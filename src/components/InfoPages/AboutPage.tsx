import { Badge, Container, Group, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconExternalLink, IconInfoCircle, IconSearch, IconShieldCheck, IconShoppingBag } from '@tabler/icons-react';

import classes from './InfoPages.module.css';

/**
 * Static about page describing the product search experience and ownership boundaries.
 */
export function AboutPage() {
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
                Independent search tool
              </Badge>
            </Group>

            <Title order={1}>About Woot Finder</Title>
            <Text c="dimmed" size="lg" maw={760}>
              Woot Finder is an independent product search interface that helps you browse deals returned by our Woot
              product API. It is built to make categories, prices, availability, photos, and product links easier to
              scan in one place.
            </Text>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="teal" variant="light" radius="xl" mb="sm">
              <IconSearch size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={3} size="h4">
              Search and discovery
            </Title>
            <Text c="dimmed" mt="xs">
              The app indexes product data from our API so you can search deals, filter by category or subcategory, and
              quickly open the original Woot listing.
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="orange" variant="light" radius="xl" mb="sm">
              <IconShoppingBag size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={3} size="h4">
              Purchases happen on Woot
            </Title>
            <Text c="dimmed" mt="xs">
              Woot Finder does not sell products, process payments, manage orders, or provide customer support for any
              purchase. External product buttons send you to Woot.
            </Text>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="cyan" variant="light" radius="xl" mb="sm">
              <IconShieldCheck size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={3} size="h4">
              Clear ownership
            </Title>
            <Text c="dimmed" mt="xs">
              Woot names, product images, prices, descriptions, and deal links belong to their respective owners and may
              change at any time.
            </Text>
          </Paper>
        </SimpleGrid>

        <Paper p="lg" radius="md" className={classes.note}>
          <Group gap="sm" mb="sm">
            <IconExternalLink size={20} stroke={1.7} />
            <Title order={2} size="h3">
              Not affiliated with Woot
            </Title>
          </Group>
          <Text c="dimmed">
            Woot Finder is not affiliated with, endorsed by, sponsored by, or officially connected to Woot, Amazon, or
            any of their affiliates. We are only a search tool for finding and previewing products before you visit the
            official listing.
          </Text>
        </Paper>

        <Paper p="lg" radius="md" className={classes.card}>
          <Title order={2} size="h3" mb="sm">
            What you should verify before buying
          </Title>
          <List spacing="xs" c="dimmed">
            <List.Item>Final price, shipping, taxes, and availability on the official Woot page.</List.Item>
            <List.Item>Whether the deal is still active, sold out, app-only, or limited by quantity.</List.Item>
            <List.Item>Product condition, warranty, return policy, and seller details shown by Woot.</List.Item>
          </List>
        </Paper>
      </Stack>
    </Container>
  );
}
