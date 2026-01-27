import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} formatStr - Format string (default: 'PPpp')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatStr = 'PPpp') => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date to relative time
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date to relative string
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Relative date string
 */
export const formatRelativeDate = (date) => {
  if (!date) return 'N/A';
  try {
    return formatRelative(new Date(date), new Date());
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid Date';
  }
};

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Format user role for display
 * @param {string} role - User role
 * @returns {string} - Formatted role
 */
export const formatRole = (role) => {
  if (!role) return 'N/A';
  return role.split('_').map(capitalize).join(' ');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
