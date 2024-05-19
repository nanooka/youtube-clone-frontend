export function convertDuration(duration: string): string {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error("Invalid duration format");
  }

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  const parts = [];
  if (hours > 0) {
    parts.push(String(hours));
  }
  // if (minutes > 0 || hours > 0) {
  parts.push(minutes.toString());
  // }
  parts.push(String(seconds).padStart(2, "0"));

  return parts.join(":");
}
