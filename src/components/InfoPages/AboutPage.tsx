import { Badge, Container, Group, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconExternalLink, IconInfoCircle, IconSearch, IconShieldCheck, IconShoppingBag } from '@tabler/icons-react';

import { useI18n } from '../../i18n';
import classes from './InfoPages.module.css';

/**
 * Static about page describing the product search experience and ownership boundaries.
 */
export function AboutPage() {
  const { t } = useI18n();

  return (
    <Container size="lg" className={classes.page}>
      <Stack gap="xl">
        <Paper className={classes.hero}>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon radius="xl" size="lg" color="teal" variant="light">
                <IconInfoCircle size={20} stroke={1.7} />
              </ThemeIcon>
              <Badge color="orange" variant="light">
                {t('about.badge')}
              </Badge>
            </Group>

            <Title order={1}>{t('about.title')}</Title>
            <Text c="dimmed" size="lg" maw={760}>
              {t('about.hero')}
            </Text>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="teal" variant="light" radius="xl" mb="sm">
              <IconSearch size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={3} size="h4">
              {t('about.searchTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('about.searchBody')}
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="orange" variant="light" radius="xl" mb="sm">
              <IconShoppingBag size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={3} size="h4">
              {t('about.purchaseTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('about.purchaseBody')}
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="cyan" variant="light" radius="xl" mb="sm">
              <IconShieldCheck size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={3} size="h4">
              {t('about.ownershipTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('about.ownershipBody')}
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper p="lg" radius="md" className={classes.note}>
          <Group gap="sm" mb="sm">
            <IconExternalLink size={20} stroke={1.7} />
            <Title order={2} size="h3">
              {t('about.notAffiliatedTitle')}
            </Title>
          </Group>
          <Text c="dimmed">
            {t('about.notAffiliatedBody')}
          </Text>
        </Paper>

        <Paper p="lg" radius="md" className={classes.card}>
          <Title order={2} size="h3" mb="sm">
            {t('about.verifyTitle')}
          </Title>
          <List spacing="xs" c="dimmed">
            <List.Item>{t('about.verifyPrice')}</List.Item>
            <List.Item>{t('about.verifyStatus')}</List.Item>
            <List.Item>{t('about.verifyPolicy')}</List.Item>
          </List>
        </Paper>
      </Stack>
    </Container>
  );
}
