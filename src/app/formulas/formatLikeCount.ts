export function formatLikeCount(likeCount: string): string {
  const count = parseInt(likeCount, 10);

  if (isNaN(count)) {
    throw new Error("Invalid subscriber count");
  }

  if (count >= 1000000) {
    return Math.floor(count / 1000000) + "M";
  } else if (count >= 1000) {
    return Math.floor(count / 1000) + "K";
  }
  return likeCount;
}
