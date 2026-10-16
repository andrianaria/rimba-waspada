const locations = [
  { name: 'Batam', city: 'Batam', state: 'Riau Islands' },
  { name: 'Palembang', city: 'Palembang', state: 'South Sumatra' },
  { name: 'Palangka Raya', city: 'Palangka Raya', state: 'Central Kalimantan' },
  { name: 'Pekanbaru', city: 'Pekanbaru', state: 'Riau' },
  { name: 'Pontianak', city: 'Pontianak', state: 'West Kalimantan' },
];

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=18000, stale-while-revalidate=3600' } });
}

export async function onRequestGet(context) {
  const key = context.env.IQAIR_API_KEY || context.env.AIRVISUAL_API_KEY;
  if (!key) return json({ configured: false, data: [], message: 'IQAIR_API_KEY belum dikonfigurasi di Cloudflare Pages.' });
  const errors = [];
  const data = (await Promise.all(locations.map(async (location) => {
    const url = new URL('https://api.airvisual.com/v2/city');
    url.search = new URLSearchParams({ city: location.city, state: location.state, country: 'Indonesia', key });
    try {
      const upstream = await fetch(url);
      const payload = await upstream.json();
      const pollution = payload?.data?.current?.pollution;
      if (pollution?.aqius == null) { errors.push(`${location.name}: ${payload?.data?.message || payload?.status || `HTTP ${upstream.status}`}`); return null; }
      return { requestedName: location.name, city: payload.data.city || location.city, state: payload.data.state || location.state, aqi: pollution.aqius, timestamp: pollution.ts || null, source: 'city' };
    } catch (error) { errors.push(`${location.name}: ${error.message}`); return null; }
  }))).filter(Boolean);
  return json({ configured: true, data, fetchedAt: new Date().toISOString(), cacheHours: 5, errors: errors.slice(0, 3) });
}
