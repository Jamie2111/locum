import { getSession, useSession, signOut } from 'next-auth/react'
import prisma from '../../lib/prisma'
import Link from 'next/link'

export default function Dashboard({ user, shifts }) {
  const { data: session } = useSession();
  return (
    <main className='container'>
      <h2>Dashboard</h2>
      <div style={{marginBottom:12}}>
        <strong>{user.email}</strong> — Role: {user.role}
        <button onClick={()=>signOut()} style={{marginLeft:12}} className='btn'>Sign out</button>
      </div>

      {user.role === 'FACILITY' && (
        <div>
          <h3>Your Shifts</h3>
          <Link href='/dashboard/post'><button className='btn'>Post Shift</button></Link>
          <div style={{marginTop:12}}>
            {shifts.map(s=> <div key={s.id} className='card'><strong>{s.title}</strong><div>{s.location} • {s.rate?('$'+s.rate+'/hr'):'N/A'}</div></div>)}
          </div>
        </div>
      )}

      {user.role === 'DOCTOR' && (
        <div>
          <h3>Open Shifts</h3>
          <div style={{marginTop:12}}>
            {shifts.map(s=> <div key={s.id} className='card'><strong>{s.title}</strong><div>{s.location} • {s.rate?('$'+s.rate+'/hr'):'N/A'}</div></div>)}
          </div>
        </div>
      )}
    </main>
  )
}

export async function getServerSideProps(ctx){
  const session = await getSession(ctx);
  if(!session) return { redirect: { destination: '/login', permanent: false } };
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  const shifts = await prisma.shift.findMany({ orderBy: { date: 'asc' }, take: 50 });
  return { props: { user: JSON.parse(JSON.stringify(user)), shifts: JSON.parse(JSON.stringify(shifts)) } }
}
