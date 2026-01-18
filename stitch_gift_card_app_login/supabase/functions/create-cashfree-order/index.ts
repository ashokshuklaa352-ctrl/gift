
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CASHFREE_APP_ID = Deno.env.get('CASHFREE_APP_ID')
const CASHFREE_SECRET_KEY = Deno.env.get('CASHFREE_SECRET_KEY')
const CASHFREE_URL = "https://api.cashfree.com/pg/orders"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // Validate Secrets Early
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
        return new Response(JSON.stringify({
            error: 'MISSING_SECRETS',
            message: 'Cashfree API keys are missing. Please add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to Supabase Secrets.'
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    try {
        const { order_amount, order_currency, customer_id, customer_email, customer_phone, x_environment = 'PRODUCTION' } = await req.json()

        const baseUrl = x_environment === 'SANDBOX'
            ? "https://sandbox.cashfree.com/pg/orders"
            : "https://api.cashfree.com/pg/orders";

        console.log(`Creating order in ${x_environment} mode`);

        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'x-client-id': CASHFREE_APP_ID!,
                'x-client-secret': CASHFREE_SECRET_KEY!,
                'x-api-version': '2023-08-01',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_amount,
                order_currency,
                customer_details: {
                    customer_id,
                    customer_email,
                    customer_phone
                }
            })
        })

        const data = await response.json()

        if (!response.ok) {
            return new Response(JSON.stringify({
                error: data.message || 'Error creating Cashfree order',
                details: data,
                environment: x_environment
            }), {
                status: response.status,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
