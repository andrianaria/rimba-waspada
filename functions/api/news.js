function decodeXml(value) { return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }

function parseGoogleNews(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const block = match[1];
    const field = (tag) => decodeXml(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]);
    const source = block.match(/<source[^>]*url="([^"]*)"[^>]*>/);
    return { title: field('title'), url: field('link'), domain: source ? new URL(source[1]).hostname : '', seendate: field('pubDate'), description: field('description') };
  }).filter((article) => article.title && article.url && article.domain);
}

function parseRss(xml, defaultDomain = '') {
  return [...String(xml || '').matchAll(/<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/gi)].map((match) => {
    const block = match[1];
    const field = (tag) => decodeXml(block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]);
    const linkTag = block.match(/<link(?:\s[^>]*)?href="([^"]+)"[^>]*>/i);
    const url = field('link') || linkTag?.[1] || '';
    return {
      title: field('title'),
      url,
      domain: defaultDomain,
      seendate: field('pubDate') || field('published') || field('updated'),
      description: field('description') || field('summary') || field('content')
    };
  }).filter((article) => article.title && article.url && article.domain);
}

async function fetchWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/rss+xml, application/xml, text/xml, text/html;q=0.8', 'user-agent': 'RimbaKita-News/1.0' }
    });
  } finally {
    clearTimeout(timer);
  }
}

function parseGdelt(payload) {
  return (payload?.articles || []).map((article) => ({
    title: article.title || '',
    url: article.url || '',
    domain: article.domain || '',
    seendate: article.seendate || '',
    description: article.socialimage || ''
  })).filter((article) => article.title && article.url && article.domain);
}

function isCurated(article) {
  const value = `${article.domain || ''} ${article.url || ''}`.toLowerCase();
  return ['kompas.com', 'detik.com', 'tempo.co', 'cnnindonesia.com'].some((domain) => value.includes(domain));
}

const fallbackArticles = [
  { title: 'Berita karhutla terbaru dari Kompas', url: 'https://www.kompas.com/tag/karhutla', domain: 'www.kompas.com', seendate: '', description: 'Buka kumpulan berita karhutla terbaru dari Kompas.' },
  { title: 'Berita karhutla terbaru dari detikcom', url: 'https://www.detik.com/search/searchall?query=karhutla', domain: 'www.detik.com', seendate: '', description: 'Buka kumpulan berita karhutla terbaru dari detikcom.' },
  { title: 'Berita karhutla terbaru dari Tempo', url: 'https://www.tempo.co/tag/karhutla', domain: 'www.tempo.co', seendate: '', description: 'Buka kumpulan berita karhutla terbaru dari Tempo.' },
  { title: 'Berita karhutla terbaru dari CNN Indonesia', url: 'https://www.cnnindonesia.com/tag/karhutla', domain: 'www.cnnindonesia.com', seendate: '', description: 'Buka kumpulan berita karhutla terbaru dari CNN Indonesia.' }
];

export async function onRequestGet() {
  try {
    const queries = [
      ['Kompas', 'site:kompas.com karhutla Indonesia'],
      ['detikcom', 'site:detik.com karhutla Indonesia'],
      ['Tempo', 'site:tempo.co karhutla Indonesia'],
      ['CNN Indonesia', 'site:cnnindonesia.com karhutla Indonesia']
    ];
    const googleResults = await Promise.allSettled(queries.map(async ([source, query]) => {
      const endpoint = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=id&gl=ID&ceid=ID:id`;
      const response = await fetchWithTimeout(endpoint);
      if (!response.ok) return [];
      return parseGoogleNews(await response.text()).map((article) => ({ ...article, source }));
    }));
    let articles = googleResults.flatMap((result) => result.status === 'fulfilled' ? result.value : []);

    if (!articles.length) {
      const directFeeds = [
        ['Tempo', 'https://rss.tempo.co/nasional', 'tempo.co'],
        ['CNN Indonesia', 'https://www.cnnindonesia.com/nasional/rss', 'cnnindonesia.com']
      ];
      const directResults = await Promise.allSettled(directFeeds.map(async ([source, endpoint, domain]) => {
        const response = await fetchWithTimeout(endpoint);
        if (!response.ok) return [];
        return parseRss(await response.text(), domain)
          .filter((article) => /karhutla|kebakaran hutan|kebakaran lahan|asap/i.test(`${article.title} ${article.description}`))
          .map((article) => ({ ...article, source }));
      }));
      articles = directResults.flatMap((result) => result.status === 'fulfilled' ? result.value : []);
    }

    if (!articles.length) {
      const query = encodeURIComponent('(karhutla OR "kebakaran hutan" OR "kebakaran lahan") Indonesia');
      const endpoint = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&maxrecords=100&format=json&sort=datedesc&timespan=7d`;
      const upstream = await fetchWithTimeout(endpoint);
      if (upstream.ok) articles = parseGdelt(await upstream.json());
    }

    const curatedArticles = articles.filter(isCurated);
    if (curatedArticles.length) articles = curatedArticles;
    articles = [...new Map(articles.map((article) => [article.url, article])).values()];
    if (!articles.length) articles = fallbackArticles;
    return new Response(JSON.stringify({ articles, stale: articles === fallbackArticles }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=1800' } });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'Sumber berita terlalu lama merespons.' : 'Indeks berita tidak dapat dihubungi.';
    return new Response(JSON.stringify({ error: message, articles: fallbackArticles, stale: true }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=900' } });
  }
}
