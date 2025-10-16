export function normalizedString(str: string): string {
  return str.trim().replace(/\s+/g, "");
}