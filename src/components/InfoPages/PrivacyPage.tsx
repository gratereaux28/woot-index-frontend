import { Badge, Container, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconDatabase, IconLock, IconRoute, IconShieldLock } from '@tabler/icons-react';

import classes from './InfoPages.module.css';

/**
 * Static privacy page covering the data handled by the search app and BFF.
 */
export function PrivacyPage() {
  return (
    <Container size="lg" className={classes.page}>
      <Stack gap="xl">
        <Paper className={classes.hero}>
          <Stack gap="md">
            <ThemeIcon radius="xl" size="lg" color="teal" variant="light">
              <IconShieldLock size={20} stroke={1.7} />
            </ThemeIcon>
            <Badge color="teal" variant="light">
              Last updated May 15, 2026
            </Badge>
            <Title order={1}>Privacy</Title>
            <Text c="dimmed" size="lg" maw={760}>
              Woot Finder is a product search tool. It does not require user accounts, does not process payments, and
              does not intentionally collect sensitive personal information.
            </Text>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="teal" variant="light" radius="xl" mb="sm">
              <IconDatabase size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              Product data
            </Title>
            <Text c="dimmed" mt="xs">
              The app displays product titles, prices, categories, availability, images, discount details, and Woot
              listing links returned by the API.
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="orange" variant="light" radius="xl" mb="sm">
              <IconRoute size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              Search requests
            </Title>
            <Text c="dimmed" mt="xs">
              Searches, category filters, pagination, and sold-out preferences are sent to the app BFF so it can return
              matching product results.
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="cyan" variant="light" radius="xl" mb="sm">
              <IconLock size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              No selling of data
            </Title>
            <Text c="dimmed" mt="xs">
              We do not sell personal information. This app is designed for browsing deals, not for advertising profiles
              or payment collection.
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper p="lg" radius="md" className={classes.card}>
          <Title order={2} size="h3" mb="sm">
            Technical information
          </Title>
          <List spacing="xs" c="dimmed">
            <List.Item>
              Server logs may include technical metadata such as IP address, timestamps, requested URLs, browser user
              agent, and error details for security, debugging, and reliability.
            </List.Item>
            <List.Item>
              Product images may load from third-party image or CDN URLs, which means your browser may request those
              resources directly.
            </List.Item>
            <List.Item>
              When you open a Woot link, you leave Woot Finder and Woot&apos;s own terms and privacy practices apply.
            </List.Item>
          </List>
        </Paper>

        <Paper p="lg" radius="md" className={classes.note}>
          <Title order={2} size="h3" mb="sm">
            Independent search tool
          </Title>
          <Text c="dimmed">
            Woot Finder is not affiliated with, endorsed by, sponsored by, or officially connected to Woot, Amazon, or
            any of their affiliates. We are only a search tool that helps users find and preview product listings.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
