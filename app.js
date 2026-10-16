let cities = [
  { name: 'Jakarta', province: 'DKI Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Batam', province: 'Kepulauan Riau', lat: 1.0456, lon: 104.0305 },
  { name: 'Palembang', province: 'Sumatera Selatan', lat: -2.9761, lon: 104.7754 },
  { name: 'Medan', province: 'Sumatera Utara', lat: 3.5952, lon: 98.6722 },
  { name: 'Dumai', province: 'Riau', lat: 1.6666, lon: 101.4000 },
  { name: 'Bandar Lampung', province: 'Lampung', lat: -5.3971, lon: 105.2668 },
  { name: 'Padang', province: 'Sumatera Barat', lat: -0.9471, lon: 100.4172 },
  { name: 'Palangka Raya', province: 'Kalimantan Tengah', lat: -2.2096, lon: 113.9213 },
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lon: 109.3425 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lon: 101.4478 },
  { name: 'Jambi', province: 'Jambi', lat: -1.6101, lon: 103.6131 },
  { name: 'Bengkulu', province: 'Bengkulu', lat: -3.7928, lon: 102.2608 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3186, lon: 114.5944 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lon: 117.1536 },
  { name: 'Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lon: 116.8529 },
  { name: 'Banjarbaru', province: 'Kalimantan Selatan', lat: -3.4420, lon: 114.8410 },
  { name: 'Bandung', province: 'Jawa Barat', lat: -6.9175, lon: 107.6191 },
  { name: 'Semarang', province: 'Jawa Tengah', lat: -6.9667, lon: 110.4167 },
  { name: 'Surabaya', province: 'Jawa Timur', lat: -7.2575, lon: 112.7521 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lon: 110.3695 },
  { name: 'Denpasar', province: 'Bali', lat: -8.6705, lon: 115.2126 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lon: 123.6070 },
  { name: 'Palu', province: 'Sulawesi Tengah', lat: -0.9003, lon: 119.8779 },
  { name: 'Manado', province: 'Sulawesi Utara', lat: 1.4748, lon: 124.8421 },
  { name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327 },
];

const qs = (selector) => document.querySelector(selector);
const SITE_BRAND = 'Rimba Kita';
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const trustedSources = [
  { match: 'kompas.com', label: 'Kompas' }, { match: 'detik.com', label: 'detikcom' },
  { match: 'tempo.co', label: 'Tempo' }, { match: 'cnnindonesia.com', label: 'CNN Indonesia' },
];
function sourceLabel(domain = '') { return trustedSources.find((source) => domain.toLowerCase().includes(source.match))?.label || null; }
async function fetchNews() { const response = await fetch('/api/news'); if (!response.ok) throw new Error(`Indeks berita HTTP ${response.status}`); const payload = await response.json(); return (payload.articles || []).map((article) => ({ ...article, source: sourceLabel(article.domain) })).filter((article) => article.source && article.url && article.title); }
function formatNewsDate(value) { if (!value) return 'waktu tidak tersedia'; const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/); if (!match) return value; return new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
function renderNews(articles) { const grid = qs('#news-grid'); if (!grid) return; const query = (qs('#news-search')?.value || '').toLowerCase(); const source = document.querySelector('.filter-button.active')?.dataset.source || 'all'; const filtered = articles.filter((article) => (source === 'all' || article.source === source) && `${article.title} ${article.domain}`.toLowerCase().includes(query)); grid.innerHTML = filtered.length ? filtered.slice(0, 60).map((article) => `<a class="news-card" href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><div class="news-card-top"><span class="news-source">${escapeHtml(article.source)}</span><span class="news-date">${escapeHtml(formatNewsDate(article.seendate))}</span></div><h3>${escapeHtml(article.title)}</h3><div class="news-card-bottom"><span>${escapeHtml(article.domain)}</span><strong>Baca artikel ↗</strong></div></a>`).join('') : '<p class="data-disclaimer">Belum ada artikel dari domain kurasi pada hasil live saat ini. Coba kata kunci lain atau buka situs sumber langsung.'; }
function renderNewsTicker(articles) { const track = qs('#news-ticker-track'); if (!track) return; const items = articles.slice(0, 12).map((article) => `<a href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(article.source)}</strong><span>${escapeHtml(article.title)}</span></a>`); track.innerHTML = items.length ? `${items.join('<i aria-hidden="true">•</i>')}${items.join('<i aria-hidden="true">•</i>')}` : '<span>Belum ada berita karhutla dari media kurasi.</span>'; }
async function initNewsTicker() { try { renderNewsTicker(await fetchNews()); } catch { const track = qs('#news-ticker-track'); if (track) track.textContent = 'Berita karhutla belum tersedia saat ini.'; } }
async function initNews() { const status = qs('#news-status'); try { const articles = await fetchNews(); window.newsData = articles; renderNews(articles); if (status) status.textContent = `LIVE · ${articles.length} artikel dari domain kurasi`; } catch (error) { if (status) status.textContent = `Indeks media belum tersedia · ${error.message}`; const grid = qs('#news-grid'); if (grid) grid.innerHTML = '<p class="data-disclaimer">Indeks berita sedang membatasi permintaan atau tidak tersedia. Tautan sumber tetap bisa ditambahkan lewat integrasi RSS/backend berikutnya.</p>'; } }
function newsSummary(value) { return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 220); }
function renderNews(articles) { const grid = qs('#news-grid'); if (!grid) return; const query = (qs('#news-search')?.value || '').toLowerCase(); const source = document.querySelector('.filter-button.active')?.dataset.source || 'all'; const filtered = articles.filter((article) => (source === 'all' || article.source === source) && `${article.title} ${article.domain}`.toLowerCase().includes(query)); grid.innerHTML = filtered.length ? filtered.slice(0, 60).map((article) => `<a class="news-card" href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><div class="news-card-top"><span class="news-source">${escapeHtml(article.source)}</span><span class="news-date">${escapeHtml(formatNewsDate(article.seendate))}</span></div><h3>${escapeHtml(article.title)}</h3><p class="news-summary">${escapeHtml(newsSummary(article.description || article.snippet) || 'Ringkasan singkat belum tersedia. Buka berita untuk membaca konteks lengkapnya.')}</p><div class="news-card-bottom"><span>${escapeHtml(article.domain)}</span><strong>Buka berita ↗</strong></div></a>`).join('') : '<p class="data-disclaimer">Belum ada artikel dari empat media kurasi pada hasil live saat ini.'; }
function formatNewsDate(value) { if (!value) return 'waktu tidak tersedia'; const match = String(value).match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/); const parsed = match ? new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`) : new Date(value); return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
function initNewsFilters() { const allowed = new Set(['all', 'Kompas', 'detikcom', 'Tempo', 'CNN Indonesia']); document.querySelectorAll('.filter-button').forEach((button) => { if (!allowed.has(button.dataset.source)) button.remove(); }); const copy = document.querySelector('#news-grid')?.closest('.news-section')?.nextElementSibling?.querySelector('p'); if (copy) copy.textContent = 'Kompas, detikcom, Tempo, dan CNN Indonesia. Kami menampilkan metadata dan ringkasan singkat; baca artikel asli untuk konteks lengkap.'; }
function initActionForm() { const form = qs('#action-form'); if (!form) return; form.addEventListener('submit', (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(form).entries()); let donation; let evidence; try { donation = new URL(values.donation); evidence = new URL(values.evidence); } catch { qs('#form-note').textContent = 'Periksa kembali URL donasi dan URL bukti kegiatan.'; return; } const blockedHosts = ['bit.ly', 'tinyurl.com', 't.co', 's.id']; if (donation.protocol !== 'https:' || evidence.protocol !== 'https:' || blockedHosts.some((host) => donation.hostname.endsWith(host))) { qs('#form-note').textContent = 'Gunakan URL HTTPS langsung; URL shortener tidak diterima untuk proses verifikasi.'; return; } const body = `## Pengajuan aksi warga\n\n**Nama aksi:** ${values.name}\n\n**Organisasi:** ${values.organization}\n\n**URL donasi:** ${values.donation}\n\n**URL bukti kegiatan:** ${values.evidence}\n\n**Kontak verifikasi:** ${values.contact}\n\n**Detail aksi:**\n${values.details}\n\n---\nPengaju menyetujui proses verifikasi Rimba Kita.\n\nChecklist reviewer:\n- [ ] Identitas organisasi dan kontak independen dicek\n- [ ] URL donasi, penerima, target, dan periode cocok\n- [ ] Bukti kegiatan dan lokasi di-cross-check\n- [ ] Dua reviewer menyetujui atau alasan penolakan dicatat`;
    const issueUrl = `https://github.com/andrianaria/rimba-waspada/issues/new?title=${encodeURIComponent(`[KURASI AKSI] ${values.name}`)}&labels=pengajuan-aksi%2Cperlu-review&body=${encodeURIComponent(body)}`;
    window.open(issueUrl, '_blank', 'noopener'); qs('#form-note').textContent = 'Pengajuan sudah dibuka. Lengkapi informasi lalu kirimkan.';
  }); }

function issueField(body, label) { return body.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`))?.[1]?.trim() || ''; }
function verifiedUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; } }
function renderVerifiedActions(issues) { const grid = qs('#verified-actions-grid'); if (!grid) return; const cards = issues.map((issue) => { const body = issue.body || ''; const donation = verifiedUrl(issueField(body, 'URL donasi')); const evidence = verifiedUrl(issueField(body, 'URL bukti kegiatan')); const name = issueField(body, 'Nama aksi') || issue.title.replace(/^\[KURASI AKSI\]\s*/i, ''); const organization = issueField(body, 'Organisasi'); if (!donation && !evidence) return ''; return `<article class="verified-action-card"><div class="verified-action-top"><span class="eyebrow">TERVERIFIKASI</span><span class="verified-action-date">${escapeHtml(new Date(issue.updated_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }))}</span></div><h3>${escapeHtml(name)}</h3>${organization ? `<p class="verified-action-org">${escapeHtml(organization)}</p>` : ''}<div class="verified-action-links">${donation ? `<a href="${escapeHtml(donation)}" target="_blank" rel="noreferrer">URL donasi resmi <span>↗</span></a>` : ''}${evidence ? `<a href="${escapeHtml(evidence)}" target="_blank" rel="noreferrer">Bukti kegiatan <span>↗</span></a>` : ''}</div></article>`; }).filter(Boolean).join(''); grid.innerHTML = cards || '<p class="data-disclaimer">Belum ada aksi terverifikasi yang dipublikasikan.</p>'; }
async function initVerifiedActions() { const grid = qs('#verified-actions-grid'); const status = qs('#verified-actions-status'); if (!grid) return; try { const response = await fetch('https://api.github.com/repos/andrianaria/rimba-waspada/issues?state=open&labels=aksi-terverifikasi&per_page=30'); if (!response.ok) throw new Error(`GitHub HTTP ${response.status}`); const issues = (await response.json()).filter((issue) => !issue.pull_request); renderVerifiedActions(issues); if (status) status.textContent = `${issues.length} aksi terverifikasi`; } catch (error) { if (status) status.textContent = 'Daftar aksi belum tersedia'; grid.innerHTML = '<p class="data-disclaimer">Daftar aksi terverifikasi belum dapat dimuat saat ini.</p>'; } }

function aqiStatus(aqi) {
  if (aqi == null) return { label: 'N/A', tone: 'moderate' };
  if (aqi <= 50) return { label: 'Baik', tone: 'good' };
  if (aqi <= 100) return { label: 'Sedang', tone: 'moderate' };
  if (aqi <= 150) return { label: 'Sensitif', tone: 'unhealthy' };
  if (aqi <= 200) return { label: 'Tidak sehat', tone: 'unhealthy' };
  return { label: 'Sangat tidak sehat', tone: 'unhealthy' };
}

async function loadAllRegencies() {
  const cached = sessionStorage.getItem('rimbakita-regencies-v1');
  if (cached) return JSON.parse(cached);
  const provincesResponse = await fetch('https://www.emsifa.com/api-wilayah-indonesia/v2/provinces.json');
  if (!provincesResponse.ok) throw new Error(`Wilayah HTTP ${provincesResponse.status}`);
  const provinces = await provincesResponse.json();
  const all = [];
  for (let i = 0; i < provinces.data.length; i += 8) {
    const group = provinces.data.slice(i, i + 8);
    const results = await Promise.all(group.map(async (province) => { const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/v2/regencies/${province.id}.json`); if (!response.ok) return []; const payload = await response.json(); return (payload.data || []).map((city) => ({ name: city.name.replace(/^(Kabupaten|Kota)\s+/i, ''), displayName: city.name, province: province.name, lat: Number(city.lat), lon: Number(city.lng), code: city.id })); }));
    all.push(...results.flat());
  }
  const usable = all.filter((city) => Number.isFinite(city.lat) && Number.isFinite(city.lon));
  sessionStorage.setItem('rimbakita-regencies-v1', JSON.stringify(usable));
  return usable;
}

async function fetchAirQuality() {
  const output = [];
  for (let i = 0; i < cities.length; i += 40) {
    const batch = cities.slice(i, i + 40);
    const params = new URLSearchParams({ latitude: batch.map((c) => c.lat).join(','), longitude: batch.map((c) => c.lon).join(','), current: 'us_aqi,pm2_5,pm10', timezone: 'auto', forecast_days: '1' });
    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
    if (!response.ok) continue;
    const payload = await response.json();
    (Array.isArray(payload) ? payload : [payload]).forEach((data, index) => output.push({ ...batch[index], aqi: data.current?.us_aqi ?? null, pm25: data.current?.pm2_5 ?? null, pm10: data.current?.pm10 ?? null, time: data.current?.time ?? null, timezone: data.timezone ?? 'Asia/Jakarta' }));
  }
  if (!output.length) throw new Error('Open-Meteo tidak mengembalikan data');
  return output;
}

function renderCities(data) {
  const grid = qs('#city-grid');
  if (!grid) return;
  const query = (qs('#city-search')?.value || '').toLowerCase();
  const filtered = data.filter((city) => `${city.name} ${city.province}`.toLowerCase().includes(query)).sort((a, b) => (b.aqi ?? -1) - (a.aqi ?? -1));
  grid.innerHTML = filtered.length ? filtered.map((city) => { const status = aqiStatus(city.aqi); return `<article class="air-card"><div class="air-card-top"><div><div class="city-name">${escapeHtml(city.name)}</div><div class="province">${escapeHtml(city.province)}</div></div><span class="air-badge ${status.tone}">${status.label}</span></div><div class="aqi-row"><strong class="aqi-number">${city.aqi ?? '—'}</strong><span class="aqi-label">US AQI<br />model</span></div><div class="pm">PM2.5 · ${city.pm25 == null ? '—' : `${Number(city.pm25).toFixed(1)} µg/m³`} · live</div><div class="card-time">${city.time ? `${city.time.replace('T', ' ')} · ${city.timezone}` : 'waktu tidak tersedia'}</div></article>`; }).join('') : '<p class="data-disclaimer">Kota tidak ditemukan.</p>';
}

async function initAir() {
  const status = qs('#air-status');
  const homeStatus = qs('#home-status');
  const grid = qs('#city-grid');
  try {
    if (status) status.textContent = 'MEMUAT 514 KABUPATEN/KOTA…';
    if (grid) grid.innerHTML = '<p class="air-loading" aria-live="polite">Memuat indeks AQI saat ini untuk seluruh kabupaten/kota Indonesia…<br />Mohon tunggu sebentar.</p>';
    cities = await loadAllRegencies();
    const data = await fetchAirQuality();
    window.airData = data;
    renderCities(data);
    const worst = [...data].sort((a, b) => (b.aqi ?? -1) - (a.aqi ?? -1))[0];
    if (status) status.textContent = `LIVE · ${data.length} kabupaten/kota · tertinggi ${worst?.name || '—'} ${worst?.aqi ?? '—'} US AQI`;
    if (homeStatus) homeStatus.textContent = 'Kualitas udara live terhubung';
  } catch (error) {
    if (status) status.textContent = 'Gagal mengambil feed live · coba refresh';
    if (homeStatus) homeStatus.textContent = 'Feed live belum tersedia';
    if (grid) grid.innerHTML = `<p class="data-disclaimer">Feed live tidak dapat diambil saat ini. Detail teknis: ${escapeHtml(error.message)}</p>`;
  }
}

function makeMap() {
  if (!qs('#map') || !window.L) return;
  const mapIntro = document.querySelector('.page-intro>p:not(.eyebrow)');
  if (mapIntro) mapIntro.textContent = 'NASA FIRMS mendeteksi titik panas dari citra satelit secara near-real-time. Satu titik adalah sinyal awal, bukan bukti kebakaran yang sudah terkonfirmasi.';
  const mapNote = qs('.map-note');
  if (mapNote) mapNote.innerHTML = '<strong>Apa itu hotspot NASA?</strong><p>Hotspot adalah anomali panas yang tertangkap sensor satelit NASA FIRMS, biasanya dari VIIRS atau MODIS.</p><p>Gunakan titik, waktu, dan tingkat kepercayaan sebagai petunjuk awal. Konfirmasi tetap perlu dilakukan dengan kondisi lapangan dan sumber resmi.</p>';
  const map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([-1.8, 117.2], 4.7);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', opacity: 0.82 }).addTo(map);
  const firesStatus = qs('#fires-status');
  fetch('/api/firms?days=1').then((response) => { if (!response.ok) throw new Error(`FIRMS HTTP ${response.status}`); return response.json(); }).then((rows) => {
    rows.slice(0, 3000).forEach((row) => { const lat = Number(row.latitude); const lon = Number(row.longitude); if (!Number.isFinite(lat) || !Number.isFinite(lon)) return; const confidence = row.confidence || 'n/a'; const marker = L.circleMarker([lat, lon], { radius: 5, color: '#fff', weight: 1, fillColor: '#e95748', fillOpacity: .83 }).addTo(map); marker.bindPopup(`<strong>Hotspot NASA FIRMS</strong><br />Kepercayaan: ${escapeHtml(confidence)}<br />${escapeHtml(row.acq_date || '')} ${escapeHtml(row.acq_time || '')} UTC`); });
    if (firesStatus) firesStatus.textContent = `LIVE · ${rows.length.toLocaleString('id-ID')} hotspot dari NASA FIRMS`;
  }).catch((error) => { if (firesStatus) firesStatus.textContent = `Feed FIRMS gagal · ${error.message}`; });
}

if (qs('#city-grid')) { qs('#city-search').addEventListener('input', () => renderCities(window.airData || [])); initAir(); }
if (qs('#news-grid')) { initNewsFilters(); qs('#news-search').addEventListener('input', () => renderNews(window.newsData || [])); document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderNews(window.newsData || []); })); initNews(); }
initActionForm();
initVerifiedActions();
const nav = document.querySelector('nav'); if (nav && !nav.querySelector('a[href="berita.html"]')) nav.insertAdjacentHTML('beforeend', '<a href="berita.html">Radar media</a>');
document.title = document.title.replace(/Rimba Waspada/g, SITE_BRAND); const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const textNodes = []; while (textWalker.nextNode()) textNodes.push(textWalker.currentNode); textNodes.forEach((node) => { if (node.nodeValue.includes('Rimba Waspada')) node.nodeValue = node.nodeValue.replace(/Rimba Waspada/g, SITE_BRAND); });
makeMap();
initNewsTicker();
setInterval(() => { initNewsTicker(); if (qs('#news-grid')) initNews(); }, 15 * 60 * 1000);
