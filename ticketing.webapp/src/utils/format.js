/** Format an amount as "1,200 AED". */
export function formatCurrency(amount, currency = 'AED') {
  return `${new Intl.NumberFormat('en-US').format(amount)} ${currency}`;
}

/** Format an ISO timestamp into a readable local string. */
export function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return iso;
  }
}
