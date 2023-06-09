import { redirect } from 'next/navigation';

export default function Home() {
  const isLogged = true;
  if (isLogged) redirect('/chat');
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Chat App</h1>
    </main>
  );
}
