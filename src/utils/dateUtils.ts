export function isStale(date: Date, hoursThreshold: number = 6): boolean {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return diffInHours >= hoursThreshold;
}