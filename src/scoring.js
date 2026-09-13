const DAY = 86_400_000;

export function daysSince(date, now = new Date()) {
  if (!date) return Infinity;
  const worn = new Date(`${date}T12:00:00`);
  return Math.max(0, Math.floor((now - worn) / DAY));
}

export function weatherBand(weather) {
  const high = weather?.tempMax ?? weather?.temp ?? 20;
  if (high <= 12) return 'cold';
  if (high >= 25) return 'warm';
  return 'mild';
}

export function scoreOutfit(outfit, weather, history = [], now = new Date()) {
  if (outfit.status !== 'available') {
    return { ...outfit, eligible: false, reason: 'Unavailable' };
  }

  const lastEvent = history
    .filter((event) => event.outfitId === outfit.id)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastWorn = lastEvent?.date || outfit.lastWorn;
  const elapsed = daysSince(lastWorn, now);
  const neededBand = weatherBand(weather);
  const bands = outfit.temperatureBands || ['mild'];
  const weatherMatch = bands.includes(neededBand);
  const rainReady = !weather?.rain || outfit.rainFriendly;

  // Keep the rules intentionally understandable: safe weather first,
  // no exact repeats for 14 days, then favorites and least recently worn.
  const eligible = weatherMatch && rainReady && elapsed >= 14;
  const score = (weatherMatch ? 60 : 0)
    + (rainReady ? 15 : 0)
    + (outfit.favorite ? 10 : 0)
    + Math.min(elapsed, 60) / 4;

  return {
    ...outfit,
    eligible,
    score,
    daysSince: elapsed,
    weatherMatch,
    rainReady,
  };
}

export function rankOutfits(outfits, weather, history = [], now = new Date()) {
  const scored = outfits.map((outfit) => scoreOutfit(outfit, weather, history, now));
  const eligible = scored.filter((outfit) => outfit.eligible);
  const safe = scored.filter((outfit) => outfit.status === 'available' && outfit.weatherMatch && outfit.rainReady);
  const available = scored.filter((outfit) => outfit.status === 'available');
  const pool = eligible.length ? eligible : safe.length ? safe : available;

  return pool.sort((a, b) => b.score - a.score || b.daysSince - a.daysSince);
}
