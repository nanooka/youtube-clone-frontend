export function formatSubscriberCount(subscriberCount: string): string {
  const count = parseInt(subscriberCount, 10);

  // if (isNaN(count)) {
  //     throw new Error("Invalid subscriber count")
  // }

  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M subscribers";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K subscribers";
  }
  return count + " subscribers";
}
