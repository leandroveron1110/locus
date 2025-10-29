export function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  if (diffSec < 60) return rtf.format(-diffSec, "second");
  if (diffSec < 3600) return rtf.format(-Math.floor(diffSec / 60), "minute");
  if (diffSec < 86400) return rtf.format(-Math.floor(diffSec / 3600), "hour");
  return rtf.format(-Math.floor(diffSec / 86400), "day");
}
