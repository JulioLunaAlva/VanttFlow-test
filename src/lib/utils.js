import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

/**
 * Returns the current local date (or a given date) as a YYYY-MM-DD string,
 * respecting the user's local timezone. Using toISOString() returns UTC time,
 * which causes date-shift bugs for users in negative UTC offsets (e.g. CDMX UTC-6).
 * @param {Date} [date=new Date()] - The date to convert. Defaults to now.
 * @returns {string} - Date string in YYYY-MM-DD format.
 */
export function toLocalDateStr(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
