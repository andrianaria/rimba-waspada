function decodeXml(value) { return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }

function parseGoogleNews(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const block = match[1];
    const field = (tag) => decodeXml(block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]);
    const source = block.match(/<source[^>]*url="([^"]*)"[^>]*>/);
    return { title: field('title'), url: field('link'), domain: source ? new URL(source[1]).hostname : '', seendate: field('pubDate'), description: field('description') };
  }).filter((article) => article.title && article.url && article.domain);
}

export async function onRequestGet() {
  try {
    const rss = await fetch('https://news.google.com/rss/search?q=karhutla+Indonesia&hl=id&gl=ID&ceid=ID:id');
    if (!rss.ok) return new Response(JSON.stringify({ error: 'Feed berita sedang tidak tersedia.' }), { status: 502, headers: { 'content-type': 'application/json' } });
    return new Response(JSON.stringify({ articles: parseGoogleNews(await rss.text()) }), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=1800' } });
  } catch { return new Response(JSON.stringify({ error: 'Indeks berita tidak dapat dihubungi.' }), { status: 502, headers: { 'content-type': 'application/json' } }); }
}
