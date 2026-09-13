import test from 'node:test';
import assert from 'node:assert/strict';
import { daysSince, rankOutfits, scoreOutfit, weatherBand } from '../src/scoring.js';

const now = new Date('2026-09-13T12:00:00');
const mildWeather = { temp: 18, tempMax: 21, rain: false };
const outfit = {
  id: 'one',
  name: 'Test outfit',
  status: 'available',
  temperatureBands: ['mild'],
  rainFriendly: false,
  favorite: false,
  lastWorn: '2026-08-01',
};

test('weather is reduced to a simple temperature band', () => {
  assert.equal(weatherBand({ tempMax: 10 }), 'cold');
  assert.equal(weatherBand({ tempMax: 20 }), 'mild');
  assert.equal(weatherBand({ tempMax: 28 }), 'warm');
});

test('unavailable outfits are excluded', () => {
  assert.equal(scoreOutfit({ ...outfit, status: 'unavailable' }, mildWeather, [], now).eligible, false);
});

test('an exact outfit cannot repeat inside fourteen days', () => {
  const recent = scoreOutfit({ ...outfit, lastWorn: '2026-09-05' }, mildWeather, [], now);
  assert.equal(recent.eligible, false);
  assert.equal(daysSince('2026-09-05', now), 8);
});

test('favorites win when equally suitable and equally recent', () => {
  const favorite = { ...outfit, id: 'favorite', favorite: true };
  const ranked = rankOutfits([outfit, favorite], mildWeather, [], now);
  assert.equal(ranked[0].id, 'favorite');
});

test('rain excludes outfits that are not rain-friendly', () => {
  const result = scoreOutfit(outfit, { ...mildWeather, rain: true }, [], now);
  assert.equal(result.eligible, false);
});
