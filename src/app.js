import { DEFAULT_SETTINGS, SEEDED_OUTFITS, SEED_HISTORY } from './data.js';
import { rankOutfits, weatherBand } from './scoring.js';

const app = document.querySelector('#app');
const toastNode = document.querySelector('#toast');
const clone = (value) => structuredClone(value);
const todayKey = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const state = {
  tab: 'today',
  adding: false,
  outfitIndex: 0,
  files: [],
  outfits: JSON.parse(localStorage.getItem('daily-edit-outfits') || 'null') || clone(SEEDED_OUTFITS),
  history: JSON.parse(localStorage.getItem('daily-edit-history') || 'null') || clone(SEED_HISTORY),
  settings: JSON.parse(localStorage.getItem('daily-edit-settings') || 'null') || clone(DEFAULT_SETTINGS),
  weather: JSON.parse(localStorage.getItem('daily-edit-weather') || 'null'),
};

function save() {
  localStorage.setItem('daily-edit-outfits', JSON.stringify(state.outfits));
  localStorage.setItem('daily-edit-history', JSON.stringify(state.history));
  localStorage.setItem('daily-edit-settings', JSON.stringify(state.settings));
  if (state.weather) localStorage.setItem('daily-edit-weather', JSON.stringify(state.weather));
}

function toast(message) {
  toastNode.textContent = message;
  toastNode.classList.add('show');
  window.setTimeout(() => toastNode.classList.remove('show'), 2200);
}

function icon(name) {
  const paths = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    hanger: '<path d="M9 6a3 3 0 1 1 4 2.8c-.6.3-1 .7-1 1.2v1l9 6H3l9-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    refresh: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M6 9a7 7 0 0 1 12-2l2 4M4 13l2 4a7 7 0 0 0 12-2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="m9 18 6-6-6-6"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
}

function shell(content) {
  const tabs = [
    ['today', 'sun', 'Today'],
    ['wardrobe', 'hanger', 'Wardrobe'],
    ['recent', 'clock', 'Recent'],
  ];
  return `
    <header class="topbar">
      <button class="wordmark" data-tab="today" aria-label="Daily Edit home"><b>DE</b><span>DAILY EDIT</span></button>
      <nav aria-label="Main navigation">
        ${tabs.map(([id, symbol, label]) => `
          <button data-tab="${id}" class="${state.tab === id ? 'active' : ''}">${icon(symbol)} ${label}</button>
        `).join('')}
      </nav>
    </header>
    <main>${content}</main>
    <nav class="mobile-nav" aria-label="Mobile navigation">
      ${tabs.map(([id, symbol, label]) => `
        <button data-tab="${id}" class="${state.tab === id ? 'active' : ''}">${icon(symbol)}<span>${label}</span></button>
      `).join('')}
    </nav>`;
}

function weatherSentence() {
  if (!state.weather) return 'Checking today’s weather…';
  const stale = state.weather.stale ? ' · saved forecast' : '';
  return `${state.weather.temp}°C · ${state.weather.label}${stale}`;
}

function recommendationReason(outfit) {
  const temperature = weatherBand(state.weather);
  const recent = Number.isFinite(outfit.daysSince)
    ? `You have not worn it for ${outfit.daysSince} days.`
    : 'It has not been worn recently.';
  return `A comfortable ${temperature}-weather choice that still feels polished. ${recent}`;
}

function todayView() {
  const ranked = rankOutfits(state.outfits, state.weather, state.history);
  if (state.outfitIndex >= ranked.length) state.outfitIndex = 0;
  const outfit = ranked[state.outfitIndex];

  return `
    <section class="today-page">
      <div class="greeting">
        <p>${new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p>
        <h1>Here’s what to wear.</h1>
      </div>
      <div class="weather-line">
        <span>${icon('sun')}</span>
        <strong>${weatherSentence()}</strong>
        <button id="refresh-weather" aria-label="Refresh weather">${icon('refresh')}</button>
      </div>
      ${outfit ? `
        <article class="pick">
          <div class="pick-photo">
            <img src="${outfit.image}" alt="${escapeHtml(outfit.name)}">
            <button class="favorite ${outfit.favorite ? 'selected' : ''}" data-favorite="${outfit.id}" aria-label="Toggle favorite">${icon('heart')}</button>
          </div>
          <div class="pick-copy">
            <p class="label">TODAY’S PICK</p>
            <h2>${escapeHtml(outfit.name)}</h2>
            <p class="reason">${recommendationReason(outfit)}</p>
            <div class="detail"><span>✦</span><p><small>THE DETAIL</small><strong>${escapeHtml(outfit.detail)}</strong></p></div>
            <div class="pick-actions">
              <button class="primary" data-wear="${outfit.id}">${icon('check')} Wear this</button>
              <button class="secondary" id="another">Another option ${icon('arrow')}</button>
            </div>
          </div>
        </article>
      ` : `
        <div class="empty"><h2>Add your first outfit</h2><p>A few photos are all Daily Edit needs to get started.</p><button class="primary" data-add>Add outfits</button></div>
      `}
    </section>`;
}

function outfitCard(outfit) {
  return `
    <article class="outfit-card">
      <div class="card-photo">
        <img src="${outfit.image}" alt="${escapeHtml(outfit.name)}">
        <button class="favorite ${outfit.favorite ? 'selected' : ''}" data-favorite="${outfit.id}" aria-label="Toggle favorite">${icon('heart')}</button>
      </div>
      <h3>${escapeHtml(outfit.name)}</h3>
      <p>${outfit.temperatureBands.join(' + ')} · ${outfit.use}</p>
      <div class="card-actions">
        <button data-availability="${outfit.id}" class="availability ${outfit.status}">${outfit.status === 'available' ? 'Available' : 'Unavailable'}</button>
        <button data-delete="${outfit.id}" class="delete">Delete</button>
      </div>
    </article>`;
}

function wardrobeView() {
  if (state.adding) return uploadView();
  return `
    <section class="page">
      <div class="page-heading">
        <div><p>YOUR COLLECTION</p><h1>Wardrobe</h1><span>${state.outfits.length} outfits</span></div>
        <button class="primary compact" data-add>${icon('plus')} Add outfits</button>
      </div>
      <div class="wardrobe-grid">${state.outfits.map(outfitCard).join('')}</div>
    </section>`;
}

function uploadView() {
  return `
    <section class="page narrow">
      <button class="back" id="cancel-upload">← Wardrobe</button>
      <div class="page-heading"><div><p>ADD OUTFITS</p><h1>A few quick details.</h1><span>Choose up to 20 photos. Each becomes a separate outfit.</span></div></div>
      <form id="upload-form" class="upload-card">
        <label class="drop-zone" for="photos">
          ${icon('plus')}<strong>Choose outfit photos</strong><span>JPG, PNG or WebP</span>
          <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required>
        </label>
        <div id="photo-previews" class="photo-previews"></div>
        <fieldset><legend>Weather</legend><div class="choice-row">
          ${['cold', 'mild', 'warm'].map((value) => `<label><input type="checkbox" name="temperature" value="${value}" ${value === 'mild' ? 'checked' : ''}><span>${value}</span></label>`).join('')}
        </div></fieldset>
        <fieldset><legend>Where would you wear it?</legend><div class="choice-row">
          ${['work', 'casual'].map((value) => `<label><input type="radio" name="use" value="${value}" ${value === 'work' ? 'checked' : ''}><span>${value}</span></label>`).join('')}
        </div></fieldset>
        <label class="toggle"><input type="checkbox" name="rainFriendly"><span>Rain-friendly</span></label>
        <label class="toggle"><input type="checkbox" name="favorite"><span>Favorite</span></label>
        <label class="text-field"><span>Optional standout detail</span><input name="detail" placeholder="e.g. Add the burgundy belt"></label>
        <button class="primary full" type="submit">Add to wardrobe</button>
      </form>
    </section>`;
}

function recentView() {
  const events = [...state.history].sort((a, b) => b.date.localeCompare(a.date));
  return `
    <section class="page narrow">
      <div class="page-heading"><div><p>WEAR HISTORY</p><h1>Recently worn</h1><span>This is how Daily Edit avoids repeating itself.</span></div></div>
      <div class="recent-list">
        ${events.length ? events.map((event) => {
          const outfit = state.outfits.find((item) => item.id === event.outfitId);
          if (!outfit) return '';
          return `<article><img src="${outfit.image}" alt=""><div><small>${new Date(`${event.date}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric' })}</small><h2>${escapeHtml(outfit.name)}</h2><p>${escapeHtml(event.weather || '')}</p></div></article>`;
        }).join('') : '<div class="empty"><h2>Nothing logged yet</h2><p>Tap “Wear this” and your outfit will appear here.</p></div>'}
      </div>
    </section>`;
}
async function refreshWeather(showMessage = true) {
  if (showMessage) toast('Checking the weather…');
  try {
    const { latitude, longitude } = state.settings;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=celsius&timezone=auto&forecast_days=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather request failed');
    const data = await response.json();
    const code = data.current.weather_code;
    const rain = code >= 51 || data.daily.precipitation_probability_max[0] >= 60;
    state.weather = {
      temp: Math.round(data.current.temperature_2m),
      tempMin: Math.round(data.daily.temperature_2m_min[0]),
      tempMax: Math.round(data.daily.temperature_2m_max[0]),
      rain,
      label: rain ? 'Rain likely' : code >= 2 ? 'Cool and cloudy' : 'Clear and dry',
      updated: new Date().toISOString(),
    };
    save();
    render();
    if (showMessage) toast('Weather updated');
  } catch {
    if (!state.weather) {
      state.weather = { temp: 18, tempMin: 13, tempMax: 21, rain: false, label: 'Mild and dry', stale: true };
    } else {
      state.weather.stale = true;
    }
    save();
    render();
    if (showMessage) toast('Using the last saved forecast');
  }
}

function render() {
  const views = { today: todayView, wardrobe: wardrobeView, recent: recentView };
  app.innerHTML = shell(views[state.tab]());
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      state.tab = button.dataset.tab;
      state.adding = false;
      render();
      window.scrollTo(0, 0);
    });
  });

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => {
      state.tab = 'wardrobe';
      state.adding = true;
      render();
    });
  });

  document.querySelectorAll('[data-favorite]').forEach((button) => {
    button.addEventListener('click', () => {
      const outfit = state.outfits.find((item) => item.id === button.dataset.favorite);
      outfit.favorite = !outfit.favorite;
      save();
      render();
      toast(outfit.favorite ? 'Saved as a favorite' : 'Removed from favorites');
    });
  });

  document.querySelectorAll('[data-wear]').forEach((button) => {
    button.addEventListener('click', () => wearOutfit(button.dataset.wear));
  });

  document.querySelectorAll('[data-availability]').forEach((button) => {
    button.addEventListener('click', () => {
      const outfit = state.outfits.find((item) => item.id === button.dataset.availability);
      outfit.status = outfit.status === 'available' ? 'unavailable' : 'available';
      save();
      render();
      toast(outfit.status === 'available' ? 'Available again' : 'Marked unavailable');
    });
  });

  document.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!window.confirm('Delete this outfit?')) return;
      state.outfits = state.outfits.filter((item) => item.id !== button.dataset.delete);
      save();
      render();
    });
  });

  document.querySelector('#another')?.addEventListener('click', () => {
    state.outfitIndex += 1;
    render();
  });
  document.querySelector('#refresh-weather')?.addEventListener('click', () => refreshWeather());
  document.querySelector('#cancel-upload')?.addEventListener('click', () => {
    state.adding = false;
    state.files = [];
    render();
  });
  document.querySelector('#photos')?.addEventListener('change', previewPhotos);
  document.querySelector('#upload-form')?.addEventListener('submit', addPhotos);
}

function wearOutfit(id) {
  const outfit = state.outfits.find((item) => item.id === id);
  const date = todayKey();
  state.history = state.history.filter((event) => event.date !== date);
  state.history.push({
    id: crypto.randomUUID(),
    date,
    outfitId: id,
    weather: weatherSentence(),
  });
  outfit.lastWorn = date;
  state.outfitIndex = 0;
  save();
  render();
  toast(`Added “${outfit.name}” to Recent`);
}

function previewPhotos(event) {
  state.files = [...event.target.files].slice(0, 20);
  const preview = document.querySelector('#photo-previews');
  preview.innerHTML = state.files.map((file) => `
    <figure><img src="${URL.createObjectURL(file)}" alt="Preview of ${escapeHtml(file.name)}"><figcaption>${escapeHtml(file.name)}</figcaption></figure>
  `).join('');
}

async function fileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function addPhotos(event) {
  event.preventDefault();
  if (!state.files.length) {
    toast('Choose at least one photo');
    return;
  }
  const form = new FormData(event.target);
  const temperatureBands = form.getAll('temperature');
  if (!temperatureBands.length) {
    toast('Choose cold, mild, or warm');
    return;
  }

  const photos = await Promise.all(state.files.map(fileAsDataUrl));
  const newOutfits = photos.map((image, index) => ({
    id: crypto.randomUUID(),
    name: state.files[index].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    image,
    temperatureBands,
    use: form.get('use'),
    rainFriendly: form.has('rainFriendly'),
    favorite: form.has('favorite'),
    detail: form.get('detail') || 'Keep the finishing touches simple.',
    status: 'available',
    lastWorn: null,
  }));

  state.outfits = [...newOutfits, ...state.outfits];
  state.files = [];
  state.adding = false;
  save();
  render();
  toast(`${newOutfits.length} outfit${newOutfits.length === 1 ? '' : 's'} added`);
}


render();
if (!state.weather) refreshWeather(false);
