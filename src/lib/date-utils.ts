// Utility functions for date handling with UTC+7 timezone (Indonesia)

export function getCurrentDateString(): string {
  // Create date in UTC+7 timezone
  const now = new Date();
  const utc7Date = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // Add 7 hours
  const year = utc7Date.getUTCFullYear();
  const month = (utc7Date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = utc7Date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateToYYYYMMDD(date: Date): string {
  // Convert to UTC+7 timezone
  const utc7Date = new Date(date.getTime() + (7 * 60 * 60 * 1000));
  const year = utc7Date.getUTCFullYear();
  const month = (utc7Date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = utc7Date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDate(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export function generateDateOptions(numberOfDays: number = 7) {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < numberOfDays; i++) {
    const date = addDaysToDate(today, i);
    const dateValue = formatDateToYYYYMMDD(date);
    
    dates.push({
      value: dateValue,
      label: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      shortLabel: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      isToday: i === 0
    });
  }
  
  return dates;
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function compareDates(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getTime() - d2.getTime();
}
