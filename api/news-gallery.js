function decodeXml(value) {
  return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

const sources = [
  { match: 'kompas.com', label: 'Kompas' },
  { match: 'detik.com', label: 'detikcom' },
  { match: 'tempo.co', label: 'Tempo' },
  { match: 'cnnindonesia.com', label: 'CNN Indonesia' },
];

function sourceLabel(domain = '') {
  return sources.find((source) => domain.toLowerCase().includes(source.match))?.label || null;
}

function parseGoogleNews(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const block = match[1];
    const field = (tag) => decodeXml(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]);
    const sourceMatch = block.match(/<source[^>]*url="([^"]*)"[^>]*>([\s\S]*?)<\/source>/);
    const sourceUrl = decodeXml(sourceMatch?.[1]);
    const domain = sourceUrl ? new URL(sourceUrl).hostname : '';
    return { title: field('title'), url: field('link'), domain, source: sourceLabel(domain), seendate: field('pubDate') };
  }).filter((article) => article.source && article.title && article.url);
}

function extractMeta(html, name) {
  const escaped = name.replace(':', '\\:');
  const first = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i').exec(html);
  const second = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i').exec(html);
  return decodeXml(first?.[1] || second?.[1] || '');
}

async function addPreview(article) {
  try {
    const response = await fetch(article.url, { headers: { 'user-agent': 'Rimba Kita media preview' } });
    if (!response.ok) return article;
    const html = await response.text();
    const image = extractMeta(html, 'og:image');
    return { ...article, image: image ? new URL(image, response.url).href : '' };
  } catch {
    return article;
  }
}

module.exports = async function handler(request, response) {
  if (request.method && request.method !== 'GET') return response.status(405).json({ error: 'Method tidak didukung.' });
  try {
    const rss = await fetch('https://news.google.com/rss/search?q=karhutla+Indonesia&hl=id&gl=ID&ceid=ID:id');
    if (!rss.ok) return response.status(502).json({ error: 'Feed berita sedang tidak tersedia.' });
    const articles = parseGoogleNews(await rss.text());
    const unique = [...new Map(articles.map((article) => [article.url, article])).values()].slice(0, 8);
    const withPreviews = await Promise.all(unique.map(addPreview));
    response.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    return response.status(200).json({ articles: withPreviews });
  } catch {
    return response.status(502).json({ error: 'Galeri media tidak dapat dihubungi.' });
  }
};
