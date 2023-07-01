import Image from 'next/image';
import Link from 'next/link';

const HOME_LINK = 'http://localhost:3000';

export default function BannedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="flex flex-col items-center">
          <Image src="/cry.ico" alt="Chat App Logo" width={100} height={100} quality={100} />
          <h1 className="my-2 mt-6 text-4xl font-bold text-white">
            You have been
            <span className="bg-gradient-to-br from-red-600 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
              {' '}
              Banned
            </span>
          </h1>
          <Link href={HOME_LINK}>
            <button className="mb-4 rounded-full bg-gradient-to-l from-blue-600 to-purple-600 px-4 py-4 font-bold text-white shadow hover:bg-blue-500">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
