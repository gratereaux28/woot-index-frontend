import { Badge, Container, Group, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconExternalLink, IconFileText, IconScale, IconSearch, IconShoppingBag } from '@tabler/icons-react';

import { useI18n } from '../../i18n';
import classes from './InfoPages.module.css';

/**
 * Static terms page describing usage rules and responsibility boundaries.
 */
export function TermsPage() {
  const { t } = useI18n();

  return (
    <Container size="lg" className={classes.page}>
      <Stack gap="xl">
        <Paper className={classes.hero}>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon radius="xl" size="lg" color="orange" variant="light">
                <IconFileText size={20} stroke={1.7} />
              </ThemeIcon>
              <Badge color="orange" variant="light">
                {t('terms.updated')}
              </Badge>
            </Group>

            <Title order={1}>{t('terms.title')}</Title>
            <Text c="dimmed" size="lg" maw={760}>
              {t('terms.hero')}
            </Text>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="teal" variant="light" radius="xl" mb="sm">
              <IconSearch size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('terms.useTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('terms.useBody')}
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="orange" variant="light" radius="xl" mb="sm">
              <IconShoppingBag size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('terms.purchaseTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('terms.purchaseBody')}
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="cyan" variant="light" radius="xl" mb="sm">
              <IconScale size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('terms.accuracyTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('terms.accuracyBody')}
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper p="lg" radius="md" className={classes.card}>
          <Title order={2} size="h3" mb="sm">
            {t('terms.rulesTitle')}
          </Title>
          <List spacing="xs" c="dimmed">
            <List.Item>{t('terms.ruleLawful')}</List.Item>
            <List.Item>{t('terms.ruleNoAbuse')}</List.Item>
            <List.Item>{t('terms.ruleNoCopy')}</List.Item>
            <List.Item>{t('terms.ruleAvailability')}</List.Item>
          </List>
        </Paper>

        <Paper p="lg" radius="md" className={classes.note}>
          <Group gap="sm" mb="sm">
            <IconExternalLink size={20} stroke={1.7} />
            <Title order={2} size="h3">
              {t('terms.independentTitle')}
            </Title>
          </Group>
          <Text c="dimmed">
            {t('terms.independentBody')}
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
