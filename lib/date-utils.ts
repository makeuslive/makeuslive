/**
 * Date/Time Formatting Utilities
 * 
 * Standard formats per PRD:
 * - Visible UI: "Jan 01, 1990" or "Jan 01, 1990, 11:59 PM"
 * - Storage/logs/APIs: RFC-3339 + IANA TZ (e.g., "2025-07-31T18:00:00+05:30[Asia/Kolkata]")
 */

/**
 * Format date for display: "Jan 01, 1990"
 * Zero-padded day as per PRD requirement
 */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return ''
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[d.getMonth()]
  const day = String(d.getDate()).padStart(2, '0') // Zero-padded
  const year = d.getFullYear()

  return `${month} ${day}, ${year}`
}

/**
 * Format date and time for display: "Jan 01, 1990, 11:59 PM"
 */
export function formatDisplayDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return ''
  }

  const dateStr = formatDisplayDate(d)
  
  // Format time in 12-hour format with AM/PM
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // 0 should be 12
  const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`

  return `${dateStr}, ${timeStr}`
}

/**
 * Format date for storage/logs/APIs: RFC-3339 + IANA TZ
 * Example: "2025-07-31T18:00:00+05:30[Asia/Kolkata]"
 */
export function formatStorageDate(date: Date | string, timezone?: string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(d.getTime())) {
    return ''
  }

  // Get timezone - use provided or detect from Intl
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // Format as RFC-3339 (ISO 8601)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  // Get timezone offset
  const offset = -d.getTimezoneOffset()
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')
  const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0')
  const offsetSign = offset >= 0 ? '+' : '-'
  
  const offsetStr = `${offsetSign}${offsetHours}:${offsetMinutes}`
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetStr}[${tz}]`
}

/**
 * Parse storage date string (RFC-3339 + IANA TZ) to Date object
 */
export function parseStorageDate(dateStr: string): Date {
  if (!dateStr) {
    return new Date()
  }

  // Extract RFC-3339 part (before the [timezone] part)
  const rfc3339Match = dateStr.match(/^(.+?)\[.+\]$/)
  const isoString = rfc3339Match ? rfc3339Match[1] : dateStr
  
  return new Date(isoString)
}

/**
 * Get current date/time in storage format
 */
export function getCurrentStorageDate(timezone?: string): string {
  return formatStorageDate(new Date(), timezone)
}

/**
 * Get current date/time in display format
 */
export function getCurrentDisplayDateTime(): string {
  return formatDisplayDateTime(new Date())
}

