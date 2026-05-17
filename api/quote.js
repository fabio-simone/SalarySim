export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const symbol = (req.query.symbol || 'ACN').toUpperCase().replace(/[^A-Z0-9.]/g, '');
  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    if (!r.ok) throw new Error(`Yahoo HTTP ${r.status}`);
    const j = await r.json();
    const price = j?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;
    res.json({ symbol, price });
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
