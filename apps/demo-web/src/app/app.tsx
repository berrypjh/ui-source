import { Box, Button } from '@berrypjh/react-ui';
import '@berrypjh/design-tokens/css';

export const App = () => {
  return (
    <div>
      <Box p="xxl" bg="background.warning">
        <Button size="lg" variant="contained">
          버튼
        </Button>
      </Box>
    </div>
  );
};

export default App;
