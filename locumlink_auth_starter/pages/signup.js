import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('DOCTOR');
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,role})});
    const j = await res.json();
    if(j.success) router.push('/login');
    else alert('Signup failed: '+j.error);
  }

  return (
    <main className='container'>
      <h2>Sign up</h2>
      <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:360}}>
        <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} type='password' />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value='DOCTOR'>Doctor</option>
          <option value='FACILITY'>Facility</option>
        </select>
        <button className='btn' type='submit'>Create account</button>
      </form>
    </main>
  )
}
