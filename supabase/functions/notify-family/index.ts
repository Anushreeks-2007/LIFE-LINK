// Supabase Edge Function: notify-family
// Secure server-side SMS dispatch without exposing provider credentials to frontend

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { patientId, recipientPhone, recipientName, hospitalName, staffName } = await req.json();

    if (!recipientPhone || !patientId) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // In production: Connect to Twilio / AWS SNS / Gupshup SMS provider using Deno.env.get('SMS_API_KEY')
    console.log(`[Edge Function notify-family] Sending SMS to ${recipientPhone} for patient ${patientId}`);

    const simulatedResponse = {
      success: true,
      provider: "Twilio/SimulatedGateway",
      messageId: `msg_${Date.now()}`,
      status: "queued_for_delivery",
      recipient: recipientPhone,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(simulatedResponse), {
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
