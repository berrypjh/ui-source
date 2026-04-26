import { Route, Routes } from 'react-router-dom';

import '@berrypjh/react-ui/styles.css';

import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ButtonPage } from './pages/ButtonPage';
import { TextFieldPage } from './pages/TextFieldPage';
import { SelectPage } from './pages/SelectPage';
import { SearchFieldPage } from './pages/SearchFieldPage';
import { FabPage } from './pages/FabPage';
import { IconButtonPage } from './pages/IconButtonPage';
import { BubbleButtonPage } from './pages/BubbleButtonPage';

export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
