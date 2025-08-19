import { getCsrfToken, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login({ csrfToken }) {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const router = useRouter();
  async function submit(e){
    e.preventDefault();
    const res = await signIn('credentials',{ redirect:false, email, password });
    if(res?.ok) router.push('/dashboard');
    else alert('Login failed');
  }
  return (
    <main className='container'>
      <h2>Login</h2>
      <form onSubmit={submit} style={{display:'grid',gap:8,maxWidth:360}}>
        <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
        <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} type='password' />
        <button className='btn' type='submit'>Login</button>
      </form>
    </main>
  );
}

export async function getServerSideProps(ctx){
  return { props: { csrfToken: await getCsrfToken(ctx) } }
}
