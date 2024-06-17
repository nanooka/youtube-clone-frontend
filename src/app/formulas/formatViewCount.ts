export function formatViewCount(views: string): string {
  const count = parseInt(views, 10);

  if (isNaN(count)) {
    return "Invalid subscriber count";
  }

  if (count >= 1000000000) {
    return (count / 1000000000).toFixed(1) + "B views";
  } else if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M views";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K views";
  }
  return count + " views";
}
