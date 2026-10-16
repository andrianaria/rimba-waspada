function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      values.push(value);
      value = '';
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
}

module.exports = async function handler(request, response) {
  const mapKey = process.env.FIRMS_MAP_KEY;
  if (!mapKey) return response.status(503).json({ error: 'Hotspot feed belum dikonfigurasi.' });

  const requestedDays = Number(request.query?.days || 1);
  const days = Math.min(Math.max(Number.isFinite(requestedDays) ? requestedDays : 1, 1), 7);
  const bounds = '95,-11,141,6';
  const endpoint = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(mapKey)}/VIIRS_SNPP_NRT/${bounds}/${days}`;

  try {
    const nasaResponse = await fetch(endpoint);
    const csv = await nasaResponse.text();
    if (!nasaResponse.ok) return response.status(nasaResponse.status).json({ error: 'NASA FIRMS tidak dapat dihubungi.' });

    const lines = csv.trim() ? csv.trim().split(/\r?\n/) : [];
    const headers = lines.shift()?.split(',') || [];
    const records = lines.map((line) => {
      const values = parseCsvLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    }).filter((record) => Number.isFinite(Number(record.latitude)) && Number.isFinite(Number(record.longitude)));

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return response.status(200).json(records);
  } catch (error) {
    return response.status(502).json({ error: 'Feed NASA FIRMS sedang tidak tersedia.' });
  }
};
