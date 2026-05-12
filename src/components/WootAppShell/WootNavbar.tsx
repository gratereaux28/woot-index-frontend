import {
  ActionIcon,
  Badge,
  Box,
  Collapse,
  Group,
  Switch,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronRight,
  IconGridDots,
  IconPlus,
  IconSearch,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useState } from 'react';

import type { WootCategory } from '@shared/woot';
import { UserButton } from './UserButton';
import classes from './WootNavbar.module.css';

const categoryColors = ['orange', 'blue', 'teal', 'grape', 'pink', 'green', 'cyan', 'yellow'];

/**
 * Sidebar controls for catalog navigation and filtering.
 */
type WootNavbarProps = {
  categories: WootCategory[];
  search: string;
  activeCategory: string | null;
  totalProducts: number;
  showSoldOut: boolean;
  onShowSoldOutChange: (value: boolean) => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
};

/**
 * Renders quick filters, category navigation and the product counter inside the app shell.
 */
export function WootNavbar({
  categories,
  search,
  activeCategory,
  totalProducts,
  showSoldOut,
  onSearchChange,
  onCategoryChange,
  onShowSoldOutChange,
}: WootNavbarProps) {
  const [openedCategories, setOpenedCategories] = useState<Record<string, boolean>>({});

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
    onShowSoldOutChange(false);
    setOpenedCategories({});
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
                  onClick={() =>
                    onCategoryChange(activeCategory === subcategory.fullSlug ? null : subcategory.fullSlug)
                  }
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
        placeholder="Search"
        size="xs"
        value={search}
        onChange={event => onSearchChange(event.currentTarget.value)}
        leftSection={<IconSearch size={12} stroke={1.5} />}
        styles={{ section: { pointerEvents: 'none' } }}
        mb="sm"
        aria-label="Search"
      />

      <Switch
        checked={showSoldOut}
        onChange={event => onShowSoldOutChange(event.currentTarget.checked)}
        mb="sm"
        label="Show sold out"
        color="teal"
        classNames={{ label: classes.soldOutLabel }}
      />

      <div className={classes.section}>
        <div className={classes.mainLinks}>
          <UnstyledButton
            className={classes.mainLink}
            data-active={activeCategory === null}
            onClick={() => onCategoryChange(null)}
          >
            <div className={classes.mainLinkInner}>
              <IconShoppingBag size={20} className={classes.mainLinkIcon} stroke={1.5} />
              <span>All products</span>
            </div>
            <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
              {totalProducts > 99 ? '99+' : totalProducts}
            </Badge>
          </UnstyledButton>
                      
          <UnstyledButton
            className={classes.mainLink}
            data-active={Boolean(activeCategory)}
            onClick={() => onCategoryChange(activeCategory)}
          >
            <div className={classes.mainLinkInner}>
              <IconGridDots size={20} className={classes.mainLinkIcon} stroke={1.5} />
              <span>Categories</span>
            </div>
          </UnstyledButton>
        </div>
      </div>

      <div className={classes.collectionsPanel}>
        <div className={classes.section}>
          <Group className={classes.collectionsHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              Categories
            </Text>
            <Tooltip label="Categories" withArrow position="right">
              <ActionIcon variant="default" size={18} aria-label="Categories">
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
