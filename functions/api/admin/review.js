const REPO = 'andrianaria/rimba-waspada';
function response(payload, status = 200) { return new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } }); }
function authorize(context) { const email = context.request.headers.get('Cf-Access-Authenticated-User-Email') || ''; const allowed = context.env.ADMIN_EMAIL || ''; return Boolean(email && allowed && email.toLowerCase() === allowed.toLowerCase() && context.env.GITHUB_ADMIN_TOKEN); }
async function github(context, path, options = {}) { return fetch(`https://api.github.com/repos/${REPO}${path}`, { ...options, headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${context.env.GITHUB_ADMIN_TOKEN}`, 'content-type': 'application/json', 'user-agent': 'Rimba-Kita-Admin', 'x-github-api-version': '2022-11-28', ...(options.headers || {}) } }); }
export async function onRequestPost(context) {
  if (!authorize(context)) return response({ error: 'Akses admin tidak diizinkan.' }, 401);
  let input; try { input = await context.request.json(); } catch { return response({ error: 'Payload tidak valid.' }, 400); }
  const number = Number(input.number); const action = input.action === 'approve' ? 'approve' : input.action === 'reject' ? 'reject' : ''; const note = String(input.note || '').trim().slice(0, 2000);
  if (!Number.isInteger(number) || !action) return response({ error: 'Nomor issue atau aksi tidak valid.' }, 400);
  const labels = action === 'approve' ? ['aksi-terverifikasi'] : ['aksi-ditolak'];
  const labelResponse = await github(context, `/issues/${number}/labels`, { method: 'POST', body: JSON.stringify({ labels }) });
  if (!labelResponse.ok) return response({ error: `Gagal memberi label GitHub (${labelResponse.status}).` }, 502);
  const comment = note || (action === 'approve' ? 'Aksi telah ditinjau dan disetujui oleh Rimba Kita.' : 'Aksi telah ditinjau dan belum dapat disetujui oleh Rimba Kita.');
  const commentResponse = await github(context, `/issues/${number}/comments`, { method: 'POST', body: JSON.stringify({ body: comment }) });
  if (!commentResponse.ok) return response({ error: `Label berhasil, tetapi komentar gagal dikirim (${commentResponse.status}).` }, 502);
  const closeResponse = await github(context, `/issues/${number}`, { method: 'PATCH', body: JSON.stringify({ state: 'closed' }) });
  if (!closeResponse.ok) return response({ error: `Review tersimpan, tetapi issue gagal ditutup (${closeResponse.status}).` }, 502);
  return response({ ok: true, action, number });
}

