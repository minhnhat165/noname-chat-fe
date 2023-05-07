import ReactQueryProvider from './ReactQueryProvider';

export interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};
