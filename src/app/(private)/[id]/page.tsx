export interface PageProps {
  params: {
    id: string;
  };
}
export const getUserGithub = async (id: string) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const data = await response.json();
  return data;
};
const Page = async ({ params }: PageProps) => {
  const user = await getUserGithub(params.id);

  return <div>{user.name}</div>;
};

export default Page;
