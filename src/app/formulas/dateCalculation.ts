import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  parseISO,
} from "date-fns";

export const dateCalculation = (publishedAt: string): string => {
  if (!publishedAt) {
    return "Unknown date";
  }

  try {
    const publishedDate = parseISO(publishedAt);
    const now = new Date();

    const years = differenceInYears(now, publishedDate);
    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }

    const months = differenceInMonths(now, publishedDate);
    if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }

    const days = differenceInDays(now, publishedDate);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date";
  }
};
