import { formatDistanceToNow } from 'date-fns';

export function getRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}