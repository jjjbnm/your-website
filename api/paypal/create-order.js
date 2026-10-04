const PAYPAL_API = 'https://api-m.paypal.com';
const PRICE = '30.00';

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(body));
}

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error('PayPal authentication failed');
  return data.access_token;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return json(res, 503, { error: 'PayPal is not configured' });
  }

  try {
    const accessToken = await getAccessToken();
    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          description: 'מנוי פרסום',
          amount: { currency_code: 'ILS', value: PRICE }
        }]
      })
    });
    const data = await response.json();
    if (!response.ok || !data.id) return json(res, 502, { error: 'PayPal order creation failed' });
    return json(res, 200, { id: data.id });
  } catch (error) {
    console.error('PayPal create order error:', error.message);
    return json(res, 500, { error: 'Unable to create payment order' });
  }
};
