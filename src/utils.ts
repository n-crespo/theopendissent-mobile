/**
 * Shuffle an array in place
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]; // create a copy to maintain immutability
  let currentIndex = newArray.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
}

/**
 * Converts a past Date object into a human-readable "time ago" string.
 * ex. "3 hours ago", "yesterday", "5 months ago".
 */
export function timeAgo(date: Date, locale: string = "en"): string {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

  const MINUTE = 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const MONTH = DAY * 30;
  const YEAR = DAY * 365;

  if (diffInSeconds < MINUTE) {
    return "just now";
  } else if (diffInSeconds < HOUR) {
    const minutes = Math.floor(diffInSeconds / MINUTE);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < DAY) {
    const hours = Math.floor(diffInSeconds / HOUR);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < MONTH) {
    const days = Math.floor(diffInSeconds / DAY);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < YEAR) {
    const months = Math.floor(diffInSeconds / MONTH);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInSeconds / YEAR);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}

export const formatCompactNumber = (number: number) => {
  if (number < 1000) {
    return number.toString();
  } else if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  return number.toString();
};
