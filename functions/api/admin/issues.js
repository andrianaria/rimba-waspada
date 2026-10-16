const REPO = 'andrianaria/rimba-waspada';
function response(payload, status = 200) { return new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } }); }
function authorize(context) { const email = context.request.headers.get('Cf-Access-Authenticated-User-Email') || ''; const allowed = context.env.ADMIN_EMAIL || ''; return Boolean(email && allowed && email.toLowerCase() === allowed.toLowerCase() && context.env.GITHUB_ADMIN_TOKEN); }
export async function onRequestGet(context) {
  if (!authorize(context)) return response({ error: 'Akses admin tidak diizinkan.' }, 401);
  const upstream = await fetch(`https://api.github.com/repos/${REPO}/issues?state=open&labels=perlu-review&per_page=50`, { headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${context.env.GITHUB_ADMIN_TOKEN}`, 'user-agent': 'Rimba-Kita-Admin', 'x-github-api-version': '2022-11-28' } });
  if (!upstream.ok) return response({ error: `GitHub HTTP ${upstream.status}` }, 502);
  const issues = (await upstream.json()).filter((issue) => !issue.pull_request).map((issue) => ({ number: issue.number, title: issue.title, body: issue.body || '', html_url: issue.html_url, created_at: issue.created_at, user: issue.user?.login || '', labels: issue.labels?.map((label) => label.name) || [] }));
  return response({ issues });
}

