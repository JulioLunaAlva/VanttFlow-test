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

/**
 * Parses a YYYY-MM-DD string into a local Date object.
 * Prevents timezone shift bugs for negative UTC offsets.
 * @param {string} dateStr - The date string, e.g., "2026-03-13"
 * @returns {Date} - A Date object exactly at local noon to avoid any boundary shifts.
 */
export function parseLocalDateStr(dateStr) {
    if (!dateStr) return new Date();
    // If it already has time components, just parse it naturally
    if (dateStr.includes('T')) return new Date(dateStr);
    // Append T12:00:00 to lock it to local time midday
    return new Date(`${dateStr}T12:00:00`);
}

