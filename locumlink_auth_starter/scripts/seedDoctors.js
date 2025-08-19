const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const u1 = await prisma.user.create({ data:{ email:'alice@seed.com', password:'$2a$10$abcdefghijklmnopqrstuv', role:'DOCTOR' }});
  await prisma.doctor.create({ data:{ userId: u1.id, name:'Dr. Alice Kim', specialty:'Emergency Medicine', location:'Boston' }});
  const u2 = await prisma.user.create({ data:{ email:'general@hospital.com', password:'$2a$10$abcdefghijklmnopqrstuv', role:'FACILITY' }});
  await prisma.facility.create({ data:{ userId: u2.id, name:'General Hospital', location:'Boston' }});
  console.log('Seeded demo users');
}
main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());
