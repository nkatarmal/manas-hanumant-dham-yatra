const state = {
  lang: localStorage.getItem('mhd-lang') || 'en',
  operators: [],
  city: 'all',
  query: ''
};

const labels = {
  en: {
    all: 'All cities',
    listings: 'listings',
    schedule: 'Schedule',
    route: 'Route',
    fare: 'Fare',
    contact: 'Contact',
    social: 'Open social profile',
    call: 'Call / WhatsApp',
    city: 'Source city',
    priceOnCall: 'Contact for price',
    notListed: 'Not listed'
  },
  gu: {
    all: 'બધા શહેરો',
    listings: 'યાદીઓ',
    schedule: 'સમયપત્રક',
    route: 'રૂટ',
    fare: 'ભાડું',
    contact: 'સંપર્ક',
    social: 'સોશિયલ પ્રોફાઇલ ખોલો',
    call: 'કૉલ / WhatsApp',
    city: 'પ્રસ્થાન શહેર',
    priceOnCall: 'ભાડા માટે સંપર્ક કરો',
    notListed: 'માહિતી ઉપલબ્ધ નથી'
  }
};

const $ = (s) => document.querySelector(s);

function textFor(obj, base) {
  if (state.lang === 'gu') return obj[`${base}Gu`] || obj[`${base}En`] || '';
  return obj[`${base}En`] || obj[`${base}Gu`] || '';
}

function applyLanguage() {
  document.documentElement.lang = state.lang === 'gu' ? 'gu' : 'en';
  document.querySelectorAll('[data-en][data-gu]').forEach(el => {
    el.textContent = state.lang === 'gu' ? el.dataset.gu : el.dataset.en;
  });
  $('#langToggle').textContent = state.lang === 'en' ? 'ગુજરાતી' : 'English';
  $('#searchInput').placeholder = state.lang === 'gu'
    ? $('#searchInput').dataset.placeholderGu
    : $('#searchInput').dataset.placeholderEn;
  $('#disclaimer').textContent = state.dataDisclaimer?.[state.lang] || '';
  document.title = state.lang === 'gu' ? 'માનસ હનુમંત ધામ યાત્રા' : 'Manas Hanumant Dham Yatra';
  renderCityFilter();
  renderOperators();
}

function renderCityFilter() {
  const select = $('#cityFilter');
  const cities = [...new Set(state.operators.map(o => state.lang === 'gu' ? o.sourceCityGu : o.sourceCity))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const current = state.city;
  select.innerHTML = '';
  select.add(new Option(labels[state.lang].all, 'all'));
  cities.forEach(cityLabel => {
    const matching = state.operators.find(o => (state.lang === 'gu' ? o.sourceCityGu : o.sourceCity) === cityLabel);
    select.add(new Option(cityLabel, matching?.sourceCity || cityLabel));
  });
  select.value = current === 'all' || state.operators.some(o => o.sourceCity === current) ? current : 'all';
}

function renderOperators() {
  const grid = $('#operatorGrid');
  const empty = $('#emptyState');
  const template = $('#operatorTemplate');
  const q = state.query.trim().toLowerCase();
  const filtered = state.operators.filter(o => {
    const matchesCity = state.city === 'all' || o.sourceCity === state.city;
    const haystack = [
      o.name,
      o.sourceCity,
      o.sourceCityGu,
      o.scheduleEn,
      o.scheduleGu,
      o.departureEn,
      o.departureGu,
      o.vehicle,
      o.vehicleGu
    ].join(' ').toLowerCase();
    return matchesCity && (!q || haystack.includes(q));
  });

  grid.innerHTML = '';
  filtered.forEach(o => {
    const node = template.content.cloneNode(true);
    node.querySelector('.operator-name').textContent = o.name;
    node.querySelector('.city-line').textContent = `${state.lang === 'gu' ? o.sourceCityGu : o.sourceCity} · ${state.lang === 'gu' ? o.vehicleGu : o.vehicle}`;
    node.querySelector('.schedule').textContent = textFor(o, 'schedule');
    node.querySelector('.route').textContent = textFor(o, 'departure');
    node.querySelector('.fare').textContent = o.fareAmount ? `₹${o.fareAmount}` : labels[state.lang].priceOnCall;
    node.querySelector('.contact').textContent = o.contact || labels[state.lang].notListed;
    node.querySelector('[data-label="schedule"]').textContent = labels[state.lang].schedule;
    node.querySelector('[data-label="route"]').textContent = labels[state.lang].route;
    node.querySelector('[data-label="fare"]').textContent = labels[state.lang].fare;
    node.querySelector('[data-label="contact"]').textContent = labels[state.lang].contact;

    const social = node.querySelector('.social-link');
    if (o.socialUrl) {
      social.href = o.socialUrl;
      social.querySelector('.social-text').textContent = o.socialType || labels[state.lang].social;
      social.setAttribute('aria-label', o.socialType || labels[state.lang].social);
    } else {
      social.remove();
    }

    const call = node.querySelector('.call-link');
    if (o.contact) {
      const firstPhone = o.contact.split('/')[0].trim();
      const digits = firstPhone.replace(/[^0-9]/g, '');
      call.href = `https://wa.me/${digits}`;
      call.querySelector('.call-text').textContent = labels[state.lang].call;
    } else {
      call.remove();
    }

    grid.appendChild(node);
  });

  const count = filtered.length;
  $('#countBadge').textContent = `${count} ${labels[state.lang].listings}`;
  empty.classList.toggle('hidden', count !== 0);
}

async function init() {
  try {
    const response = await fetch('operators.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.operators = data.operators || [];
    state.dataDisclaimer = data.disclaimer || {};
    applyLanguage();
  } catch (err) {
    console.error(err);
    $('#operatorGrid').innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><h3>Unable to load listings</h3><p>Run the site through a local web server or GitHub Pages.</p></div>';
  }
}

$('#langToggle').addEventListener('click', () => {
  state.lang = state.lang === 'en' ? 'gu' : 'en';
  localStorage.setItem('mhd-lang', state.lang);
  applyLanguage();
});

$('#cityFilter').addEventListener('change', (e) => {
  state.city = e.target.value;
  renderOperators();
});

$('#searchInput').addEventListener('input', (e) => {
  state.query = e.target.value;
  renderOperators();
});

$('#resetBtn').addEventListener('click', () => {
  state.city = 'all';
  state.query = '';
  $('#searchInput').value = '';
  $('#cityFilter').value = 'all';
  renderOperators();
});

init();
