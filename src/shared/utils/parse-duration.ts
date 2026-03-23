// src/common/utils/parse-duration.ts

export function parseDurationToMs(duration: string): number {
  const units: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  };

  const match = duration.match(/^(\d+)([smhdw])$/);
  if (!match) {
    throw new Error(`Invalid duration format: "${duration}". Expected format: 7d, 15m, 1h`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  return value * units[unit];
}