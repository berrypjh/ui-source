import { Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { ButtonPage } from './pages/ButtonPage';
import { ConsumerProfilePage } from './pages/ConsumerProfilePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { FabPage } from './pages/FabPage';
import { HomePage } from './pages/HomePage';
import { IconButtonPage } from './pages/IconButtonPage';
import { SearchFieldPage } from './pages/SearchFieldPage';
import { SelectPage } from './pages/SelectPage';
import { TextFieldPage } from './pages/TextFieldPage';
import { TokensPage } from './pages/TokensPage';

import '@berrypjh/react-ui/styles.css';
// Shared CSS 뒤에 와야 한다 — 같은 specificity에서 순서로 이긴다.
import '../_generated/sample-consumer/css/variables.css';

export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/consumer-profile" element={<ConsumerProfilePage />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/text-field" element={<TextFieldPage />} />
        <Route path="/components/select" element={<SelectPage />} />
        <Route path="/components/search-field" element={<SearchFieldPage />} />
        <Route path="/components/fab" element={<FabPage />} />
        <Route path="/components/icon-button" element={<IconButtonPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
