import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { BubbleButtonPage } from './pages/BubbleButtonPage';
import { ButtonPage } from './pages/ButtonPage';
import { FabPage } from './pages/FabPage';
import { HomePage } from './pages/HomePage';
import { IconButtonPage } from './pages/IconButtonPage';
import { SearchFieldPage } from './pages/SearchFieldPage';
import { SelectPage } from './pages/SelectPage';
import { TextFieldPage } from './pages/TextFieldPage';
import { TokensPage } from './pages/TokensPage';

import '@berrypjh/react-ui/styles.css';

export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/text-field" element={<TextFieldPage />} />
        <Route path="/components/select" element={<SelectPage />} />
        <Route path="/components/search-field" element={<SearchFieldPage />} />
        <Route path="/components/fab" element={<FabPage />} />
        <Route path="/components/icon-button" element={<IconButtonPage />} />
        <Route path="/components/bubble-button" element={<BubbleButtonPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
