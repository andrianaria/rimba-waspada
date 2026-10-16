function decodeXml(value) {
  return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function parseGoogleNews(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const block = match[1];
    const field = (tag) => decodeXml(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]);
    const sourceMatch = block.match(/<source[^>]*url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/);
    const sourceUrl = decodeXml(sourceMatch?.[1]);
    return { title: field('title'), url: field('link'), domain: sourceUrl ? new URL(sourceUrl).hostname : '', seendate: field('pubDate') };
  }).filter((article) => article.title && article.url && article.domain);
}

module.exports = async function handler(request, response) {
  if (request.method && request.method !== 'GET') {
    return response.status(405).json({ error: 'Method tidak didukung.' });
  }

  const query = encodeURIComponent('(karhutla OR "kebakaran hutan" OR "kebakaran lahan") Indonesia');
  const endpoint = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&maxrecords=100&format=json&sort=datedesc&timespan=7d`;

  try {
    const upstream = await fetch(endpoint);
    const body = await upstream.text();
    let payload = null;
    if (upstream.ok) {
      try { payload = JSON.parse(body); } catch { payload = null; }
    }

    if (!payload?.articles?.length) {
      const rss = await fetch('https://news.google.com/rss/search?q=karhutla+Indonesia&hl=id&gl=ID&ceid=ID:id');
      if (!rss.ok) return response.status(502).json({ error: 'Indeks berita sedang tidak tersedia.' });
      payload = { articles: parseGoogleNews(await rss.text()) };
    }

    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=900');
    return response.status(200).json(payload);
  } catch {
    return response.status(502).json({ error: 'Indeks berita tidak dapat dihubungi.' });
  }
};
