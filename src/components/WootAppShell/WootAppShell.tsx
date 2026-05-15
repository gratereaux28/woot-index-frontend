import { ActionIcon, AppShell, Burger, Group, TextInput, Title, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoon, IconSearch, IconShoppingBag, IconSun } from '@tabler/icons-react';
import type { PropsWithChildren } from 'react';

import type { WootCategory } from '@shared/woot';
import { WootNavbar } from './WootNavbar';
import classes from './WootAppShell.module.css';

/**
 * Container props required to render the global app shell around the catalog.
 */
type WootAppShellProps = PropsWithChildren<{
  categories: WootCategory[];
  search: string;
  activeCategory: string | null;
  activePage: 'catalog' | 'about' | 'privacy';
  totalProducts: number;
  showSoldOut: boolean;
  onNavigate: (path: '/' | '/about' | '/privacy') => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onShowSoldOutChange: (value: boolean) => void;
}>;

/**
 * Wraps the catalog UI with a header, collapsible sidebar and theme toggle.
 */
export function WootAppShell({
  categories,
  search,
  activeCategory,
  activePage,
  totalProducts,
  showSoldOut,
  onNavigate,
  onSearchChange,
  onCategoryChange,
  onShowSoldOutChange,
  children,
}: WootAppShellProps) {
  const [opened, { toggle, close }] = useDisclosure();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconShoppingBag size={24} stroke={1.7} />
            <Title order={1} className={classes.title}>
              Woot Finder
            </Title>
          </Group>

          <TextInput
            visibleFrom="sm"
            className={classes.headerSearch}
            placeholder="Search"
            size="sm"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            styles={{ section: { pointerEvents: 'none' } }}
            aria-label="Search"
            value={search}
            onChange={event => onSearchChange(event.currentTarget.value)}
          />

          <ActionIcon
            variant="white"
            color={isDark ? 'yellow' : 'dark'}
            radius="xl"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <WootNavbar
          categories={categories}
          search={search}
          activeCategory={activeCategory}
          totalProducts={totalProducts}
          onSearchChange={onSearchChange}
          onCategoryChange={value => {
            onCategoryChange(value);
            close();
          }}
          activePage={activePage}
          onNavigate={path => {
            onNavigate(path);
            close();
          }}
          showSoldOut={showSoldOut}
          onShowSoldOutChange={onShowSoldOutChange}
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
