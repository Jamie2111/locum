import Link from 'next/link'
import { getSession } from 'next-auth/react'

export default function Home({ session }){
  return (
    <main className="container">
      <h1>LocumLink</h1>
      <p>Demo platform: locum ingestion + matching + auth</p>
      {!session ? (
        <div style={{marginTop:12}}>
          <Link href='/login'><button className='btn'>Login</button></Link>
          <Link href='/signup' style={{marginLeft:12}}><button className='btn'>Sign up</button></Link>
        </div>
      ) : (
        <div style={{marginTop:12}}>
          <Link href='/dashboard'><button className='btn'>Go to Dashboard</button></Link>
        </div>
      )}
    </main>
  )
}

export async function getServerSideProps(ctx){
  const session = await getSession(ctx);
  return { props: { session: session || null } }
}
