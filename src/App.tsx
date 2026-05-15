import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router';
import AppContent from './AppContent';

export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </MantineProvider>
  );
}
