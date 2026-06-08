module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });
 
  const systemPrompt = `Du bist ein erstklassiger Webdesigner der professionelle, moderne Unternehmenswebsites erstellt.
 
DESIGN-ANFORDERUNGEN (PFLICHT):
- Modernes, professionelles Design das wie eine echte Agentur-Website aussieht
- Schöne Hero-Section mit großem Titel, Untertitel und Call-to-Action Button
- Gradient-Hintergründe oder starke Akzentfarben passend zur Branche
- Runde Ecken, Schatten, moderne Typografie (Google Fonts einbinden)
- Schöne Karten für Leistungen mit Icons (nutze Unicode-Symbole)
- Professioneller Footer mit allen Kontaktinfos
- Vollständig responsive (mobile-first)
- Animationen: sanfte fade-in Effekte beim Scrollen
- Farbpalette: passend zur Branche (Restaurant=warm/orange, Handwerker=blau/stark, Kosmetik=rosa/elegant etc.)
 
STRUKTUR (PFLICHT):
1. Navigation mit Logo und Menüpunkten
2. Hero-Section (große Überschrift, Slogan, Button)
3. Über-uns Section
4. Leistungen (3-4 Karten mit Icons)
5. Warum uns? (3 Vorteile)
6. Kontakt Section
7. Footer mit Impressum (§5 TMG) und Datenschutz (DSGVO)
 
TECHNISCH:
- Eine einzige HTML-Datei, CSS eingebettet
- Google Fonts laden (z.B. Inter oder Poppins)
- Kein JavaScript Framework nötig
- Nur reinen HTML-Code ausgeben, kein Markdown`;
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
