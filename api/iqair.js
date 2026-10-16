const CACHE_SECONDS = 5 * 60 * 60;

const locations = [
  { name: 'Jakarta', province: 'DKI Jakarta', city: 'Jakarta', state: 'Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Batam', province: 'Kepulauan Riau', city: 'Batam', state: 'Riau Islands', lat: 1.0456, lon: 104.0305 },
  { name: 'Palembang', province: 'Sumatera Selatan', city: 'Palembang', state: 'South Sumatra', lat: -2.9761, lon: 104.7754 },
  { name: 'Medan', province: 'Sumatera Utara', city: 'Medan', state: 'North Sumatra', lat: 3.5952, lon: 98.6722 },
  { name: 'Dumai', province: 'Riau', city: 'Dumai', state: 'Riau', lat: 1.6666, lon: 101.4 },
  { name: 'Bandar Lampung', province: 'Lampung', city: 'Bandar Lampung', state: 'Lampung', lat: -5.3971, lon: 105.2668 },
  { name: 'Padang', province: 'Sumatera Barat', city: 'Padang', state: 'West Sumatra', lat: -0.9471, lon: 100.4172 },
  { name: 'Palangka Raya', province: 'Kalimantan Tengah', city: 'Palangka Raya', state: 'Central Kalimantan', lat: -2.2096, lon: 113.9213 },
  { name: 'Pontianak', province: 'Kalimantan Barat', city: 'Pontianak', state: 'West Kalimantan', lat: -0.0263, lon: 109.3425 },
  { name: 'Pekanbaru', province: 'Riau', city: 'Pekanbaru', state: 'Riau', lat: 0.5071, lon: 101.4478 },
  { name: 'Jambi', province: 'Jambi', city: 'Jambi', state: 'Jambi', lat: -1.6101, lon: 103.6131 },
  { name: 'Bengkulu', province: 'Bengkulu', city: 'Bengkulu', state: 'Bengkulu', lat: -3.7928, lon: 102.2608 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', city: 'Banjarmasin', state: 'South Kalimantan', lat: -3.3186, lon: 114.5944 },
  { name: 'Samarinda', province: 'Kalimantan Timur', city: 'Samarinda', state: 'East Kalimantan', lat: -0.5022, lon: 117.1536 },
  { name: 'Balikpapan', province: 'Kalimantan Timur', city: 'Balikpapan', state: 'East Kalimantan', lat: -1.2379, lon: 116.8529 },
  { name: 'Banjarbaru', province: 'Kalimantan Selatan', city: 'Banjarbaru', state: 'South Kalimantan', lat: -3.442, lon: 114.841 },
  { name: 'Bandung', province: 'Jawa Barat', city: 'Bandung', state: 'West Java', lat: -6.9175, lon: 107.6191 },
  { name: 'Semarang', province: 'Jawa Tengah', city: 'Semarang', state: 'Central Java', lat: -6.9667, lon: 110.4167 },
  { name: 'Surabaya', province: 'Jawa Timur', city: 'Surabaya', state: 'East Java', lat: -7.2575, lon: 112.7521 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', city: 'Yogyakarta', state: 'Yogyakarta', lat: -7.7956, lon: 110.3695 },
  { name: 'Denpasar', province: 'Bali', city: 'Denpasar', state: 'Bali', lat: -8.6705, lon: 115.2126 },
  { name: 'Kupang', province: 'Nusa Tenggara Timur', city: 'Kupang', state: 'East Nusa Tenggara', lat: -10.1772, lon: 123.607 },
  { name: 'Palu', province: 'Sulawesi Tengah', city: 'Palu', state: 'Central Sulawesi', lat: -0.9003, lon: 119.8779 },
  { name: 'Manado', province: 'Sulawesi Utara', city: 'Manado', state: 'North Sulawesi', lat: 1.4748, lon: 124.8421 },
  { name: 'Makassar', province: 'Sulawesi Selatan', city: 'Makassar', state: 'South Sulawesi', lat: -5.1477, lon: 119.4327 },
];

function send(response, status, payload, cacheable = false) {
  if (cacheable) {
    const cacheHeader = `public, max-age=0, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=3600`;
    response.setHeader('Cache-Control', cacheHeader);
    response.setHeader('Vercel-CDN-Cache-Control', cacheHeader);
  }
  return response.status(status).json(payload);
}

function pollutionResult(location, payload, source) {
  const pollution = payload?.data?.current?.pollution;
  if (!pollution || pollution.aqius == null) return null;
  return { requestedName: location.name, station: payload.data.name || payload.data.city || location.city, city: payload.data.city || location.city, state: payload.data.state || location.state, aqi: pollution.aqius, pm25: pollution.p2?.conc ?? null, timestamp: pollution.ts || null, source };
}

async function readUpstream(url) {
  const upstream = await fetch(url);
  let payload = {};
  try { payload = await upstream.json(); } catch { /* non-JSON upstream response */ }
  return { upstream, payload };
}

module.exports = async function handler(request, response) {
  const key = process.env.IQAIR_API_KEY || process.env.AIRVISUAL_API_KEY;
  if (!key) return send(response, 200, { configured: false, data: [], message: 'IQAIR_API_KEY belum dikonfigurasi.' }, request.method === 'GET');
  if (!['GET', 'POST'].includes(request.method)) return send(response, 405, { error: 'Method tidak didukung.' });

  const requested = request.method === 'POST' && request.body?.locations ? request.body.locations : locations;
  const safeLocations = requested.filter((location) => Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lon))).slice(0, 25);
  if (!safeLocations.length) return send(response, 200, { configured: true, data: [], errors: ['Tidak ada lokasi valid.'] }, request.method === 'GET');

  const errors = [];
  const data = (await Promise.all(safeLocations.map(async (location) => {
    const city = location.city || location.name;
    const state = location.state || location.province;
    const cityUrl = new URL('https://api.airvisual.com/v2/city');
    cityUrl.search = new URLSearchParams({ city, state, country: 'Indonesia', key });
    try {
      const cityResponse = await readUpstream(cityUrl);
      const cityResult = pollutionResult(location, cityResponse.payload, 'city');
      if (cityResult) return cityResult;
      const nearestCityUrl = new URL('https://api.airvisual.com/v2/nearest_city');
      nearestCityUrl.search = new URLSearchParams({ lat: String(location.lat), lon: String(location.lon), key });
      const nearestCityResponse = await readUpstream(nearestCityUrl);
      const nearestCityResult = pollutionResult(location, nearestCityResponse.payload, 'nearest_city');
      if (nearestCityResult) return nearestCityResult;
      const nearestUrl = new URL('https://api.airvisual.com/v2/nearest_station');
      nearestUrl.search = new URLSearchParams({ lat: String(location.lat), lon: String(location.lon), key });
      const nearestResponse = await readUpstream(nearestUrl);
      const nearestResult = pollutionResult(location, nearestResponse.payload, 'nearest_station');
      if (nearestResult) return nearestResult;
      const upstreamError = nearestResponse.payload?.data?.message || nearestResponse.payload?.status || nearestCityResponse.payload?.data?.message || nearestCityResponse.payload?.status || cityResponse.payload?.data?.message || cityResponse.payload?.status || `HTTP ${nearestResponse.upstream.status}`;
      errors.push(`${location.name}: ${upstreamError}`);
    } catch (error) { errors.push(`${location.name}: ${error.message}`); }
    return null;
  }))).filter(Boolean);

  return send(response, 200, { configured: true, data, fetchedAt: new Date().toISOString(), cacheHours: 5, errors: errors.slice(0, 3) }, request.method === 'GET');
};
