import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Collapse,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronRight,
  IconGridDots,
  IconInfoCircle,
  IconPlus,
  IconSearch,
  IconShieldLock,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useState } from 'react';

import type { CatalogFilters, Category } from '@shared/catalog';
import { useI18n } from '../../i18n';
import { UserButton } from './UserButton';
import classes from './Navbar.module.css';

const categoryColors = ['orange', 'blue', 'teal', 'grape', 'pink', 'green', 'cyan', 'yellow'];

/**
 * Sidebar controls for catalog navigation and filtering.
 */
type NavbarProps = {
  categories: Category[];
  search: string;
  activeCategory: string | null;
  activePage: 'catalog' | 'about' | 'privacy';
  totalProducts: number;
  showSoldOut: boolean;
  filters: CatalogFilters;
  onNavigate: (path: '/' | '/about' | '/privacy') => void;
  onRequestClose: () => void;
  onShowSoldOutChange: (value: boolean) => void;
  onFiltersChange: (value: Partial<CatalogFilters>) => void;
  onResetFilters: () => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
};

/**
 * Renders quick filters, category navigation and the product counter inside the app shell.
 */
export function Navbar({
  categories,
  search,
  activeCategory,
  activePage,
  totalProducts,
  showSoldOut,
  filters,
  onNavigate,
  onRequestClose,
  onSearchChange,
  onCategoryChange,
  onShowSoldOutChange,
  onFiltersChange,
  onResetFilters,
}: NavbarProps) {
  const [openedCategories, setOpenedCategories] = useState<Record<string, boolean>>({});
  const { t } = useI18n();
  const discountOptions = [
    { label: t('filters.discountAny'), value: '' },
    { label: '20%+', value: '20' },
    { label: '40%+', value: '40' },
    { label: '60%+', value: '60' },
  ];
  const hasActiveFilters =
    showSoldOut ||
    filters.appOnly ||
    filters.amazonFulfilled ||
    filters.featuredOnly ||
    Boolean(filters.minPrice || filters.maxPrice || filters.discount);

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onResetFilters();
    onNavigate('/');
    setOpenedCategories({});
  };

  const handleClearProductFilters = () => {
    onResetFilters();
    onNavigate('/');
  };

  const categoryLinks = categories.map((category, index) => {
    const hasActiveSubcategory = category.subcategories?.some(
      subcategory => subcategory.fullSlug === activeCategory,
    );
    const isExpanded =
      Boolean(openedCategories[category.slug]) || activeCategory === category.slug || Boolean(hasActiveSubcategory);

    const closeCategory = () => {
      onCategoryChange(null);
      setOpenedCategories(current => ({ ...current, [category.slug]: false }));
    };

    return (
      <div key={category.id}>
        <UnstyledButton
          className={classes.collectionLink}
          data-active={activeCategory === category.slug || hasActiveSubcategory}
          onClick={() => {
            onNavigate('/');

            if (isExpanded) {
              closeCategory();
              return;
            }

            onCategoryChange(category.slug);
            setOpenedCategories(current => ({ ...current, [category.slug]: true }));
          }}
        >
          <Box component="span" mr={9} fz={16}>
            <span className={classes.categoryMark} data-color={categoryColors[index % categoryColors.length]} />
          </Box>
          <span className={classes.collectionLabel}>{category.description ?? category.name}</span>
          {category.subcategories?.length ? (
            <ActionIcon
              component="span"
              variant="transparent"
              size={18}
              className={classes.chevron}
              data-opened={isExpanded}
              onClick={event => {
                event.stopPropagation();

                if (isExpanded) {
                  closeCategory();
                  return;
                }

                onNavigate('/');
                setOpenedCategories(current => ({ ...current, [category.slug]: true }));
              }}
            >
              <IconChevronRight size={14} stroke={1.5} />
            </ActionIcon>
          ) : null}
        </UnstyledButton>

        {category.subcategories?.length ? (
          <Collapse expanded={isExpanded}>
            <div className={classes.subcollections}>
              {category.subcategories.map(subcategory => (
                <UnstyledButton
                  key={subcategory.id}
                  className={classes.subcollectionLink}
                  data-active={activeCategory === subcategory.fullSlug}
                  onClick={() => {
                    onNavigate('/');
                    onCategoryChange(activeCategory === subcategory.fullSlug ? null : subcategory.fullSlug);
                  }}
                >
                  {subcategory.name}
                </UnstyledButton>
              ))}
            </div>
          </Collapse>
        ) : null}
      </div>
    );
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UserButton totalProducts={totalProducts} onResetFilters={handleResetFilters} />
      </div>

      <TextInput
        placeholder={t('app.search')}
        size="xs"
        value={search}
        onChange={event => {
          onNavigate('/');
          onSearchChange(event.currentTarget.value);
        }}
        leftSection={<IconSearch size={12} stroke={1.5} />}
        styles={{ section: { pointerEvents: 'none' } }}
        mb="sm"
        aria-label={t('app.search')}
      />

      <div className={classes.section}>
        <div className={classes.mainLinks}>
          <UnstyledButton
            className={classes.mainLink}
            data-active={activePage === 'catalog' && activeCategory === null}
            onClick={() => {
              onNavigate('/');
              onCategoryChange(null);
            }}
          >
            <div className={classes.mainLinkInner}>
              <IconShoppingBag size={20} className={classes.mainLinkIcon} stroke={1.5} />
              <span>{t('nav.allProducts')}</span>
            </div>
            <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
              {totalProducts > 99 ? '99+' : totalProducts}
            </Badge>
          </UnstyledButton>

          <UnstyledButton
            className={classes.mainLink}
            data-active={activePage === 'catalog' && Boolean(activeCategory)}
            onClick={() => {
              onNavigate('/');
              onCategoryChange(activeCategory);
            }}
          >
            <div className={classes.mainLinkInner}>
              <IconGridDots size={20} className={classes.mainLinkIcon} stroke={1.5} />
              <span>{t('nav.categories')}</span>
            </div>
          </UnstyledButton>

          <div className={classes.secondaryLinks}>
            <UnstyledButton
              className={classes.mainLink}
              data-active={activePage === 'about'}
              onClick={() => {
                onNavigate('/about');
                onRequestClose();
              }}
            >
              <div className={classes.mainLinkInner}>
                <IconInfoCircle size={20} className={classes.mainLinkIcon} stroke={1.5} />
                <span>{t('nav.about')}</span>
              </div>
            </UnstyledButton>

            <UnstyledButton
              className={classes.mainLink}
              data-active={activePage === 'privacy'}
              onClick={() => {
                onNavigate('/privacy');
                onRequestClose();
              }}
            >
              <div className={classes.mainLinkInner}>
                <IconShieldLock size={20} className={classes.mainLinkIcon} stroke={1.5} />
                <span>{t('nav.privacy')}</span>
              </div>
            </UnstyledButton>
          </div>
        </div>
      </div>

      <div className={classes.collectionsPanel}>
        <div className={classes.filtersSection}>
          <Group className={classes.filtersHeader} justify="space-between">
            <Text size="xs" fw={700} c="dimmed">
              {t('filters.title')}
            </Text>
            <Button
              size="compact-xs"
              variant="subtle"
              color="teal"
              disabled={!hasActiveFilters}
              onClick={handleClearProductFilters}
            >
              {t('filters.clear')}
            </Button>
          </Group>

          <Stack gap="xs" className={classes.filters}>
            <div>
              <Text size="xs" c="dimmed" fw={600} mb={5}>
                {t('filters.priceRange')}
              </Text>
              <div className={classes.priceGrid}>
                <NumberInput
                  value={filters.minPrice}
                  onChange={value => {
                    onNavigate('/');
                    onFiltersChange({ minPrice: value === '' ? '' : String(value) });
                  }}
                  placeholder={t('filters.min')}
                  size="xs"
                  min={0}
                  prefix="$"
                  hideControls
                  aria-label={t('filters.minPrice')}
                />
                <NumberInput
                  value={filters.maxPrice}
                  onChange={value => {
                    onNavigate('/');
                    onFiltersChange({ maxPrice: value === '' ? '' : String(value) });
                  }}
                  placeholder={t('filters.max')}
                  size="xs"
                  min={0}
                  prefix="$"
                  hideControls
                  aria-label={t('filters.maxPrice')}
                />
              </div>
            </div>

            <div>
              <Text size="xs" c="dimmed" fw={600} mb={5}>
                {t('filters.discount')}
              </Text>
              <SegmentedControl
                fullWidth
                size="xs"
                value={filters.discount}
                onChange={value => {
                  onNavigate('/');
                  onFiltersChange({ discount: value });
                }}
                data={discountOptions}
              />
            </div>

            <Switch
              checked={showSoldOut}
              onChange={event => {
                onNavigate('/');
                onShowSoldOutChange(event.currentTarget.checked);
              }}
              label={t('filters.showSoldOut')}
              color="teal"
              classNames={{ label: classes.filterSwitchLabel }}
            />
            <Switch
              checked={filters.appOnly}
              onChange={event => {
                onNavigate('/');
                onFiltersChange({ appOnly: event.currentTarget.checked });
              }}
              label={t('filters.appOnly')}
              color="green"
              classNames={{ label: classes.filterSwitchLabel }}
            />
            <Switch
              checked={filters.amazonFulfilled}
              onChange={event => {
                onNavigate('/');
                onFiltersChange({ amazonFulfilled: event.currentTarget.checked });
              }}
              label={t('filters.amazonFulfilled')}
              color="orange"
              classNames={{ label: classes.filterSwitchLabel }}
            />
            <Switch
              checked={filters.featuredOnly}
              onChange={event => {
                onNavigate('/');
                onFiltersChange({ featuredOnly: event.currentTarget.checked });
              }}
              label={t('filters.featuredOnly')}
              color="blue"
              classNames={{ label: classes.filterSwitchLabel }}
            />
          </Stack>
        </div>

        <div className={classes.section}>
          <Group className={classes.collectionsHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              {t('nav.categories')}
            </Text>
            <Tooltip label={t('nav.categories')} withArrow position="right">
              <ActionIcon variant="default" size={18} aria-label={t('nav.categories')}>
                <IconPlus size={12} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.collections}>{categoryLinks}</div>
        </div>
      </div>
    </nav>
  );
}
