import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function PostShift({}) {
  const [title,setTitle]=useState('');
  const [location,setLocation]=useState('');
  const [rate,setRate]=useState('');
  const [date,setDate]=useState('');
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/shifts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,location,rate,date})});
    const j = await res.json();
    if(j.success) router.push('/dashboard');
    else alert('Error: '+j.error);
  }

  return (
    <main className='container'>
      <h2>Post Shift</h2>
      <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:480}}>
        <input placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder='Location' value={location} onChange={e=>setLocation(e.target.value)} />
        <input placeholder='Rate' value={rate} onChange={e=>setRate(e.target.value)} />
        <input placeholder='Date (YYYY-MM-DD)' value={date} onChange={e=>setDate(e.target.value)} />
        <button className='btn' type='submit'>Create Shift</button>
      </form>
    </main>
  )
}

export async function getServerSideProps(ctx){
  const session = await getSession(ctx);
  if(!session) return { redirect: { destination: '/login', permanent: false } };
  return { props: {} }
}
