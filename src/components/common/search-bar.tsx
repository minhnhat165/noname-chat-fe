import { Input } from 'antd';

export const SearchBar: React.FC = () => {
  const { Search } = Input;

  return <Search size="large" placeholder="input search text" allowClear />;
};
