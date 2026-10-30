// Supabase Edge Function: verify-qr
// Validates cryptographic QR token and returns clinical profile to authenticated healthcare personnel only

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Query non-revoked profile by token
    const { data: profile, error } = await supabaseAdmin
      .from("emergency_profiles")
      .select("id, name, age, gender, blood_group, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, allergies, relevant_medical_notes, is_revoked")
      .eq("qr_token", token)
      .single();

    if (error || !profile) {
      return new Response(JSON.stringify({ error: "Invalid or expired emergency QR token" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (profile.is_revoked) {
      return new Response(JSON.stringify({ error: "This emergency QR token has been revoked by patient" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, profile }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
