export function formatTimeAgo(timestamp: any): string {
  if (!timestamp) return "Just now";

  // If it's a string (ISO), convert to Date. If it's a Firestore Timestamp, use .toDate()
  const date =
    typeof timestamp === "string"
      ? new Date(timestamp)
      : timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
