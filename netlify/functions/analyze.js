const https = require('https');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY not set');
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured.' }) };
  }

  console.log('API key found, length:', ANTHROPIC_API_KEY.length);

  let body;
  try { body = JSON.parse(event.body); }
  catch(e) { 
    console.error('ERROR: Invalid JSON body', e.message);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request.' }) }; 
  }

  console.log('Messages count:', body.messages ? body.messages.length : 0);

  const payload = JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1200,
    messages: body.messages
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      console.log('Anthropic response status:', res.statusCode);
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Anthropic response body:', data.substring(0, 200));
        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: data
        });
      });
    });

    req.on('error', (err) => {
      console.error('HTTPS request error:', err.message);
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: 'API error.', detail: err.message })
      });
    });

    req.write(payload);
    req.end();
  });
};
