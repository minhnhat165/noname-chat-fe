import { Input } from 'antd';

const SearchBar: React.FC = () => {
  const { Search } = Input;

  return <Search size="large" placeholder="input search text" allowClear />;
};

export default SearchBar;
