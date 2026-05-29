import { Center, Loader, SimpleGrid, Stack, Text, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

import type { Product } from '@shared/catalog';
import { useI18n } from '../i18n';
import { ProductCard } from './ProductCard/ProductCard';

import classes from './ProductGrid.module.css';

/**
 * Props required to render the product grid and trigger incremental pagination.
 */
type ProductGridProps = {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  hasNextPage: boolean;
  search: string;
  onLoadMore: () => void;
  onSelect: (product: Product) => void;
  onSearchChange: (value: string) => void;
};

/**
 * Displays the current result set and observes a sentinel element to load the next page.
 */
export function ProductGrid({
  products,
  loading,
  loadingMore,
  hasNextPage,
  search,
  onLoadMore,
  onSelect,
  onSearchChange,
}: ProductGridProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasNextPage || loading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '520px 0px' },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, loading, onLoadMore]);

  if (loading) {
    return (
      <Center className="state-panel">
        <Loader />
      </Center>
    );
  }

  if (products.length === 0) {
    return (
      <Center className="state-panel">
        <Stack gap="xs" align="center">
          <IconSearch size={42} stroke={1.5} />
          <Text fw={700}>{t('grid.emptyTitle')}</Text>
          <Text c="dimmed" size="sm">
            {t('grid.emptyBody')}
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <TextInput
        className={classes.productSearch}
        placeholder={t('app.search')}
        hiddenFrom="sm"
        size="lg"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        styles={{ section: { pointerEvents: 'none' } }}
        aria-label={t('app.search')}
        value={search}
        onChange={event => onSearchChange(event.currentTarget.value)}
      />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onSelect={onSelect} />
        ))}
      </SimpleGrid>

      <Center ref={sentinelRef} h={56}>
        {loadingMore ? <Loader size="sm" /> : hasNextPage ? <Text c="dimmed" size="sm">{t('grid.loadingMore')}</Text> : null}
      </Center>
    </Stack>
  );
}
