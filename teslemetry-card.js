/*!
 * Teslemetry Card — a Home Assistant Lovelace card for the Teslemetry integration
 * https://github.com/mimikm/Teslemetry-Card
 * MIT License · (c) Dominik Martyniak (mimikm)
 */

const CARD_VERSION = '0.2.0';

/* ------------------------------------------------------------------ */
/* Entity map: key -> [domain, entity_id suffixes, translation keys]   */
/* Suffixes match the default entity IDs Teslemetry creates           */
/* (e.g. sensor.my_tesla_battery_level). Translation keys are tried   */
/* first so renamed entities are still found.                         */
/* ------------------------------------------------------------------ */
const FIELDS = {
  battery_level:   ['sensor', ['battery_level', 'usable_battery_level'], ['charge_state_battery_level', 'charge_state_usable_battery_level']],
  battery_range:   ['sensor', ['battery_range', 'estimate_battery_range', 'ideal_battery_range'], ['charge_state_battery_range', 'charge_state_est_battery_range']],
  charging:        ['sensor', ['charging'], ['charge_state_charging_state']],
  charger_power:   ['sensor', ['charger_power'], ['charge_state_charger_power']],
  charge_rate:     ['sensor', ['charge_rate'], ['charge_state_charge_rate']],
  energy_added:    ['sensor', ['charge_energy_added'], ['charge_state_charge_energy_added']],
  time_to_full:    ['sensor', ['time_to_full_charge'], ['charge_state_minutes_to_full_charge']],
  inside_temp:     ['sensor', ['inside_temperature'], ['climate_state_inside_temp']],
  outside_temp:    ['sensor', ['outside_temperature'], ['climate_state_outside_temp']],
  odometer:        ['sensor', ['odometer'], ['vehicle_state_odometer']],
  shift_state:     ['sensor', ['shift_state'], ['drive_state_shift_state']],
  speed:           ['sensor', ['speed'], ['drive_state_speed']],
  exterior_color:  ['sensor', ['exterior_color'], ['exterior_color']],
  tpms_fl:         ['sensor', ['tire_pressure_front_left'], ['vehicle_state_tpms_pressure_fl']],
  tpms_fr:         ['sensor', ['tire_pressure_front_right'], ['vehicle_state_tpms_pressure_fr']],
  tpms_rl:         ['sensor', ['tire_pressure_rear_left'], ['vehicle_state_tpms_pressure_rl']],
  tpms_rr:         ['sensor', ['tire_pressure_rear_right'], ['vehicle_state_tpms_pressure_rr']],
  tpms_warn_fl:    ['binary_sensor', ['tire_pressure_warning_front_left'], ['vehicle_state_tpms_soft_warning_fl']],
  tpms_warn_fr:    ['binary_sensor', ['tire_pressure_warning_front_right'], ['vehicle_state_tpms_soft_warning_fr']],
  tpms_warn_rl:    ['binary_sensor', ['tire_pressure_warning_rear_left'], ['vehicle_state_tpms_soft_warning_rl']],
  tpms_warn_rr:    ['binary_sensor', ['tire_pressure_warning_rear_right'], ['vehicle_state_tpms_soft_warning_rr']],
  status:          ['binary_sensor', ['status'], ['state']],
  door_fd:         ['binary_sensor', ['front_driver_door'], ['vehicle_state_df']],
  door_fp:         ['binary_sensor', ['front_passenger_door'], ['vehicle_state_pf']],
  door_rd:         ['binary_sensor', ['rear_driver_door'], ['vehicle_state_dr']],
  door_rp:         ['binary_sensor', ['rear_passenger_door'], ['vehicle_state_pr']],
  win_fd:          ['binary_sensor', ['front_driver_window'], ['vehicle_state_fd_window']],
  win_fp:          ['binary_sensor', ['front_passenger_window'], ['vehicle_state_fp_window']],
  win_rd:          ['binary_sensor', ['rear_driver_window'], ['vehicle_state_rd_window']],
  win_rp:          ['binary_sensor', ['rear_passenger_window'], ['vehicle_state_rp_window']],
  charge_cable:    ['binary_sensor', ['charge_cable'], ['charge_state_conn_charge_cable']],
  rhd:             ['binary_sensor', ['right_hand_drive'], ['vehicle_state_rhd']],
  lock:            ['lock', ['lock'], ['vehicle_state_locked']],
  frunk:           ['cover', ['frunk'], ['vehicle_state_ft']],
  trunk:           ['cover', ['trunk'], ['vehicle_state_rt']],
  charge_port:     ['cover', ['charge_port_door'], ['charge_state_charge_port_door_open']],
  vent_windows:    ['cover', ['vent_windows', 'windows'], ['windows']],
  sunroof:         ['cover', ['sunroof'], ['vehicle_state_sun_roof_state']],
  climate:         ['climate', ['climate'], ['driver_temp']],
  sentry:          ['switch', ['sentry_mode'], ['vehicle_state_sentry_mode']],
  charge_switch:   ['switch', ['charge'], ['charge_state_user_charge_enable_request']],
  defrost:         ['switch', ['defrost'], ['climate_state_defrost_mode']],
  charge_limit:    ['number', ['charge_limit'], ['charge_state_charge_limit_soc']],
  charge_current:  ['number', ['charge_current'], ['charge_state_charge_current_request']],
  wake:            ['button', ['wake'], ['wake']],
  flash:           ['button', ['flash_lights'], ['flash_lights']],
  honk:            ['button', ['honk_horn'], ['honk']],
  location:        ['device_tracker', ['location'], ['location']],
  update:          ['update', ['update'], ['update']],
};

const ACTIONS = ['lock', 'climate', 'frunk', 'trunk', 'charge_port', 'sentry', 'charge', 'vent', 'defrost', 'flash', 'honk', 'wake'];
const DEFAULT_ACTIONS = ['lock', 'climate', 'frunk', 'trunk', 'charge_port', 'sentry', 'charge', 'vent', 'flash', 'honk'];
const CONFIRM_ACTIONS = ['unlock', 'frunk', 'trunk'];

const PAINT = {
  pearlwhite: '#e9e9e6', white: '#e9e9e6', pearlwhitemulticoat: '#ecebe7',
  solidblack: '#1c1d20', black: '#1c1d20', obsidianblack: '#1e1f24', diamondblack: '#16171a',
  midnightsilver: '#4b4f55', midnightsilvermetallic: '#4b4f55', stealthgrey: '#3d4046', stealthgray: '#3d4046',
  midnightcherryred: '#5a1220', deepblue: '#1f3b6e', deepbluemetallic: '#1f3b6e', marineblue: '#1b3a5c',
  redmulticoat: '#a3161f', ultrared: '#b3141d', quicksilver: '#a7aaae', silver: '#b9bcc0', silvermetallic: '#b9bcc0',
  lunarsilver: '#c5c8cb', frostwhite: '#f1f1ee',
};

const RHD_COUNTRIES = ['GB', 'IE', 'AU', 'NZ', 'JP', 'ZA', 'IN', 'HK', 'SG', 'MY', 'TH', 'ID', 'CY', 'MT', 'MO', 'KE', 'PK', 'LK', 'BD', 'IM', 'JE', 'GG'];

const CHARGING_LABELS = {
  starting: 'Starting', charging: 'Charging', stopped: 'Stopped', complete: 'Complete',
  disconnected: 'Unplugged', no_power: 'No power', nopower: 'No power',
};
const SHIFT_LABELS = { p: 'Parked', d: 'Driving', r: 'Reversing', n: 'Neutral' };

const BAD = ['unavailable', 'unknown', '', undefined, null];

/* ------------------------------------------------------------------ */
/* Colour schemes                                                     */
/* bg: card background · fg/fg2: text · tint: rgb used for tiles      */
/* ------------------------------------------------------------------ */
const SCHEMES = {
  ha: { label: 'Home Assistant theme' },
  midnight: {
    label: 'Midnight', accent: '#5b8cff', fg: '#eef2ff', fg2: '#93a0bd', tint: '160,175,215',
    bg: 'radial-gradient(120% 80% at 50% 0%, #1d2746 0%, #0e1322 55%, #090c14 100%)',
  },
  studio: {
    label: 'Studio Black', accent: '#e82127', battery: '#e9e9ee', fg: '#f5f5f7', fg2: '#8e8e93', tint: '255,255,255',
    bg: 'linear-gradient(180deg, #161618 0%, #0a0a0b 100%)',
  },
  glass: {
    label: 'Glass', accent: '#7dd3fc', fg: '#ffffff', fg2: 'rgba(255,255,255,.72)', tint: '255,255,255',
    bg: 'linear-gradient(135deg, rgba(255,255,255,.16) 0%, rgba(255,255,255,.05) 100%)',
    extra: 'backdrop-filter:blur(18px) saturate(150%); -webkit-backdrop-filter:blur(18px) saturate(150%); border:1px solid rgba(255,255,255,.2);',
  },
  aurora: {
    label: 'Aurora', accent: '#34e0c0', fg: '#f1f5ff', fg2: '#a9b6d6', tint: '190,205,255',
    bg: 'radial-gradient(90% 60% at 15% 0%, rgba(124,58,237,.45) 0%, transparent 60%), radial-gradient(80% 60% at 100% 100%, rgba(20,184,166,.35) 0%, transparent 60%), linear-gradient(160deg, #180f30 0%, #0f2236 55%, #0a2b2a 100%)',
  },
  arctic: {
    label: 'Arctic (light)', accent: '#2563eb', fg: '#13202f', fg2: '#5d6b7c', tint: '40,70,110', light: true,
    bg: 'linear-gradient(180deg, #ffffff 0%, #eaf1f8 100%)',
  },
  sunset: {
    label: 'Sunset', accent: '#ff8a3d', battery: '#ffd9bf', fg: '#fff4ee', fg2: '#e3bcae', tint: '255,205,185',
    bg: 'radial-gradient(100% 70% at 80% 0%, rgba(255,138,61,.35) 0%, transparent 60%), linear-gradient(165deg, #2a1230 0%, #46192d 50%, #5e2419 100%)',
  },
  carbon: {
    label: 'Carbon', accent: '#c6ff3d', fg: '#f2f2f2', fg2: '#9a9da3', tint: '255,255,255',
    bg: 'repeating-linear-gradient(45deg, rgba(255,255,255,.035) 0 2px, transparent 2px 5px), repeating-linear-gradient(-45deg, rgba(0,0,0,.35) 0 2px, transparent 2px 5px), linear-gradient(180deg, #1d1e21 0%, #111214 100%)',
  },
};

/* ------------------------------------------------------------------ */
/* Car models — top-down geometry in a 420×220 viewBox, nose → right. */
/* Only the car's LEFT side (top of drawing) is described; the right  */
/* side is mirrored around y = 110.                                   */
/* ------------------------------------------------------------------ */
const flipY = (d) => {
  let i = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (n) => (i++ % 2 ? String(+(220 - parseFloat(n)).toFixed(2)) : n));
};

const CAR_MODELS = {
  model_3: {
    label: 'Model 3',
    body: 'M74 110 C74 76 84 58 116 55 L262 51 C318 50 352 66 360 92 C364 104 364 116 360 128 C352 154 318 170 262 169 L116 165 C84 162 74 144 74 110 Z',
    glass: 'M128 72 C120 90 120 130 128 148 L238 152 C266 144 276 128 276 110 C276 92 266 76 238 68 Z',
    pillar: [234, 69],
    frunk: 'M284 66 C320 66 346 80 351 100 L351 120 C346 140 320 154 284 154 C291 134 291 86 284 66 Z',
    trunk: 'M121 68 C97 70 84 86 84 110 C84 134 97 150 121 152 C115 130 115 90 121 68 Z',
    wheels: { f: [290, 51], r: [128, 54] },
    mirror: [246, 47],
    doors: { f: [188, 238], r: [136, 186], y: 49.5 },
    wins: { f: [198, 232, 70.5], r: [138, 190, 72] },
    seats: { f: 205, r: 140, dash: 236, steer: 249 },
    head: 'M334 68 C345 74 352 83 356 93',
    tail: 'M104 58 C90 61 80 70 77 84',
    beam: 352,
    port: [96, 57, 'top'],
    shoulder: 'M132 61 L258 57',
  },
  model_y: {
    label: 'Model Y',
    body: 'M70 110 C70 72 82 54 118 51 L258 48 C320 47 354 64 362 92 C366 104 366 116 362 128 C354 156 320 173 258 172 L118 169 C82 166 70 148 70 110 Z',
    glass: 'M118 70 C110 88 110 132 118 150 L240 155 C270 147 282 130 282 110 C282 90 270 73 240 65 Z',
    pillar: [236, 66],
    frunk: 'M290 64 C326 64 350 80 355 100 L355 120 C350 140 326 156 290 156 C297 135 297 85 290 64 Z',
    trunk: 'M112 66 C90 69 80 86 80 110 C80 134 90 151 112 154 C106 132 106 88 112 66 Z',
    wheels: { f: [292, 48], r: [124, 51] },
    mirror: [250, 44],
    doors: { f: [190, 240], r: [136, 190], y: 46.5 },
    wins: { f: [200, 236, 66.5], r: [140, 186, 68.5] },
    seats: { f: 208, r: 140, dash: 240, steer: 254 },
    head: 'M338 66 C349 72 356 82 360 93',
    tail: 'M106 54 C90 57 78 68 74 84',
    beam: 356,
    port: [94, 54, 'top'],
    shoulder: 'M128 58 L254 54',
  },
  model_s: {
    label: 'Model S',
    body: 'M60 110 C60 78 70 60 104 57 L270 53 C326 52 360 68 368 93 C371 104 371 116 368 127 C360 152 326 168 270 167 L104 163 C70 160 60 142 60 110 Z',
    glass: 'M124 73 C116 90 116 130 124 147 L236 151 C262 144 272 128 272 110 C272 92 262 76 236 69 Z',
    pillar: [232, 70],
    frunk: 'M286 67 C326 67 354 82 359 100 L359 120 C354 138 326 153 286 153 C293 134 293 86 286 67 Z',
    trunk: 'M116 69 C88 71 72 88 72 110 C72 132 88 149 116 151 C110 130 110 90 116 69 Z',
    wheels: { f: [298, 53], r: [120, 56] },
    mirror: [244, 49],
    doors: { f: [184, 236], r: [130, 184], y: 51.5 },
    wins: { f: [194, 230, 70.5], r: [134, 180, 72.5] },
    seats: { f: 202, r: 138, dash: 233, steer: 246 },
    head: 'M342 69 C353 75 360 84 364 94',
    tail: 'M96 60 C80 63 68 72 64 86',
    beam: 360,
    port: [84, 59, 'top'],
    shoulder: 'M128 63 L262 59',
  },
  model_x: {
    label: 'Model X',
    body: 'M66 110 C66 70 78 51 116 48 L262 45 C324 44 356 62 364 90 C368 104 368 116 364 130 C356 158 324 176 262 175 L116 172 C78 169 66 150 66 110 Z',
    glass: 'M118 70 C110 88 110 132 118 150 L246 157 C278 148 292 130 292 110 C292 90 278 72 246 63 Z',
    pillar: null,
    frunk: 'M298 62 C330 62 352 78 357 100 L357 120 C352 142 330 158 298 158 C305 136 305 84 298 62 Z',
    trunk: 'M112 66 C90 69 78 86 78 110 C78 134 90 151 112 154 C106 132 106 88 112 66 Z',
    wheels: { f: [296, 45], r: [124, 48] },
    mirror: [262, 41],
    doors: { f: [206, 256], r: 'falcon', y: 43.5 },
    wins: { f: [214, 252, 64.5], r: null },
    falcon: {
      panel: 'M128 69.5 L202 65.5 L204 106.5 L126 106.5 C121 94 122 80 128 69.5 Z',
      win: 'M140 74 L194 71 L195 99 L138 99 Z',
    },
    seats: { f: 214, r: 160, third: 124, dash: 248, steer: 262 },
    head: 'M336 64 C348 71 356 80 360 91',
    tail: 'M106 51 C90 55 76 66 71 82',
    beam: 356,
    port: [92, 52, 'top'],
    shoulder: 'M130 55 L256 51',
  },
  cybertruck: {
    label: 'Cybertruck',
    body: 'M64 52 L318 49 L358 64 L372 92 L372 128 L358 156 L318 171 L64 168 L58 140 L58 80 Z',
    glass: 'M170 70 L250 66 L298 92 L298 128 L250 154 L170 150 Z',
    pillar: [250, 67],
    frunk: 'M304 62 L346 72 L362 96 L362 124 L346 148 L304 158 Z',
    trunk: 'M66 60 L166 62 L166 158 L66 160 Z',
    wheels: { f: [292, 46], r: [112, 48] },
    mirror: [292, 44],
    doors: { f: [238, 290], r: [178, 238], y: 47.5 },
    wins: { f: [244, 286, 68.5], r: [180, 234, 70] },
    seats: { f: 230, r: 180, dash: 260, steer: 273 },
    headBar: 'M371 93 L371 127',
    tailBar: 'M59 82 L59 138',
    beam: 372,
    port: [92, 167, 'bot'],
    shoulder: 'M70 56 L314 53',
    extra: (lo) => {
      const flares = ['M86 54 L95 40 L129 40 L138 54 Z', 'M266 51 L275 38 L309 38 L318 51 Z'];
      const f = flares.map((d) => `<path d="${d}" fill="#2a2c31"/><path d="${flipY(d)}" fill="#2a2c31"/>`).join('');
      let slats = '';
      for (let x = 76; x <= 160; x += 9) slats += `<line x1="${x}" y1="64" x2="${x}" y2="156"/>`;
      return `<g stroke="${lo}" stroke-opacity="0.45" stroke-width="1">${slats}</g>${f}`;
    },
  },
};
const MODEL_KEYS = Object.keys(CAR_MODELS);

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function toRgb(color) {
  if (!color) return null;
  if (Array.isArray(color)) return color.slice(0, 3).map(Number);
  let c = String(color).trim();
  const m = c.match(/^rgba?\(([^)]+)\)$/i);
  if (m) return m[1].split(',').slice(0, 3).map((v) => parseFloat(v));
  if (c[0] === '#') c = c.slice(1);
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  if (!/^[0-9a-f]{6}$/i.test(c)) return null;
  return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
}
const rgbHex = (rgb) => '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
/** amt > 0 mixes toward white, < 0 toward black */
function shade(hex, amt) {
  const rgb = toRgb(hex) || [200, 200, 200];
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return rgbHex(rgb.map((v) => v + (t - v) * p));
}
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex) || [200, 200, 200];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

function fmtDuration(mins) {
  mins = Math.max(0, Math.round(mins));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/* ------------------------------------------------------------------ */
/* Card                                                               */
/* ------------------------------------------------------------------ */
class TeslemetryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._uid = 'tc' + Math.random().toString(36).slice(2, 8);
    this._ents = {};
    this._sig = '';
    this._confirm = null;
    this._flashUntil = 0;
    this._pendingTemp = null;
    this._dragging = false;
    this.shadowRoot.addEventListener('click', (e) => this._onClick(e));
    this.shadowRoot.addEventListener('input', (e) => this._onInput(e));
    this.shadowRoot.addEventListener('change', (e) => this._onChange(e));
    this.shadowRoot.addEventListener('pointerdown', (e) => { if (e.target.matches?.('input[type=range]')) this._dragging = true; });
    this.shadowRoot.addEventListener('pointerup', () => { this._dragging = false; });
  }

  static async getConfigElement() {
    // Make sure ha-form & selectors are loaded before the editor renders
    try {
      const helpers = await window.loadCardHelpers?.();
      if (helpers && !customElements.get('ha-form')) {
        const c = await helpers.createCardElement({ type: 'entities', entities: [] });
        await c.constructor.getConfigElement?.();
      }
    } catch (_) { /* ignore */ }
    return document.createElement('teslemetry-card-editor');
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    if (!config) throw new Error('Invalid configuration');
    this._config = {
      show_tyres: true,
      show_climate: true,
      show_charging: true,
      show_charge_limit: true,
      show_actions: true,
      show_footer: true,
      confirm_actions: true,
      drive_side: 'auto',
      model: 'auto',
      color_scheme: 'ha',
      ...config,
    };
    this._resolvedFor = null;
    this._sig = '';
    if (this._hass) this.hass = this._hass;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (this._resolvedFor !== hass.entities || !this._resolvedOnce) this._resolve(hass);
    if (this._dragging) return;
    const sig = this._signature();
    if (sig === this._sig) return;
    this._sig = sig;
    this._render();
  }

  get hass() { return this._hass; }

  getCardSize() { return 8; }

  getGridOptions() { return { columns: 12, min_columns: 6 }; }

  /* ---------------- entity discovery ---------------- */
  _resolve(hass) {
    this._resolvedFor = hass.entities;
    this._resolvedOnce = true;
    const cfg = this._config;
    const reg = hass.entities || {};
    const regList = Object.values(reg);
    let pool = null;
    let deviceId = cfg.device_id;

    if (!deviceId && !cfg.vehicle) {
      const hit = regList.find((e) => e.platform === 'teslemetry' && e.device_id && /^sensor\..+_battery_level$/.test(e.entity_id) && !/usable/.test(e.entity_id));
      if (hit) deviceId = hit.device_id;
    }
    if (deviceId) {
      pool = regList.filter((e) => e.device_id === deviceId).map((e) => ({ entity_id: e.entity_id, tk: e.translation_key }));
    } else {
      let prefix = cfg.vehicle;
      if (!prefix) {
        // No registry info — guess from a battery sensor that has a matching lock entity
        for (const id of Object.keys(hass.states)) {
          const m = id.match(/^sensor\.(.+)_battery_level$/);
          if (m && hass.states[`lock.${m[1]}_lock`]) { prefix = m[1]; break; }
        }
      }
      if (prefix) {
        prefix = String(prefix).replace(/^[a-z_]+\./, '');
        pool = Object.keys(hass.states)
          .filter((id) => id.split('.')[1].startsWith(prefix + '_'))
          .map((id) => ({ entity_id: id, tk: reg[id]?.translation_key }));
      }
    }
    this._deviceId = deviceId;
    this._ents = {};
    if (pool) {
      for (const [key, [domain, suffixes, keys]] of Object.entries(FIELDS)) {
        const inDomain = pool.filter((e) => e.entity_id.startsWith(domain + '.'));
        let found;
        for (const k of keys) {
          found = inDomain.find((e) => e.tk && e.tk === k);
          if (found) break;
        }
        if (!found) {
          for (const s of suffixes) {
            const c = inDomain.filter((e) => {
              const o = e.entity_id.slice(domain.length + 1);
              return o === s || o.endsWith('_' + s);
            });
            if (c.length) { found = c.sort((a, b) => a.entity_id.length - b.entity_id.length)[0]; break; }
          }
        }
        if (found) this._ents[key] = found.entity_id;
      }
    }
    // Manual overrides always win
    Object.assign(this._ents, cfg.entities || {});
  }

  _s(key) { const id = this._ents[key]; return id ? this._hass.states[id] : undefined; }
  _v(key) { const s = this._s(key); return s && !BAD.includes(s.state) ? s.state : undefined; }
  _n(key) { const v = parseFloat(this._v(key)); return Number.isFinite(v) ? v : undefined; }
  _u(key) { return this._s(key)?.attributes?.unit_of_measurement || ''; }
  _isOn(key) { const v = this._v(key); return v === 'on' || v === 'open' || v === 'opening' || v === 'unlocked'; }

  _signature() {
    const parts = [];
    for (const id of Object.values(this._ents)) {
      const s = this._hass.states[id];
      parts.push(s ? s.last_updated : '-');
    }
    if (this._chargingActive()) parts.push(Math.floor(Date.now() / 60000));
    parts.push(this._hass.themes?.darkMode ? 'd' : 'l');
    return parts.join('|');
  }

  _chargingActive() {
    const v = (this._v('charging') || '').toLowerCase();
    return v === 'charging' || v === 'starting';
  }

  _rhd() {
    const ds = this._config.drive_side;
    if (ds === 'rhd') return true;
    if (ds === 'lhd') return false;
    const r = this._v('rhd');
    if (r === 'on') return true;
    if (r === 'off') return false;
    return RHD_COUNTRIES.includes((this._hass.config?.country || '').toUpperCase());
  }

  _paint() {
    if (this._config.car_color) return toRgb(this._config.car_color) ? rgbHex(toRgb(this._config.car_color)) : this._config.car_color;
    const ext = (this._v('exterior_color') || '').toLowerCase().replace(/[^a-z]/g, '');
    if (PAINT[ext]) return PAINT[ext];
    const k = Object.keys(PAINT).find((p) => ext && (ext.includes(p) || p.includes(ext)));
    return k ? PAINT[k] : '#c9ccd1';
  }

  _scheme() {
    return SCHEMES[this._config.color_scheme] || SCHEMES.ha;
  }

  _accent() {
    const c = toRgb(this._config.accent_color) || toRgb(this._scheme().accent);
    return c ? rgbHex(c) : '#4f8cff';
  }

  _name() {
    if (this._config.name) return this._config.name;
    const d = this._deviceId && this._hass.devices?.[this._deviceId];
    return d?.name_by_user || d?.name || 'Tesla';
  }

  _timeToFull() {
    const s = this._s('time_to_full');
    const v = this._v('time_to_full');
    if (!v) return null;
    let mins;
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
      mins = (Date.parse(v) - Date.now()) / 60000;
    } else {
      const n = parseFloat(v);
      const u = s.attributes.unit_of_measurement;
      mins = u === 'h' ? n * 60 : u === 's' ? n / 60 : u === 'd' ? n * 1440 : n;
    }
    if (!(mins > 0)) return null;
    const end = new Date(Date.now() + mins * 60000);
    let clock = '';
    try { clock = end.toLocaleTimeString(this._hass.locale?.language || undefined, { hour: '2-digit', minute: '2-digit' }); } catch (_) { /* */ }
    return { text: fmtDuration(mins), clock };
  }

  /* ---------------- rendering ---------------- */
  _render() {
    const cfg = this._config;
    const accent = this._accent();
    const accRgb = toRgb(accent).join(',');

    if (!this._ents.battery_level && !this._ents.lock) {
      this.shadowRoot.innerHTML = `${this._style(accent, accRgb)}<ha-card><div class="empty">
        <ha-icon icon="mdi:car-search-outline"></ha-icon>
        <div><b>No Teslemetry vehicle found</b><br>Pick your car in the card editor, or set <code>device_id</code> / <code>vehicle</code> in YAML.</div>
      </div></ha-card>`;
      return;
    }

    const soc = this._n('battery_level');
    const range = this._n('battery_range');
    const chargingState = (this._v('charging') || '').toLowerCase();
    const charging = this._chargingActive();
    const cable = this._isOn('charge_cable') || (chargingState && chargingState !== 'disconnected');
    const status = this._v('status');
    const online = status === 'on';
    const shift = (this._v('shift_state') || '').toLowerCase();
    const driving = shift === 'd' || shift === 'r';
    const speed = this._n('speed');
    const locked = this._v('lock') === 'locked';
    const climate = this._s('climate');
    const climateOn = climate && !BAD.includes(climate.state) && climate.state !== 'off';
    const inside = this._n('inside_temp') ?? climate?.attributes?.current_temperature;
    const target = this._pendingTemp ?? climate?.attributes?.temperature;
    const heating = climateOn && target != null && inside != null ? target >= inside : true;
    const limit = this._n('charge_limit');
    const rhd = this._rhd();
    const paint = this._paint();

    const model = this._modelKey();
    const st = {
      model, paint, accent, rhd, charging, cable,
      complete: chargingState === 'complete',
      port: this._isOn('charge_port'),
      frunk: this._isOn('frunk'), trunk: this._isOn('trunk'),
      sunroof: this._isOn('sunroof'),
      sentry: this._isOn('sentry'),
      climateOn, heating, driving,
      flash: Date.now() < this._flashUntil,
      doors: { fd: this._isOn('door_fd'), fp: this._isOn('door_fp'), rd: this._isOn('door_rd'), rp: this._isOn('door_rp') },
      wins: { fd: this._isOn('win_fd'), fp: this._isOn('win_fp'), rd: this._isOn('win_rd'), rp: this._isOn('win_rp') },
      tyres: cfg.show_tyres ? ['fl', 'fr', 'rl', 'rr'].reduce((o, k) => {
        const n = this._n('tpms_' + k);
        if (n != null) {
          const u = this._u('tpms_' + k);
          const dec = /psi/i.test(u) ? 0 : 1;
          o[k] = { text: `${n.toFixed(dec)}${u ? ' ' + u : ''}`, warn: this._isOn('tpms_warn_' + k) };
        } else {
          o[k] = { text: '—', missing: true };
        }
        return o;
      }, {}) : {},
    };
    // Teslemetry ships the tyre pressure sensors disabled — say how to turn them on
    const tyresOff = cfg.show_tyres && !['fl', 'fr', 'rl', 'rr'].some((k) => this._ents['tpms_' + k]);

    /* header sub-line */
    const sub = [];
    if (status) sub.push(`<span class="dot ${online ? 'on' : ''}"></span>${online ? 'Online' : 'Asleep'}`);
    if (driving) sub.push(`${SHIFT_LABELS[shift]}${speed != null ? ` · ${Math.round(speed)} ${esc(this._u('speed'))}` : ''}`);
    else if (shift && SHIFT_LABELS[shift]) sub.push(SHIFT_LABELS[shift]);
    else if (status) sub.push('Parked');
    const loc = this._s('location');
    if (loc && !BAD.includes(loc.state)) {
      const zone = loc.state === 'home' ? 'Home' : loc.state === 'not_home' ? 'Away' : (this._hass.states[`zone.${loc.state}`]?.attributes?.friendly_name || loc.state);
      sub.push(`<span class="clickable" data-more="location">${esc(zone)}</span>`);
    }

    const upd = this._s('update');
    const updAvail = upd && upd.state === 'on';
    const showWake = this._ents.wake && status === 'off';

    /* lock button */
    const lockBtn = this._ents.lock ? (() => {
      const conf = this._confirm?.act === 'lock';
      return `<button class="lockbtn ${locked ? '' : 'unlocked'} ${conf ? 'confirm' : ''}" data-act="lock" title="${locked ? 'Unlock' : 'Lock'}">
        <ha-icon icon="${conf ? 'mdi:gesture-tap' : locked ? 'mdi:lock' : 'mdi:lock-open-variant'}"></ha-icon></button>`;
    })() : '';

    /* battery */
    let batteryHtml = '';
    if (cfg.show_charging && soc != null) {
      const col = charging || st.complete ? '#35d07f' : soc <= 10 ? '#e5484d' : soc <= 20 ? '#f5a524' : (this._scheme().battery || accent);
      const chgLabel = CHARGING_LABELS[chargingState] || '';
      const stats = [];
      if (charging) {
        const p = this._n('charger_power');
        if (p != null) stats.push(`<span><ha-icon icon="mdi:flash"></ha-icon>${p >= 10 ? Math.round(p) : p.toFixed(1)} ${esc(this._u('charger_power') || 'kW')}</span>`);
        const r = this._n('charge_rate');
        if (r != null && r > 0) stats.push(`<span><ha-icon icon="mdi:speedometer"></ha-icon>${Math.round(r)} ${esc(this._u('charge_rate'))}</span>`);
        const tf = this._timeToFull();
        if (tf) stats.push(`<span><ha-icon icon="mdi:timer-sand"></ha-icon>${tf.text}${limit != null ? ` to ${Math.round(limit)}%` : ''}${tf.clock ? ` · ${esc(tf.clock)}` : ''}</span>`);
      }
      const ea = this._n('energy_added');
      if ((charging || st.complete) && ea != null && ea > 0) stats.push(`<span><ha-icon icon="mdi:battery-plus-variant"></ha-icon>+${ea.toFixed(1)} ${esc(this._u('energy_added') || 'kWh')}</span>`);

      const lim = this._s('charge_limit');
      const limMin = lim?.attributes?.min ?? 50;
      const limMax = lim?.attributes?.max ?? 100;
      const limitRow = cfg.show_charge_limit && limit != null ? `
        <div class="limit-row">
          <ha-icon icon="mdi:battery-arrow-up-outline"></ha-icon><span>Charge limit</span>
          <input type="range" data-num="charge_limit" min="${limMin}" max="${limMax}" step="${lim?.attributes?.step ?? 1}" value="${limit}">
          <b data-out="charge_limit">${Math.round(limit)}%</b>
        </div>` : '';
      const cur = this._s('charge_current');
      const curVal = this._n('charge_current');
      const currentRow = cfg.show_charge_current && curVal != null ? `
        <div class="limit-row">
          <ha-icon icon="mdi:current-ac"></ha-icon><span>Charge current</span>
          <input type="range" data-num="charge_current" min="${cur.attributes.min ?? 0}" max="${cur.attributes.max ?? 32}" step="${cur.attributes.step ?? 1}" value="${curVal}">
          <b data-out="charge_current">${Math.round(curVal)} A</b>
        </div>` : '';

      batteryHtml = `
      <div class="battery">
        <div class="bat-head">
          <div class="soc clickable" data-more="battery_level">${Math.round(soc)}<span>%</span></div>
          ${range != null ? `<div class="range clickable" data-more="battery_range"><span><b>${Math.round(range)}</b> ${esc(this._u('battery_range'))}</span><small>range</small></div>` : ''}
          ${chgLabel && chargingState !== 'disconnected' ? `<div class="cstate ${charging ? 'charging' : ''} ${st.complete ? 'complete' : ''}" data-more="charging"><ha-icon icon="${charging ? 'mdi:lightning-bolt' : st.complete ? 'mdi:check-circle' : 'mdi:power-plug'}"></ha-icon>${chgLabel}</div>` : ''}
        </div>
        <div class="bar">
          <div class="fill ${charging ? 'charging' : ''}" style="width:${Math.max(2, Math.min(100, soc))}%;--fill:${col}"></div>
          ${limit != null ? `<div class="limit" style="left:${Math.min(100, limit)}%"></div>` : ''}
        </div>
        ${stats.length ? `<div class="stats">${stats.join('')}</div>` : ''}
        ${limitRow}${currentRow}
      </div>`;
    }

    /* climate */
    let climateHtml = '';
    if (cfg.show_climate && (climate || inside != null)) {
      const out = this._n('outside_temp');
      const tu = this._u('inside_temp') || this._hass.config?.unit_system?.temperature || '°C';
      const step = climate?.attributes?.target_temp_step || (tu.includes('F') ? 1 : 0.5);
      const mode = climateOn ? (heating ? 'heat' : 'cool') : '';
      climateHtml = `
      <div class="climate ${mode}">
        <div class="temp clickable" data-more="inside_temp"><small>Inside</small><b>${inside != null ? Number(inside).toFixed(1) : '–'}${esc(tu)}</b></div>
        ${out != null ? `<div class="temp clickable" data-more="outside_temp"><small>Outside</small><b>${out.toFixed(1)}${esc(tu)}</b></div>` : ''}
        ${climate ? `
        <div class="target">
          <button class="tbtn" data-temp="-${step}" ${!climateOn ? 'disabled' : ''}><ha-icon icon="mdi:minus"></ha-icon></button>
          <div class="tval clickable" data-more="climate"><b>${target != null ? Number(target).toFixed(step < 1 ? 1 : 0) : '–'}°</b><small>${climateOn ? (heating ? 'Heating' : 'Cooling') : 'Off'}</small></div>
          <button class="tbtn" data-temp="${step}" ${!climateOn ? 'disabled' : ''}><ha-icon icon="mdi:plus"></ha-icon></button>
          <button class="power ${climateOn ? 'on' : ''}" data-act="climate"><ha-icon icon="mdi:power"></ha-icon></button>
        </div>` : ''}
      </div>`;
    }

    /* actions */
    let actionsHtml = '';
    if (cfg.show_actions) {
      const list = (Array.isArray(cfg.actions) && cfg.actions.length ? cfg.actions : DEFAULT_ACTIONS).filter((a) => ACTIONS.includes(a));
      const btns = list.map((a) => this._actionButton(a)).filter(Boolean);
      if (btns.length) actionsHtml = `<div class="actions">${btns.join('')}</div>`;
    }

    /* footer */
    let footHtml = '';
    if (cfg.show_footer) {
      const f = [];
      const odo = this._n('odometer');
      if (odo != null) f.push(`<span class="clickable" data-more="odometer"><ha-icon icon="mdi:counter"></ha-icon>${Math.round(odo).toLocaleString(this._hass.locale?.language)} ${esc(this._u('odometer'))}</span>`);
      if (upd && !BAD.includes(upd.state)) {
        const ver = upd.attributes.installed_version;
        f.push(`<span class="clickable ${updAvail ? 'upd' : ''}" data-more="update"><ha-icon icon="${updAvail ? 'mdi:package-up' : 'mdi:package-variant-closed-check'}"></ha-icon>${updAvail ? `Update ${esc(upd.attributes.latest_version || '')}` : esc(ver || 'Up to date')}</span>`);
      }
      if (f.length) footHtml = `<div class="foot">${f.join('')}</div>`;
    }

    this.shadowRoot.innerHTML = `${this._style(accent, accRgb)}
    <ha-card>
      <div class="head">
        <div class="title">
          <div class="name clickable" data-more="${this._ents.location ? 'location' : 'status'}">${esc(this._name())}</div>
          <div class="sub">${sub.join('<span class="sep">·</span>')}</div>
        </div>
        ${showWake ? `<button class="chip" data-act="wake"><ha-icon icon="mdi:sleep-off"></ha-icon>Wake</button>` : ''}
        ${lockBtn}
      </div>
      <div class="stage ${model === 'custom' ? 'is-photo' : ''}">${model === 'custom' ? this._photoHero(st) : this._carSvg(st)}</div>
      ${tyresOff ? `<div class="hint" data-nav="${this._deviceId ? `/config/devices/device/${esc(this._deviceId)}` : '/config/integrations/integration/teslemetry'}">
        <ha-icon icon="mdi:car-tire-alert"></ha-icon><span>Turn on the <b>Tire pressure</b> sensors in Teslemetry to see tyre pressures</span><ha-icon icon="mdi:chevron-right"></ha-icon></div>` : ''}
      ${batteryHtml}
      ${climateHtml}
      ${actionsHtml}
      ${footHtml}
    </ha-card>`;
  }

  _actionButton(a) {
    const conf = this._confirm?.act === a;
    const btn = (key, icon, label, cls = '') => `<button class="act ${cls} ${conf ? 'confirm' : ''}" data-act="${a}" ${key && !this._s(key) ? 'disabled' : ''}>
      <ha-icon icon="${conf ? 'mdi:gesture-tap' : icon}"></ha-icon><span>${conf ? 'Tap again' : label}</span></button>`;
    switch (a) {
      case 'lock': {
        if (!this._ents.lock) return '';
        const l = this._v('lock') === 'locked';
        return btn('lock', l ? 'mdi:lock' : 'mdi:lock-open-variant', l ? 'Locked' : 'Unlocked', l ? '' : 'warn');
      }
      case 'climate': {
        if (!this._ents.climate) return '';
        const on = this._v('climate') && this._v('climate') !== 'off';
        return btn('climate', on ? 'mdi:fan' : 'mdi:fan-off', on ? 'Climate on' : 'Climate', on ? 'on spin' : '');
      }
      case 'frunk':
        if (!this._ents.frunk) return '';
        return btn('frunk', 'mdi:car-select', this._isOn('frunk') ? 'Frunk open' : 'Frunk', this._isOn('frunk') ? 'warn' : '');
      case 'trunk':
        if (!this._ents.trunk) return '';
        return btn('trunk', 'mdi:car-back', this._isOn('trunk') ? 'Trunk open' : 'Trunk', this._isOn('trunk') ? 'warn' : '');
      case 'charge_port':
        if (!this._ents.charge_port) return '';
        return btn('charge_port', 'mdi:ev-plug-type2', this._isOn('charge_port') ? 'Port open' : 'Charge port', this._isOn('charge_port') ? 'on' : '');
      case 'sentry':
        if (!this._ents.sentry) return '';
        return btn('sentry', this._isOn('sentry') ? 'mdi:cctv' : 'mdi:cctv-off', 'Sentry', this._isOn('sentry') ? 'danger' : '');
      case 'charge': {
        if (!this._ents.charge_switch) return '';
        const on = this._isOn('charge_switch');
        return btn('charge_switch', on ? 'mdi:stop-circle-outline' : 'mdi:ev-station', on ? 'Stop charge' : 'Charge', on ? 'ok' : '');
      }
      case 'vent':
        if (!this._ents.vent_windows) return '';
        return btn('vent_windows', 'mdi:window-shutter-open', this._isOn('vent_windows') ? 'Close vents' : 'Vent', this._isOn('vent_windows') ? 'on' : '');
      case 'defrost':
        if (!this._ents.defrost) return '';
        return btn('defrost', 'mdi:car-defrost-front', 'Defrost', this._isOn('defrost') ? 'on' : '');
      case 'flash':
        if (!this._ents.flash) return '';
        return btn('flash', 'mdi:car-light-high', 'Flash');
      case 'honk':
        if (!this._ents.honk) return '';
        return btn('honk', 'mdi:bullhorn-outline', 'Honk');
      case 'wake':
        if (!this._ents.wake) return '';
        return btn('wake', 'mdi:sleep-off', 'Wake');
      default:
        return '';
    }
  }

  /* ---------------- the car ---------------- */
  _modelKey() {
    const m = this._config.model;
    if (m === 'custom') return this._config.image ? 'custom' : 'model_3';
    if (m && m !== 'auto' && CAR_MODELS[m]) return m;
    if (this._config.image && (!m || m === 'auto')) return 'custom';
    const d = this._deviceId && this._hass.devices?.[this._deviceId];
    const s = `${d?.model || ''} ${d?.name || ''}`.toLowerCase();
    if (s.includes('cybertruck')) return 'cybertruck';
    if (/model\s*y\b/.test(s)) return 'model_y';
    if (/model\s*s\b/.test(s)) return 'model_s';
    if (/model\s*x\b/.test(s)) return 'model_x';
    return 'model_3';
  }

  _imageUrl() {
    let img = this._config.image;
    if (img && typeof img === 'object') img = img.media_content_id || img.url;
    if (!img) return null;
    if (!String(img).startsWith('media-source://')) return img;
    const cached = this._media?.[img];
    if (cached && cached.until > Date.now()) return cached.url;
    if (!this._resolving) {
      this._resolving = true;
      this._hass.callWS({ type: 'media_source/resolve_media', media_content_id: img })
        .then((r) => { this._media = { [img]: { url: r.url, until: Date.now() + 20 * 60000 } }; this._sig = ''; this._render(); })
        .catch(() => { /* leave the placeholder */ })
        .finally(() => { this._resolving = false; });
    }
    return cached?.url || null;
  }

  _photoHero(st) {
    const url = this._imageUrl();
    const chip = (key, icon, text, cls = '') => `<span class="pchip ${cls}" data-more="${key}"><ha-icon icon="${icon}"></ha-icon>${text}</span>`;
    const chips = [];
    // charging state already shows in the battery section
    if (!this._config.show_charging) {
      if (st.charging) chips.push(chip('charging', 'mdi:lightning-bolt', 'Charging', 'ok'));
      else if (st.cable) chips.push(chip('charge_cable', 'mdi:power-plug', 'Plugged in', 'acc'));
    }
    if (st.sentry) chips.push(chip('sentry', 'mdi:cctv', 'Sentry', 'danger'));
    if (st.climateOn) chips.push(chip('climate', 'mdi:fan', st.heating ? 'Heating' : 'Cooling', st.heating ? 'heat' : 'cool'));
    const openDoors = Object.entries(st.doors).filter(([, v]) => v).map(([k]) => k);
    if (openDoors.length) chips.push(chip('door_' + openDoors[0], 'mdi:car-door', openDoors.length > 1 ? `${openDoors.length} doors open` : 'Door open', 'warn'));
    const openWins = Object.entries(st.wins).filter(([, v]) => v).map(([k]) => k);
    if (openWins.length) chips.push(chip('win_' + openWins[0], 'mdi:window-open-variant', openWins.length > 1 ? `${openWins.length} windows open` : 'Window open', 'warn'));
    if (st.frunk) chips.push(chip('frunk', 'mdi:car-select', 'Frunk open', 'warn'));
    if (st.trunk) chips.push(chip('trunk', 'mdi:car-back', 'Trunk open', 'warn'));
    if (st.sunroof) chips.push(chip('sunroof', 'mdi:car-select', 'Sunroof open', 'warn'));
    if (st.port && !st.cable) chips.push(chip('charge_port', 'mdi:ev-plug-type2', 'Port open', 'acc'));

    const tyre = (k) => {
      const t = st.tyres[k];
      return `<span class="pt ${k} ${t.warn ? 'warn' : ''} ${t.missing ? 'missing' : ''}" data-more="tpms_${k}"><small>${k.toUpperCase()}</small><b>${esc(t.text)}</b></span>`;
    };
    const tyrePanel = st.tyres.fl ? `
      <div class="ptyres">
        ${tyre('fl')}
        <svg class="pt-car" viewBox="0 0 44 76" aria-hidden="true">
          <rect x="2" y="12" width="7" height="14" rx="2.5" class="${st.tyres.fl.warn ? 'w' : ''}"/><rect x="35" y="12" width="7" height="14" rx="2.5" class="${st.tyres.fr.warn ? 'w' : ''}"/>
          <rect x="2" y="50" width="7" height="14" rx="2.5" class="${st.tyres.rl.warn ? 'w' : ''}"/><rect x="35" y="50" width="7" height="14" rx="2.5" class="${st.tyres.rr.warn ? 'w' : ''}"/>
          <path d="M22 2 C33 2 38 7 38 16 L38 62 C38 70 33 74 22 74 C11 74 6 70 6 62 L6 16 C6 7 11 2 22 2 Z" class="body"/>
          <path d="M12 22 C16 19 28 19 32 22 L31 50 C27 52 17 52 13 50 Z" class="glass"/>
        </svg>
        ${tyre('fr')}${tyre('rl')}${tyre('rr')}
      </div>` : '';
    const h = Number(this._config.image_height) || 190;
    return `
      <div class="photo ${st.charging ? 'charging' : ''} ${st.sentry ? 'sentry' : ''}" style="--ph:${h}px">
        ${url ? `<img src="${esc(url)}" alt="" draggable="false">` : `<div class="ph-empty"><ha-icon icon="mdi:image-outline"></ha-icon></div>`}
      </div>
      ${chips.length ? `<div class="pchips">${chips.join('')}</div>` : ''}
      ${tyrePanel}`;
  }

  _carSvg(st) {
    const G = CAR_MODELS[st.model] || CAR_MODELS.model_3;
    const id = this._uid;
    const c = st.paint;
    const light = luminance(c) > 0.6;
    const hi = shade(c, light ? 0.35 : 0.22);
    const lo = shade(c, light ? -0.22 : -0.45);
    const edge = shade(c, light ? -0.3 : 0.12);
    const acc = st.accent;
    const climateCol = st.heating ? '#ff8a3d' : '#4fb3ff';
    const portCol = st.charging || st.complete ? '#35d07f' : st.port || st.cable ? '#4da3ff' : lo;
    const both = (d, attrs) => `<path d="${d}" ${attrs}/><path d="${flipY(d)}" ${attrs}/>`;

    // Car faces right → car's left side is the TOP of the drawing.
    const sideDoor = (pos, side) => (side === 'top'
      ? (pos === 'f' ? (st.rhd ? 'fp' : 'fd') : (st.rhd ? 'rp' : 'rd'))
      : (pos === 'f' ? (st.rhd ? 'fd' : 'fp') : (st.rhd ? 'rd' : 'rp')));

    const door = (pos, side) => {
      const d = G.doors[pos];
      if (!Array.isArray(d)) return '';
      const which = sideDoor(pos, side);
      const open = st.doors[which];
      const [x, hx] = d;
      const y = side === 'top' ? G.doors.y : 220 - G.doors.y - 7;
      const hy = side === 'top' ? G.doors.y + 3.5 : 220 - G.doors.y - 3.5;
      const ang = side === 'top' ? 36 : -36;
      return `
        ${open ? `<line x1="${x + 2}" y1="${hy}" x2="${hx - 2}" y2="${hy}" stroke="${acc}" stroke-width="3" stroke-linecap="round" class="glow"/>` : ''}
        <g class="door ${open ? 'open' : ''}" data-more="door_${which}" style="transform-origin:${hx}px ${hy}px;transform:rotate(${open ? ang : 0}deg)">
          <rect x="${x}" y="${y}" width="${hx - x}" height="7" rx="3.5" fill="${open ? hi : 'transparent'}" stroke="${open ? acc : 'transparent'}" stroke-width="1.4"/>
        </g>`;
    };

    const falcon = (side) => {
      if (G.doors.r !== 'falcon') return '';
      const which = sideDoor('r', side);
      const open = st.doors[which];
      const winOpen = st.wins[which];
      const P = side === 'top' ? G.falcon.panel : flipY(G.falcon.panel);
      const W = side === 'top' ? G.falcon.win : flipY(G.falcon.win);
      const dy = side === 'top' ? -30 : 30;
      return `<g class="door ${open ? 'open' : ''}" data-more="door_${which}" style="transform:translate(0px,${open ? dy : 0}px)">
          <path d="${P}" fill="url(#${id}b)" stroke="${open ? acc : edge}" stroke-opacity="${open ? 1 : 0.5}" stroke-width="${open ? 1.6 : 0.8}"/>
          <path d="${W}" fill="#0b1018" fill-opacity="0.85" stroke="${winOpen ? acc : 'none'}" stroke-width="2"/>
        </g>`;
    };

    const seams = () => {
      const xs = [];
      for (const k of ['f', 'r']) if (Array.isArray(G.doors[k])) xs.push(...G.doors[k]);
      const y = G.doors.y + 4;
      return [...new Set(xs)].map((x) => both(`M${x} ${y} L${x + 1} ${y + 12}`, '')).join('');
    };

    const winLine = (pos, side) => {
      const w = G.wins[pos];
      if (!w) return '';
      const which = sideDoor(pos, side);
      if (!st.wins[which]) return '';
      const y = side === 'top' ? w[2] : 220 - w[2];
      return `<line x1="${w[0]}" y1="${y}" x2="${w[1]}" y2="${y}" stroke="${acc}" stroke-width="3" stroke-linecap="round" class="glow"/>`;
    };

    const wheel = (x, y) => `<rect x="${x - 25}" y="${y - 9}" width="50" height="18" rx="7" fill="#101114"/>
      <rect x="${x - 20}" y="${y - 6}" width="40" height="12" rx="5" fill="none" stroke="#2a2c31" stroke-width="1.5"/>`;
    const label = (k, x, ly) => {
      const t = st.tyres[k];
      if (!t) return '';
      const w = Math.max(44, t.text.length * 6.6 + 14);
      return `<g class="tyre ${t.warn ? 'warn' : ''} ${t.missing ? 'missing' : ''}" data-more="tpms_${k}">
        <rect x="${x - w / 2}" y="${ly - 10}" width="${w}" height="20" rx="10"/>
        <text x="${x}" y="${ly + 4}" text-anchor="middle">${esc(t.text)}</text></g>`;
    };
    const [fx, fy] = G.wheels.f;
    const [rx, ry] = G.wheels.r;

    const S = G.seats;
    const driverY = st.rhd ? 130 : 90;
    const seats = `
      <g fill="#2c333e" opacity="0.9">
        <rect x="${S.f}" y="78" width="27" height="24" rx="7"/><rect x="${S.f}" y="118" width="27" height="24" rx="7"/>
        <rect x="${S.f - 7}" y="80" width="7" height="20" rx="3"/><rect x="${S.f - 7}" y="120" width="7" height="20" rx="3"/>
        <rect x="${S.r}" y="78" width="30" height="64" rx="9"/><rect x="${S.r - 8}" y="80" width="8" height="60" rx="3"/>
        ${S.third ? `<rect x="${S.third}" y="82" width="20" height="56" rx="7"/>` : ''}
      </g>
      <g stroke="#1b2028" stroke-width="1.2"><line x1="${S.r + 1}" y1="99" x2="${S.r + 29}" y2="99"/><line x1="${S.r + 1}" y1="121" x2="${S.r + 29}" y2="121"/></g>
      <rect x="${S.dash}" y="96" width="10" height="28" rx="3" fill="#20262f"/>
      <ellipse cx="${S.steer}" cy="${driverY}" rx="3" ry="11" fill="none" stroke="#596170" stroke-width="2.4"/>`;

    // lights
    const headCol = st.flash ? '#fffbe6' : '#e9eef5';
    const headW = st.flash ? 4 : 2.6;
    const glowF = st.flash ? `filter="url(#${id}glow)"` : '';
    const heads = G.headBar
      ? `<path d="${G.headBar}" stroke="${headCol}" stroke-width="${headW}" stroke-linecap="round" fill="none" ${glowF}/>`
      : both(G.head, `stroke="${headCol}" stroke-width="${headW}" stroke-linecap="round" fill="none" ${glowF}`);
    const tails = G.tailBar
      ? `<path d="${G.tailBar}" stroke="#d3242c" stroke-width="2.6" stroke-linecap="round" fill="none" ${st.flash ? `class="blink" ${glowF}` : ''}/>`
      : both(G.tail, `stroke="#d3242c" stroke-width="2.6" stroke-linecap="round" fill="none" ${st.flash ? `class="blink" ${glowF}` : ''}`);
    const bx = G.beam;
    const beams = !st.flash ? '' : G.headBar
      ? `<g class="beam"><polygon points="${bx},92 420,56 420,164 ${bx},128" fill="url(#${id}beam)"/></g>`
      : `<g class="beam"><polygon points="${bx},82 420,54 420,112 ${bx + 5},100" fill="url(#${id}beam)"/><polygon points="${bx},138 420,166 420,108 ${bx + 5},120" fill="url(#${id}beam)"/></g>`;

    // charge port + cable
    const [px, py, pside] = G.port;
    const pyTop = pside === 'top' ? py : 220 - py;
    let cablePath = `M${px} ${pyTop} C${px - 8} ${pyTop - 19} 60 30 0 28`;
    let flowPath = `M0 28 C60 30 ${px - 8} ${pyTop - 19} ${px} ${pyTop}`;
    if (pside !== 'top') { cablePath = flipY(cablePath); flowPath = flipY(flowPath); }
    const cable = !st.cable ? '' : `<path d="${cablePath}" stroke="#0d0e11" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="${cablePath}" stroke="#3a3d44" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      ${st.charging ? `<path class="flow" d="${flowPath}" stroke="#35d07f" stroke-width="2.4" fill="none" stroke-linecap="round" filter="url(#${id}glow)"/>` : ''}`;
    const port = `<rect x="${px - 7}" y="${py - 3.5}" width="14" height="7" rx="2.5" fill="${portCol}" data-more="charge_port"
      class="${st.charging ? 'pulse' : ''}" ${st.port || st.cable ? `filter="url(#${id}glow)"` : ''} transform="rotate(${pside === 'top' ? -8 : 8} ${px} ${py})"/>`;

    const lid = (key, d, open) => `<path class="lid" data-more="${key}" d="${d}" fill="${open ? acc : 'transparent'}" fill-opacity="0.22"
      stroke="${open ? acc : lo}" stroke-opacity="${open ? 1 : 0.55}" stroke-width="${open ? 1.6 : 0.9}"/>`;

    return `
<svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(G.label)} status">
  <defs>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${lo}"/><stop offset="0.18" stop-color="${c}"/><stop offset="0.48" stop-color="${hi}"/>
      <stop offset="0.52" stop-color="${hi}"/><stop offset="0.82" stop-color="${c}"/><stop offset="1" stop-color="${lo}"/>
    </linearGradient>
    <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1c2738"/><stop offset="1" stop-color="#070b12"/></linearGradient>
    <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="${id}c" cx="0.55" cy="0.5" r="0.6"><stop offset="0" stop-color="${climateCol}" stop-opacity="0.75"/><stop offset="1" stop-color="${climateCol}" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffbe6" stop-opacity="0.9"/><stop offset="1" stop-color="#fffbe6" stop-opacity="0"/></linearGradient>
    <filter id="${id}blur" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="${id}glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="${id}glass"><path d="${G.glass}"/></clipPath>
  </defs>

  ${st.driving ? `<g class="road"><line x1="0" y1="6" x2="420" y2="6"/><line x1="0" y1="214" x2="420" y2="214"/></g>` : ''}
  ${st.sentry ? `<ellipse class="sentry" cx="216" cy="110" rx="182" ry="100" fill="none" stroke="#e5484d" stroke-width="1.6"/>` : ''}
  <ellipse cx="216" cy="114" rx="156" ry="68" fill="#000" opacity="0.38" filter="url(#${id}blur)"/>

  ${wheel(fx, fy)}${wheel(rx, ry)}${wheel(fx, 220 - fy)}${wheel(rx, 220 - ry)}
  <ellipse cx="${G.mirror[0]}" cy="${G.mirror[1]}" rx="10" ry="5" fill="${c}" stroke="${edge}" stroke-width="0.8" transform="rotate(-12 ${G.mirror[0]} ${G.mirror[1]})"/>
  <ellipse cx="${G.mirror[0]}" cy="${220 - G.mirror[1]}" rx="10" ry="5" fill="${c}" stroke="${edge}" stroke-width="0.8" transform="rotate(12 ${G.mirror[0]} ${220 - G.mirror[1]})"/>

  <path d="${G.body}" fill="url(#${id}b)" stroke="${edge}" stroke-opacity="0.55" stroke-width="1" stroke-linejoin="round"/>
  <path d="${G.shoulder}" stroke="#fff" stroke-opacity="0.18" stroke-width="2" stroke-linecap="round"/>
  <path d="${flipY(G.shoulder)}" stroke="#000" stroke-opacity="0.18" stroke-width="2" stroke-linecap="round"/>
  <g stroke="${lo}" stroke-width="1" opacity="0.7">${seams()}</g>

  ${lid('frunk', G.frunk, st.frunk)}
  ${lid('trunk', G.trunk, st.trunk)}
  ${G.extra ? G.extra(lo) : ''}

  <path d="${G.glass}" fill="url(#${id}g)"/>
  <g clip-path="url(#${id}glass)">
    ${seats}
    ${st.climateOn ? `<rect class="cabin-glow" x="100" y="60" width="210" height="100" fill="url(#${id}c)"/>
      <g class="air" stroke="${climateCol}" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(${S.dash + 26 - 262} 0)">
        <path d="M262 92 q-8 -4 -16 0 t-16 0"/><path d="M262 110 q-8 -4 -16 0 t-16 0"/><path d="M262 128 q-8 -4 -16 0 t-16 0"/>
      </g>` : ''}
    <path d="M110 150 L262 58 L282 58 L130 160 Z" fill="url(#${id}r)" opacity="${st.sunroof ? 0.15 : 0.45}"/>
    ${st.sunroof ? `<rect x="${S.r + 10}" y="80" width="56" height="60" rx="6" fill="none" stroke="${acc}" stroke-width="1.6" class="glow"/>` : ''}
  </g>
  <path d="${G.glass}" fill="none" stroke="#000" stroke-opacity="0.5" stroke-width="1.2" stroke-linejoin="round"/>
  ${G.pillar ? `<line x1="${G.pillar[0]}" y1="${G.pillar[1]}" x2="${G.pillar[0]}" y2="${220 - G.pillar[1]}" stroke="${c}" stroke-opacity="0.55" stroke-width="1.4"/>` : ''}
  ${falcon('top')}${falcon('bot')}
  ${winLine('f', 'top')}${winLine('r', 'top')}${winLine('f', 'bot')}${winLine('r', 'bot')}
  ${door('f', 'top')}${door('r', 'top')}${door('f', 'bot')}${door('r', 'bot')}

  ${beams}${heads}${tails}
  ${cable}${port}

  ${label('fl', fx, 25)}${label('rl', rx, 25)}${label('fr', fx, 195)}${label('rr', rx, 195)}
</svg>`;
  }
  _style(accent, accRgb) {
    const sc = this._scheme();
    const onAcc = luminance(accent) > 0.62 ? '#111' : '#fff';
    const vars = sc.bg
      ? `--tc-fg:${sc.fg}; --tc-fg2:${sc.fg2}; --tc-tint:${sc.tint}; --primary-text-color:${sc.fg}; --secondary-text-color:${sc.fg2};`
      : '--tc-fg:var(--primary-text-color); --tc-fg2:var(--secondary-text-color); --tc-tint:127,127,127;';
    const card = sc.bg ? `background:${sc.bg}; color:${sc.fg}; ${sc.extra || ''}` : '';
    return `<style>
    :host { display:block; --tc-accent:${accent}; --tc-acc-rgb:${accRgb}; --tc-on-acc:${onAcc}; ${vars} }
    ha-card { display:block; position:relative; overflow:hidden; padding:16px 16px 14px; box-sizing:border-box; ${card} }
    .clickable { cursor:pointer; }
    .head { display:flex; align-items:center; gap:10px; }
    .title { flex:1; min-width:0; }
    .name { font-size:1.35em; font-weight:600; letter-spacing:.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--tc-fg); }
    .sub { display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-top:2px; font-size:.86em; color:var(--tc-fg2); }
    .sep { opacity:.5; }
    .dot { width:8px; height:8px; border-radius:50%; background:#8b9098; display:inline-block; margin-right:2px; }
    .dot.on { background:#35d07f; box-shadow:0 0 0 3px rgba(53,208,127,.18); }
    button { font:inherit; color:inherit; -webkit-tap-highlight-color:transparent; }
    .lockbtn { width:46px; height:46px; flex:none; border-radius:15px; border:none; cursor:pointer; display:grid; place-items:center;
      background:rgba(var(--tc-tint),.13); color:var(--tc-fg); transition:background .25s, transform .15s; --mdc-icon-size:24px; }
    .lockbtn.unlocked { background:rgba(245,165,36,.18); color:#f5a524; }
    .lockbtn:active, .act:active, .tbtn:active, .power:active, .chip:active { transform:scale(.94); }
    .chip { display:flex; align-items:center; gap:4px; border:none; border-radius:999px; padding:6px 12px 6px 8px; cursor:pointer;
      background:rgba(var(--tc-acc-rgb),.16); color:var(--tc-accent); font-size:.82em; font-weight:500; --mdc-icon-size:18px; }
    .confirm { background:#e5484d !important; color:#fff !important; animation:tcPulse 1s ease-in-out infinite; }

    .stage { position:relative; margin:4px -10px 0; background:radial-gradient(55% 62% at 52% 52%, rgba(var(--tc-acc-rgb),.16), transparent 72%); }
    .stage svg { display:block; width:100%; height:auto; overflow:visible; }
    .stage [data-more] { cursor:pointer; }
    .photo { position:relative; height:var(--ph); margin:6px 10px 0; display:flex; align-items:center; justify-content:center; }
    .photo::after { content:''; position:absolute; left:12%; right:12%; bottom:2px; height:18px; border-radius:50%;
      background:radial-gradient(closest-side, rgba(0,0,0,.45), transparent); z-index:0; }
    .photo.charging::after { background:radial-gradient(closest-side, rgba(53,208,127,.55), transparent); animation:tcBreath 2s ease-in-out infinite; }
    .photo.sentry { box-shadow:inset 0 0 0 1.5px rgba(229,72,77,.55); border-radius:18px; animation:tcBlink 2.4s ease-in-out infinite; }
    .photo img { position:relative; z-index:1; max-width:100%; max-height:100%; object-fit:contain; user-select:none; filter:drop-shadow(0 10px 14px rgba(0,0,0,.3)); }
    .ph-empty { display:grid; place-items:center; width:100%; height:100%; border-radius:16px; border:1.5px dashed rgba(var(--tc-tint),.35);
      color:var(--tc-fg2); --mdc-icon-size:40px; }
    .ptyres { display:grid; grid-template-columns:1fr auto 1fr; grid-template-rows:auto auto; align-items:center; gap:6px 12px;
      max-width:300px; margin:8px auto 14px; }
    .ptyres .pt-car { grid-column:2; grid-row:1 / span 2; width:34px; height:58px; }
    .pt-car rect { fill:#2a2c31; } .pt-car rect.w { fill:#e5484d; }
    .pt-car .body { fill:rgba(var(--tc-tint),.28); stroke:rgba(var(--tc-tint),.45); stroke-width:1; } .pt-car .glass { fill:rgba(0,0,0,.35); }
    .pt { display:flex; flex-direction:column; line-height:1.15; padding:5px 10px; border-radius:12px; background:rgba(var(--tc-tint),.1); cursor:pointer; }
    .pt.fl, .pt.rl { text-align:right; align-items:flex-end; } .pt.fr, .pt.rr { align-items:flex-start; }
    .pt.fl { grid-column:1; grid-row:1; } .pt.fr { grid-column:3; grid-row:1; } .pt.rl { grid-column:1; grid-row:2; } .pt.rr { grid-column:3; grid-row:2; }
    .pt small { font-size:.68em; font-weight:600; letter-spacing:.6px; color:var(--tc-fg2); }
    .pt b { font-size:.92em; font-weight:600; color:var(--tc-fg); }
    .pt.warn { background:rgba(229,72,77,.16); } .pt.warn b, .pt.warn small { color:#e5484d; }
    .pt.missing b { color:var(--tc-fg2); font-weight:400; }
    .tyre.missing text { fill:var(--tc-fg2); } .tyre.missing rect { fill:rgba(var(--tc-tint),.08); }
    .hint { display:flex; align-items:center; gap:8px; margin:6px 0 2px; padding:8px 10px; border-radius:12px; cursor:pointer;
      background:rgba(var(--tc-acc-rgb),.1); color:var(--tc-fg2); font-size:.8em; --mdc-icon-size:18px; }
    .hint ha-icon:first-child { color:var(--tc-accent); } .hint span { flex:1; } .hint b { color:var(--tc-fg); font-weight:500; }
    .pchips { display:flex; flex-wrap:wrap; justify-content:center; gap:6px; margin:8px 10px 6px; }
    .pchip { display:inline-flex; align-items:center; gap:4px; padding:4px 10px 4px 7px; border-radius:999px; font-size:.78em; font-weight:500; cursor:pointer;
      background:rgba(var(--tc-tint),.13); color:var(--tc-fg2); --mdc-icon-size:16px; }
    .pchip.ok { background:rgba(53,208,127,.15); color:#2fbf73; } .pchip.acc { background:rgba(var(--tc-acc-rgb),.16); color:var(--tc-accent); }
    .pchip.warn { background:rgba(245,165,36,.17); color:#f5a524; } .pchip.danger { background:rgba(229,72,77,.15); color:#e5484d; }
    .pchip.heat { background:rgba(255,138,61,.16); color:#ff8a3d; } .pchip.cool { background:rgba(79,179,255,.16); color:#4fb3ff; }
    .door { transition:transform .6s cubic-bezier(.3,1.4,.5,1); }
    .glow { filter:drop-shadow(0 0 3px var(--tc-accent)); }
    .tyre rect { fill:rgba(var(--tc-tint),.16); stroke:rgba(var(--tc-tint),.25); stroke-width:.8; }
    .tyre text { fill:var(--tc-fg); font-size:11px; font-weight:500; font-family:inherit; }
    .tyre.warn rect { fill:rgba(229,72,77,.22); stroke:#e5484d; }
    .tyre.warn text { fill:#e5484d; }
    .flow { stroke-dasharray:6 10; animation:tcFlow .7s linear infinite; }
    .pulse { animation:tcBlink 1.6s ease-in-out infinite; }
    .blink { animation:tcBlink .5s ease-in-out 4; }
    .beam { animation:tcBeam .5s ease-in-out 4; }
    .sentry { stroke-dasharray:3 9; opacity:.75; animation:tcFlow 3s linear infinite, tcBlink 2.4s ease-in-out infinite; }
    .cabin-glow { animation:tcBreath 3s ease-in-out infinite; }
    .air path { stroke-dasharray:4 6; animation:tcFlowRev 1.2s linear infinite; opacity:.85; }
    .road line { stroke:rgba(var(--tc-tint),.35); stroke-width:2; stroke-dasharray:22 18; animation:tcRoad .5s linear infinite; }

    .battery { margin-top:4px; }
    .bat-head { display:flex; align-items:flex-end; gap:16px; }
    .soc { font-size:2.5em; font-weight:300; line-height:1; color:var(--tc-fg); letter-spacing:-1px; }
    .soc span { font-size:.45em; color:var(--tc-fg2); margin-left:2px; letter-spacing:0; }
    .range { display:flex; flex-direction:column; color:var(--tc-fg2); font-size:.95em; line-height:1.15; padding-bottom:2px; }
    .range b { color:var(--tc-fg); font-weight:600; font-size:1.15em; }
    .range small { font-size:.75em; text-transform:uppercase; letter-spacing:.6px; opacity:.75; }
    .cstate { margin-left:auto; display:flex; align-items:center; gap:4px; padding:5px 10px 5px 7px; border-radius:999px; font-size:.82em; font-weight:500;
      background:rgba(var(--tc-tint),.13); color:var(--tc-fg2); --mdc-icon-size:17px; cursor:pointer; }
    .cstate.charging, .cstate.complete { background:rgba(53,208,127,.15); color:#2fbf73; }
    .bar { position:relative; height:10px; margin-top:12px; border-radius:6px; background:rgba(var(--tc-tint),.18); }
    .fill { position:absolute; left:0; top:0; bottom:0; border-radius:6px; transition:width .8s ease;
      background:linear-gradient(90deg, color-mix(in srgb, var(--fill) 70%, #000) 0%, var(--fill) 100%); background-color:var(--fill);
      box-shadow:0 0 12px -2px var(--fill); }
    .fill.charging { background-image:repeating-linear-gradient(-45deg, rgba(255,255,255,.28) 0 7px, transparent 7px 14px), linear-gradient(90deg, var(--fill), var(--fill));
      background-size:19.8px 19.8px, 100% 100%; animation:tcStripes .8s linear infinite; }
    .limit { position:absolute; top:-4px; bottom:-4px; width:3px; margin-left:-1.5px; border-radius:2px; background:var(--tc-fg); opacity:.55; }
    .stats { display:flex; flex-wrap:wrap; gap:6px 14px; margin-top:10px; font-size:.84em; color:var(--tc-fg2); }
    .stats span, .foot span { display:inline-flex; align-items:center; gap:4px; --mdc-icon-size:16px; }
    .stats ha-icon { color:#2fbf73; }
    .limit-row { display:flex; align-items:center; gap:8px; margin-top:10px; font-size:.86em; color:var(--tc-fg2); --mdc-icon-size:18px; }
    .limit-row span { white-space:nowrap; }
    .limit-row input { flex:1; min-width:60px; accent-color:var(--tc-accent); height:20px; }
    .limit-row b { min-width:44px; text-align:right; color:var(--tc-fg); font-weight:600; }

    .climate { display:flex; align-items:center; gap:16px; margin-top:14px; padding:10px 10px 10px 14px; border-radius:16px;
      background:rgba(var(--tc-tint),.08); transition:background .4s; }
    .climate.heat { background:linear-gradient(90deg, rgba(255,138,61,.14), rgba(var(--tc-tint),.06)); }
    .climate.cool { background:linear-gradient(90deg, rgba(79,179,255,.14), rgba(var(--tc-tint),.06)); }
    .temp { display:flex; flex-direction:column; line-height:1.2; }
    .temp small, .tval small { font-size:.72em; text-transform:uppercase; letter-spacing:.6px; color:var(--tc-fg2); }
    .temp b { font-size:1.08em; font-weight:600; color:var(--tc-fg); }
    .target { margin-left:auto; display:flex; align-items:center; gap:6px; }
    .tval { display:flex; flex-direction:column; align-items:center; min-width:52px; line-height:1.15; }
    .tval b { font-size:1.25em; font-weight:600; color:var(--tc-fg); }
    .climate.heat .tval small { color:#ff8a3d; } .climate.cool .tval small { color:#4fb3ff; }
    .tbtn, .power { width:34px; height:34px; border-radius:50%; border:none; cursor:pointer; display:grid; place-items:center;
      background:rgba(var(--tc-tint),.14); color:var(--tc-fg); --mdc-icon-size:18px; transition:transform .15s, background .25s; }
    .tbtn:disabled { opacity:.35; cursor:default; }
    .power.on { background:var(--tc-accent); color:var(--tc-on-acc); box-shadow:0 0 14px -2px var(--tc-accent); }

    .actions { display:grid; grid-template-columns:repeat(auto-fill, minmax(64px, 1fr)); gap:8px; margin-top:14px; }
    .act { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; min-height:62px; padding:8px 4px; border:none;
      border-radius:16px; cursor:pointer; background:rgba(var(--tc-tint),.1); color:var(--tc-fg); font-size:.72em; line-height:1.1;
      --mdc-icon-size:22px; transition:background .25s, color .25s, transform .15s; text-align:center; }
    .act span { opacity:.9; }
    .act:hover { background:rgba(var(--tc-tint),.17); }
    .act.on { background:rgba(var(--tc-acc-rgb),.17); color:var(--tc-accent); }
    .act.ok { background:rgba(53,208,127,.16); color:#2fbf73; }
    .act.warn { background:rgba(245,165,36,.17); color:#f5a524; }
    .act.danger { background:rgba(229,72,77,.15); color:#e5484d; }
    .act.spin ha-icon { animation:tcSpin 2.4s linear infinite; }
    .act:disabled { opacity:.35; cursor:default; }

    .foot { display:flex; flex-wrap:wrap; gap:6px 16px; margin-top:12px; font-size:.8em; color:var(--tc-fg2); }
    .foot .upd { color:var(--tc-accent); font-weight:500; }
    .empty { display:flex; gap:14px; align-items:center; padding:8px; color:var(--tc-fg2); --mdc-icon-size:36px; }
    .empty code { font-size:.9em; }

    @keyframes tcFlow { to { stroke-dashoffset:-16; } }
    @keyframes tcFlowRev { to { stroke-dashoffset:20; } }
    @keyframes tcRoad { to { stroke-dashoffset:40; } }
    @keyframes tcBlink { 0%,100% { opacity:1; } 50% { opacity:.35; } }
    @keyframes tcBeam { 0%,100% { opacity:0; } 50% { opacity:1; } }
    @keyframes tcBreath { 0%,100% { opacity:.55; } 50% { opacity:1; } }
    @keyframes tcStripes { to { background-position:19.8px 0, 0 0; } }
    @keyframes tcSpin { to { transform:rotate(360deg); } }
    @keyframes tcPulse { 0%,100% { box-shadow:0 0 0 0 rgba(229,72,77,.5); } 50% { box-shadow:0 0 0 6px rgba(229,72,77,0); } }
    @media (prefers-reduced-motion: reduce) { * { animation:none !important; transition:none !important; } }
    </style>`;
  }

  /* ---------------- interaction ---------------- */
  _more(key) {
    const entityId = this._ents[key] || key;
    if (!this._hass.states[entityId]) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }));
  }

  _call(domain, service, key, data = {}) {
    const entity_id = this._ents[key];
    if (!entity_id) return;
    return this._hass.callService(domain, service, { entity_id, ...data });
  }

  _needsConfirm(act) {
    if (!this._config.confirm_actions) return false;
    if (this._confirm?.act === act && Date.now() < this._confirm.until) { this._clearConfirm(); return false; }
    this._confirm = { act, until: Date.now() + 4000 };
    clearTimeout(this._confirmT);
    this._confirmT = setTimeout(() => this._clearConfirm(true), 4000);
    this._sig = ''; this._render();
    return true;
  }

  _clearConfirm(render) {
    this._confirm = null;
    clearTimeout(this._confirmT);
    if (render) { this._sig = ''; this._render(); }
  }

  _onClick(e) {
    const path = e.composedPath();
    const actEl = path.find((n) => n.dataset?.act);
    const tempEl = path.find((n) => n.dataset?.temp);
    const moreEl = path.find((n) => n.dataset?.more || n.getAttribute?.('data-more'));
    const navEl = path.find((n) => n.dataset?.nav);
    if (navEl) {
      history.pushState(null, '', navEl.dataset.nav);
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
      return;
    }
    if (actEl) { if (!actEl.disabled) this._doAction(actEl.dataset.act); return; }
    if (tempEl) { if (!tempEl.disabled) this._bumpTemp(parseFloat(tempEl.dataset.temp)); return; }
    if (moreEl) this._more(moreEl.dataset?.more || moreEl.getAttribute('data-more'));
  }

  _doAction(a) {
    const isOn = (k) => this._isOn(k);
    switch (a) {
      case 'lock':
        if (this._v('lock') === 'locked') {
          if (CONFIRM_ACTIONS.includes('unlock') && this._needsConfirm('lock')) return;
          this._call('lock', 'unlock', 'lock');
        } else this._call('lock', 'lock', 'lock');
        break;
      case 'climate': {
        const on = this._v('climate') && this._v('climate') !== 'off';
        this._call('climate', on ? 'turn_off' : 'turn_on', 'climate');
        break;
      }
      case 'frunk': {
        if (isOn('frunk')) {
          const sf = this._s('frunk')?.attributes?.supported_features || 0;
          if (sf & 2) this._call('cover', 'close_cover', 'frunk'); else this._more('frunk');
          return;
        }
        if (this._needsConfirm('frunk')) return;
        this._call('cover', 'open_cover', 'frunk');
        break;
      }
      case 'trunk':
        if (isOn('trunk')) { this._call('cover', 'close_cover', 'trunk'); break; }
        if (this._needsConfirm('trunk')) return;
        this._call('cover', 'open_cover', 'trunk');
        break;
      case 'charge_port':
        this._call('cover', isOn('charge_port') ? 'close_cover' : 'open_cover', 'charge_port');
        break;
      case 'vent':
        this._call('cover', isOn('vent_windows') ? 'close_cover' : 'open_cover', 'vent_windows');
        break;
      case 'sentry':
        this._call('switch', 'toggle', 'sentry');
        break;
      case 'charge':
        this._call('switch', 'toggle', 'charge_switch');
        break;
      case 'defrost':
        this._call('switch', 'toggle', 'defrost');
        break;
      case 'flash':
        this._call('button', 'press', 'flash');
        this._flashUntil = Date.now() + 2200;
        this._sig = ''; this._render();
        setTimeout(() => { this._sig = ''; this._render(); }, 2300);
        break;
      case 'honk':
        this._call('button', 'press', 'honk');
        break;
      case 'wake':
        this._call('button', 'press', 'wake');
        break;
      default:
    }
  }

  _bumpTemp(delta) {
    const cl = this._s('climate');
    if (!cl) return;
    const a = cl.attributes;
    const cur = this._pendingTemp ?? a.temperature ?? 20;
    const next = Math.min(a.max_temp ?? 28, Math.max(a.min_temp ?? 15, Math.round((cur + delta) * 10) / 10));
    this._pendingTemp = next;
    this._sig = ''; this._render();
    clearTimeout(this._tempT);
    this._tempT = setTimeout(async () => {
      try { await this._call('climate', 'set_temperature', 'climate', { temperature: next }); } finally {
        setTimeout(() => { this._pendingTemp = null; this._sig = ''; if (this._hass) this.hass = this._hass; }, 4000);
      }
    }, 900);
  }

  _onInput(e) {
    const t = e.target;
    if (!t.dataset?.num) return;
    const out = this.shadowRoot.querySelector(`[data-out="${t.dataset.num}"]`);
    if (out) out.textContent = t.dataset.num === 'charge_current' ? `${t.value} A` : `${t.value}%`;
    if (t.dataset.num === 'charge_limit') {
      const lim = this.shadowRoot.querySelector('.limit');
      if (lim) lim.style.left = `${t.value}%`;
    }
  }

  _onChange(e) {
    const t = e.target;
    if (!t.dataset?.num) return;
    this._dragging = false;
    this._call('number', 'set_value', t.dataset.num, { value: Number(t.value) });
  }
}

/* ------------------------------------------------------------------ */
/* Visual editor                                                      */
/* ------------------------------------------------------------------ */
const ACTION_LABELS = {
  lock: 'Lock / unlock', climate: 'Climate', frunk: 'Frunk', trunk: 'Trunk', charge_port: 'Charge port',
  sentry: 'Sentry mode', charge: 'Start / stop charging', vent: 'Vent windows', defrost: 'Defrost',
  flash: 'Flash lights', honk: 'Honk horn', wake: 'Wake',
};

const MODEL_OPTIONS = [
  { value: 'auto', label: 'Automatic (from vehicle)' },
  ...MODEL_KEYS.map((k) => ({ value: k, label: CAR_MODELS[k].label })),
  { value: 'custom', label: 'Custom picture' },
];

const editorSchema = (data) => [
  { name: 'device_id', selector: { device: { filter: { integration: 'teslemetry' } } } },
  { name: 'name', selector: { text: {} } },
  { name: 'model', selector: { select: { mode: 'dropdown', options: MODEL_OPTIONS } } },
  { name: 'color_scheme', selector: { select: { mode: 'dropdown', options: Object.entries(SCHEMES).map(([value, v]) => ({ value, label: v.label })) } } },
  ...(data.model === 'custom' ? [
    { name: 'image', selector: { text: {} } },
    { name: 'image_height', selector: { number: { min: 100, max: 400, step: 10, mode: 'slider', unit_of_measurement: 'px' } } },
  ] : [
    {
      type: 'grid', name: '', schema: [
        { name: 'car_color', selector: { text: {} } },
        { name: 'drive_side', selector: { select: { mode: 'dropdown', options: [
          { value: 'auto', label: 'Automatic' }, { value: 'lhd', label: 'Left-hand drive' }, { value: 'rhd', label: 'Right-hand drive' },
        ] } } },
      ],
    },
  ]),
  { name: 'accent_color', selector: { text: {} } },
  {
    type: 'expandable', name: 'display', title: 'Sections', flatten: true, schema: [
      { type: 'grid', name: '', schema: [
        { name: 'show_tyres', selector: { boolean: {} } },
        { name: 'show_charging', selector: { boolean: {} } },
        { name: 'show_charge_limit', selector: { boolean: {} } },
        { name: 'show_charge_current', selector: { boolean: {} } },
        { name: 'show_climate', selector: { boolean: {} } },
        { name: 'show_actions', selector: { boolean: {} } },
        { name: 'show_footer', selector: { boolean: {} } },
        { name: 'confirm_actions', selector: { boolean: {} } },
      ] },
    ],
  },
  {
    type: 'expandable', name: 'buttons', title: 'Buttons', flatten: true, schema: [
      { name: 'actions', selector: { select: { multiple: true, mode: 'list', options: ACTIONS.map((a) => ({ value: a, label: ACTION_LABELS[a] })) } } },
    ],
  },
];

const EDITOR_LABELS = {
  device_id: 'Vehicle', name: 'Name (optional)', car_color: 'Paint colour (optional, e.g. #1f3b6e)',
  accent_color: 'Accent colour (optional)', drive_side: 'Drive side',
  model: 'Car picture', color_scheme: 'Colour scheme', image: 'Picture URL or /local/ path (or upload below)', image_height: 'Picture height',
  show_tyres: 'Tyre pressures', show_charging: 'Battery & charging', show_charge_limit: 'Charge limit slider',
  show_charge_current: 'Charge current slider', show_climate: 'Climate', show_actions: 'Buttons',
  show_footer: 'Footer (odometer, software)', confirm_actions: 'Tap twice to unlock / open', actions: 'Buttons to show',
};

class TeslemetryCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass; else this._render();
  }

  _emit(cfg) {
    this._config = cfg;
    this._render();
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: cfg }, bubbles: true, composed: true }));
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => EDITOR_LABELS[s.name] ?? s.name;
      this._form.addEventListener('value-changed', (e) => {
        const cfg = { ...e.detail.value };
        Object.keys(cfg).forEach((k) => { if (cfg[k] === '' || cfg[k] === undefined || cfg[k] === null) delete cfg[k]; });
        if (cfg.model !== 'custom') { delete cfg.image; delete cfg.image_height; }
        if (cfg.model === 'auto') delete cfg.model;
        if (cfg.color_scheme === 'ha') delete cfg.color_scheme;
        this._emit(cfg);
      });
      this.appendChild(this._form);
      this._buildUpload();
    }
    const data = {
      show_tyres: true, show_charging: true, show_charge_limit: true, show_charge_current: false,
      show_climate: true, show_actions: true, show_footer: true, confirm_actions: true,
      drive_side: 'auto', model: this._config.image && !this._config.model ? 'custom' : 'auto', image_height: 190, color_scheme: 'ha',
      actions: DEFAULT_ACTIONS, ...this._config,
    };
    this._form.hass = this._hass;
    this._form.schema = editorSchema(data);
    this._form.data = data;
    this._renderUpload(data);
  }

  /* "Upload picture" — stores the file with Home Assistant's image upload and uses its URL */
  _buildUpload() {
    const box = document.createElement('div');
    box.className = 'tc-upload';
    box.innerHTML = `
      <style>
        .tc-upload { display:flex; gap:14px; align-items:center; margin:4px 0 16px; padding:12px; border-radius:12px;
          border:1px dashed var(--divider-color, rgba(127,127,127,.4)); transition:background .2s, border-color .2s; }
        .tc-upload.drag { background:rgba(79,140,255,.08); border-color:var(--primary-color); }
        .tc-upload .thumb { width:112px; height:72px; flex:none; border-radius:10px; display:grid; place-items:center; overflow:hidden;
          background:rgba(127,127,127,.12); color:var(--secondary-text-color); --mdc-icon-size:28px; }
        .tc-upload .thumb img { max-width:100%; max-height:100%; object-fit:contain; }
        .tc-upload .col { display:flex; flex-direction:column; gap:6px; min-width:0; }
        .tc-upload .btns { display:flex; gap:8px; flex-wrap:wrap; }
        .tc-upload button { font:inherit; font-size:.9em; font-weight:500; border:none; border-radius:999px; padding:7px 14px; cursor:pointer;
          background:var(--primary-color, #03a9f4); color:var(--text-primary-color, #fff); display:inline-flex; align-items:center; gap:6px; --mdc-icon-size:18px; }
        .tc-upload button.rm { background:rgba(127,127,127,.15); color:var(--primary-text-color); }
        .tc-upload button:disabled { opacity:.5; cursor:default; }
        .tc-upload .msg { font-size:.8em; color:var(--secondary-text-color); }
        .tc-upload .msg.err { color:var(--error-color, #e5484d); }
      </style>
      <div class="thumb"></div>
      <div class="col">
        <div class="btns">
          <button type="button" class="up"><ha-icon icon="mdi:upload"></ha-icon>Upload picture</button>
          <button type="button" class="rm"><ha-icon icon="mdi:delete-outline"></ha-icon>Remove</button>
        </div>
        <div class="msg">PNG with a transparent background looks best. You can also drop a file here.</div>
      </div>
      <input type="file" accept="image/*" hidden>`;
    const input = box.querySelector('input');
    box.querySelector('.up').addEventListener('click', () => input.click());
    box.querySelector('.rm').addEventListener('click', () => {
      const cfg = { ...this._config };
      delete cfg.image;
      this._emit(cfg);
    });
    input.addEventListener('change', () => { if (input.files?.[0]) this._upload(input.files[0]); input.value = ''; });
    box.addEventListener('dragover', (e) => { e.preventDefault(); box.classList.add('drag'); });
    box.addEventListener('dragleave', () => box.classList.remove('drag'));
    box.addEventListener('drop', (e) => {
      e.preventDefault(); box.classList.remove('drag');
      const f = e.dataTransfer?.files?.[0];
      if (f) this._upload(f);
    });
    this._up = box;
    this.appendChild(box);
  }

  _renderUpload(data) {
    if (!this._up) return;
    const show = data.model === 'custom';
    this._up.style.display = show ? '' : 'none';
    if (!show) return;
    // keep the upload box straight after the picture fields
    if (this._up.previousSibling !== this._form) this._form.after(this._up);
    const thumb = this._up.querySelector('.thumb');
    const img = typeof data.image === 'string' ? data.image : '';
    const want = img && !img.startsWith('media-source://') ? img : '';
    if (thumb.dataset.src !== want) {
      thumb.dataset.src = want;
      thumb.innerHTML = want ? `<img src="${esc(want)}" alt="">` : '<ha-icon icon="mdi:image-plus-outline"></ha-icon>';
    }
    this._up.querySelector('.rm').disabled = !img;
  }

  async _upload(file) {
    const msg = this._up.querySelector('.msg');
    const btn = this._up.querySelector('.up');
    if (!file.type.startsWith('image/')) { msg.className = 'msg err'; msg.textContent = 'That file is not a picture.'; return; }
    msg.className = 'msg'; msg.textContent = `Uploading ${file.name}…`; btn.disabled = true;
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await this._hass.fetchWithAuth('/api/image/upload', { method: 'POST', body: fd });
      if (!r.ok) throw new Error(r.status === 413 ? 'The picture is too large.' : `Upload failed (${r.status}).`);
      const j = await r.json();
      msg.textContent = 'Uploaded.';
      this._emit({ ...this._config, model: 'custom', image: `/api/image/serve/${j.id}/original` });
    } catch (err) {
      msg.className = 'msg err';
      msg.textContent = err.message || 'Upload failed.';
    } finally {
      btn.disabled = false;
    }
  }
}

if (!customElements.get('teslemetry-card')) customElements.define('teslemetry-card', TeslemetryCard);
if (!customElements.get('teslemetry-card-editor')) customElements.define('teslemetry-card-editor', TeslemetryCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'teslemetry-card')) {
  window.customCards.push({
    type: 'teslemetry-card',
    name: 'Teslemetry Card',
    description: 'Your Tesla at a glance — battery, charging, climate, doors, tyres and quick controls for the Teslemetry integration.',
    preview: true,
    documentationURL: 'https://github.com/mimikm/Teslemetry-Card',
  });
}

console.info(
  `%c TESLEMETRY-CARD %c v${CARD_VERSION} `,
  'color:#fff;background:#4f8cff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px',
  'color:#4f8cff;background:#1c1d20;font-weight:700;border-radius:0 4px 4px 0;padding:2px 4px',
);
