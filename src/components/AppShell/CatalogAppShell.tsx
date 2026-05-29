import { ActionIcon, AppShell, Burger, Group, Menu, Text, TextInput, Title, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoon, IconSearch, IconShoppingBag, IconSun } from '@tabler/icons-react';
import type { PropsWithChildren } from 'react';

import type { CatalogFilters, Category } from '@shared/catalog';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useI18n, type Language } from '../../i18n';
import { Navbar } from './Navbar';
import classes from './CatalogAppShell.module.css';

const languageOptions: Array<{ value: Language; flag: string; labelKey: 'language.english' | 'language.spanish' }> = [
  { value: 'en', flag: '🇺🇸', labelKey: 'language.english' },
  { value: 'es', flag: '🇪🇸', labelKey: 'language.spanish' },
];

/**
 * Container props required to render the global app shell around the catalog.
 */
type CatalogAppShellProps = PropsWithChildren<{
  categories: Category[];
  search: string;
  activeCategory: string | null;
  activePage: 'catalog' | 'about' | 'privacy' | 'terms' | 'contact';
  totalProducts: number;
  showSoldOut: boolean;
  filters: CatalogFilters;
  onNavigate: (path: '/' | '/about' | '/privacy' | '/terms' | '/contact') => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onShowSoldOutChange: (value: boolean) => void;
  onFiltersChange: (value: Partial<CatalogFilters>) => void;
  onResetFilters: () => void;
}>;

/**
 * Wraps the catalog UI with a header, collapsible sidebar and theme toggle.
 */
export function CatalogAppShell({
  categories,
  search,
  activeCategory,
  activePage,
  totalProducts,
  showSoldOut,
  filters,
  onNavigate,
  onSearchChange,
  onCategoryChange,
  onShowSoldOutChange,
  onFiltersChange,
  onResetFilters,
  children,
}: CatalogAppShellProps) {
  const [opened, { toggle, close }] = useDisclosure();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { language, setLanguage, t } = useI18n();
  const track = useAnalytics();
  const isDark = colorScheme === 'dark';
  const currentLanguage = languageOptions.find(option => option.value === language) ?? languageOptions[0];

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    track({
      event: 'language_changed',
      metadata: {
        language: nextLanguage,
      },
    });
  };

  const handleThemeToggle = () => {
    const nextScheme = isDark ? 'light' : 'dark';
    setColorScheme(nextScheme);
    track({
      event: 'theme_changed',
      metadata: {
        theme: nextScheme,
      },
    });
  };

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
              WootIndex
            </Title>
          </Group>

          <TextInput
            visibleFrom="sm"
            className={classes.headerSearch}
            placeholder={t('app.search')}
            leftSection={<IconSearch size={16} stroke={1.5} />}
            styles={{ section: { pointerEvents: 'none' } }}
            aria-label={t('app.search')}
            value={search}
            onChange={event => onSearchChange(event.currentTarget.value)}
          />

          <Group gap="xs" wrap="nowrap">
            <Menu shadow="md" radius="md" width={170} position="bottom-end">
              <Menu.Target>
                <ActionIcon
                  variant="white"
                  color="dark"
                  radius="xl"
                  aria-label={t('language.title')}
                  className={classes.flagButton}
                >
                  <Text component="span" fz={18} lh={1}>
                    {currentLanguage.flag}
                  </Text>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{t('language.title')}</Menu.Label>
                {languageOptions.map(option => (
                  <Menu.Item
                    key={option.value}
                    onClick={() => handleLanguageChange(option.value)}
                    leftSection={<span className={classes.languageFlag}>{option.flag}</span>}
                    data-active={language === option.value}
                  >
                    {t(option.labelKey)}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

            <ActionIcon
              variant="white"
              color={isDark ? 'yellow' : 'dark'}
              radius="xl"
              aria-label={isDark ? t('app.switchLight') : t('app.switchDark')}
              onClick={handleThemeToggle}
            >
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar
          categories={categories}
          search={search}
          activeCategory={activeCategory}
          totalProducts={totalProducts}
          filters={filters}
          onSearchChange={onSearchChange}
          onCategoryChange={value => {
            onCategoryChange(value);
            close();
          }}
          activePage={activePage}
          onNavigate={onNavigate}
          onRequestClose={close}
          showSoldOut={showSoldOut}
          onShowSoldOutChange={onShowSoldOutChange}
          onFiltersChange={onFiltersChange}
          onResetFilters={onResetFilters}
        />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
