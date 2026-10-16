function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'object') return body;
  try { return JSON.parse(body); } catch { return {}; }
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method tidak didukung.' });
  const key = process.env.IQAIR_API_KEY || process.env.AIRVISUAL_API_KEY;
  if (!key) return response.status(200).json({ configured: false, data: [], message: 'IQAIR_API_KEY belum dikonfigurasi.' });
  const locations = (parseBody(request.body).locations || []).filter((location) => Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lon))).slice(0, 24);
  if (!locations.length) return response.status(200).json({ configured: true, data: [] });
  try {
    const data = (await Promise.all(locations.map(async (location) => {
      const params = new URLSearchParams({ lat: String(location.lat), lon: String(location.lon), key });
      try {
        const upstream = await fetch(`https://api.airvisual.com/v2/nearest_station?${params}`);
        if (!upstream.ok) return null;
        const payload = await upstream.json();
        if (payload.status !== 'success' || !payload.data?.current?.pollution) return null;
        const pollution = payload.data.current.pollution;
        return { requestedName: location.name, station: payload.data.name || '', city: payload.data.city || '', state: payload.data.state || '', aqi: pollution.aqius ?? null, pm25: pollution.p2?.conc ?? null, timestamp: pollution.ts || null };
      } catch { return null; }
    }))).filter(Boolean);
    response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return response.status(200).json({ configured: true, data });
  } catch {
    return response.status(502).json({ configured: true, data: [], error: 'Data IQAir tidak dapat dihubungi.' });
  }
};
