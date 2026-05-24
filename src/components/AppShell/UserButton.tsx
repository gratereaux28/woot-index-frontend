import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';

import classes from './UserButton.module.css';
import { IconShoppingBag } from '@tabler/icons-react';
import { useI18n } from '../../i18n';

/**
 * Compact summary block shown at the top of the sidebar.
 */
type UserButtonProps = {
  totalProducts: number;
  onResetFilters: () => void;
};

/**
 * Displays the application identity and the current product count.
 */
export function UserButton({ totalProducts, onResetFilters }: UserButtonProps) {
  const { language, t } = useI18n();
  const formattedTotal = totalProducts.toLocaleString(language === 'es' ? 'es-DO' : 'en-US');

  return (
    <UnstyledButton className={classes.user} onClick={onResetFilters}>
      <Group>
        <Avatar color="blue" radius="xl">
          <IconShoppingBag size={24} stroke={1.7} />
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            WootIndex
          </Text>

          <Text c="dimmed" size="xs">
            {t('nav.products', { count: formattedTotal })}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
}
