import { VerbStats } from "./types";

export function verbWeight(stats: VerbStats | undefined): number {
  if (!stats || stats.attempts === 0) return 3;

  const accuracy = stats.correct / stats.attempts;
  const hoursSinceSeen = (Date.now() - stats.lastSeen) / (1000 * 60 * 60);

  const recencyBoost = Math.exp(-hoursSinceSeen / 24);
  return Math.max(0.2, 1 - accuracy + recencyBoost);
}
