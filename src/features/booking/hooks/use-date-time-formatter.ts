import { localeAtom } from '@/features/locale';
import { useAtomValue } from 'jotai';

export function useDateTimeFormatter() {
  const lang = useAtomValue(localeAtom);

  function formatDateTime(dateString: string) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString(lang, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function formatDate(dateString: string) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleString(lang, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function formatTime(dateString: string) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleTimeString(lang, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return { formatDateTime, formatDate, formatTime };
}
