import {
  Alert,
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconAlertCircle, IconMail, IconMessageCircle, IconSend, IconShieldCheck } from '@tabler/icons-react';
import { useState, type FormEvent } from 'react';

import type { ContactMessagePayload, ContactResponse } from '@shared/contact';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useI18n } from '../../i18n';
import classes from './InfoPages.module.css';

const contactEmail = 'info@wootindex.com';

type FormState = Required<ContactMessagePayload>;

const initialForm: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

/**
 * Contact page with direct email details and a server-backed contact form.
 */
export function ContactPage() {
  const { t } = useI18n();
  const track = useAnalytics();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'notConfigured'>('idle');

  const updateField = (field: keyof FormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
    setStatus('idle');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    try {
      const response = await window.fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.ok) {
        setForm(initialForm);
        setStatus('success');
        track({ event: 'contact_form_submitted', metadata: { hasSubject: Boolean(form.subject.trim()) } });
        return;
      }

      setStatus(result.error === 'contact_not_configured' ? 'notConfigured' : 'error');
    } catch (error) {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const mailtoHref = `mailto:${contactEmail}`;

  return (
    <Container size="lg" className={classes.page}>
      <Stack gap="xl">
        <Paper className={classes.hero}>
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon radius="xl" size="lg" color="teal" variant="light">
                <IconMessageCircle size={20} stroke={1.7} />
              </ThemeIcon>
            </Group>

            <Title order={1}>{t('contact.title')}</Title>
            <Text c="dimmed" size="lg" maw={760}>
              {t('contact.hero')}
            </Text>
          </Stack>
        </Paper>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="teal" variant="light" radius="xl" mb="sm">
              <IconMail size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('contact.emailTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('contact.emailBody')}
            </Text>
            <Anchor href={mailtoHref} mt="md" display="inline-block">
              {contactEmail}
            </Anchor>
          </Paper>

          <Paper p="lg" radius="md" className={classes.card}>
            <ThemeIcon color="orange" variant="light" radius="xl" mb="sm">
              <IconShieldCheck size={18} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} size="h4">
              {t('contact.scopeTitle')}
            </Title>
            <Text c="dimmed" mt="xs">
              {t('contact.scopeBody')}
            </Text>
          </Paper>
        </SimpleGrid>

        { false && (
        <Paper p="lg" radius="md" className={classes.card}>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
            <Title order={2} size="h3">
              {t('contact.formTitle')}
            </Title>

            {status === 'success' ? (
              <Alert color="teal" variant="light" icon={<IconSend size={18} />}>
                {t('contact.success')}
              </Alert>
            ) : null}

            {status === 'notConfigured' ? (
              <Alert color="orange" variant="light" icon={<IconAlertCircle size={18} />}>
                {t('contact.notConfigured')}{' '}
                <Anchor href={mailtoHref} inherit>
                  {contactEmail}
                </Anchor>
              </Alert>
            ) : null}

            {status === 'error' ? (
              <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
                {t('contact.error')}{' '}
                <Anchor href={mailtoHref} inherit>
                  {contactEmail}
                </Anchor>
              </Alert>
            ) : null}

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label={t('contact.name')}
                value={form.name}
                onChange={event => updateField('name', event.currentTarget.value)}
                required
                maxLength={180}
              />
              <TextInput
                label={t('contact.email')}
                value={form.email}
                onChange={event => updateField('email', event.currentTarget.value)}
                required
                type="email"
                maxLength={180}
              />
            </SimpleGrid>

            <TextInput
              label={t('contact.subject')}
              value={form.subject}
              onChange={event => updateField('subject', event.currentTarget.value)}
              maxLength={180}
            />

            <Textarea
              label={t('contact.message')}
              value={form.message}
              onChange={event => updateField('message', event.currentTarget.value)}
              required
              minRows={6}
              maxLength={5000}
            />

            <Group justify="flex-end">
              <Button type="submit" loading={submitting} leftSection={<IconSend size={16} />}>
                {t('contact.submit')}
              </Button>
            </Group>
            </Stack>
          </form>
        </Paper>
        )}
      </Stack>
    </Container>
  );
}
