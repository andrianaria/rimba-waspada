function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; }
      else quoted = !quoted;
    } else if (character === ',' && !quoted) { values.push(value); value = ''; }
    else value += character;
  }
  values.push(value);
  return values;
}

function json(payload, status = 200, cache = '') {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(cache ? { 'cache-control': cache } : {}) },
  });
}

export async function onRequestGet(context) {
  const mapKey = context.env.FIRMS_MAP_KEY;
  if (!mapKey) return json({ error: 'Hotspot feed belum dikonfigurasi di Cloudflare Pages.' }, 503);
  const requestedDays = Number(new URL(context.request.url).searchParams.get('days') || 1);
  const days = Math.min(Math.max(Number.isFinite(requestedDays) ? requestedDays : 1, 1), 7);
  const bounds = '95,-11,141,6';
  const sensors = ['VIIRS_SNPP_NRT', 'VIIRS_NOAA20_NRT', 'VIIRS_NOAA21_NRT', 'MODIS_NRT'];
  try {
    const responses = await Promise.all(sensors.map(async (sensor) => {
      const endpoint = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(mapKey)}/${sensor}/${bounds}/${days}`;
      const upstream = await fetch(endpoint);
      if (!upstream.ok) return [];
      const lines = (await upstream.text()).trim().split(/\r?\n/).filter(Boolean);
      const headers = lines.shift()?.split(',') || [];
      return lines.map((line) => {
        const values = parseCsvLine(line);
        return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
      }).filter((record) => Number.isFinite(Number(record.latitude)) && Number.isFinite(Number(record.longitude))).map((record) => ({ ...record, sensor }));
    }));
    return json(responses.flat(), 200, 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
  } catch {
    return json({ error: 'Feed NASA FIRMS sedang tidak tersedia.' }, 502);
  }
}
