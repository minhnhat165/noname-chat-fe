import Image from 'next/image';
import Link from 'next/link';
import { checkIsLogin } from '@/utils/auth';
import { redirect } from 'next/navigation';

//const LOGIN_LINK = process.env.API_BASE_URL + '/auth/google';
const LOGIN_LINK = 'http://localhost:5000/api/auth/google';

export default function Home() {
  const isLogged = checkIsLogin();
  if (isLogged) redirect('/chat');
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Chat App Logo" width={100} height={100} />
          <h1 className="my-2 mt-6 text-4xl font-bold text-white">
            Welcome to{' '}
            <span className="bg-gradient-to-br from-sky-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
              Noname Chat
            </span>
          </h1>
          <p className="mb-10 text-lg font-semibold text-white">
            Connect with friends and start chatting!
          </p>
        </div>
        <Link href={LOGIN_LINK}>
          <button className="mb-4 rounded-full bg-gradient-to-l from-blue-600 to-purple-600 px-4 py-4 font-bold text-white shadow hover:bg-blue-500">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
