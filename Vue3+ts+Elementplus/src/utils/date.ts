/**
 * 日期时间工具函数
 */

/**
 * 格式化日期时间
 * @param date 日期对象或日期字符串
 * @param format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDateTime(
  date: Date | string | number,
  format: string = "YYYY-MM-DD HH:mm:ss",
): string {
  const d = new Date(date);

  // 如果日期无效，返回空字符串
  if (isNaN(d.getTime())) {
    return "";
  }

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const second = d.getSeconds();

  // 替换格式中的年、月、日、时、分、秒
  return format
    .replace(/YYYY/g, year.toString())
    .replace(/YY/g, (year % 100).toString().padStart(2, "0"))
    .replace(/MM/g, month.toString().padStart(2, "0"))
    .replace(/M/g, month.toString())
    .replace(/DD/g, day.toString().padStart(2, "0"))
    .replace(/D/g, day.toString())
    .replace(/HH/g, hour.toString().padStart(2, "0"))
    .replace(/H/g, hour.toString())
    .replace(/mm/g, minute.toString().padStart(2, "0"))
    .replace(/m/g, minute.toString())
    .replace(/ss/g, second.toString().padStart(2, "0"))
    .replace(/s/g, second.toString());
}

/**
 * 格式化日期（不含时间）
 * @param date 日期对象或日期字符串
 * @param format 格式化模板，默认 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string | number,
  format: string = "YYYY-MM-DD",
): string {
  return formatDateTime(date, format);
}

/**
 * 格式化时间（不含日期）
 * @param date 日期对象或日期字符串
 * @param format 格式化模板，默认 'HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function formatTime(
  date: Date | string | number,
  format: string = "HH:mm:ss",
): string {
  return formatDateTime(date, format);
}

/**
 * 获取相对时间描述（如：刚刚、5分钟前、2小时前、昨天等）
 * @param date 日期对象或日期字符串
 * @returns 相对时间描述
 */
export function getRelativeTime(date: Date | string | number): string {
  const d = new Date(date);

  // 如果日期无效，返回空字符串
  if (isNaN(d.getTime())) {
    return "";
  }

  const now = new Date();
  const diff = now.getTime() - d.getTime();

  // 转换为秒
  const seconds = Math.floor(diff / 1000);

  // 小于1分钟，显示"刚刚"
  if (seconds < 60) {
    return "刚刚";
  }

  // 小于1小时，显示"x分钟前"
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分钟前`;
  }

  // 小于24小时，显示"x小时前"
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}小时前`;
  }

  // 小于7天，显示"x天前"
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}天前`;
  }

  // 大于7天，显示具体日期
  return formatDate(d);
}

/**
 * 判断是否为同一天
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 是否为同一天
 */
export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number,
): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
