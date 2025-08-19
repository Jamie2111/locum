import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req,res){
  try {
    if(req.method==='GET'){
      const shifts = await prisma.shift.findMany({ orderBy: { date: 'asc' }});
      return res.status(200).json({ success:true, shifts });
    }
    if(req.method==='POST'){
      const session = await getSession({ req });
      if(!session || session.user.role !== 'FACILITY') return res.status(403).json({ error:'Forbidden' });
      const user = await prisma.user.findUnique({ where: { email: session.user.email }});
      const facility = await prisma.facility.findUnique({ where: { userId: user.id }});
      const { title, location, rate, date } = req.body;
      const shift = await prisma.shift.create({ data: { facilityId: facility.id, title, description:'', location, rate: rate ? Number(rate) : null, date: date ? new Date(date) : null }});
      return res.status(200).json({ success:true, shift });
    }
    res.status(405).end();
  } catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
