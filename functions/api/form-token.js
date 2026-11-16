// Issues the short-lived signed token the contact form must present.
// A bot POSTing straight at /api/contact never fetches one, which is the
// single strongest signal separating scripted submissions from real visitors.

const ALLOWED_TOKEN_ORIGINS = [
  "brianward.com", "www.brianward.com",
  "temecula.pro", "www.temecula.pro",
  "carlsbadappraiser.pro", "www.carlsbadappraiser.pro",
  "sanmarcos.pro", "www.sanmarcos.pro",
  "sandiegoappraiser.pro", "www.sandiegoappraiser.pro",
  "chula-vista.pro", "www.chula-vista.pro",
  "ocvaluepro.com", "www.ocvaluepro.com",
  "riverside-appraiser.com", "www.riverside-appraiser.com",
  "palm-springs-appraiser.com", "www.palm-springs-appraiser.com",
  "bw-r.com", "www.bw-r.com",
  "ca-appraiser.com", "www.ca-appraiser.com",
  "palmdesertappraiser.com", "www.palmdesertappraiser.com",
  "emblazed.com", "www.emblazed.com",
  "ward.pro", "www.ward.pro",
  "oceanside.pro", "www.oceanside.pro",
  "san-diego-appraiser.com", "www.san-diego-appraiser.com",
  "diego-appraiser.com", "www.diego-appraiser.com",
  "diegoappraiser.com", "www.diegoappraiser.com",
  "appraisal-sandiego.com", "www.appraisal-sandiego.com",
  "bankruptcy-appraiser.com", "www.bankruptcy-appraiser.com",
  "brianward.net", "www.brianward.net",
  "appraiser.llc", "www.appraiser.llc",
  "elcajon.pro", "www.elcajon.pro",
  "encinitas.pro", "www.encinitas.pro",
  "lamesa.pro", "www.lamesa.pro",
  "poway.pro", "www.poway.pro",
];

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function corsFor(request) {
  const origin = request.headers.get('Origin') || '';
  try {
    const u = new URL(origin);
    if (ALLOWED_TOKEN_ORIGINS.includes(u.hostname)) {
      return { 'Access-Control-Allow-Origin': u.origin };
    }
  } catch (e) { /* same-origin */ }
  return { 'Access-Control-Allow-Origin': 'https://www.brianward.com' };
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const secret = env.FORM_SECRET || env.RESEND_API_KEY || 'fallback-secret';
  const ts = Date.now();
  const nonce = crypto.randomUUID();
  const sig = await hmac(secret, `${ts}.${nonce}`);
  return new Response(JSON.stringify({ token: `${ts}.${nonce}.${sig}` }), {
    headers: {
      ...corsFor(request),
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      ...corsFor(context.request),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
