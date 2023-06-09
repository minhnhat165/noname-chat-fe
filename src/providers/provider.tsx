import ReactQueryProvider from './react-query-provider';

export interface ProviderProps {
	children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
	return <ReactQueryProvider>{children}</ReactQueryProvider>;
};
