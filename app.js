const cities = [
  { name: 'Jakarta', province: 'DKI Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Palangka Raya', province: 'Kalimantan Tengah', lat: -2.2096, lon: 113.9213 },
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lon: 109.3425 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.5071, lon: 101.4478 },
  { name: 'Jambi', province: 'Jambi', lat: -1.6101, lon: 103.6131 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3186, lon: 114.5944 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lon: 117.1536 },
  { name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327 },
];

const qs = (selector) => document.querySelector(selector);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function aqiStatus(aqi) {
  if (aqi == null) return { label: 'N/A', tone: 'moderate' };
  if (aqi <= 50) return { label: 'Baik', tone: 'good' };
  if (aqi <= 100) return { label: 'Sedang', tone: 'moderate' };
  if (aqi <= 150) return { label: 'Sensitif', tone: 'unhealthy' };
  if (aqi <= 200) return { label: 'Tidak sehat', tone: 'unhealthy' };
  return { label: 'Sangat tidak sehat', tone: 'unhealthy' };
}

async function fetchAirQuality() {
  const params = new URLSearchParams({ latitude: cities.map((c) => c.lat).join(','), longitude: cities.map((c) => c.lon).join(','), current: 'us_aqi,pm2_5,pm10', timezone: 'auto', forecast_days: '1' });
  const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
  if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);
  const payload = await response.json();
  return (Array.isArray(payload) ? payload : [payload]).map((data, index) => ({ ...cities[index], aqi: data.current?.us_aqi ?? null, pm25: data.current?.pm2_5 ?? null, pm10: data.current?.pm10 ?? null, time: data.current?.time ?? null, timezone: data.timezone ?? 'Asia/Jakarta' }));
}

function renderCities(data) {
  const grid = qs('#city-grid');
  if (!grid) return;
  const query = (qs('#city-search')?.value || '').toLowerCase();
  const filtered = data.filter((city) => `${city.name} ${city.province}`.toLowerCase().includes(query));
  grid.innerHTML = filtered.length ? filtered.map((city) => { const status = aqiStatus(city.aqi); return `<article class="air-card"><div class="air-card-top"><div><div class="city-name">${escapeHtml(city.name)}</div><div class="province">${escapeHtml(city.province)}</div></div><span class="air-badge ${status.tone}">${status.label}</span></div><div class="aqi-row"><strong class="aqi-number">${city.aqi ?? '—'}</strong><span class="aqi-label">US AQI<br />model</span></div><div class="pm">PM2.5 · ${city.pm25 == null ? '—' : `${Number(city.pm25).toFixed(1)} µg/m³`} · live</div><div class="card-time">${city.time ? `${city.time.replace('T', ' ')} · ${city.timezone}` : 'waktu tidak tersedia'}</div></article>`; }).join('') : '<p class="data-disclaimer">Kota tidak ditemukan.</p>';
}

async function initAir() {
  const status = qs('#air-status');
  const homeStatus = qs('#home-status');
  try {
    const data = await fetchAirQuality();
    window.airData = data;
    renderCities(data);
    if (status) status.textContent = `LIVE · ${new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}`;
    if (homeStatus) homeStatus.textContent = 'Kualitas udara live terhubung';
  } catch (error) {
    if (status) status.textContent = 'Gagal mengambil feed live · coba refresh';
    if (homeStatus) homeStatus.textContent = 'Feed live belum tersedia';
    const grid = qs('#city-grid');
    if (grid) grid.innerHTML = `<p class="data-disclaimer">Feed live tidak dapat diambil saat ini. Detail teknis: ${escapeHtml(error.message)}</p>`;
  }
}

function makeMap() {
  if (!qs('#map') || !window.L) return;
  const map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([-1.8, 117.2], 4.7);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', opacity: 0.82 }).addTo(map);
  const firesStatus = qs('#fires-status');
  const mapKey = window.FIRMS_MAP_KEY || '';
  if (!mapKey) {
    if (firesStatus) firesStatus.textContent = 'MENUNGGU MAP_KEY · Peta siap menerima hotspot NASA FIRMS live';
    return;
  }
  const bounds = '95,-11,141,6';
  const endpoint = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(mapKey)}/VIIRS_SNPP_NRT/${bounds}/1`;
  fetch(endpoint).then((response) => { if (!response.ok) throw new Error(`FIRMS HTTP ${response.status}`); return response.text(); }).then((csv) => {
    const lines = csv.trim().split('\n'); const headers = lines.shift().split(','); const rows = lines.map((line) => line.split(',')); const index = Object.fromEntries(headers.map((header, i) => [header, i]));
    rows.slice(0, 3000).forEach((row) => { const lat = Number(row[index.latitude]); const lon = Number(row[index.longitude]); if (!Number.isFinite(lat) || !Number.isFinite(lon)) return; const confidence = row[index.confidence] || 'n/a'; const marker = L.circleMarker([lat, lon], { radius: 5, color: '#fff', weight: 1, fillColor: '#e95748', fillOpacity: .83 }).addTo(map); marker.bindPopup(`<strong>Hotspot NASA FIRMS</strong><br />Kepercayaan: ${escapeHtml(confidence)}<br />${escapeHtml(row[index.acq_date] || '')} ${escapeHtml(row[index.acq_time] || '')} UTC`); });
    if (firesStatus) firesStatus.textContent = `LIVE · ${rows.length.toLocaleString('id-ID')} hotspot dari NASA FIRMS`;
  }).catch((error) => { if (firesStatus) firesStatus.textContent = `Feed FIRMS gagal · ${error.message}`; });
}

if (qs('#city-grid')) { qs('#city-search').addEventListener('input', () => renderCities(window.airData || [])); initAir(); }
if (qs('#map')) { const config = document.createElement('script'); config.src = 'config.js'; config.onload = makeMap; config.onerror = makeMap; document.head.appendChild(config); } else makeMap();
