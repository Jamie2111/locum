import prisma from '../../lib/prisma';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  try {
    const { shiftId } = req.body;
    if(!shiftId) return res.status(400).json({ error:'shiftId required' });
    const shift = await prisma.shift.findUnique({ where:{ id: shiftId }});
    if(!shift) return res.status(404).json({ error:'shift not found' });
    const doctor = await prisma.doctor.findFirst();
    if(!doctor) return res.status(404).json({ error:'no doctors seeded' });
    const app = await prisma.application.create({ data: { doctorId: doctor.id, shiftId: shift.id }});
    return res.status(200).json({ success:true, application:app, doctor });
  } catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
