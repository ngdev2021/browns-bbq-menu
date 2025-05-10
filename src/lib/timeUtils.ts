/**
 * Utility functions for time-based theming and holiday detection
 */

export type TimeOfDay = 'morning' | 'day' | 'evening';

/**
 * Determine the time of day based on current hour
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour < 11) {
    return 'morning';
  } else if (hour >= 17) {
    return 'evening';
  } else {
    return 'day';
  }
}

/**
 * Set CSS variable for current time-based accent color
 */
export function setTimeBasedTheme(): void {
  if (typeof document === 'undefined') return; // Skip during SSR
  
  const timeOfDay = getTimeOfDay();
  document.documentElement.style.setProperty(
    '--current-accent', 
    `var(--accent-${timeOfDay})`
  );
}

/**
 * Check if today is a special holiday
 * @returns Object with holiday name and boolean flag
 */
export function checkHolidays(): { isHoliday: boolean; holidayName?: string } {
  const today = new Date();
  const month = today.getMonth(); // 0-11
  const date = today.getDate();
  
  // July 4th - Independence Day
  if (month === 6 && date === 4) {
    return { isHoliday: true, holidayName: 'Independence Day' };
  }
  
  // December 25th - Christmas
  if (month === 11 && date === 25) {
    return { isHoliday: true, holidayName: 'Christmas' };
  }
  
  // October 31st - Halloween
  if (month === 9 && date === 31) {
    return { isHoliday: true, holidayName: 'Halloween' };
  }
  
  // November 4th Thursday - Thanksgiving (simplified check)
  if (month === 10) {
    const firstDay = new Date(today.getFullYear(), 10, 1).getDay();
    const thursdayOffset = (11 - firstDay) % 7;
    const fourthThursday = thursdayOffset + 21;
    
    if (date === fourthThursday) {
      return { isHoliday: true, holidayName: 'Thanksgiving' };
    }
  }
  
  return { isHoliday: false };
}
