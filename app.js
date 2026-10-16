const cities = [
  { name: 'Palangka Raya', province: 'Kalimantan Tengah', aqi: 176, pm: 92, status: 'Tidak sehat', tone: 'unhealthy' },
  { name: 'Pontianak', province: 'Kalimantan Barat', aqi: 132, pm: 61, status: 'Sensitif', tone: 'unhealthy' },
  { name: 'Pekanbaru', province: 'Riau', aqi: 108, pm: 44, status: 'Sensitif', tone: 'unhealthy' },
  { name: 'Jambi', province: 'Jambi', aqi: 87, pm: 29, status: 'Sedang', tone: 'moderate' },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', aqi: 73, pm: 22, status: 'Sedang', tone: 'moderate' },
  { name: 'Jakarta', province: 'DKI Jakarta', aqi: 68, pm: 20, status: 'Sedang', tone: 'moderate' },
  { name: 'Samarinda', province: 'Kalimantan Timur', aqi: 54, pm: 13, status: 'Sedang', tone: 'moderate' },
  { name: 'Makassar', province: 'Sulawesi Selatan', aqi: 42, pm: 9, status: 'Baik', tone: 'good' },
];

function renderCities(query = '') {
  const grid = document.querySelector('#city-grid');
  const filtered = cities.filter((city) => `${city.name} ${city.province}`.toLowerCase().includes(query.toLowerCase()));
  grid.innerHTML = filtered.length ? filtered.map((city) => `
    <article class="air-card">
      <div class="air-card-top"><div><div class="city-name">${city.name}</div><div class="province">${city.province}</div></div><span class="air-badge ${city.tone}">${city.status}</span></div>
      <div class="aqi-row"><strong class="aqi-number">${city.aqi}</strong><span class="aqi-label">AQI<br />simulasi</span></div>
      <div class="pm">PM2.5 · ${city.pm} µg/m³ · contoh data</div>
    </article>`).join('') : '<p class="data-disclaimer">Kota belum ada di demo. Integrasi produksi akan memuat daftar lokasi dari provider kualitas udara.</p>';
}

function makeMap() {
  if (!window.L) return;
  const map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([-1.8, 117.2], 4.7);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', opacity: 0.82 }).addTo(map);
  const hotspots = [
    [-0.95, 114.2, 'Kalimantan Tengah', 'Tinggi', 17], [-2.3, 113.7, 'Kalimantan Tengah', 'Waspada', 12],
    [0.4, 109.3, 'Kalimantan Barat', 'Tinggi', 15], [1.2, 102.1, 'Riau', 'Waspada', 11],
    [-0.5, 101.4, 'Riau', 'Tinggi', 14], [-1.6, 103.6, 'Jambi', 'Waspada', 10],
    [-3.3, 104.5, 'Sumatera Selatan', 'Rendah', 8], [0.15, 116.2, 'Kalimantan Timur', 'Rendah', 8],
    [-3.8, 114.9, 'Kalimantan Selatan', 'Waspada', 10], [-2.7, 118.4, 'Sulawesi Barat', 'Rendah', 7],
  ];
  const colors = { Tinggi: '#e95748', Waspada: '#f47a39', Rendah: '#2aa795' };
  hotspots.forEach(([lat, lng, region, level, size]) => {
    const marker = L.circleMarker([lat, lng], { radius: size, color: '#fff', weight: 2, fillColor: colors[level], fillOpacity: .86 }).addTo(map);
    marker.bindPopup(`<strong>${region}</strong><br />Risiko ${level.toLowerCase()}<br /><small>Data contoh · perlu verifikasi lapangan</small>`);
  });
}

renderCities();
document.querySelector('#city-search').addEventListener('input', (event) => renderCities(event.target.value));
makeMap();
