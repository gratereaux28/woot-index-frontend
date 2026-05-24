import { ActionIcon, Affix, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';
import { useI18n } from '../i18n';

/**
 * Shows a floating action button that jumps back to the top after the user scrolls down.
 */
export function FloatingScrollTop() {
  const [scroll, scrollTo] = useWindowScroll();
  const { t } = useI18n();

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <Transition transition="slide-up" mounted={scroll.y > 420}>
        {transitionStyles => (
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            color="orange"
            style={transitionStyles}
            aria-label={t('app.backToTop')}
            onClick={() => scrollTo({ y: 0 })}
          >
            <IconArrowUp size={22} stroke={1.8} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
}
