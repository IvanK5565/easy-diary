/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Adds an event listener that triggers the callback when clicking outside the target element.
 * @param {HTMLElement} element - The DOM element to detect outside clicks for.
 * @param {Function} callback - The function to call when an outside click is detected.
 * @returns {Function} A cleanup function to remove the event listener.
 */
export function clickOutSideTheBlock(element: any, callback: any) {
  function handleClick(event: any) {
    if (element && !element.contains(event.target)) {
      callback(event);
    }
  }

  document.addEventListener("mousedown", handleClick);

  // Return cleanup function
  return () => {
    document.removeEventListener("mousedown", handleClick);
  };
}

// isNumber: checks if a value is a number (and not NaN)
export function isNumber(value: any) {
  return typeof value === "number" && !isNaN(value);
}

// isFunction: checks if a value is a function
export function isFunction(value: any) {
  return typeof value === "function";
}

// isEmpty: checks if a object have keys
export function isEmpty(obj: Record<any, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (вс) – 6 (сб)
  const diff = day === 0 ? -6 : 1 - day; // если воскресенье — назад 6 дней
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0); // обнуляем время
  return d;
}

export function findClosestPastMonday(
  mondays: Date[],
  today: Date = new Date(),
): Date | null {
  const pastMondays = mondays
    .filter((m) => m.getTime() <= today.getTime())
    .sort((a, b) => b.getTime() - a.getTime()); // сортируем по убыванию

  return pastMondays[0] || null;
}
