import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  Image,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconBrandAmazon,
  IconCalendar,
  IconDiscount2,
  IconExternalLink,
  IconPackage,
  IconRosetteDiscountCheck,
  IconTruckDelivery,
} from '@tabler/icons-react';

import type { Product } from '@shared/catalog';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useI18n } from '../../i18n';
import {
  amazonProductUrl,
  discountLabel,
  formatPrice,
  productDescription,
  timeRemainingLabel,
} from '../../utils/product';
import classes from './ProductCard.module.css';

const safeUrl = (url?: string | null) =>
  url?.startsWith('https://') || url?.startsWith('http://') ? url : undefined;

/**
 * Builds the compact metadata row shown in the product card footer.
 */
const featureData = (product: Product, t: ReturnType<typeof useI18n>['t']) => [
  {
    shortLabel: product.isFeatured ? t('product.featured') : t('product.deal'),
    fullLabel: undefined,
    icon: IconRosetteDiscountCheck,
  },
  {
    shortLabel: product.isFulfilledByAmazon ? t('product.amazonFulfilled') : t('product.wootFulfilled'),
    fullLabel: undefined,
    icon: IconTruckDelivery,
  },
  {
    shortLabel: product.purchaseLimit ? t('product.max', { count: product.purchaseLimit }) : t('product.noLimit'),
    fullLabel: undefined,
    icon: IconPackage,
  },
  {
    ...timeRemainingLabel(product.endDate, t),
    icon: IconCalendar,
  },
];

/**
 * Summary card rendered in the catalog grid.
 */
type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
};

/**
 * Renders product highlights, pricing and navigation actions for a single deal.
 */
export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { language, t } = useI18n();
  const track = useAnalytics();
  const features = featureData(product, t).map(feature => {
    const content = (
      <Center key={feature.shortLabel} className={classes.feature}>
        <feature.icon size={16} className={classes.icon} stroke={1.5} />
        <Text size="xs" lineClamp={1}>
          {feature.shortLabel}
        </Text>
      </Center>
    );

    return feature.fullLabel ? (
      <Tooltip key={feature.fullLabel} label={feature.fullLabel} withArrow>
        {content}
      </Tooltip>
    ) : (
      content
    );
  });

  const discount = discountLabel(product, value => t('product.percentOff', { value }));
  const amazonUrl = amazonProductUrl(product);
  const trackExternalClick = (event: 'open_woot_clicked' | 'open_amazon_clicked') => {
    track({
      event,
      metadata: {
        productId: product.id,
        isSoldOut: product.isSoldOut,
      },
    });
  };

  return (
    <Card
      withBorder
      radius="md"
      className={classes.card}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(product)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(product);
        }
      }}
    >
      <Card.Section className={classes.imageSection}>
        {product.photoUrl ? (
          <Image src={product.photoUrl} alt={product.title} className={classes.image} fit="contain" />
        ) : (
          <Center className={classes.emptyImage}>
            <IconPackage size={44} stroke={1.5} />
          </Center>
        )}
      </Card.Section>

      <Group justify="space-between" mt="md" align="flex-start" wrap="nowrap">
        <div className={classes.titleBlock}>
          <Text fw={500} lineClamp={2}>
            {product.title}
          </Text>
          <Text fz="xs" c="dimmed" lineClamp={2}>
            {productDescription(product)}
          </Text>
        </div>
        <div className={classes.badgeStack}>
          {discount ? (
            <Badge variant="outline" className={classes.discountBadge}>
              {discount}
            </Badge>
          ) : null}
          {product.isAvailableOnMobileAppOnly ? (
            <Badge color="green" variant="light" className={classes.discountBadge}>
              {t('product.appOnly')}
            </Badge>
          ) : null}
          {product.isSoldOut ? (
            <Badge color="red" variant="light" className={classes.discountBadge}>
              {t('product.soldOut')}
            </Badge>
          ) : null}
        </div>
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text fz="sm" c="dimmed" className={classes.label}>
          {t('product.basicConfiguration')}
        </Text>

        <Group gap={8} mb={-8} className={classes.features}>
          {features}
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group gap="sm" wrap="nowrap" className={classes.actions}>
          <div>
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              {formatPrice(product.salePriceMin, language, t('product.viewPrice'))}
            </Text>
            <Text fz="sm" c="dimmed" fw={500} style={{ lineHeight: 1 }} mt={3} td="line-through">
              {formatPrice(product.listPriceMin, language, t('product.viewPrice'))}
            </Text>
          </div>

          <Button radius="xl" style={{ flex: 1 }} rightSection={<IconDiscount2 size={16} />}>
            {t('product.details')}
          </Button>
          {safeUrl(product.url) ? (
            <Button
              component="a"
              href={safeUrl(product.url)}
              target="_blank"
              rel="noreferrer"
              radius="xl"
              variant="light"
              className={classes.marketplaceButton}
              rightSection={<IconExternalLink size={16} />}
              onClick={event => {
                event.stopPropagation();
                trackExternalClick('open_woot_clicked');
              }}
            >
              {t('product.woot')}
            </Button>
          ) : null}
          {amazonUrl ? (
            <Button
              component="a"
              href={amazonUrl}
              target="_blank"
              rel="noreferrer"
              radius="xl"
              variant="light"
              color="orange"
              className={classes.externalButton}
              rightSection={<IconBrandAmazon size={16} />}
              onClick={event => {
                event.stopPropagation();
                trackExternalClick('open_amazon_clicked');
              }}
            >
              {t('product.amazon')}
            </Button>
          ) : null}
        </Group>
      </Card.Section>
    </Card>
  );
}
