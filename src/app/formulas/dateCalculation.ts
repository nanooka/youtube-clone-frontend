// import {
//   differenceInYears,
//   differenceInMonths,
//   differenceInDays,
//   parseISO,
// } from "date-fns";

// export const dateCalculation = (publishedAt: string): string => {
//   if (!publishedAt) {
//     return "Unknown date";
//   }

//   try {
//     const publishedDate = parseISO(publishedAt);
//     const now = new Date();

//     const years = differenceInYears(now, publishedDate);
//     if (years > 0) {
//       return `${years} year${years > 1 ? "s" : ""} ago`;
//     }

//     const months = differenceInMonths(now, publishedDate);
//     if (months > 0) {
//       return `${months} month${months > 1 ? "s" : ""} ago`;
//     }

//     const days = differenceInDays(now, publishedDate);
//     return `${days} day${days > 1 ? "s" : ""} ago`;
//   } catch (error) {
//     console.error("Error parsing date:", error);
//     return "Invalid date";
//   }
// };

import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  parseISO,
  isValid,
} from "date-fns";

export const dateCalculation = (publishedAt: string): string => {
  if (!publishedAt) {
    return "Unknown date";
  }

  // console.log("PublishedAt received:", publishedAt);

  try {
    const publishedDate = parseISO(publishedAt);
    if (!isValid(publishedDate)) {
      return "Invalid date format";
    }

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
    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const hours = differenceInHours(now, publishedDate);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const minutes = differenceInMinutes(now, publishedDate);
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    const seconds = differenceInSeconds(now, publishedDate);
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date";
  }
};
