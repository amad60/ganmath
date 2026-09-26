import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { withSupabase } from "@supabase/server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: cors });
}

/**
 * HP baru (PWA) mengetik kode yang tampil di HP lama.
 * Mengembalikan token_hash supaya klien bisa verifyOtp di dalam PWA —
 * tanpa membuka tautan email di Chrome/Safari.
 */
export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
    if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !serviceKey) return json({ error: "Server is not configured." }, 500);

    let code = "";
    try {
      const body = (await req.json()) as { code?: unknown };
      code = typeof body.code === "string" ? body.code.replace(/\D/g, "").slice(0, 6) : "";
    } catch {
      return json({ error: "Bad request." }, 400);
    }
    if (code.length !== 6) return json({ error: "Type the 6-digit code." }, 400);

    const admin = createClient(url, serviceKey);
    const { data: row, error: lookupError } = await admin
      .from("pairing_codes")
      .select("code, user_id, expires_at, attempts")
      .eq("code", code)
      .maybeSingle();

    if (lookupError) return json({ error: lookupError.message }, 500);
    if (!row) return json({ error: "That code is wrong or expired." }, 400);
    if (new Date(row.expires_at as string).getTime() < Date.now()) {
      await admin.from("pairing_codes").delete().eq("code", code);
      return json({ error: "That code expired. Make a new one on the other phone." }, 400);
    }
    if ((row.attempts as number) >= 5) {
      await admin.from("pairing_codes").delete().eq("code", code);
      return json({ error: "Too many tries. Make a new code on the other phone." }, 400);
    }

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(
      row.user_id as string,
    );
    const email = userData.user?.email;
    if (userError || !email) {
      await admin
        .from("pairing_codes")
        .update({ attempts: (row.attempts as number) + 1 })
        .eq("code", code);
      return json({ error: "That code is wrong or expired." }, 400);
    }

    const { data: link, error: linkError } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkError || !link.properties?.hashed_token) {
      return json({ error: linkError?.message ?? "Could not sign in." }, 500);
    }

    await admin.from("pairing_codes").delete().eq("code", code);
    return json({ email, token_hash: link.properties.hashed_token });
  }),
};
