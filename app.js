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
let currentLanguage = localStorage.getItem('rimbakita-language') || 'id';
function t(id, en) { return currentLanguage === 'en' ? en : id; }
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const sharedNavigation = [
  ['index.html', 'Beranda'],
  ['pantauan.html', 'Pantauan'],
  ['aksi.html', 'Aksi warga'],
  ['berita.html', 'Radar media'],
  ['kontak.html', 'Kontak darurat'],
];
function renderSharedHeader() {
  const header = qs('.site-header');
  const page = location.pathname.split('/').pop() || 'index.html';
  if (!header || page === 'admin.html') return;
  header.innerHTML = `<a class="brand" href="index.html"><img class="brand-logo" src="assets/rimba-kita-logo.svg" alt="Rimba Kita" /></a><nav id="site-navigation" aria-label="Navigasi utama">${sharedNavigation.map(([href, label]) => `<a class="${href === page ? 'active' : ''}" href="${href}">${label}</a>`).join('')}</nav>`;
}
function applySeo() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const seo = {
    'index.html': { title: 'Karhutla Indonesia Hari Ini — Pantau Hotspot & Kualitas Udara | Rimba Kita', description: 'Pantau karhutla Indonesia secara lebih cepat: lihat hotspot NASA FIRMS, kualitas udara, AQI, asap, dan berita kebakaran hutan terkini.', keywords: 'karhutla, pantau karhutla, kebakaran hutan, kebakaran lahan, hotspot NASA FIRMS, kualitas udara Indonesia, AQI, kabut asap' },
    'pantauan.html': { title: 'Pantau Karhutla Indonesia — Peta Hotspot NASA FIRMS | Rimba Kita', description: 'Pantau keadaan karhutla Indonesia melalui peta hotspot NASA FIRMS, sinyal panas satelit, dan atmosfer karbon monoksida.', keywords: 'pantau karhutla, keadaan karhutla, peta hotspot, NASA FIRMS, titik panas, kebakaran hutan Indonesia' },
    'udara.html': { title: 'Kualitas Udara Indonesia — AQI & PM2.5 | Rimba Kita', description: 'Cek kualitas udara Indonesia, US AQI berbasis model CAMS, AQI IQAir bila tersedia, PM2.5, dan kota dengan udara paling perlu diwaspadai.', keywords: 'kualitas udara Indonesia, AQI Indonesia, US AQI, IQAir, PM2.5, kabut asap karhutla' },
    'berita.html': { title: 'Berita Karhutla Indonesia Terbaru — Radar Media | Rimba Kita', description: 'Berita karhutla Indonesia terbaru dari Kompas, detikcom, Tempo, dan CNN Indonesia, diringkas dengan tautan ke artikel asli.', keywords: 'berita karhutla, berita kebakaran hutan, kabut asap terbaru, Kompas karhutla, detik karhutla, Tempo karhutla' },
    'aksi.html': { title: 'Aksi Warga untuk Karhutla — Rimba Kita', description: 'Daftarkan aksi warga untuk membantu menghadapi karhutla, kabut asap, dan dampak kebakaran hutan dengan proses kurasi yang jelas.', keywords: 'aksi warga karhutla, bantuan kebakaran hutan, lapor karhutla, dukungan warga, bantuan kabut asap' },
    'kontak.html': { title: 'Kontak Darurat Karhutla Indonesia | Rimba Kita', description: 'Kontak darurat untuk wilayah terdampak karhutla, kebakaran hutan, kabut asap, dan keadaan yang mengancam keselamatan.', keywords: 'kontak darurat karhutla, pemadam kebakaran, BPBD, kabut asap, nomor darurat Indonesia' },
  }[page] || {};
  if (!seo.title) return;
  document.title = seo.title;
  const setMeta = (selector, attribute, value) => { let element = document.head.querySelector(selector); if (!element) { element = document.createElement('meta'); const name = selector.match(/(?:name|property)="([^"]+)"/)?.[1]; if (name) element.setAttribute(attribute, name); document.head.appendChild(element); } element.setAttribute('content', value); };
  setMeta('meta[name="description"]', 'name', seo.description); setMeta('meta[name="keywords"]', 'name', seo.keywords); setMeta('meta[name="robots"]', 'name', 'index,follow,max-image-preview:large');
  const canonicalUrl = `https://rimbakita.kuatdigital.com/${page === 'index.html' ? '' : page}`;
  let canonical = document.head.querySelector('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); } canonical.href = canonicalUrl;
  setMeta('meta[property="og:type"]', 'property', 'website'); setMeta('meta[property="og:site_name"]', 'property', 'Rimba Kita'); setMeta('meta[property="og:title"]', 'property', seo.title); setMeta('meta[property="og:description"]', 'property', seo.description); setMeta('meta[property="og:url"]', 'property', canonicalUrl); setMeta('meta[property="og:image"]', 'property', 'https://rimbakita.kuatdigital.com/assets/karhutla-hero.jpeg');
  setMeta('meta[name="twitter:card"]', 'name', 'summary_large_image'); setMeta('meta[name="twitter:title"]', 'name', seo.title); setMeta('meta[name="twitter:description"]', 'name', seo.description); setMeta('meta[name="twitter:image"]', 'name', 'https://rimbakita.kuatdigital.com/assets/karhutla-hero.jpeg');
  if (page === 'index.html' && !document.head.querySelector('#rimbakita-schema')) { const schema = document.createElement('script'); schema.id = 'rimbakita-schema'; schema.type = 'application/ld+json'; schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Rimba Kita', url: 'https://rimbakita.kuatdigital.com/', description: 'Pusat informasi publik untuk memantau karhutla, hotspot NASA FIRMS, kualitas udara, AQI, dan berita kebakaran hutan Indonesia.', inLanguage: 'id-ID' }); document.head.appendChild(schema); }
}
const trustedSources = [
  { match: 'kompas.com', label: 'Kompas' }, { match: 'detik.com', label: 'detikcom' },
  { match: 'tempo.co', label: 'Tempo' }, { match: 'cnnindonesia.com', label: 'CNN Indonesia' },
];
function sourceLabel(domain = '') { return trustedSources.find((source) => domain.toLowerCase().includes(source.match))?.label || null; }
function articleSource(article) {
  const candidates = [article?.domain];
  try { if (article?.url) candidates.push(new URL(article.url).hostname); } catch {}
  return candidates.map((value) => sourceLabel(value || '')).find(Boolean) || null;
}

function applyLanguage(lang = currentLanguage) {
  currentLanguage = lang === 'en' ? 'en' : 'id';
  localStorage.setItem('rimbakita-language', currentLanguage);
  document.documentElement.lang = currentLanguage;
  const page = location.pathname.split('/').pop() || 'index.html';
  const labels = {
    'index.html': ['Beranda', 'Home'], 'pantauan.html': ['Pantauan', 'Monitoring'], 'udara.html': ['Kualitas udara', 'Air quality'], 'aksi.html': ['Aksi warga', 'Community action'], 'berita.html': ['Radar media', 'Media radar'], 'kontak.html': ['Kontak darurat', 'Emergency contacts'],
  };
  document.querySelectorAll('.site-header nav a').forEach((link) => { const key = Object.keys(labels).find((path) => link.getAttribute('href')?.split('#')[0].endsWith(path)); if (key) link.textContent = labels[key][currentLanguage === 'en' ? 1 : 0]; });
  const report = qs('.header-button'); if (report) report.textContent = t('Laporkan', 'Report');
  const tickerLabel = qs('.news-ticker-label'); if (tickerLabel) tickerLabel.textContent = t('UPDATE KARHUTLA', 'WILDFIRE UPDATE');
  const tickerLink = qs('.news-ticker-link'); if (tickerLink) tickerLink.textContent = t('Semua berita ↗', 'All news ↗');
  const heroTitle = qs('.hero h1'); if (heroTitle) heroTitle.innerHTML = currentLanguage === 'en' ? 'Protect forests.<br /><em>Protect life.</em>' : 'Menjaga hutan.<br /><em>Menjaga kehidupan.</em>';
  const heroLede = qs('.hero-lede'); if (heroLede) heroLede.textContent = t('Warga bantu warga. Selalu waspada dan jaga kesehatan.', 'Neighbors help neighbors. Stay alert and protect your health.');
  const heroPrimary = qs('.hero-actions .button-primary'); if (heroPrimary) heroPrimary.innerHTML = `${t('Buka peta pantauan', 'Open monitoring map')} <span>↗</span>`;
  const heroSecondary = qs('.hero-actions .text-link'); if (heroSecondary) heroSecondary.innerHTML = `${t('Cek udara kota', 'Check city air')} <span>→</span>`;
  const homeTitle = qs('#home-aqi-title'); if (homeTitle) homeTitle.textContent = t('Indeks saat ini', 'Current index');
  const homeCopy = qs('.home-air-copy'); if (homeCopy) homeCopy.textContent = t('US AQI berbasis model CAMS/Open-Meteo membantu melihat kondisi udara di setiap kabupaten/kota.', 'CAMS/Open-Meteo model US AQI helps show air conditions across every regency and city.');
  const homeSideCopy = qs('.section-sidecopy'); if (homeSideCopy && page === 'index.html') homeSideCopy.textContent = t('Pantauan model CAMS untuk seluruh kabupaten/kota Indonesia.', 'CAMS model monitoring for every regency and city in Indonesia.');
  const footerLink = qs('.site-footer a'); if (footerLink) footerLink.textContent = t('Kirim dukungan', 'Send support');
  const actionHeading = qs('.submit-heading h2'); if (actionHeading) actionHeading.innerHTML = currentLanguage === 'en' ? 'Register your action,<br /><em>we review its validity before it goes live.</em>' : 'Daftarkan aksimu,<br /><em>validitas akan dikurasi terlebih dahulu sebelum live.</em>';
  const verifiedHeading = qs('.verified-actions-heading h2'); if (verifiedHeading) verifiedHeading.innerHTML = currentLanguage === 'en' ? 'Action<br /><em>directory.</em>' : 'Daftar<br /><em>aksi.</em>';
  updateAqiInfoCopy();
  const introCopy = {
    'udara.html': ['Udara yang kita hirup,<br /><em>kita jaga bersama.</em>', 'US AQI berbasis model CAMS/Open-Meteo membantu melihat kondisi udara di seluruh Indonesia.', 'Data model diperbarui berkala dan digunakan sebagai gambaran kondisi udara per wilayah.'],
    'aksi.html': ['Informasi adalah<br /><em>pertolongan pertama.</em>', 'We can help without adding risk: protect yourself, send useful reports, and support official channels.', 'Close windows, use a suitable mask, and limit outdoor activity when air quality worsens.'],
    'berita.html': ['Suara publik,<br /><em>dipantau bersama.</em>', 'Follow the latest wildfire coverage from a curated list of Indonesian media domains. Read the full article on the publisher’s site; we do not copy the article text.', 'Kompas, detikcom, Tempo, and CNN Indonesia are monitored for relevant updates.'],
  };
  if (introCopy[page]) {
    const intro = document.querySelector('.page-intro');
    const heading = intro?.querySelector('h1');
    const copy = intro?.querySelector('p:not(.eyebrow)');
    if (heading && currentLanguage === 'en') heading.innerHTML = introCopy[page][0].replace('Udara yang kita hirup,', 'The air we breathe,').replace('kita jaga bersama.', 'we care for together.').replace('Informasi adalah', 'Information is').replace('pertolongan pertama.', 'first aid.').replace('Suara publik,', 'Public voices,').replace('dipantau bersama.', 'followed together.');
    if (copy) copy.textContent = currentLanguage === 'en' ? introCopy[page][1] : (page === 'udara.html' ? 'US AQI berbasis model CAMS/Open-Meteo membantu melihat kondisi udara di seluruh Indonesia.' : copy.textContent);
    const methodCopy = intro?.nextElementSibling?.querySelector('.method-copy p');
    if (methodCopy) methodCopy.textContent = currentLanguage === 'en' ? introCopy[page][2] : (page === 'udara.html' ? 'Data model diperbarui berkala dan digunakan sebagai gambaran kondisi udara per wilayah.' : methodCopy.textContent);
  }
  const titles = { 'index.html': ['Rimba Kita — Pantau Karhutla Indonesia', 'Rimba Kita — Indonesia Wildfire Monitoring'], 'pantauan.html': ['Pantauan — Rimba Kita', 'Monitoring — Rimba Kita'], 'udara.html': ['Kualitas Udara — Rimba Kita', 'Air Quality — Rimba Kita'], 'aksi.html': ['Aksi Warga — Rimba Kita', 'Community Action — Rimba Kita'], 'berita.html': ['Radar Media — Rimba Kita', 'Media Radar — Rimba Kita'], 'kontak.html': ['Kontak Darurat — Rimba Kita', 'Emergency Contacts — Rimba Kita'] };
  if (titles[page]) document.title = titles[page][currentLanguage === 'en' ? 1 : 0];
  document.querySelectorAll('.language-switcher button').forEach((button) => { button.classList.toggle('active', button.dataset.lang === currentLanguage); button.setAttribute('aria-pressed', String(button.dataset.lang === currentLanguage)); });
  const mobileButton = qs('#mobile-menu-button');
  if (mobileButton) mobileButton.setAttribute('aria-label', mobileButton.getAttribute('aria-expanded') === 'true' ? t('Tutup menu', 'Close menu') : t('Buka menu', 'Open menu'));
}

function initLanguageSwitcher() {
  const header = qs('.site-header');
  if (!header || header.querySelector('.language-switcher')) return;
  header.insertAdjacentHTML('beforeend', '<div class="language-switcher" aria-label="Language"><button type="button" data-lang="id">ID</button><span>/</span><button type="button" data-lang="en">EN</button></div>');
  header.querySelectorAll('.language-switcher button').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.lang)));
  applyLanguage();
}

function initMobileMenu() {
  const header = qs('.site-header');
  const nav = header?.querySelector('nav');
  if (!header || !nav || qs('#mobile-menu-button')) return;
  nav.id = nav.id || 'site-navigation';
  nav.insertAdjacentHTML('beforebegin', '<button class="mobile-menu-button" id="mobile-menu-button" type="button" aria-label="Buka menu" aria-controls="site-navigation" aria-expanded="false"><span></span><span></span><span></span></button>');
  const button = qs('#mobile-menu-button');
  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? t('Tutup menu', 'Close menu') : t('Buka menu', 'Open menu'));
  };
  button.addEventListener('click', () => setOpen(!header.classList.contains('menu-open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (event) => { if (!header.contains(event.target)) setOpen(false); });
}

function updateAqiInfoCopy() {
  const panel = qs('#aqi-info-panel');
  if (!panel) return;
  panel.innerHTML = currentLanguage === 'en' ? '<button class="aqi-info-close" type="button" aria-label="Close explanation">×</button><strong>What does this air-quality number mean?</strong><p><b>Air quality from CAMS</b> is a numerical estimate from the Copernicus Atmosphere Monitoring Service, delivered here through Open-Meteo. It models pollution across an area, so it can differ from a nearby station.</p><p>The US AQI scale translates pollution levels into health guidance. Higher numbers mean the air needs more attention.</p>' : '<button class="aqi-info-close" type="button" aria-label="Tutup penjelasan">×</button><strong>Apa arti angka kualitas udara ini?</strong><p><b>Air quality from CAMS</b> adalah estimasi numerik dari Copernicus Atmosphere Monitoring Service yang ditampilkan melalui Open-Meteo. Data ini memodelkan polusi di suatu wilayah, sehingga bisa berbeda dari stasiun terdekat.</p><p>Skala US AQI menerjemahkan tingkat polusi menjadi panduan kesehatan. Angka lebih tinggi berarti udara perlu lebih diwaspadai.</p>';
  panel.querySelector('.aqi-info-close')?.addEventListener('click', () => { panel.hidden = true; qs('#aqi-info-button')?.setAttribute('aria-expanded', 'false'); });
}

function initAqiInfo() {
  const heading = document.querySelector('.air-page .section-heading h2');
  if (!heading || qs('#aqi-info-button')) return;
  heading.insertAdjacentHTML('beforeend', ' <button class="aqi-info-button" id="aqi-info-button" type="button" aria-label="Informasi indeks kualitas udara" aria-expanded="false">?</button>');
  heading.insertAdjacentHTML('afterend', '<div class="aqi-info-panel" id="aqi-info-panel" role="dialog" aria-live="polite" hidden></div>');
  updateAqiInfoCopy();
  qs('#aqi-info-button').addEventListener('click', () => { const panel = qs('#aqi-info-panel'); panel.hidden = !panel.hidden; qs('#aqi-info-button').setAttribute('aria-expanded', String(!panel.hidden)); });
}
async function fetchNews() {
  const cacheKey = 'rimbakita-news-cache-v1';
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch {}
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch('/api/news?view=curated', { signal: controller.signal });
    if (!response.ok) throw new Error(`Indeks berita HTTP ${response.status}`);
    const payload = await response.json();
    const articles = (payload.articles || []).map((article) => ({ ...article, source: articleSource(article) || article.source || article.domain || 'Media' })).filter((article) => article.url && article.title);
    if (articles.length) localStorage.setItem(cacheKey, JSON.stringify({ savedAt: new Date().toISOString(), articles }));
    window.newsDataStale = Boolean(payload.stale);
    return articles;
  } catch (error) {
    if (cached?.articles?.length) { window.newsDataStale = true; return cached.articles; }
    if (error?.name === 'AbortError') throw new Error('Permintaan berita timeout. Coba muat ulang.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
function formatNewsDate(value) { if (!value) return 'waktu tidak tersedia'; const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/); if (!match) return value; return new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
function renderNews(articles) { const grid = qs('#news-grid'); if (!grid) return; const query = (qs('#news-search')?.value || '').toLowerCase(); const source = document.querySelector('.filter-button.active')?.dataset.source || 'all'; const filtered = articles.filter((article) => (source === 'all' || article.source === source) && `${article.title} ${article.domain}`.toLowerCase().includes(query)); grid.innerHTML = filtered.length ? filtered.slice(0, 60).map((article) => `<a class="news-card" href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><div class="news-card-top"><span class="news-source">${escapeHtml(article.source)}</span><span class="news-date">${escapeHtml(formatNewsDate(article.seendate))}</span></div><h3>${escapeHtml(article.title)}</h3><div class="news-card-bottom"><span>${escapeHtml(article.domain)}</span><strong>Baca artikel ↗</strong></div></a>`).join('') : '<p class="data-disclaimer">Belum ada artikel dari domain kurasi pada hasil live saat ini. Coba kata kunci lain atau buka situs sumber langsung.'; }
function renderNewsTicker(articles) { const track = qs('#news-ticker-track'); if (!track) return; const items = articles.slice(0, 12).map((article) => `<a href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(article.source)}</strong><span>${escapeHtml(article.title)}</span></a>`); track.innerHTML = items.length ? `${items.join('<i aria-hidden="true">•</i>')}${items.join('<i aria-hidden="true">•</i>')}` : '<span>Belum ada berita karhutla dari media kurasi.</span>'; }
async function initNewsTicker() { try { renderNewsTicker(await fetchNews()); } catch { const track = qs('#news-ticker-track'); if (track) track.textContent = 'Berita karhutla belum tersedia saat ini.'; } }
async function initNews() { const status = qs('#news-status'); const grid = qs('#news-grid'); if (grid) grid.innerHTML = '<p class="data-disclaimer">Memuat berita terbaru…</p>'; try { const articles = await fetchNews(); window.newsData = articles; renderNews(articles); if (status) status.textContent = `${window.newsDataStale ? 'CACHE ·' : 'LIVE ·'} ${articles.length} artikel dari empat media kurasi`; } catch (error) { if (status) status.textContent = `Indeks media belum tersedia · ${error.message}`; if (grid) grid.innerHTML = '<p class="data-disclaimer">Berita belum dapat dimuat saat ini. Coba muat ulang beberapa saat lagi.</p>'; } }
function newsSummary(value, title = '') { let summary = String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); if (title && summary.toLowerCase().startsWith(title.toLowerCase())) summary = summary.slice(title.length).replace(/^\s*[-–—:]\s*/, '').trim(); return summary.slice(0, 220); }
function newsTimestamp(value) { const match = String(value || '').match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/); const parsed = match ? new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`) : new Date(value); return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime(); }
function renderNews(articles) { const grid = qs('#news-grid'); if (!grid) return; const query = (qs('#news-search')?.value || '').toLowerCase(); const source = document.querySelector('.filter-button.active')?.dataset.source || 'all'; const filtered = articles.filter((article) => (source === 'all' || article.source === source) && `${article.title} ${article.domain}`.toLowerCase().includes(query)).sort((a, b) => newsTimestamp(b.seendate) - newsTimestamp(a.seendate)); grid.innerHTML = filtered.length ? filtered.slice(0, 60).map((article) => `<a class="news-card" href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><div class="news-card-top"><span class="news-source">${escapeHtml(article.source)}</span><span class="news-date">${escapeHtml(formatNewsDate(article.seendate))}</span></div><h3>${escapeHtml(article.title)}</h3><p class="news-summary">${escapeHtml(newsSummary(article.description || article.snippet, article.title) || 'Ringkasan singkat belum tersedia. Buka berita untuk membaca konteks lengkapnya.')}</p><div class="news-card-bottom"><span>${escapeHtml(article.domain)}</span><strong>Buka berita ↗</strong></div></a>`).join('') : '<p class="data-disclaimer">Belum ada artikel dari empat media kurasi pada hasil live saat ini.'; }
function formatNewsDate(value) { if (!value) return 'waktu tidak tersedia'; const match = String(value).match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/); const parsed = match ? new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`) : new Date(value); return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); }
function initNewsFilters() { const allowed = new Set(['all', 'Kompas', 'detikcom', 'Tempo', 'CNN Indonesia']); const filters = qs('#news-filters'); if (filters && !filters.querySelector('[data-source="CNN Indonesia"]')) filters.insertAdjacentHTML('beforeend', '<button class="filter-button" data-source="CNN Indonesia">CNN INDONESIA</button>'); document.querySelectorAll('.filter-button').forEach((button) => { if (!allowed.has(button.dataset.source)) button.remove(); }); const copy = document.querySelector('#news-grid')?.closest('.news-section')?.nextElementSibling?.querySelector('p'); if (copy) copy.textContent = 'Kompas, detikcom, Tempo, dan CNN Indonesia. Kami menampilkan metadata dan ringkasan singkat; baca artikel asli untuk konteks lengkap.'; }
function updateNewsSourceCopy() { const section = qs('#news-grid')?.closest('.news-section'); const disclaimer = section?.querySelector('.data-disclaimer'); if (disclaimer) disclaimer.textContent = 'Feed diperbarui berkala dan hanya menampilkan metadata serta ringkasan singkat. Buka artikel asli untuk konteks lengkap dan koreksi terbaru.'; const sourceLink = section?.nextElementSibling?.querySelector('a.button'); if (sourceLink) { sourceLink.textContent = 'Buka feed berita ↗'; sourceLink.href = 'https://news.google.com/'; } }
function renderMediaGallery(articles) { const gallery = qs('#media-gallery'); if (!gallery) return; gallery.innerHTML = articles.length ? articles.map((article) => `<a class="media-gallery-card" href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><div class="media-gallery-image">${article.image ? `<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" loading="lazy" />` : '<img src="assets/karhutla-hero.jpeg" alt="Foto ilustrasi karhutla" loading="lazy" /><span class="media-gallery-fallback-label">Foto ilustrasi</span>'}</div><div class="media-gallery-content"><div class="media-gallery-meta"><span class="media-gallery-source">${escapeHtml(article.source)}</span><span>${escapeHtml(formatNewsDate(article.seendate))}</span></div><h3>${escapeHtml(article.title)}</h3><span class="media-gallery-link">Buka artikel ↗</span></div></a>`).join('') : '<p class="data-disclaimer">Belum ada foto artikel dari media kurasi.</p>'; }
async function initMediaGallery() { const gallery = qs('#media-gallery'); if (!gallery) return; try { const response = await fetch('/api/news-gallery'); if (!response.ok) throw new Error(`Galeri HTTP ${response.status}`); const payload = await response.json(); renderMediaGallery(payload.articles || []); } catch { gallery.innerHTML = '<p class="data-disclaimer">Galeri foto belum tersedia. Coba muat ulang beberapa saat lagi.</p>'; } }
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
  const hourKey = new Date().toISOString().slice(0, 13);
  const cacheKey = `rimbakita-air-quality-v4-${hourKey}-${cities.length}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch { /* browser storage may be unavailable */ }
  const output = [];
  for (let i = 0; i < cities.length; i += 40) {
    const batch = cities.slice(i, i + 40);
    const params = new URLSearchParams({ latitude: batch.map((c) => c.lat).join(','), longitude: batch.map((c) => c.lon).join(','), current: 'us_aqi,pm2_5,pm10', timezone: 'auto' });
    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
    if (!response.ok) continue;
    const payload = await response.json();
    (Array.isArray(payload) ? payload : [payload]).forEach((data, index) => output.push({ ...batch[index], aqi: data.current?.us_aqi ?? null, pm25: data.current?.pm2_5 ?? null, pm10: data.current?.pm10 ?? null, time: data.current?.time ?? null, timezone: data.timezone ?? 'Asia/Jakarta' }));
  }
  if (!output.length) throw new Error('Open-Meteo tidak mengembalikan data');
  try {
    localStorage.setItem(cacheKey, JSON.stringify(output));
    Object.keys(localStorage).filter((key) => key.startsWith('rimbakita-air-quality-v') && key !== cacheKey).forEach((key) => localStorage.removeItem(key));
  } catch { /* browser storage may be unavailable */ }
  return output;
}

function moveAirQualityToHome() {
  if (!location.pathname.endsWith('/index.html') && location.pathname !== '/') return;
  const section = qs('.home-aqi-section');
  const grid = qs('#home-aqi-grid');
  if (!section || !grid) return;
  section.classList.remove('home-aqi-section');
  section.classList.add('air-section', 'air-page');
  const eyebrow = section.querySelector('.eyebrow');
  const sidecopy = section.querySelector('.section-sidecopy');
  if (eyebrow) eyebrow.textContent = 'KABUPATEN/KOTA INDONESIA';
  if (sidecopy) sidecopy.outerHTML = '<div class="filter-row"><label for="city-search">Cari kota</label><input id="city-search" type="search" placeholder="Jakarta, Pontianak…" /></div>';
  grid.id = 'city-grid';
  grid.className = 'air-grid';
  grid.innerHTML = '<p class="air-loading" aria-live="polite">Memuat indeks AQI saat ini untuk seluruh kabupaten/kota Indonesia…<br />Mohon tunggu sebentar.</p>';
}

function renderCities(data) {
  const grid = qs('#city-grid');
  if (!grid) return;
  const query = (qs('#city-search')?.value || '').toLowerCase();
  const filtered = data.filter((city) => `${city.name} ${city.province}`.toLowerCase().includes(query)).sort((a, b) => (b.aqi ?? -1) - (a.aqi ?? -1));
  grid.innerHTML = filtered.length ? filtered.map((city) => { const status = aqiStatus(city.aqi); return `<article class="air-card"><div class="air-card-top"><div><div class="city-name">${escapeHtml(city.name)}</div><div class="province">${escapeHtml(city.province)}</div></div><span class="air-badge ${status.tone}">${status.label}</span></div><div class="aqi-single"><strong class="aqi-number">${city.aqi ?? '—'}</strong><span class="aqi-label">US AQI<br />model CAMS</span></div><div class="aqi-source-labels"><span>Open-Meteo · CAMS</span></div><div class="pm">PM2.5 model · ${city.pm25 == null ? '—' : `${Number(city.pm25).toFixed(1)} µg/m³`} · live</div><div class="card-time">${city.time ? `${city.time.replace('T', ' ')} · ${city.timezone}` : 'waktu tidak tersedia'}</div></article>`; }).join('') : '<p class="data-disclaimer">Kota tidak ditemukan.</p>';
}

function renderHomeWorst(data, iqairPayload) {
  const grid = qs('#home-aqi-grid');
  if (!grid) return;
  const ranked = data.filter((city) => city.iqair?.aqi != null).sort((a, b) => b.iqair.aqi - a.iqair.aqi).slice(0, 5);
  if (!iqairPayload.configured) {
    grid.innerHTML = `<div class="home-aqi-empty"><strong>${t('IQAir belum terhubung', 'IQAir is not connected yet')}</strong><p>${t('Tambahkan IQAIR_API_KEY di Vercel Production agar lima kota dengan AQI IQAir tertinggi dapat ditampilkan.', 'Add IQAIR_API_KEY in Vercel Production to show the five cities with the highest IQAir AQI.')}</p><a class="text-link" href="udara.html">${t('Lihat data model CAMS', 'View CAMS model data')} <span>→</span></a></div>`;
    return;
  }
  if (!ranked.length) {
    const denied = iqairPayload.errors?.some((error) => error.includes('permission_denied'));
    grid.innerHTML = `<div class="home-aqi-empty"><strong>${t(denied ? 'Akses data kota IQAir belum tersedia' : 'Data AQI belum tersedia', denied ? 'IQAir city data access is not available' : 'IQAir AQI data is not available yet')}</strong><p>${t(denied ? 'API key sudah terbaca, tetapi endpoint Overall AQI tingkat kota belum diizinkan untuk paket IQAir saat ini.' : 'Belum ada pembaruan AQI kota dari IQAir untuk wilayah yang dipantau.', denied ? 'The API key is detected, but city-level Overall AQI is not enabled for the current IQAir plan.' : 'No city-level AQI update is available from IQAir for the monitored locations.')}</p></div>`;
    return;
  }
  grid.innerHTML = ranked.map((city, index) => { const status = aqiStatus(city.iqair.aqi); return `<article class="home-aqi-card"><div class="home-aqi-rank">0${index + 1}</div><div class="home-aqi-main"><div><strong>${escapeHtml(city.name)}</strong><span>${escapeHtml(city.province)}</span></div><span class="air-badge ${status.tone}">${escapeHtml(status.label)}</span></div><div class="home-aqi-value"><b>${city.iqair.aqi}</b><span>US AQI · IQAir<br />${t('tingkat kota', 'city level')}</span></div><div class="home-aqi-time">${escapeHtml(city.iqair.timestamp ? new Date(city.iqair.timestamp).toLocaleString(document.documentElement.lang === 'en' ? 'en-US' : 'id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : t('waktu tidak tersedia', 'time unavailable'))}</div></article>`; }).join('');
}

async function initAir() {
  const status = qs('#air-status');
  const homeStatus = qs('#home-status');
  const grid = qs('#city-grid');
  try {
    if (status) status.textContent = 'MEMUAT 514 KABUPATEN/KOTA…';
    if (grid) grid.innerHTML = '<p class="air-loading" aria-live="polite">Memuat indeks AQI saat ini untuk seluruh kabupaten/kota Indonesia…<br />Mohon tunggu sebentar.</p>';
    const homeOnly = !!qs('#home-aqi-grid') && !grid;
    if (!homeOnly) cities = await loadAllRegencies();
    const data = await fetchAirQuality();
    const iqairPayload = { configured: false, data: [] };
    window.airData = data;
    renderCities(data);
    renderHomeWorst(data, iqairPayload);
    const rankedIqair = data.filter((city) => city.iqair?.aqi != null).sort((a, b) => b.iqair.aqi - a.iqair.aqi).slice(0, 5);
    document.querySelectorAll('.home-aqi-card .home-aqi-value span').forEach((label, index) => { const modelAqi = rankedIqair[index]?.aqi; label.innerHTML = `US AQI · IQAir<br />${t('tingkat kota', 'city level')}<br /><small>US AQI CAMS: ${modelAqi ?? '—'}</small>`; });
    const worst = [...data].sort((a, b) => (b.aqi ?? -1) - (a.aqi ?? -1))[0];
    if (status) status.textContent = `LIVE · ${data.length} kabupaten/kota · tertinggi ${worst?.name || '—'} ${worst?.aqi ?? '—'} US AQI model CAMS`;
    const homeCopy = document.querySelector('.home-air-copy'); if (homeCopy) homeCopy.textContent = t('US AQI berbasis model CAMS/Open-Meteo membantu melihat kondisi udara di setiap kabupaten/kota.', 'CAMS/Open-Meteo model US AQI helps show air conditions across every regency and city.');
    const disclaimer = document.querySelector('.air-page .data-disclaimer'); if (disclaimer) disclaimer.textContent = 'Sumber: Open-Meteo Air Quality API berbasis model CAMS. IQAir sementara disembunyikan.';
    const methodology = document.querySelector('.air-page')?.nextElementSibling; if (methodology) { const title = methodology.querySelector('strong'); const copy = methodology.querySelector('p'); if (title) title.textContent = 'Model CAMS'; if (copy) copy.textContent = 'Data model membantu membaca pola kualitas udara per wilayah. Angka ini bukan pengganti pengukuran sensor lapangan.'; }
    const footerSource = document.querySelector('.site-footer span:nth-child(2)'); if (footerSource) footerSource.textContent = 'Data udara: model CAMS';
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
  const mapTitle = document.querySelector('.page-intro h1');
  if (mapTitle) mapTitle.textContent = t('Pantau Udara Kita', 'Monitor Our Air');
  if (mapIntro) mapIntro.textContent = t('Data NASA FIRMS dan US AQI membantu kita melihat hotspot, kualitas udara, dan paparan karbon monoksida (CO) di sekitar Indonesia. Data ini adalah sinyal pemantauan, bukan pengganti pemeriksaan lapangan.', 'NASA FIRMS and US AQI data help us understand hotspots, air quality, and carbon monoxide (CO) exposure across Indonesia. These signals support monitoring; they do not replace field verification.');
  const mapSource = document.querySelector('.map-section')?.nextElementSibling;
  if (mapSource?.classList.contains('source-strip')) mapSource.innerHTML = '<div><span class="eyebrow">MEMAHAMI DATA</span><strong>Hotspot, CO, dan AQI</strong><div class="data-guide-grid"><div><b>Hotspot</b><p>Anomali panas yang terdeteksi satelit NASA FIRMS. Hotspot bukan otomatis berarti kebakaran; awan dan kondisi lahan bisa memengaruhi deteksi.</p></div><div><b>CO</b><p>Karbon monoksida adalah gas hasil pembakaran. Di peta NASA AIRS, CO membantu melihat sebaran asap dan atmosfer—ini bukan CO₂ dan bukan AQI.</p></div><div><b>US AQI</b><p>Indeks untuk menerjemahkan tingkat polusi udara menjadi skala risiko kesehatan. Angka lebih tinggi berarti udara lebih perlu diwaspadai.</p></div></div></div><a class="button button-outline" href="https://firms.modaps.eosdis.nasa.gov/web-services/" target="_blank" rel="noreferrer">Tentang NASA FIRMS ↗</a>';
  const mapNote = qs('.map-note');
  if (mapNote) mapNote.innerHTML = '<strong>Hotspot & atmosfer NASA</strong><p>Titik merah adalah anomali panas dari NASA FIRMS. Layer warna adalah konsentrasi karbon monoksida NASA AIRS: merah lebih tinggi, biru/ungu lebih rendah.</p><p>Layer atmosfer bukan AQI dan tidak otomatis menunjukkan lokasi kebakaran.</p>';
  const map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([-1.8, 117.2], 4.7);
  L.control.zoom({ position: 'topright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', opacity: 0.82 }).addTo(map);
  const nasaDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const coLayer = L.tileLayer.wms('https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi', { layers: 'AIRS_L2_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Day', format: 'image/png', transparent: true, opacity: .52, version: '1.1.1', time: nasaDate, attribution: 'NASA GIBS / AIRS' }).addTo(map);
  const mapOverlay = document.querySelector('#map')?.parentElement?.querySelector('.map-overlay');
  if (mapOverlay) { mapOverlay.insertAdjacentHTML('beforeend', '<button class="overlay-chip map-toggle" id="co-toggle" type="button">Sembunyikan CO</button><button class="overlay-chip map-toggle" id="map-note-toggle" type="button">Sembunyikan keterangan</button>'); qs('#co-toggle')?.addEventListener('click', (event) => { if (map.hasLayer(coLayer)) { map.removeLayer(coLayer); event.currentTarget.textContent = 'Tampilkan CO'; } else { coLayer.addTo(map); event.currentTarget.textContent = 'Sembunyikan CO'; } }); qs('#map-note-toggle')?.addEventListener('click', (event) => { mapNote?.classList.toggle('is-hidden'); event.currentTarget.textContent = mapNote?.classList.contains('is-hidden') ? 'Tampilkan keterangan' : 'Sembunyikan keterangan'; }); }
  const firesStatus = qs('#fires-status');
  fetch('/api/firms?days=1').then((response) => { if (!response.ok) throw new Error(`FIRMS HTTP ${response.status}`); return response.json(); }).then((rows) => {
    rows.slice(0, 3000).forEach((row) => { const lat = Number(row.latitude); const lon = Number(row.longitude); if (!Number.isFinite(lat) || !Number.isFinite(lon)) return; const confidence = row.confidence || 'n/a'; const marker = L.circleMarker([lat, lon], { radius: 5, color: '#fff', weight: 1, fillColor: '#e95748', fillOpacity: .83 }).addTo(map); marker.bindPopup(`<strong>Hotspot NASA FIRMS</strong><br />Kepercayaan: ${escapeHtml(confidence)}<br />${escapeHtml(row.acq_date || '')} ${escapeHtml(row.acq_time || '')} UTC`); });
    if (firesStatus) firesStatus.textContent = `LIVE · ${rows.length.toLocaleString('id-ID')} hotspot dari NASA FIRMS`;
  }).catch((error) => { if (firesStatus) firesStatus.textContent = `Feed FIRMS gagal · ${error.message}`; });
}

function aqiMapColor(aqi) { if (aqi == null) return '#64716d'; if (aqi <= 50) return '#4caa72'; if (aqi <= 100) return '#d2a531'; if (aqi <= 150) return '#e27b3d'; if (aqi <= 200) return '#d95751'; return '#81517c'; }
async function makeAqiMap() {
  if (!qs('#map') || !window.L || qs('#aqi-map')) return;
  const sourceStrip = qs('.source-strip');
  if (!sourceStrip) return;
  sourceStrip.insertAdjacentHTML('beforebegin', '<section class="aqi-map-section shell"><div class="section-heading compact"><div><p class="eyebrow">KUALITAS UDARA NASIONAL</p><h2>Indeks AQI<br /><em>di peta.</em></h2></div><div><p class="section-sidecopy">US AQI saat ini untuk seluruh kabupaten/kota Indonesia. Warna dan angka membantu melihat wilayah dengan kualitas udara yang perlu diperhatikan.</p><div class="data-status" id="aqi-map-status">Menyiapkan peta AQI…</div></div></div><div class="map-wrap aqi-map-wrap"><div id="aqi-map" aria-label="Peta indeks kualitas udara Indonesia"></div><div class="map-overlay"><span class="overlay-chip"><span class="pulse"></span> AQI LIVE</span><span class="overlay-chip muted">MODEL OPEN-METEO</span></div><div class="map-note"><strong>Catatan AQI</strong><p>Nilai US AQI dihitung dari data kualitas udara model Open-Meteo, bukan pembacaan langsung dari stasiun IQAir.</p></div></div><div class="map-footer aqi-map-footer"><div><i class="legend-dot low"></i>Baik ≤ 50</div><div><i class="legend-dot medium"></i>Sedang 51–100</div><div><i class="legend-dot high"></i>Tidak sehat &gt; 100</div><div>Data diperbarui saat halaman dimuat</div></div></section>');
  const map = L.map('aqi-map', { scrollWheelZoom: false, zoomControl: false }).setView([-1.8, 117.2], 4.7);
  L.control.zoom({ position: 'topright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', opacity: 0.82 }).addTo(map);
  const status = qs('#aqi-map-status');
  const aqiMapNote = document.querySelector('.aqi-map-wrap .map-note');
  const aqiMapOverlay = document.querySelector('.aqi-map-wrap .map-overlay');
  if (aqiMapOverlay) { aqiMapOverlay.insertAdjacentHTML('beforeend', '<button class="overlay-chip map-toggle" id="aqi-map-note-toggle" type="button">Sembunyikan keterangan</button>'); qs('#aqi-map-note-toggle')?.addEventListener('click', (event) => { aqiMapNote?.classList.toggle('is-hidden'); event.currentTarget.textContent = aqiMapNote?.classList.contains('is-hidden') ? 'Tampilkan keterangan' : 'Sembunyikan keterangan'; }); }
  try {
    if (status) status.textContent = 'MEMUAT AQI 514 KABUPATEN/KOTA…';
    const regencies = await loadAllRegencies();
    cities = regencies;
    const data = await fetchAirQuality();
    data.forEach((city) => {
      if (!Number.isFinite(city.aqi)) return;
      const marker = L.circleMarker([city.lat, city.lon], { radius: 5, color: '#fff', weight: 1, fillColor: aqiMapColor(city.aqi), fillOpacity: .9 }).addTo(map);
      marker.bindPopup(`<strong>${escapeHtml(city.name)}</strong><br />${escapeHtml(city.province)}<br /><b>${city.aqi} US AQI</b> · ${escapeHtml(aqiStatus(city.aqi).label)}<br />PM2.5: ${city.pm25 == null ? '—' : Number(city.pm25).toFixed(1)} µg/m³<br />${escapeHtml(city.time || '')}`);
    });
    const updated = data.filter((city) => city.time).sort((a, b) => String(b.time).localeCompare(String(a.time)))[0]?.time;
    if (status) status.textContent = `LIVE · ${data.length} kabupaten/kota · ${updated ? updated.replace('T', ' ') : 'waktu tersedia'}`;
  } catch (error) {
    if (status) status.textContent = 'Feed AQI gagal dimuat · coba refresh';
    const note = document.querySelector('.aqi-map-wrap .map-note');
    if (note) note.insertAdjacentHTML('beforeend', `<p class="map-error">${escapeHtml(error.message)}</p>`);
  }
}

// Move the air-quality section before wiring the search field. On the home page
// this creates #city-grid and #city-search dynamically; binding before that
// happened meant the search input never received an event listener.
moveAirQualityToHome();
if (qs('#city-grid') || qs('#home-aqi-grid')) { qs('#city-search')?.addEventListener('input', () => renderCities(window.airData || [])); initAir(); }
if (qs('#news-grid')) { initNewsFilters(); updateNewsSourceCopy(); qs('#news-search').addEventListener('input', () => renderNews(window.newsData || [])); document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active')); button.classList.add('active'); renderNews(window.newsData || []); })); initNews(); }
if (qs('.action-section')) { document.querySelector('.page-intro')?.remove(); document.querySelector('.action-section')?.remove(); }
initActionForm();
initVerifiedActions();
renderSharedHeader();
applySeo();
document.querySelectorAll('nav a[href="udara.html"]').forEach((element) => element.remove());
const homeAqiSection = document.querySelector('.home-aqi-section'); if (homeAqiSection) { homeAqiSection.id = 'home-aqi-section'; document.querySelectorAll('a[href="udara.html"]').forEach((link) => { link.href = 'index.html#home-aqi-section'; }); }
document.querySelectorAll('.header-button, .site-footer a').forEach((element) => element.remove());
document.title = document.title.replace(/Rimba Waspada/g, SITE_BRAND); const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const textNodes = []; while (textWalker.nextNode()) textNodes.push(textWalker.currentNode); textNodes.forEach((node) => { if (node.nodeValue.includes('Rimba Waspada')) node.nodeValue = node.nodeValue.replace(/Rimba Waspada/g, SITE_BRAND); });
initMobileMenu();
initLanguageSwitcher();
initAqiInfo();
makeMap();
makeAqiMap();
initNewsTicker();
initMediaGallery();
setInterval(() => { initNewsTicker(); initMediaGallery(); if (qs('#news-grid')) initNews(); }, 15 * 60 * 1000);
