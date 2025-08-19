import prisma from '../../lib/prisma';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

async function callOpenAI(rawDescription){
  if(!process.env.OPENAI_API_KEY) return null;
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(), 8000);
  try {
    const resp = await fetch(OPENAI_URL, {
      method:'POST',
      headers:{ 'Authorization': 'Bearer '+process.env.OPENAI_API_KEY, 'Content-Type':'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role:'system', content:'Extract title, location, rate, date (ISO) from this job posting and return pure JSON.' }, { role:'user', content: rawDescription }],
        max_tokens: 300
      })
    });
    clearTimeout(timeout);
    if(!resp.ok) throw new Error('OpenAI error '+resp.status);
    const j = await resp.json();
    const text = j.choices?.[0]?.message?.content || '{}';
    try { return JSON.parse(text); } catch(e){ return null; }
  } catch(e){
    console.error('OpenAI call failed', e.message);
    return null;
  }
}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  try {
    const body = req.body || {};
    const rawDescription = body.rawDescription || body.description || '';
    let title = body.title || 'Locum Shift';
    let location = body.location || 'Unknown';
    let rate = body.rate || null;
    let date = body.date || null;

    if(rawDescription && process.env.OPENAI_API_KEY){
      const parsed = await callOpenAI(rawDescription);
      if(parsed){
        title = parsed.title || title;
        location = parsed.location || location;
        rate = parsed.rate || rate;
        date = parsed.date || date;
      }
    } else {
      const m = rawDescription.match(/\$?([0-9]{2,4})\/?hr/);
      if(m) rate = parseFloat(m[1]);
      const loc = rawDescription.match(/in\s+([A-Za-z\s,]+)/);
      if(loc) location = loc[1].trim();
    }

    const shift = await prisma.shift.create({
      data: { title, description: rawDescription, location, rate: rate ? Number(rate) : null, date: date ? new Date(date) : null }
    });
    return res.status(200).json({ success:true, shift });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
