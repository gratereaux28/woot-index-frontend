import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft, IconSearchOff } from '@tabler/icons-react';
import { useNavigate } from 'react-router';

import { useI18n } from '../../i18n';
import classes from './InfoPages.module.css';

/**
 * 404 Not Found page rendered for any unmatched route.
 */
export function NotFoundPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  console.warn('Rendering NotFoundPage for unmatched route');

  return (
    <Container size="sm" className={classes.page}>
      <Stack align="center" gap="xl">
        <div className={classes.notFoundHero} style={{ width: '100%' }}>
          <Stack align="center" gap="md">
            <div className={classes.notFoundCode}>404</div>

            <IconSearchOff size={40} stroke={1.5} color="var(--mantine-color-red-5)" />

            <Title order={1} size="h2">
              {t('notFound.title')}
            </Title>

            <Text c="dimmed" size="lg" maw={480}>
              {t('notFound.body')}
            </Text>

            <Button
              leftSection={<IconArrowLeft size={16} stroke={1.7} />}
              variant="light"
              color="orange"
              size="md"
              mt="sm"
              onClick={() => navigate('/')}
            >
              {t('notFound.cta')}
            </Button>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
}
