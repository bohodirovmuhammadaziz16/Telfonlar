import { PHONE_CATALOG, USD_TO_UZS } from './catalog.js';
import { PhoneStage3D } from './sketchfab-stage.js';
import { sendOrderToTelegram } from './telegram.js';

const STORAGE_CART_KEY = 'mobilsphere_cart_v1';

const state = {
  selectedPhoneId: PHONE_CATALOG[0].id,
  selectedColorId: PHONE_CATALOG[0].colors[0].id,
  selectedStorageId: PHONE_CATALOG[0].storages[0].id,
  selectedSimId: PHONE_CATALOG[0].sims[0].id,
  selectedBundleId: PHONE_CATALOG[0].bundles[0].id,
  brandFilter: 'all',
  searchQuery: '',
  cardColors: {},
  cart: loadCartFromStorage()
};

const els = {
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),
  mobileNavDrawer: document.getElementById('mobileNavDrawer'),
  modelTabs: document.getElementById('modelTabs'),
  sketchfabWrap: document.getElementById('sketchfabWrap'),
  sketchfabFrame: document.getElementById('sketchfabFrame'),
  stageLoader: document.getElementById('stageLoader'),
  css3dWrap: document.getElementById('css3dWrap'),
  css3dPhone: document.getElementById('css3dPhone'),
  css3dImage: document.getElementById('css3dImage'),
  toggleViewModeBtn: document.getElementById('toggleViewModeBtn'),
  sketchfabExternalLink: document.getElementById('sketchfabExternalLink'),
  hudModelName: document.getElementById('hudModelName'),
  hudColorName: document.getElementById('hudColorName'),
  hudStorageName: document.getElementById('hudStorageName'),
  configMetaLine: document.getElementById('configMetaLine'),
  configTitle: document.getElementById('configTitle'),
  configTagline: document.getElementById('configTagline'),
  selectedColorLabel: document.getElementById('selectedColorLabel'),
  colorSwatches: document.getElementById('colorSwatches'),
  selectedStorageLabel: document.getElementById('selectedStorageLabel'),
  storageOptions: document.getElementById('storageOptions'),
  selectedSimLabel: document.getElementById('selectedSimLabel'),
  simOptions: document.getElementById('simOptions'),
  bundleOptions: document.getElementById('bundleOptions'),
  quickSpecsStrip: document.getElementById('quickSpecsStrip'),
  configPriceUsd: document.getElementById('configPriceUsd'),
  configPriceUzs: document.getElementById('configPriceUzs'),
  addToCartBtn: document.getElementById('addToCartBtn'),
  instantOrderBtn: document.getElementById('instantOrderBtn'),
  brandFilters: document.getElementById('brandFilters'),
  catalogSearchInput: document.getElementById('catalogSearchInput'),
  catalogGrid: document.getElementById('catalogGrid'),
  catalogEmpty: document.getElementById('catalogEmpty'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  specsSectionHeading: document.getElementById('specsSectionHeading'),
  specsSectionSub: document.getElementById('specsSectionSub'),
  detailedSpecsTable: document.getElementById('detailedSpecsTable'),
  openCartBtn: document.getElementById('openCartBtn'),
  closeCartBtn: document.getElementById('closeCartBtn'),
  cartBackdrop: document.getElementById('cartBackdrop'),
  cartDrawer: document.getElementById('cartDrawer'),
  headerCartCount: document.getElementById('headerCartCount'),
  cartItemsList: document.getElementById('cartItemsList'),
  cartEmptyState: document.getElementById('cartEmptyState'),
  browseFromEmptyBtn: document.getElementById('browseFromEmptyBtn'),
  checkoutForm: document.getElementById('checkoutForm'),
  formFeedback: document.getElementById('formFeedback'),
  cartTotalUsd: document.getElementById('cartTotalUsd'),
  cartTotalUzs: document.getElementById('cartTotalUzs'),
  submitOrderBtn: document.getElementById('submitOrderBtn'),
  orderSuccessState: document.getElementById('orderSuccessState'),
  successOrderNumber: document.getElementById('successOrderNumber'),
  successReceipt: document.getElementById('successReceipt'),
  newOrderBtn: document.getElementById('newOrderBtn'),
  toast: document.getElementById('toast')
};

const stage3D = new PhoneStage3D({
  sketchfabWrap: els.sketchfabWrap,
  sketchfabFrame: els.sketchfabFrame,
  stageLoader: els.stageLoader,
  css3dWrap: els.css3dWrap,
  css3dPhone: els.css3dPhone,
  css3dImage: els.css3dImage,
  toggleViewModeBtn: els.toggleViewModeBtn,
  sketchfabExternalLink: els.sketchfabExternalLink
});

let toastTimer = null;

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(state.cart));
  } catch {
    // Ignore storage quota errors
  }
}

function formatUsd(amount) {
  return `$${amount.toLocaleString('en-US')}`;
}

function formatUzs(usdAmount) {
  const uzs = Math.round(usdAmount * USD_TO_UZS);
  return `≈ ${uzs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`;
}

function getActiveConfig() {
  const phone = PHONE_CATALOG.find((p) => p.id === state.selectedPhoneId) || PHONE_CATALOG[0];
  const color = phone.colors.find((c) => c.id === state.selectedColorId) || phone.colors[0];
  const storage = phone.storages.find((s) => s.id === state.selectedStorageId) || phone.storages[0];
  const sim = phone.sims.find((s) => s.id === state.selectedSimId) || phone.sims[0];
  const bundle = phone.bundles.find((b) => b.id === state.selectedBundleId) || phone.bundles[0];
  const unitPriceUsd = phone.basePriceUsd + storage.deltaUsd + sim.deltaUsd + bundle.deltaUsd;
  return { phone, color, storage, sim, bundle, unitPriceUsd };
}

function selectPhone(phoneId, scrollToStudio = false, preferredColorId = null) {
  const phone = PHONE_CATALOG.find((p) => p.id === phoneId);
  if (!phone) return;
  const matchedColor = preferredColorId && phone.colors.find((c) => c.id === preferredColorId);
  state.selectedPhoneId = phone.id;
  state.selectedColorId = matchedColor ? matchedColor.id : phone.colors[0].id;
  state.selectedStorageId = phone.storages[0].id;
  state.selectedSimId = phone.sims[0].id;
  state.selectedBundleId = phone.bundles[0].id;

  renderModelTabs();
  renderConfigurator();
  renderDetailedSpecs();
  renderCatalog();

  const { color } = getActiveConfig();
  stage3D.loadModel(phone, color);

  if (scrollToStudio) {
    document.getElementById('studio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderModelTabs() {
  els.modelTabs.innerHTML = '';
  PHONE_CATALOG.forEach((phone) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'tab';
    const isActive = phone.id === state.selectedPhoneId;
    btn.className = `model-tab-btn${isActive ? ' is-active' : ''}`;
    btn.setAttribute('aria-selected', String(isActive));

    const dot = document.createElement('span');
    dot.className = 'model-tab-dot';
    dot.style.backgroundColor = phone.colors[0].hex;

    const text = document.createElement('span');
    text.textContent = phone.name;

    btn.append(dot, text);
    btn.addEventListener('click', () => selectPhone(phone.id, false));
    els.modelTabs.appendChild(btn);
  });
}

function renderConfigurator() {
  const { phone, color, storage, sim, bundle, unitPriceUsd } = getActiveConfig();

  els.configMetaLine.textContent = `${phone.brand} · ${phone.category} · Mavjud`;
  els.configTitle.textContent = phone.name;
  els.configTagline.textContent = phone.tagline;

  els.hudModelName.textContent = phone.name;
  els.hudColorName.textContent = color.name;
  els.hudStorageName.textContent = storage.short;

  // 1. Colors
  els.selectedColorLabel.textContent = color.name;
  els.colorSwatches.innerHTML = '';
  phone.colors.forEach((c) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'radio';
    const selected = c.id === color.id;
    btn.className = `swatch-btn${selected ? ' is-selected' : ''}`;
    btn.setAttribute('aria-checked', String(selected));

    const circle = document.createElement('span');
    circle.className = 'swatch-circle';
    circle.style.backgroundColor = c.hex;

    const label = document.createElement('span');
    label.textContent = c.name;

    btn.append(circle, label);
    btn.addEventListener('click', () => {
      state.selectedColorId = c.id;
      stage3D.applyStageColor(c);
      renderConfigurator();
    });
    els.colorSwatches.appendChild(btn);
  });

  // 2. Storage & RAM
  els.selectedStorageLabel.textContent = storage.label;
  els.storageOptions.innerHTML = '';
  phone.storages.forEach((s) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'radio';
    const selected = s.id === storage.id;
    btn.className = `option-btn${selected ? ' is-selected' : ''}`;
    btn.setAttribute('aria-checked', String(selected));

    const primary = document.createElement('span');
    primary.className = 'option-primary tabular-nums';
    primary.textContent = s.short;

    const sub = document.createElement('span');
    sub.className = 'option-sub tabular-nums';
    sub.textContent = s.deltaUsd === 0 ? 'Baza narx' : `+$${s.deltaUsd}`;

    btn.append(primary, sub);
    btn.addEventListener('click', () => {
      state.selectedStorageId = s.id;
      renderConfigurator();
      renderDetailedSpecs();
    });
    els.storageOptions.appendChild(btn);
  });

  // 3. SIM / Region
  els.selectedSimLabel.textContent = sim.label;
  els.simOptions.innerHTML = '';
  phone.sims.forEach((s) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'radio';
    const selected = s.id === sim.id;
    btn.className = `option-btn${selected ? ' is-selected' : ''}`;
    btn.setAttribute('aria-checked', String(selected));

    const primary = document.createElement('span');
    primary.className = 'option-primary';
    primary.textContent = s.label;

    const sub = document.createElement('span');
    sub.className = 'option-sub';
    sub.textContent = s.deltaUsd > 0 ? `${s.sub} (+$${s.deltaUsd})` : s.sub;

    btn.append(primary, sub);
    btn.addEventListener('click', () => {
      state.selectedSimId = s.id;
      renderConfigurator();
    });
    els.simOptions.appendChild(btn);
  });

  // 4. Protection & Accessories
  els.bundleOptions.innerHTML = '';
  phone.bundles.forEach((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.role = 'radio';
    const selected = b.id === bundle.id;
    btn.className = `option-btn${selected ? ' is-selected' : ''}`;
    btn.setAttribute('aria-checked', String(selected));

    const primary = document.createElement('span');
    primary.className = 'option-primary';
    primary.textContent = b.label;

    const sub = document.createElement('span');
    sub.className = 'option-sub';
    sub.textContent = b.deltaUsd > 0 ? `${b.sub} (+$${b.deltaUsd})` : b.sub;

    btn.append(primary, sub);
    btn.addEventListener('click', () => {
      state.selectedBundleId = b.id;
      renderConfigurator();
    });
    els.bundleOptions.appendChild(btn);
  });

  // Quick Specs Strip
  els.quickSpecsStrip.innerHTML = `
    <div class="quick-spec-cell">
      <span class="quick-spec-key">Protsessor</span>
      <span class="quick-spec-val">${phone.specs.Protsessor.split('(')[0].trim()}</span>
    </div>
    <div class="quick-spec-cell">
      <span class="quick-spec-key">Asosiy kamera</span>
      <span class="quick-spec-val">${phone.specs.Kamera.split('+')[0].trim()}</span>
    </div>
    <div class="quick-spec-cell">
      <span class="quick-spec-key">Batareya</span>
      <span class="quick-spec-val tabular-nums">${phone.specs.Batareya.split('·')[0].trim()}</span>
    </div>
  `;

  els.configPriceUsd.textContent = formatUsd(unitPriceUsd);
  els.configPriceUzs.textContent = formatUzs(unitPriceUsd);
}

function renderDetailedSpecs() {
  const { phone, color, storage, sim } = getActiveConfig();
  els.specsSectionHeading.textContent = `${phone.name} — Texnik xususiyatlar`;
  els.specsSectionSub.textContent = `${color.name} · ${storage.label} · ${sim.label} konfiguratsiyasi uchun to'liq ko'rsatkichlar.`;

  const rows = [
    ['Displey', phone.specs.Displey],
    ['Protsessor', phone.specs.Protsessor],
    ['Xotira va RAM', storage.label],
    ['Asosiy kamera', phone.specs.Kamera],
    ['Old kamera', phone.specs.OldKamera],
    ['Batareya', phone.specs.Batareya],
    ['Korpus va himoya', `${phone.specs.Korpus} (${color.name})`],
    ['Og‘irlik va port', phone.specs.Vazn]
  ];

  els.detailedSpecsTable.innerHTML = rows
    .map(
      ([dt, dd]) => `
        <div class="spec-row">
          <dt>${dt}</dt>
          <dd>${dd}</dd>
        </div>
      `
    )
    .join('');
}

function renderCatalog() {
  const q = state.searchQuery.trim().toLowerCase();
  const filtered = PHONE_CATALOG.filter((p) => {
    const matchesBrand = state.brandFilter === 'all' || p.category === state.brandFilter;
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.specs.Protsessor.toLowerCase().includes(q);
    return matchesBrand && matchesQuery;
  });

  els.catalogGrid.innerHTML = '';
  els.catalogEmpty.hidden = filtered.length > 0;

  filtered.forEach((phone) => {
    const card = document.createElement('article');
    const isCurrent = phone.id === state.selectedPhoneId;
    const activeColorId = state.cardColors[phone.id] || phone.colors[0].id;
    const activeColor = phone.colors.find((c) => c.id === activeColorId) || phone.colors[0];
    const isDefaultColor = activeColor.id === phone.colors[0].id;

    card.className = `phone-card${isCurrent ? ' is-current' : ''}`;
    card.style.setProperty('--card-finish-rgb', activeColor.rgb);

    const swatchesHtml = phone.colors
      .map(
        (c) => `
          <button
            type="button"
            class="mini-swatch-btn${c.id === activeColor.id ? ' is-active' : ''}"
            data-color-id="${c.id}"
            aria-label="${c.name} rangini tanlash"
            aria-pressed="${c.id === activeColor.id}"
            title="${c.name}"
          >
            <span class="mini-swatch-dot" style="background-color: ${c.hex};"></span>
          </button>
        `
      )
      .join('');

    card.innerHTML = `
      <div class="phone-card-media${isDefaultColor ? '' : ' has-custom-tint'}" role="button" tabindex="0" aria-label="${phone.name} ni 3D studiyada ko'rish">
        <img
          src="${phone.image}"
          alt="${phone.name} — ${activeColor.name}"
          class="phone-card-img"
          referrerpolicy="no-referrer"
          loading="lazy"
        />
        <div class="phone-card-tint" aria-hidden="true"></div>
        <div class="phone-card-sheen" aria-hidden="true"></div>
        <div class="phone-card-scrim" aria-hidden="true">
          <span class="phone-card-scrim-hint">3D ko'rish uchun bosing</span>
        </div>
        <div class="phone-card-fallback" hidden>
          <svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <rect x="6" y="2" width="12" height="20" rx="2.5" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <span>${phone.name}</span>
        </div>
      </div>
      <div class="phone-card-body">
        <div class="phone-card-meta">${phone.brand} · ${phone.storages[0].short} – ${phone.storages[phone.storages.length - 1].short}</div>
        <h3 class="phone-card-title">${phone.name}</h3>
        <p class="phone-card-spec-line">${phone.specs.Protsessor}</p>
        <div class="phone-card-swatches" aria-label="Mavjud ranglar">
          ${swatchesHtml}
          <span class="phone-card-color-label">${activeColor.name}</span>
        </div>
        <div class="phone-card-footer">
          <span class="phone-card-price tabular-nums">${formatUsd(phone.basePriceUsd)}</span>
          <div class="phone-card-actions">
            <button type="button" class="card-btn" data-action="view3d">3D da ko'rish</button>
            <button type="button" class="card-btn card-btn-primary" data-action="quickadd">Savatga</button>
          </div>
        </div>
      </div>
    `;

    const mediaEl = card.querySelector('.phone-card-media');
    const imgEl = card.querySelector('.phone-card-img');
    const fallbackEl = card.querySelector('.phone-card-fallback');

    imgEl.addEventListener('error', () => {
      imgEl.hidden = true;
      fallbackEl.hidden = false;
    });

    // Clicking or pressing Enter on card photo opens 3D Studio with selected color
    mediaEl.addEventListener('click', () => {
      selectPhone(phone.id, true, state.cardColors[phone.id] || phone.colors[0].id);
    });
    mediaEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPhone(phone.id, true, state.cardColors[phone.id] || phone.colors[0].id);
      }
    });

    // Interactive color swatches directly on the card
    card.querySelectorAll('.mini-swatch-btn').forEach((swatchBtn) => {
      swatchBtn.addEventListener('click', () => {
        const chosenId = swatchBtn.dataset.colorId;
        const chosen = phone.colors.find((c) => c.id === chosenId) || phone.colors[0];
        state.cardColors[phone.id] = chosen.id;
        card.style.setProperty('--card-finish-rgb', chosen.rgb);
        mediaEl.classList.toggle('has-custom-tint', chosen.id !== phone.colors[0].id);
        imgEl.alt = `${phone.name} — ${chosen.name}`;
        card.querySelector('.phone-card-color-label').textContent = chosen.name;
        card.querySelectorAll('.mini-swatch-btn').forEach((b) => {
          const active = b.dataset.colorId === chosen.id;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
      });
    });

    // 3D Tilt hover effect (compositor transform only)
    card.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-3px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });

    card.querySelector('[data-action="view3d"]').addEventListener('click', () => {
      selectPhone(phone.id, true, state.cardColors[phone.id] || phone.colors[0].id);
    });

    card.querySelector('[data-action="quickadd"]').addEventListener('click', () => {
      const chosenColorId = state.cardColors[phone.id] || phone.colors[0].id;
      const chosenColor = phone.colors.find((c) => c.id === chosenColorId) || phone.colors[0];
      const defaultStorage = phone.storages[0];
      const defaultSim = phone.sims[0];
      const defaultBundle = phone.bundles[0];
      addConfiguredItemToCart({
        phone,
        color: chosenColor,
        storage: defaultStorage,
        sim: defaultSim,
        bundle: defaultBundle,
        unitPriceUsd: phone.basePriceUsd + defaultStorage.deltaUsd + defaultSim.deltaUsd + defaultBundle.deltaUsd
      });
      showToast(`${phone.name} (${chosenColor.name}) savatga qo'shildi`);
    });

    els.catalogGrid.appendChild(card);
  });
}

function addConfiguredItemToCart(config) {
  const { phone, color, storage, sim, bundle, unitPriceUsd } = config;
  const variantKey = `${phone.id}__${color.id}__${storage.id}__${sim.id}__${bundle.id}`;
  const existing = state.cart.find((item) => item.variantKey === variantKey);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      variantKey,
      phoneId: phone.id,
      name: phone.name,
      image: phone.image,
      colorName: color.name,
      colorHex: color.hex,
      storageLabel: storage.label,
      simLabel: sim.label,
      bundleLabel: bundle.label,
      processor: phone.specs.Protsessor,
      camera: phone.specs.Kamera,
      unitPriceUsd,
      quantity: 1
    });
  }

  saveCartToStorage();
  renderCart();
}

function updateCartQuantity(variantKey, delta) {
  const idx = state.cart.findIndex((i) => i.variantKey === variantKey);
  if (idx === -1) return;
  state.cart[idx].quantity += delta;
  if (state.cart[idx].quantity <= 0) {
    state.cart.splice(idx, 1);
  }
  saveCartToStorage();
  renderCart();
}

function removeCartItem(variantKey) {
  state.cart = state.cart.filter((i) => i.variantKey !== variantKey);
  saveCartToStorage();
  renderCart();
}

function renderCart() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalUsd = state.cart.reduce((sum, item) => sum + item.unitPriceUsd * item.quantity, 0);

  els.headerCartCount.textContent = String(totalCount);

  const hasItems = state.cart.length > 0;
  els.cartEmptyState.hidden = hasItems || !els.orderSuccessState.hidden;
  els.checkoutForm.hidden = !hasItems || !els.orderSuccessState.hidden;

  els.cartItemsList.innerHTML = '';
  if (!els.orderSuccessState.hidden) {
    return;
  }

  state.cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" referrerpolicy="no-referrer" />
      <div>
        <h3 class="cart-item-title">${item.name}</h3>
        <div class="cart-item-meta">
          ${item.colorName} · ${item.storageLabel} · ${item.simLabel}<br />
          To'plam: ${item.bundleLabel}
        </div>
        <div class="cart-item-controls">
          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-qty="-1" aria-label="Sonini kamaytirish">-</button>
            <span class="qty-val tabular-nums">${item.quantity}</span>
            <button type="button" class="qty-btn" data-qty="1" aria-label="Sonini oshirish">+</button>
          </div>
          <span class="tabular-nums" style="font-weight:700;font-size:14px;">${formatUsd(item.unitPriceUsd * item.quantity)}</span>
          <button type="button" class="remove-item-btn">O'chirish</button>
        </div>
      </div>
    `;

    row.querySelector('[data-qty="-1"]').addEventListener('click', () => updateCartQuantity(item.variantKey, -1));
    row.querySelector('[data-qty="1"]').addEventListener('click', () => updateCartQuantity(item.variantKey, 1));
    row.querySelector('.remove-item-btn').addEventListener('click', () => removeCartItem(item.variantKey));

    els.cartItemsList.appendChild(row);
  });

  els.cartTotalUsd.textContent = formatUsd(totalUsd);
  els.cartTotalUzs.textContent = formatUzs(totalUsd).replace('≈ ', '');
}

function openCartDrawer() {
  els.orderSuccessState.hidden = true;
  els.formFeedback.hidden = true;
  renderCart();
  els.cartBackdrop.hidden = false;
  els.cartDrawer.hidden = false;
  document.body.style.overflow = 'hidden';
  els.closeCartBtn.focus();
}

function closeCartDrawer() {
  els.cartBackdrop.hidden = true;
  els.cartDrawer.hidden = true;
  document.body.style.overflow = '';
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.hidden = true;
  }, 2800);
}

function bindEvents() {
  // Mobile Navigation
  els.mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = els.mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    els.mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
    els.mobileNavDrawer.hidden = isExpanded;
  });

  els.mobileNavDrawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      els.mobileMenuBtn.setAttribute('aria-expanded', 'false');
      els.mobileNavDrawer.hidden = true;
    });
  });

  // Camera Presets & 3D Mode Toggle
  document.querySelectorAll('.stage-ctrl-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stage-ctrl-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      stage3D.setCameraPreset(btn.dataset.cam);
    });
  });

  els.toggleViewModeBtn.addEventListener('click', () => {
    stage3D.toggleViewMode();
  });

  // Configurator Purchase Actions
  els.addToCartBtn.addEventListener('click', () => {
    const config = getActiveConfig();
    addConfiguredItemToCart(config);
    showToast(`${config.phone.name} (${config.color.name}, ${config.storage.short}) savatga qo'shildi`);
  });

  els.instantOrderBtn.addEventListener('click', () => {
    const config = getActiveConfig();
    addConfiguredItemToCart(config);
    openCartDrawer();
  });

  // Brand Filter Tabs & Search
  els.brandFilters.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      els.brandFilters.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      state.brandFilter = tab.dataset.brand;
      renderCatalog();
    });
  });

  els.catalogSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderCatalog();
  });

  els.resetFiltersBtn.addEventListener('click', () => {
    state.brandFilter = 'all';
    state.searchQuery = '';
    els.catalogSearchInput.value = '';
    els.brandFilters.querySelectorAll('.filter-tab').forEach((t) => {
      t.classList.toggle('is-active', t.dataset.brand === 'all');
    });
    renderCatalog();
  });

  // Cart Drawer
  els.openCartBtn.addEventListener('click', openCartDrawer);
  els.closeCartBtn.addEventListener('click', closeCartDrawer);
  els.cartBackdrop.addEventListener('click', closeCartDrawer);
  els.browseFromEmptyBtn.addEventListener('click', () => {
    closeCartDrawer();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !els.cartDrawer.hidden) {
      closeCartDrawer();
    }
  });

  // Order Submission to Telegram Channel
  els.checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    els.formFeedback.hidden = true;

    if (state.cart.length === 0) {
      els.formFeedback.textContent = "Buyurtma berish uchun avval savatga smartfon qo'shing.";
      els.formFeedback.hidden = false;
      return;
    }

    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const city = document.getElementById('customerCity').value;
    const address = document.getElementById('customerAddress').value.trim();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const telegram = document.getElementById('customerTelegram').value.trim();
    const note = document.getElementById('customerNote').value.trim();

    if (name.length < 2) {
      els.formFeedback.textContent = 'Iltimos, ism va familiyangizni kiriting.';
      els.formFeedback.hidden = false;
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 9) {
      els.formFeedback.textContent = "Iltimos, to'g'ri telefon raqamini kiriting (masalan: +998 90 123 45 67).";
      els.formFeedback.hidden = false;
      return;
    }

    if (address.length < 4) {
      els.formFeedback.textContent = "Iltimos, yetkazib berish manzilini aniqroq kiriting.";
      els.formFeedback.hidden = false;
      return;
    }

    const totalUsd = state.cart.reduce((sum, item) => sum + item.unitPriceUsd * item.quantity, 0);
    const orderId = `MS-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsSnapshot = [...state.cart];

    els.submitOrderBtn.disabled = true;
    els.submitOrderBtn.textContent = 'Telegramga yuborilmoqda...';

    try {
      await sendOrderToTelegram({
        orderId,
        customer: { name, phone, city, address, paymentMethod, telegram, note },
        items: itemsSnapshot,
        totalUsd,
        usdToUzs: USD_TO_UZS,
        createdAt
      });

      // Clear cart & show receipt
      state.cart = [];
      saveCartToStorage();
      els.headerCartCount.textContent = '0';
      els.cartItemsList.innerHTML = '';
      els.checkoutForm.hidden = true;
      els.cartEmptyState.hidden = true;

      const esc = (v) =>
        String(v ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      els.successOrderNumber.textContent = `Buyurtma #${orderId} yuborildi`;
      els.successReceipt.innerHTML = `
        <strong>Mijoz:</strong> ${esc(name)} (${esc(phone)})<br />
        <strong>Manzil:</strong> ${esc(city)}, ${esc(address)}<br />
        <strong>To'lov:</strong> ${esc(paymentMethod)}<br />
        <strong>Qurilmalar:</strong> ${itemsSnapshot.map((i) => `${esc(i.name)} (${esc(i.colorName)}, ${esc(i.storageLabel)}) ×${i.quantity}`).join('; ')}<br />
        <strong>Jami:</strong> ${formatUsd(totalUsd)} (${formatUzs(totalUsd).replace('≈ ', '')})
      `;
      els.orderSuccessState.hidden = false;
      els.checkoutForm.reset();
      showToast('Buyurtma Telegram kanalga muvaffaqiyatli yuborildi');
    } catch (err) {
      els.formFeedback.textContent = err.message || "Telegramga ulanishda xatolik yuz berdi. Qayta urinib ko'ring.";
      els.formFeedback.hidden = false;
    } finally {
      els.submitOrderBtn.disabled = false;
      els.submitOrderBtn.textContent = 'Buyurtmani Telegramga yuborish';
    }
  });

  els.newOrderBtn.addEventListener('click', () => {
    closeCartDrawer();
  });
}

function init() {
  bindEvents();
  renderModelTabs();
  renderConfigurator();
  renderDetailedSpecs();
  renderCatalog();
  renderCart();

  const { phone, color } = getActiveConfig();
  stage3D.loadModel(phone, color);
}

init();
