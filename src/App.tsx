import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router';
import AppContent from './AppContent';
import { I18nProvider } from './i18n';

export default function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <I18nProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </I18nProvider>
    </MantineProvider>
  );
}
