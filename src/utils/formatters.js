// Timestamp and text formatting utilities

/**
 * Checks whether an ISO timestamp is older than freshness threshold hours (default: 6 hours)
 */
export function isTimestampOutdated(isoString, thresholdHours = 6) {
  if (!isoString) return true;
  const time = new Date(isoString).getTime();
  const now = Date.now();
  const diffHours = (now - time) / (1000 * 60 * 60);
  return diffHours > thresholdHours;
}

/**
 * Formats relative time in human readable format
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return 'Unknown';
  const timestamp = new Date(isoString).getTime();
  const now = Date.now();
  const diffSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (diffSeconds < 60) {
    return 'Just now';
  }
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Formats exact date and time for audit logs
 */
export function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  const d = new Date(isoString);
  return d.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/**
 * Masks a phone number for safe display (e.g. +91 98765 43210 -> +91 98*** **210)
 */
export function maskPhoneNumber(phone) {
  if (!phone || phone.length < 7) return phone || '';
  const visibleStart = phone.slice(0, 5);
  const visibleEnd = phone.slice(-3);
  return `${visibleStart}****${visibleEnd}`;
}
