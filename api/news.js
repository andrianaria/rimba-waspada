module.exports = async function handler(request, response) {
  if (request.method && request.method !== 'GET') {
    return response.status(405).json({ error: 'Method tidak didukung.' });
  }

  const query = encodeURIComponent('(karhutla OR "kebakaran hutan" OR "kebakaran lahan") Indonesia');
  const endpoint = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&maxrecords=100&format=json&sort=datedesc&timespan=7d`;

  try {
    const upstream = await fetch(endpoint);
    const body = await upstream.text();
    if (!upstream.ok) return response.status(502).json({ error: 'Indeks berita sedang membatasi permintaan.' });

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return response.status(502).json({ error: 'Indeks berita mengembalikan respons yang tidak valid.' });
    }

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    return response.status(200).json(payload);
  } catch {
    return response.status(502).json({ error: 'Indeks berita tidak dapat dihubungi.' });
  }
};
