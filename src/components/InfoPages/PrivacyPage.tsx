import { Badge, Container, Group, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconDatabase, IconLock, IconRoute, IconShieldLock } from '@tabler/icons-react';

import { useI18n } from '../../i18n';
import classes from './InfoPages.module.css';

/**
 * Static privacy page covering the data handled by the search app and BFF.
 */
export function PrivacyPage() {
  const { t } = useI18n();

  return (
    <Container size="lg" className={classes.page}>
      <Stack gap="xl">
        <Paper className={classes.hero}>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon radius="xl" size="lg" color="teal" variant="light">
                <IconShieldLock size={20} stroke={1.7} />
              </ThemeIcon>
              <Badge color="teal" variant="light">
                {t('privacy.updated')}
              </Badge>
            </Group>

            <Title order={1}>{t('privacy.title')}</Title>
            <Text c="dimmed" size="lg" maw={760}>
              {t('privacy.hero')}
            </Text>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="teal" variant="light" radius="xl" mb="sm">
              <IconDatabase size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('privacy.productTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('privacy.productBody')}
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="orange" variant="light" radius="xl" mb="sm">
              <IconRoute size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('privacy.searchTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('privacy.searchBody')}
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="cyan" variant="light" radius="xl" mb="sm">
              <IconLock size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('privacy.noSellTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('privacy.noSellBody')}
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper p="lg" radius="md" className={classes.card}>
          <Title order={2} size="h3" mb="sm">
            {t('privacy.techTitle')}
          </Title>
          <List spacing="xs" c="dimmed">
            <List.Item>{t('privacy.logs')}</List.Item>
            <List.Item>{t('privacy.analytics')}</List.Item>
            <List.Item>{t('privacy.images')}</List.Item>
            <List.Item>{t('privacy.external')}</List.Item>
          </List>
        </Paper>

        <Paper p="lg" radius="md" className={classes.note}>
          <Title order={2} size="h3" mb="sm">
            {t('privacy.independentTitle')}
          </Title>
          <Text c="dimmed">
            {t('privacy.independentBody')}
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
