import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  try {
    const { email, password, role } = req.body;
    if(!email || !password) return res.status(400).json({ error:'Missing fields' });
    const existing = await prisma.user.findUnique({ where:{ email }});
    if(existing) return res.status(400).json({ error:'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, role }});
    if(role==='DOCTOR'){
      await prisma.doctor.create({ data: { userId: user.id, name: email.split('@')[0], location: '' }});
    } else if(role==='FACILITY'){
      await prisma.facility.create({ data: { userId: user.id, name: email.split('@')[0] + ' Facility', location: '' }});
    }
    return res.json({ success:true });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
