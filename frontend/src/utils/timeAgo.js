export const timeAgo = (date) => {
  const now = new Date();
  const timeDiff = now - new Date(date); // difference in milliseconds

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const msPerMonth = msPerDay * 30; // Approximate
  const msPerYear = msPerDay * 365; // Approximate

  if (timeDiff < msPerMinute) {
    return "Just now";
  } else if (timeDiff < msPerHour) {
    const minutes = Math.round(timeDiff / msPerMinute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDiff < msPerDay) {
    const hours = Math.round(timeDiff / msPerHour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (timeDiff < msPerWeek) {
    const days = Math.round(timeDiff / msPerDay);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (timeDiff < msPerMonth) {
    const weeks = Math.round(timeDiff / msPerWeek);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (timeDiff < msPerYear) {
    const months = Math.round(timeDiff / msPerMonth);
    if (months === 1) {
      return "Last month";
    } else {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    }
  } else {
    const years = Math.round(timeDiff / msPerYear);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};
