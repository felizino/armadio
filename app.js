(function () {
  'use strict';

  const STORAGE_KEY = 'armadio-items';

  /** For "how many X?" – map question word to item-type stems that belong to that category (e.g. pants → jeans, pants, shorts). */
  const typeCategoryStems = {
    pants: ['pant', 'jeans', 'trouser', 'short'],
    shirts: ['shirt', 'tee', 'polo'],
    jackets: ['jacket', 'coat', 'blazer', 'vest'],
    shoes: ['sneaker', 'boot', 'loafer', 'shoe'],
    sweaters: ['sweater', 'cardigan', 'hoodie', 'jumper'],
    dresses: ['dress'],
    skirts: ['skirt']
  };

  const suggestionData = {
    itemType: ['Shirt', 'T-Shirt', 'Pants', 'Jeans', 'Jacket', 'Coat', 'Sweater', 'Dress', 'Skirt', 'Shorts', 'Sneakers', 'Boots', 'Loafers', 'Blazer', 'Hoodie', 'Cardigan', 'Vest', 'Polo', 'Jumper'],
    brand: ['Theory', 'Zara', 'Nike', 'Adidas', 'Uniqlo', "Levi's", 'H&M', 'COS', 'Everlane', 'Reformation', 'Allbirds', 'Common Projects', 'J.Crew', 'Madewell', 'Patagonia', 'The North Face', 'Gucci', 'Prada', 'Saint Laurent', 'Acne Studios'],
    size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32', '34', '36', '38', '40', '42', '44', '8', '9', '10', '11', '12', 'One Size'],
    color: ['Black', 'White', 'Navy', 'Grey', 'Gray', 'Charcoal', 'Beige', 'Cream', 'Brown', 'Tan', 'Burgundy', 'Red', 'Blue', 'Green', 'Olive', 'Pink', 'Yellow', 'Orange', 'Purple', 'Denim', 'Khaki', 'Camel', 'Ivory', 'Off-White']
  };

  const brandToDomain = {
    'Acne Studios': 'acnestudios.com',
    'Adidas': 'adidas.com',
    'A.P.C.': 'apc.fr',
    'Armani': 'armani.com',
    'Aritzia': 'aritzia.com',
    'Asics': 'asics.com',
    'AllSaints': 'allsaints.com',
    '& Other Stories': 'stories.com',
    'Balenciaga': 'balenciaga.com',
    'Bape': 'bape.com',
    'Bottega Veneta': 'bottegaveneta.com',
    'Burberry': 'burberry.com',
    'Bally': 'bally.com',
    'Bershka': 'bershka.com',
    'Boss': 'hugoboss.com',
    'Brunello Cucinelli': 'brunellocucinelli.com',
    'Calvin Klein': 'calvinklein.com',
    'Carhartt': 'carhartt.com',
    'Celine': 'celine.com',
    'Chanel': 'chanel.com',
    'Chloé': 'chloe.com',
    'Club Monaco': 'clubmonaco.com',
    'Coach': 'coach.com',
    'Comme des Garçons': 'comme-des-garcons.com',
    'COS': 'cosstores.com',
    'Diesel': 'diesel.com',
    'Dior': 'dior.com',
    'Dolce & Gabbana': 'dolcegabbana.com',
    'Dr. Martens': 'drmartens.com',
    'Dries Van Noten': 'driesvannoten.com',
    'Everlane': 'everlane.com',
    'Essentials': 'fearofgod.com',
    'Fendi': 'fendi.com',
    'Fear of God': 'fearofgod.com',
    'Frame': 'frame-store.com',
    'Ganni': 'ganni.com',
    'Givenchy': 'givenchy.com',
    'Golden Goose': 'goldengoose.com',
    'G-Star Raw': 'gstar.com',
    'Gucci': 'gucci.com',
    'H&M': 'hm.com',
    'Hermès': 'hermes.com',
    'Hugo Boss': 'hugoboss.com',
    'Isabel Marant': 'isabelmarant.com',
    'J.Crew': 'jcrew.com',
    'Jil Sander': 'jilsander.com',
    'Jordan': 'nike.com',
    'JW Anderson': 'jw-anderson.com',
    'Kenzo': 'kenzo.com',
    'Kith': 'kith.com',
    'Lacoste': 'lacoste.com',
    'Lee': 'lee.com',
    "Levi's": 'levi.com',
    'Loewe': 'loewe.com',
    'Louis Vuitton': 'louisvuitton.com',
    'Lululemon': 'lululemon.com',
    'Madewell': 'madewell.com',
    'Maje': 'maje.com',
    'Mango': 'mango.com',
    'Marni': 'marni.com',
    'Marine Serre': 'marineserre.com',
    'Massimo Dutti': 'massimodutti.com',
    'Max Mara': 'maxmara.com',
    'Miu Miu': 'miumiu.com',
    'Moncler': 'moncler.com',
    'Mother': 'motherdenim.com',
    'Nanushka': 'nanushka.com',
    'New Balance': 'newbalance.com',
    'Nike': 'nike.com',
    'The North Face': 'thenorthface.com',
    'Off-White': 'off---white.com',
    'Oscar de la Renta': 'oscardelarenta.com',
    'Palace': 'palaceskateboards.com',
    'Patagonia': 'patagonia.com',
    'Paul Smith': 'paulsmith.com',
    'Prada': 'prada.com',
    'Puma': 'puma.com',
    'Rag & Bone': 'rag-bone.com',
    'Ralph Lauren': 'ralphlauren.com',
    'Reebok': 'reebok.com',
    'Reformation': 'reformation.com',
    'Reiss': 'reiss.com',
    'Rick Owens': 'rickowens.eu',
    'Rotate': 'rotate.dk',
    'Saint Laurent': 'ysl.com',
    'Salvatore Ferragamo': 'ferragamo.com',
    'Sandro': 'sandro-paris.com',
    'Sézane': 'sezane.com',
    'Stella McCartney': 'stellamccartney.com',
    'Stüssy': 'stussy.com',
    'Supreme': 'supremenewyork.com',
    'Theory': 'theory.com',
    'Thom Browne': 'thombrowne.com',
    "Tod's": 'tods.com',
    'Tom Ford': 'tomford.com',
    'Tommy Hilfiger': 'tommy.com',
    'Totême': 'toteme.com',
    'The Row': 'therow.com',
    'Uniqlo': 'uniqlo.com',
    'Valentino': 'valentino.com',
    'Van Cleef & Arpels': 'vancleefarpels.com',
    'Vans': 'vans.com',
    'Versace': 'versace.com',
    'Vince': 'vince.com',
    'Whistles': 'whistles.com',
    'Wrangler': 'wrangler.com',
    'Sacai': 'sacai.jp',
    'Stine Goya': 'stinegoya.com',
    'Zara': 'zara.com',
    'Zimmermann': 'zimmermannwear.com',
    'Allbirds': 'allbirds.com',
    'Common Projects': 'commonprojects.com'
  };

  const colorToHex = {
    black: '#1a1a1a',
    white: '#fafafa',
    navy: '#1e3a5f',
    grey: '#6b7280',
    gray: '#6b7280',
    charcoal: '#36454f',
    beige: '#d4b896',
    cream: '#fffdd0',
    brown: '#5c4033',
    tan: '#d2b48c',
    burgundy: '#800020',
    red: '#b91c1c',
    blue: '#2563eb',
    green: '#15803d',
    olive: '#6b8e23',
    pink: '#db2777',
    yellow: '#ca8a04',
    orange: '#ea580c',
    purple: '#7c3aed',
    denim: '#1560bd',
    khaki: '#c3b091',
    camel: '#c19a6b',
    ivory: '#fffff0',
    'off-white': '#f5f5dc'
  };

  function getItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        alert('Storage full. You can add more items without photos, or remove some existing photos to free space.');
      }
      return false;
    }
  }

  function getBrandDomain(brand) {
    if (!brand || typeof brand !== 'string') return null;
    const key = Object.keys(brandToDomain).find(k => k.toLowerCase() === brand.trim().toLowerCase());
    return key ? brandToDomain[key] : null;
  }

  function getBrandLogoUrl(brand) {
    const domain = getBrandDomain(brand);
    if (!domain) return null;
    return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) + '&sz=128';
  }

  function getBrandInitials(brand) {
    if (!brand || typeof brand !== 'string') return '?';
    const parts = brand.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return brand.slice(0, 2).toUpperCase();
  }

  function getColorHex(colorName) {
    if (!colorName || typeof colorName !== 'string') return '#888';
    const key = colorName.trim().toLowerCase().replace(/\s+/g, ' ');
    return colorToHex[key] || '#888';
  }

  function escapeHtml(str) {
    if (str == null) return '';
    const s = String(str);
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  /** Resize and compress image to JPEG data URL to reduce localStorage usage (typical 5MB limit). */
  function compressImageForStorage(dataUrl, maxDimension, quality) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) return Promise.resolve(dataUrl);
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth;
        var h = img.naturalHeight;
        var tw = w;
        var th = h;
        if (w > maxDimension || h > maxDimension) {
          if (w >= h) {
            tw = maxDimension;
            th = Math.round(h * maxDimension / w);
          } else {
            th = maxDimension;
            tw = Math.round(w * maxDimension / h);
          }
        }
        var canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = th;
        var ctx = canvas.getContext('2d');
        if (!ctx) { resolve(dataUrl); return; }
        ctx.drawImage(img, 0, 0, tw, th);
        try {
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = function () { reject(new Error('Image load failed')); };
      img.src = dataUrl;
    });
  }

  function getProfileDisplayName() {
    try {
      const raw = localStorage.getItem('armadio-profile');
      if (!raw) return '';
      const p = JSON.parse(raw);
      return (p.name || '').trim();
    } catch (_) {
      return '';
    }
  }

  function getStyleSummary(items) {
    const displayName = getProfileDisplayName();
    const namePart = displayName ? displayName + ', ' : '';

    if (!items || items.length === 0) {
      return namePart ? namePart + 'add items to learn about your style.' : 'Add items to learn about your style.';
    }

    const colors = [...new Set(items.map(i => (i.color || '').trim()).filter(Boolean))];
    const brands = [...new Set(items.map(i => (i.brand || '').trim()).filter(Boolean))];
    const types = [...new Set(items.map(i => (i.itemType || '').trim()).filter(Boolean))];
    const neutralColors = ['black', 'white', 'navy', 'grey', 'gray', 'charcoal', 'beige', 'cream', 'brown', 'tan', 'khaki', 'camel', 'ivory', 'off-white'];
    const isNeutral = colors.length > 0 && colors.every(c => neutralColors.includes(c.toLowerCase()));
    const designerBrands = ['Gucci', 'Prada', 'Saint Laurent', 'Acne Studios', 'Theory', 'Jil Sander', 'Armani', 'Celine', 'Loewe', 'The Row', 'Totême', 'Bottega Veneta', 'Dior', 'Hermès'];
    const hasDesigner = brands.some(b => designerBrands.some(d => b.toLowerCase().includes(d.toLowerCase())));
    const tailored = ['blazer', 'coat', 'dress', 'shirt', 'pants', 'trousers', 'jacket'];
    const casual = ['t-shirt', 'hoodie', 'sneakers', 'shorts', 'jeans', 'tee'];
    const hasTailored = types.some(t => tailored.some(tl => (t || '').toLowerCase().includes(tl)));
    const hasCasual = types.some(t => casual.some(c => (t || '').toLowerCase().includes(c)));

    const colorPhrase = isNeutral
      ? (colors.length ? 'a refined palette of ' + colors.slice(0, 3).join(', ').toLowerCase() : 'a neutral palette')
      : 'a bold mix of ' + (colors.slice(0, 3).join(', ').toLowerCase() || 'color');
    const brandPhrase = brands.length
      ? (hasDesigner ? 'with pieces from ' + brands.slice(0, 2).join(' and ') : 'mixing ' + brands.slice(0, 2).join(' and '))
      : '';
    let vibePhrase = '';
    if (hasTailored && hasCasual) vibePhrase = 'smart-casual and easy—tailored when it matters, relaxed when it doesn’t.';
    else if (hasTailored) vibePhrase = 'sharp and intentional—clean lines and polished separates.';
    else if (hasCasual) vibePhrase = 'effortlessly casual—laid-back pieces that still feel considered.';
    else vibePhrase = 'curated and personal—each piece has its place.';

    const mid = colorPhrase + (brandPhrase ? ', ' + brandPhrase : '') + '—' + vibePhrase;
    const text = namePart + 'Your style is ' + mid;
    return text.replace(/\s+/g, ' ').trim();
  }

  function updateStyleSummary() {
    const el = document.getElementById('style-summary');
    if (el) el.textContent = getStyleSummary(getItems());
  }

  const FIT_STORAGE_KEY = 'armadio-fit';
  const FIT_UNIT_KEY = 'armadio-fit-unit';
  const FIT_KEYS = ['head', 'neck', 'chest', 'waist', 'hip', 'wrist', 'thigh', 'knee', 'ankle'];
  /** Likely male measurement ranges (circumference in cm) for dropdowns. */
  const FIT_RANGES = {
    head: { min: 54, max: 62, step: 0.5 },
    neck: { min: 35, max: 45, step: 0.5 },
    chest: { min: 85, max: 120, step: 1 },
    waist: { min: 70, max: 110, step: 1 },
    hip: { min: 85, max: 115, step: 1 },
    wrist: { min: 15, max: 21, step: 0.5 },
    thigh: { min: 50, max: 70, step: 1 },
    knee: { min: 35, max: 45, step: 0.5 },
    ankle: { min: 22, max: 28, step: 0.5 }
  };

  function getFit() {
    try {
      var raw = localStorage.getItem(FIT_STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (_) { return {}; }
  }

  function saveFit(data) {
    try {
      localStorage.setItem(FIT_STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function getFitUnit() {
    try {
      var u = localStorage.getItem(FIT_UNIT_KEY);
      return u === 'in' ? 'in' : 'cm';
    } catch (_) { return 'cm'; }
  }

  function setFitUnit(unit) {
    try {
      localStorage.setItem(FIT_UNIT_KEY, unit === 'in' ? 'in' : 'cm');
    } catch (_) {}
  }

  let pendingDeleteIndex = null;
  let pendingPhotoIndex = null;
  let autocompleteSelectionInProgress = false;
  let photoPreviewCurrentIndex = null;
  let addFormPhotoDataUrl = null;

  function getItemsViewMode() {
    try {
      const v = localStorage.getItem('armadio-items-view');
      return (v === 'grid' || v === 'list') ? v : 'list';
    } catch (_) { return 'list'; }
  }
  function setItemsViewMode(mode) {
    try { localStorage.setItem('armadio-items-view', mode); } catch (_) {}
  }

  function deleteItem(index) {
    const items = getItems();
    if (index < 0 || index >= items.length) return;
    items.splice(index, 1);
    saveItems(items);
    renderItems();
  }

  function updateItem(index, item) {
    const items = getItems();
    if (index < 0 || index >= items.length) return;
    const existing = items[index];
    const photo = existing && existing.photo ? existing.photo : (item.photo || null);
    items[index] = { itemType: item.itemType, brand: item.brand, size: item.size, color: item.color, photo: photo };
    saveItems(items);
    renderItems();
  }

  function reorderItemsFromDomOrder(listEl) {
    const lis = listEl.querySelectorAll('li[data-index]');
    const order = Array.from(lis).map(li => parseInt(li.getAttribute('data-index'), 10));
    const items = getItems();
    const reordered = order.map(i => items[i]).filter(Boolean);
    if (reordered.length !== items.length) return;
    saveItems(reordered);
    renderItems();
  }

  function sampleImageLuminance(img, samples) {
    if (!img || !img.complete || img.naturalWidth === 0) return 0.5;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0.5;
    const w = Math.min(img.naturalWidth, 64);
    const h = Math.min(img.naturalHeight, 64);
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    const step = Math.max(1, Math.floor((w * h) / (samples || 20)));
    let sum = 0;
    let n = 0;
    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      sum += (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      n++;
    }
    return n ? sum / n : 0.5;
  }

  function getItemsWithPhotos() {
    return getItems()
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.photo);
  }

  function openPhotoPreviewModal(index) {
    const items = getItems();
    if (index < 0 || index >= items.length || !items[index].photo) return;
    const withPhotos = getItemsWithPhotos();
    const pos = withPhotos.findIndex(({ index: i }) => i === index);
    if (pos === -1) return;
    photoPreviewCurrentIndex = withPhotos[pos].index;
    const item = items[photoPreviewCurrentIndex];
    const imgEl = document.getElementById('photo-preview-img');
    const detailsEl = document.getElementById('photo-preview-details');
    if (imgEl) {
      imgEl.src = item.photo;
      imgEl.alt = [item.itemType, item.brand, item.size].filter(Boolean).join(' · ');
    }
    if (detailsEl) detailsEl.textContent = [item.itemType, item.brand, item.size].filter(Boolean).join(' · ');
    const backdrop = document.getElementById('photo-preview-backdrop');
    if (backdrop) backdrop.classList.add('is-open');
    positionPhotoPreviewArrows();
    const closeBtn = document.getElementById('photo-preview-close');
    if (closeBtn && imgEl) {
      imgEl.onload = function () {
        const lum = sampleImageLuminance(imgEl, 30);
        closeBtn.classList.toggle('is-light', lum < 0.5);
        closeBtn.classList.toggle('is-dark', lum >= 0.5);
      };
      if (imgEl.complete) {
        const lum = sampleImageLuminance(imgEl, 30);
        closeBtn.classList.toggle('is-light', lum < 0.5);
        closeBtn.classList.toggle('is-dark', lum >= 0.5);
      }
    }
  }

  function positionPhotoPreviewArrows() {
    const backdrop = document.getElementById('photo-preview-backdrop');
    if (!backdrop) return;
    const modal = document.getElementById('photo-preview-modal');
    const prevBtn = document.getElementById('photo-preview-prev');
    const nextBtn = document.getElementById('photo-preview-next');
    if (!modal || !prevBtn || !nextBtn) return;
    const gap = Math.max(16, (window.innerWidth - modal.offsetWidth) / 2 * 0.5);
    prevBtn.style.left = gap + 'px';
    nextBtn.style.right = gap + 'px';
    const withPhotos = getItemsWithPhotos();
    const showArrows = withPhotos.length > 1;
    prevBtn.classList.toggle('hidden', !showArrows);
    nextBtn.classList.toggle('hidden', !showArrows);
  }

  function goToPrevPhotoPreview() {
    const withPhotos = getItemsWithPhotos();
    if (withPhotos.length === 0) return;
    const idx = withPhotos.findIndex(({ index }) => index === photoPreviewCurrentIndex);
    const prevIdx = idx <= 0 ? withPhotos[withPhotos.length - 1].index : withPhotos[idx - 1].index;
    openPhotoPreviewModal(prevIdx);
  }

  function goToNextPhotoPreview() {
    const withPhotos = getItemsWithPhotos();
    if (withPhotos.length === 0) return;
    const idx = withPhotos.findIndex(({ index }) => index === photoPreviewCurrentIndex);
    const nextIdx = idx < 0 || idx >= withPhotos.length - 1 ? withPhotos[0].index : withPhotos[idx + 1].index;
    openPhotoPreviewModal(nextIdx);
  }

  function openEditModal(index) {
    const items = getItems();
    if (index < 0 || index >= items.length) return;
    const item = items[index];
    const form = document.getElementById('edit-item-form');
    if (!form) return;
    const typeInput = form.querySelector('[name="itemType"]');
    const brandInput = form.querySelector('[name="brand"]');
    const sizeInput = form.querySelector('[name="size"]');
    const colorInput = form.querySelector('[name="color"]');
    if (typeInput) typeInput.value = item.itemType || '';
    if (brandInput) brandInput.value = item.brand || '';
    if (sizeInput) sizeInput.value = item.size || '';
    if (colorInput) colorInput.value = item.color || '';
    form.dataset.editIndex = String(index);
    document.getElementById('edit-modal-backdrop').classList.add('is-open');
  }

  function openPhotoModal(index) {
    pendingPhotoIndex = index;
    const items = getItems();
    const item = index >= 0 && index < items.length ? items[index] : null;
    const subtitle = document.getElementById('photo-modal-subtitle');
    if (subtitle && item) subtitle.textContent = [item.itemType, item.brand].filter(Boolean).join(' · ') || 'Item';
    else if (subtitle) subtitle.textContent = '';
    document.getElementById('photo-modal-backdrop').classList.add('is-open');
    document.getElementById('photo-file-input').value = '';
  }

  function answerArmadio(question) {
    const questionDisplay = (question || '').trim();
    const q = questionDisplay.toLowerCase();
    const items = getItems();
    const answerEl = document.getElementById('fab-answer-content');
    const box = document.getElementById('fab-answer-box');
    if (!answerEl || !box) return;

    var pendingAnswerContainer = null;

    function scrollToBottom() {
      answerEl.scrollTop = answerEl.scrollHeight;
    }

    function showAnswer(html) {
      if (pendingAnswerContainer) {
        pendingAnswerContainer.innerHTML = html;
        pendingAnswerContainer = null;
      } else {
        var exchange = document.createElement('div');
        exchange.className = 'fab-exchange';
        if (questionDisplay) {
          var qEl = document.createElement('p');
          qEl.className = 'fab-msg-q';
          qEl.textContent = questionDisplay;
          exchange.appendChild(qEl);
        }
        var aWrap = document.createElement('div');
        aWrap.className = 'fab-msg-a-wrap';
        aWrap.innerHTML = html;
        exchange.appendChild(aWrap);
        answerEl.appendChild(exchange);
      }
      box.classList.add('is-visible');
      scrollToBottom();
    }

    function showThinkingThen(fn) {
      var exchange = document.createElement('div');
      exchange.className = 'fab-exchange';
      if (questionDisplay) {
        var qEl = document.createElement('p');
        qEl.className = 'fab-msg-q';
        qEl.textContent = questionDisplay;
        exchange.appendChild(qEl);
      }
      var answerPlaceholder = document.createElement('div');
      answerPlaceholder.className = 'fab-msg-a-wrap';
      answerPlaceholder.innerHTML = '<p class="fab-msg-thinking"><span class="fab-thinking-dots"><span></span><span></span><span></span></span></p>';
      exchange.appendChild(answerPlaceholder);
      answerEl.appendChild(exchange);
      pendingAnswerContainer = answerPlaceholder;
      box.classList.add('is-visible');
      scrollToBottom();
      var wrap = document.getElementById('fab-wrap');
      if (wrap) wrap.classList.add('is-thinking');
      setTimeout(function () {
        if (wrap) wrap.classList.remove('is-thinking');
        fn();
      }, 400);
    }

    if (!q) return;

    if (q.includes('what brand') || q === 'brands') {
      showThinkingThen(() => {
        const brands = [...new Set(items.map(i => i.brand).filter(Boolean))];
        if (brands.length === 0) showAnswer('<p class="fab-msg-a">You don\'t have any items yet.</p>');
        else showAnswer('<p class="fab-msg-a">' + escapeHtml(brands.join(', ')) + '</p>');
      });
      return;
    }

    if ((q.includes('my style') || (q.includes('what') && q.includes('style'))) && !q.includes('size')) {
      showThinkingThen(function () {
        var summary = getStyleSummary(items);
        showAnswer('<p class="fab-msg-a">' + escapeHtml(summary) + '</p>');
      });
      return;
    }

    var sizeOfCategoryMatch = q.match(/(?:what'?s?\s+my\s+|my\s+)(pants?|shirts?|jackets?|shoes?|sweaters?|dresses?|skirts?)\s+size/i);
    if (sizeOfCategoryMatch) {
      var categoryWordFromSize = sizeOfCategoryMatch[1].toLowerCase();
      if (!typeCategoryStems[categoryWordFromSize] && typeCategoryStems[categoryWordFromSize + 's']) categoryWordFromSize = categoryWordFromSize + 's';
      var stemsFromSize = typeCategoryStems[categoryWordFromSize];
      if (stemsFromSize) {
        showThinkingThen(function () {
          var categoryItems = items.filter(i => {
            var t = (i.itemType || '').toLowerCase();
            return stemsFromSize.some(stem => t.includes(stem));
          });
          if (categoryItems.length === 0) {
            showAnswer('<p class="fab-msg-a">You don\'t have any ' + categoryWordFromSize + ' in your wardrobe yet.</p>');
            return;
          }
          var withSize = categoryItems.filter(i => (i.size || '').trim() !== '');
          if (withSize.length === 0) {
            showAnswer('<p class="fab-msg-a">You have ' + categoryWordFromSize + ' but no sizes saved for them yet.</p>');
            return;
          }
          var sizes = [...new Set(withSize.map(i => (i.size || '').trim()))];
          var brands = [...new Set(withSize.map(i => (i.brand || '').trim()).filter(Boolean))];
          if (sizes.length === 1) {
            var sizeVal = sizes[0];
            var sizeLabel = (categoryWordFromSize === 'shoes' ? 'shoe size' : 'size');
            if (brands.length === 1) {
              showAnswer('<p class="fab-msg-a">Based on your item from ' + escapeHtml(brands[0]) + ', your ' + sizeLabel + ' is ' + escapeHtml(sizeVal) + '.</p>');
            } else if (brands.length > 0) {
              var brandList = brands.slice(0, -1).join(', ') + ' and ' + brands[brands.length - 1];
              showAnswer('<p class="fab-msg-a">Based on the items from ' + escapeHtml(brandList) + ', your ' + sizeLabel + ' is ' + escapeHtml(sizeVal) + '.</p>');
            } else {
              showAnswer('<p class="fab-msg-a">Your ' + sizeLabel + ' is ' + escapeHtml(sizeVal) + '.</p>');
            }
          } else {
            var parts = withSize.map(i => escapeHtml((i.size || '') + (i.brand ? ' in ' + i.brand : '')));
            showAnswer('<p class="fab-msg-a">You have different sizes: ' + parts.join('; ') + '.</p>');
          }
        });
        return;
      }
    }

    if (q.includes('size in') || q.includes('size for') || q.includes('size of')) {
      const match = q.match(/size\s+(?:in|for|of)\s+(.+?)(?:\?|\.|!)?$/i);
      const word = match ? match[1].trim().replace(/\?|\.|!$/g, '').trim().toLowerCase() : '';
      let categoryWord = word;
      if (categoryWord && !typeCategoryStems[categoryWord] && typeCategoryStems[categoryWord + 's']) categoryWord = categoryWord + 's';
      const stems = categoryWord && typeCategoryStems[categoryWord];
      showThinkingThen(() => {
        if (stems) {
          var categoryItems = items.filter(i => {
            const t = (i.itemType || '').toLowerCase();
            return stems.some(stem => t.includes(stem));
          });
          if (categoryItems.length === 0) {
            showAnswer('<p class="fab-msg-a">You don\'t have any ' + categoryWord + ' in your wardrobe yet.</p>');
            return;
          }
          var withSize = categoryItems.filter(i => (i.size || '').trim() !== '');
          if (withSize.length === 0) {
            showAnswer('<p class="fab-msg-a">You have ' + categoryWord + ' but no sizes saved for them yet.</p>');
            return;
          }
          var sizes = [...new Set(withSize.map(i => (i.size || '').trim()))];
          var brands = [...new Set(withSize.map(i => (i.brand || '').trim()).filter(Boolean))];
          if (sizes.length === 1) {
            var sizeVal = sizes[0];
            var sizeLabel = (categoryWord === 'shoes' ? 'shoe size' : 'size');
            if (brands.length === 1) {
              showAnswer('<p class="fab-msg-a">Based on your item from ' + escapeHtml(brands[0]) + ', your ' + sizeLabel + ' is ' + escapeHtml(sizeVal) + '.</p>');
            } else if (brands.length > 0) {
              var brandList = brands.length === 1 ? brands[0] : brands.slice(0, -1).join(', ') + ' and ' + brands[brands.length - 1];
              showAnswer('<p class="fab-msg-a">Based on the items from ' + escapeHtml(brandList) + ', your ' + sizeLabel + ' is ' + escapeHtml(sizeVal) + '.</p>');
            } else {
              showAnswer('<p class="fab-msg-a">Your ' + sizeLabel + ' is ' + escapeHtml(sizeVal) + '.</p>');
            }
          } else {
            var parts = withSize.map(i => escapeHtml((i.size || '') + (i.brand ? ' in ' + i.brand : '')));
            showAnswer('<p class="fab-msg-a">You have different sizes: ' + parts.join('; ') + '.</p>');
          }
          return;
        }
        var found = items.filter(i => (i.brand || '').toLowerCase().includes(word));
        if (found.length === 0) showAnswer('<p class="fab-msg-a">No items from that brand.</p>');
        else {
          var sizesBrand = found.map(i => i.size).filter(Boolean);
          var uniq = [...new Set(sizesBrand)];
          showAnswer('<p class="fab-msg-a">' + escapeHtml(uniq.join(', ')) + '</p>');
        }
      });
      return;
    }

    if (q.includes('do i have') && (q.includes('brand') || q.includes(q))) {
      const rest = q.replace(/do i have\s+/, '').replace(/\s*brand\s*$/, '').trim().replace(/\?|\.|!$/g, '');
      const brandLower = (rest || q.replace(/do i have\s+/, '').trim().replace(/\?|\.|!$/g, '')).toLowerCase();
      showThinkingThen(() => {
        const found = items.some(i => (i.brand || '').toLowerCase().includes(brandLower));
        showAnswer('<p class="fab-msg-a">' + (found ? 'Yes.' : 'No.') + '</p>');
      });
      return;
    }

    if (q.includes('what pant') || q.includes('what shirt') || q.includes('what jacket') || q.includes('what dress') || q.includes('what sweater') || q.includes('what shoe')) {
      const typeMatch = q.match(/what\s+(pants?|shirts?|jackets?|dresses?|sweaters?|shoes?|sneakers?|etc\.?)/i);
      const typeKeyword = typeMatch ? typeMatch[1].replace(/s$/, '') : 'item';
      showThinkingThen(() => {
        const found = items.filter(i => (i.itemType || '').toLowerCase().includes(typeKeyword));
        if (found.length === 0) showAnswer('<p class="fab-msg-a">None.</p>');
        else showAnswer('<p class="fab-msg-a">' + escapeHtml(found.map(i => (i.brand + ' ' + (i.color || '')).trim()).join(', ')) + '</p>');
      });
      return;
    }

    if (q.includes('how many')) {
      const howManyMatch = q.match(/how\s+many\s+(\w+)/i);
      let categoryWord = howManyMatch ? howManyMatch[1].trim().toLowerCase() : '';
      if (categoryWord && !typeCategoryStems[categoryWord] && typeCategoryStems[categoryWord + 's']) categoryWord = categoryWord + 's';
      const stems = categoryWord && typeCategoryStems[categoryWord];
      showThinkingThen(() => {
        if (!stems) {
          showAnswer('<p class="fab-msg-a">You have ' + items.length + ' item' + (items.length === 1 ? '' : 's') + '.</p>');
          return;
        }
        const found = items.filter(i => {
          const t = (i.itemType || '').toLowerCase();
          return stems.some(stem => t.includes(stem));
        });
        const n = found.length;
        let label = categoryWord;
        if (n === 1 && (categoryWord === 'pants' || categoryWord === 'shorts')) {
          showAnswer('<p class="fab-msg-a">You have 1 pair of ' + categoryWord + '.</p>');
        } else if (n === 1 && categoryWord.endsWith('s') && categoryWord !== 'pants' && categoryWord !== 'shorts') {
          label = categoryWord.slice(0, -1);
          showAnswer('<p class="fab-msg-a">You have 1 ' + label + '.</p>');
        } else {
          showAnswer('<p class="fab-msg-a">You have ' + n + ' ' + categoryWord + '.</p>');
        }
      });
      return;
    }

    if (q.includes('what color') || q === 'colors') {
      showThinkingThen(() => {
        const colors = [...new Set(items.map(i => i.color).filter(Boolean))];
        if (colors.length === 0) showAnswer('<p class="fab-msg-a">No items yet.</p>');
        else showAnswer('<p class="fab-msg-a">' + escapeHtml(colors.join(', ')) + '</p>');
      });
      return;
    }

    const showMeMatch = q.match(/show\s+me\s+my\s+(.+)/);
    if (showMeMatch) {
      const part = showMeMatch[1].trim();
      const parts = part.split(/\s+/);
      let brand = '';
      let type = '';
      if (parts.length >= 2) {
        brand = parts[0];
        type = parts.slice(1).join(' ');
      } else {
        type = part;
      }
      showThinkingThen(() => {
        const found = items.filter(i => {
          const b = (i.brand || '').toLowerCase();
          const t = (i.itemType || '').toLowerCase();
          const matchBrand = !brand || b.includes(brand.toLowerCase());
          const matchType = !type || t.includes(type.toLowerCase());
          return matchBrand && matchType;
        });
        if (found.length === 0) showAnswer('<p class="fab-msg-a">No matching item.</p>');
        else {
          const firstIndex = getItems().findIndex(it => it === found[0]);
          if (found[0].photo && firstIndex >= 0) openPhotoPreviewModal(firstIndex);
          showAnswer('<p class="fab-msg-a">' + escapeHtml(found[0].brand + ' ' + found[0].itemType + (found[0].size ? ' (' + found[0].size + ')' : '')) + '</p>');
        }
      });
      return;
    }

    showAnswer('<p class="fab-msg-a">Try: "What\'s my style?", "What brands?", "Size in Zara", "What\'s my size of pants?", "Do I have Nike?", "What pants?", "How many?", "What colors?", or "Show me my Zara pants".</p>');
  }

  function renderItems() {
    const items = getItems();
    const listEl = document.getElementById('items-list');
    const gridEl = document.getElementById('items-grid');
    const toggleEl = document.getElementById('items-view-toggle');
    const sectionEl = listEl && listEl.closest('.items-section');
    const emptyEl = document.getElementById('items-empty');
    const headingEl = document.getElementById('items-heading');

    if (headingEl) {
      const count = items.length;
      const word = count === 1 ? '1 item' : count + ' items';
      headingEl.textContent = 'Your wardrobe, ' + word;
    }

    updateStyleSummary();

    if (sectionEl) {
      sectionEl.classList.toggle('has-items', items.length > 0);
    }
    if (emptyEl) {
      emptyEl.classList.toggle('items-empty', true);
    }

    if (!listEl) return;

    let itemsViewMode = getItemsViewMode();
    if (items.length < 3) {
      itemsViewMode = 'list';
      setItemsViewMode('list');
      if (sectionEl) sectionEl.classList.remove('items-view-grid');
      if (gridEl) { gridEl.classList.remove('is-visible'); gridEl.innerHTML = ''; gridEl.setAttribute('aria-hidden', 'true'); }
      if (toggleEl) toggleEl.hidden = true;
    } else {
      if (toggleEl) {
        toggleEl.hidden = false;
        const label = toggleEl.querySelector('.items-view-toggle-label');
        const iconEl = document.getElementById('items-view-toggle-icon');
        const isList = itemsViewMode === 'list';
        if (label) label.textContent = isList ? 'GRID' : 'LIST';
        if (iconEl) {
          iconEl.innerHTML = isList
            ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'
            : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>';
        }
        toggleEl.setAttribute('aria-label', isList ? 'Switch to grid view' : 'Switch to list view');
      }
      if (itemsViewMode === 'grid' && sectionEl && gridEl) {
        sectionEl.classList.add('items-view-grid');
        gridEl.classList.add('is-visible');
        gridEl.setAttribute('aria-hidden', 'false');
        const photoPlaceholderSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M16 8l2-2"/></svg>';
        const ellipsisSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>';
        gridEl.innerHTML = items.map((item, index) => {
          const logoUrl = getBrandLogoUrl(item.brand);
          const avatarHtml = logoUrl
            ? '<div class="items-grid-card-avatar"><img src="' + escapeHtml(logoUrl) + '" alt=""></div>'
            : '<div class="items-grid-card-avatar"><span class="items-grid-card-avatar-initials">' + escapeHtml(getBrandInitials(item.brand)) + '</span></div>';
          const line1 = escapeHtml((item.brand || '') + (item.brand && item.itemType ? ' · ' : '') + (item.itemType || ''));
          const line2 = escapeHtml([item.color, item.size].filter(Boolean).join(' · '));
          const photoContent = item.photo
            ? '<img src="' + escapeHtml(item.photo) + '" alt="">'
            : '<div class="items-grid-card-photo-placeholder">' + photoPlaceholderSvg + '</div>';
          const photoHtml = '<div class="items-grid-card-photo" data-index="' + index + '" role="button">' + photoContent + '<button type="button" class="items-grid-card-menu-btn" data-index="' + index + '" aria-label="Options" aria-haspopup="true" aria-expanded="false">' + ellipsisSvg + '</button><div class="items-grid-card-menu" role="menu" hidden><button type="button" class="items-grid-card-menu-item" data-action="view" data-index="' + index + '" role="menuitem">View</button><button type="button" class="items-grid-card-menu-item" data-action="edit" data-index="' + index + '" role="menuitem">Edit</button><button type="button" class="items-grid-card-menu-item" data-action="delete" data-index="' + index + '" role="menuitem">Delete</button></div></div>';
          return '<div class="items-grid-card" data-index="' + index + '" style="view-transition-name: item-' + index + '">' + photoHtml + '<div class="items-grid-card-info">' + avatarHtml + '<div class="items-grid-card-text"><p class="items-grid-card-line1">' + line1 + '</p><p class="items-grid-card-line2">' + line2 + '</p></div></div></div>';
        }).join('');
        gridEl.querySelectorAll('.items-grid-card').forEach(function (card) {
          const index = parseInt(card.getAttribute('data-index'), 10);
          const photoEl = card.querySelector('.items-grid-card-photo');
          const menuBtn = card.querySelector('.items-grid-card-menu-btn');
          const menu = card.querySelector('.items-grid-card-menu');
          function closeMenu() {
            if (menu) { menu.hidden = true; menuBtn && menuBtn.setAttribute('aria-expanded', 'false'); }
          }
          function openMenu() {
            gridEl.querySelectorAll('.items-grid-card-menu').forEach(function (m) { m.hidden = true; });
            gridEl.querySelectorAll('.items-grid-card-menu-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
            if (menu) { menu.hidden = false; menuBtn && menuBtn.setAttribute('aria-expanded', 'true'); }
            setTimeout(function () {
              document.addEventListener('click', function handler() {
                gridEl.querySelectorAll('.items-grid-card-menu').forEach(function (m) { m.hidden = true; });
                gridEl.querySelectorAll('.items-grid-card-menu-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
                document.removeEventListener('click', handler);
              });
            }, 0);
          }
          if (menuBtn && menu) {
            menuBtn.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              if (menu.hidden) openMenu(); else closeMenu();
            });
          }
          card.querySelectorAll('.items-grid-card-menu-item').forEach(function (itemBtn) {
            itemBtn.addEventListener('click', function (e) {
              e.preventDefault();
              e.stopPropagation();
              closeMenu();
              const idx = parseInt(itemBtn.getAttribute('data-index'), 10);
              const action = itemBtn.getAttribute('data-action');
              if (action === 'view') {
                const currentItems = getItems();
                if (currentItems[idx] && currentItems[idx].photo) openPhotoPreviewModal(idx);
                else openPhotoModal(idx);
              } else if (action === 'edit') {
                openEditModal(idx);
              } else if (action === 'delete') {
                pendingDeleteIndex = idx;
                document.getElementById('delete-confirm-backdrop').classList.add('is-open');
              }
            });
          });
          card.addEventListener('click', function (e) {
            if (e.target.closest('.items-grid-card-menu-btn') || e.target.closest('.items-grid-card-menu')) return;
            const idx = parseInt(card.getAttribute('data-index'), 10);
            if (e.target.closest('.items-grid-card-photo')) {
              e.preventDefault();
              e.stopPropagation();
              const currentItems = getItems();
              if (currentItems[idx] && currentItems[idx].photo) openPhotoPreviewModal(idx);
              else openPhotoModal(idx);
              return;
            }
            openEditModal(idx);
          });
        });
      } else {
        if (sectionEl) sectionEl.classList.remove('items-view-grid');
        if (gridEl) { gridEl.classList.remove('is-visible'); gridEl.innerHTML = ''; gridEl.setAttribute('aria-hidden', 'true'); }
      }
    }

    if (listEl._sortable) {
      listEl._sortable.destroy();
      listEl._sortable = null;
    }

    const gripSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>';

    listEl.innerHTML = items.map((item, index) => {
      const photoHtml = item.photo
        ? '<div class="item-photo" data-index="' + index + '" role="button" tabindex="0"><span class="item-photo-crop"><img src="' + escapeHtml(item.photo) + '" alt=""></span></div>'
        : '<button type="button" class="item-photo item-photo--placeholder" data-index="' + index + '" data-tooltip="Add photo" aria-label="Add photo"><span class="item-photo-placeholder-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M16 8l2-2"/></svg></span></button>';
      const logoUrl = getBrandLogoUrl(item.brand);
      const avatarHtml = logoUrl
        ? '<div class="item-avatar"><img src="' + escapeHtml(logoUrl) + '" alt=""></div>'
        : '<div class="item-avatar item-avatar--initials"><span class="item-avatar-initials">' + escapeHtml(getBrandInitials(item.brand)) + '</span></div>';
      const hex = getColorHex(item.color);
      const meta = escapeHtml([item.color, item.size].filter(Boolean).join(' · '));
      const swatch = item.color ? '<span class="item-color-swatch" style="background:' + escapeHtml(hex) + '"></span> ' : '';
      const vtName = items.length >= 3 ? ' style="view-transition-name: item-' + index + '"' : '';
      return '<li data-index="' + index + '" draggable="false"' + vtName + '>' +
        photoHtml +
        avatarHtml +
        '<div class="item-content">' +
        '<div class="item-name">' + escapeHtml((item.brand || '') + ' · ' + (item.itemType || '')) + '</div>' +
        '<div class="item-meta">' + swatch + meta + '</div>' +
        '</div>' +
        '<div class="item-actions">' +
        '<button type="button" class="item-action item-edit" data-index="' + index + '" aria-label="Edit">Edit</button>' +
        '<button type="button" class="item-action item-delete" data-index="' + index + '" aria-label="Delete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
        '<button type="button" class="item-drag-handle" data-index="' + index + '" draggable="true" aria-label="Drag to reorder">' + gripSvg + '</button>' +
        '</div></li>';
    }).join('');

    listEl.querySelectorAll('.item-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingDeleteIndex = parseInt(btn.getAttribute('data-index'), 10);
        document.getElementById('delete-confirm-backdrop').classList.add('is-open');
      });
    });
    listEl.querySelectorAll('.item-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(parseInt(btn.getAttribute('data-index'), 10)));
    });
    listEl.querySelectorAll('.item-photo--placeholder[data-index]').forEach(btn => {
      btn.addEventListener('click', () => openPhotoModal(parseInt(btn.getAttribute('data-index'), 10)));
    });
    listEl.querySelectorAll('.item-photo[data-index]:not(.item-photo--placeholder)').forEach(el => {
      el.addEventListener('click', () => openPhotoPreviewModal(parseInt(el.getAttribute('data-index'), 10)));
    });

    if (typeof Sortable !== 'undefined') {
      listEl._sortable = new Sortable(listEl, {
        handle: '.item-drag-handle',
        animation: 200,
        ghostClass: 'sortable-ghost',
        chosenClass: 'is-dragging',
        dragClass: 'sortable-drag',
        onEnd: function () {
          reorderItemsFromDomOrder(listEl);
        }
      });
    }
  }

  function getListForInput(input) {
    const key = input.getAttribute('data-autocomplete');
    if (!key || !suggestionData[key]) return [];
    const list = suggestionData[key];
    const val = (input.value || '').trim().toLowerCase();
    if (!val) return list.slice(0, 12);
    return list.filter(s => String(s).toLowerCase().includes(val)).slice(0, 12);
  }

  function initAutocompleteForInput(input, listId) {
    const listEl = document.getElementById(listId);
    if (!listEl || !input) return;
    let highlighted = -1;

    function showList() {
      const options = getListForInput(input);
      listEl.innerHTML = options.map((opt, i) => '<li class="autocomplete-item" data-value="' + escapeHtml(opt) + '" role="option">' + escapeHtml(opt) + '</li>').join('');
      listEl.classList.remove('open-upward');
      const listMaxHeight = 200;
      const inputRect = input.getBoundingClientRect();
      if (inputRect.bottom + listMaxHeight + 8 > (window.innerHeight || document.documentElement.clientHeight)) {
        listEl.classList.add('open-upward');
      }
      listEl.classList.add('is-open');
      listEl.setAttribute('aria-expanded', 'true');
      highlighted = -1;
      listEl.querySelectorAll('.autocomplete-item').forEach((li, i) => {
        li.addEventListener('mousedown', (e) => {
          e.preventDefault();
          autocompleteSelectionInProgress = true;
          setTimeout(function () { autocompleteSelectionInProgress = false; }, 250);
          input.value = li.getAttribute('data-value');
          hideList();
          input.focus();
        });
      });
    }

    function hideList() {
      listEl.classList.remove('is-open', 'open-upward');
      listEl.setAttribute('aria-expanded', 'false');
      highlighted = -1;
    }

    function selectHighlighted() {
      const items = listEl.querySelectorAll('.autocomplete-item');
      if (highlighted >= 0 && highlighted < items.length) {
        input.value = items[highlighted].getAttribute('data-value');
        hideList();
      }
    }

    input.addEventListener('input', showList);
    input.addEventListener('focus', showList);
    input.addEventListener('blur', () => setTimeout(hideList, 150));
    input.addEventListener('keydown', (e) => {
      const items = listEl.querySelectorAll('.autocomplete-item');
      if (!listEl.classList.contains('is-open')) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlighted = Math.min(highlighted + 1, items.length - 1);
        items.forEach((el, i) => el.classList.toggle('is-highlighted', i === highlighted));
        if (highlighted >= 0 && items[highlighted]) items[highlighted].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlighted = highlighted <= 0 ? -1 : highlighted - 1;
        items.forEach((el, i) => el.classList.toggle('is-highlighted', i === highlighted));
        if (highlighted >= 0 && items[highlighted]) items[highlighted].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectHighlighted();
      } else if (e.key === 'Escape') {
        hideList();
      }
    });
  }

  function initAddForm() {
    const form = document.getElementById('add-item-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var item = {
        itemType: (fd.get('itemType') || '').trim(),
        brand: (fd.get('brand') || '').trim(),
        size: (fd.get('size') || '').trim(),
        color: (fd.get('color') || '').trim(),
        photo: addFormPhotoDataUrl
      };
      var items = getItems();
      items.push(item);
      if (!saveItems(items)) {
        items.pop();
      } else {
        closeAddModal();
        renderItems();
      }
    });
  }

  function setAddFormPhoto(dataUrl) {
    addFormPhotoDataUrl = dataUrl;
    const emptyEl = document.getElementById('add-item-photo-empty');
    const previewEl = document.getElementById('add-item-photo-preview');
    const imgEl = document.getElementById('add-item-photo-preview-img');
    const removeBtn = document.getElementById('add-item-photo-remove');
    const fileInput = document.getElementById('add-item-photo-file');
    const cameraInput = document.getElementById('add-item-photo-camera');
    if (dataUrl) {
      if (emptyEl) emptyEl.hidden = true;
      if (previewEl) { previewEl.hidden = false; if (imgEl) imgEl.src = dataUrl; }
      if (removeBtn) removeBtn.hidden = false;
      if (fileInput) fileInput.value = '';
      if (cameraInput) cameraInput.value = '';
    } else {
      if (emptyEl) emptyEl.hidden = false;
      if (previewEl) previewEl.hidden = true;
      if (removeBtn) removeBtn.hidden = true;
      if (imgEl) imgEl.src = '';
      if (fileInput) fileInput.value = '';
      if (cameraInput) cameraInput.value = '';
    }
  }

  function initAddFormPhoto() {
    const dropEl = document.getElementById('add-item-photo-drop');
    const fileInput = document.getElementById('add-item-photo-file');
    const cameraInput = document.getElementById('add-item-photo-camera');
    const cameraBtn = document.getElementById('add-item-photo-camera-btn');
    const removeBtn = document.getElementById('add-item-photo-remove');

    function handleAddFormPhotoFile(file) {
      if (!file || !file.type.startsWith('image/')) return;
      var reader = new FileReader();
      reader.onload = function () {
        var raw = reader.result;
        compressImageForStorage(raw, 800, 0.82).then(function (dataUrl) {
          setAddFormPhoto(dataUrl);
        }).catch(function () {
          setAddFormPhoto(raw);
        });
      };
      reader.readAsDataURL(file);
    }

    if (cameraBtn && cameraInput) cameraBtn.addEventListener('click', function () { cameraInput.click(); });
    if (fileInput) fileInput.addEventListener('change', function () { if (fileInput.files && fileInput.files[0]) handleAddFormPhotoFile(fileInput.files[0]); });
    if (cameraInput) cameraInput.addEventListener('change', function () { if (cameraInput.files && cameraInput.files[0]) handleAddFormPhotoFile(cameraInput.files[0]); });
    if (removeBtn) removeBtn.addEventListener('click', function () { setAddFormPhoto(null); });

    if (dropEl) {
      dropEl.addEventListener('dragover', function (e) { e.preventDefault(); dropEl.classList.add('is-dragover'); });
      dropEl.addEventListener('dragleave', function () { dropEl.classList.remove('is-dragover'); });
      dropEl.addEventListener('drop', function (e) {
        e.preventDefault();
        dropEl.classList.remove('is-dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleAddFormPhotoFile(e.dataTransfer.files[0]);
      });
      dropEl.addEventListener('click', function (e) {
        if (!e.target.closest('button')) fileInput && fileInput.click();
      });
    }
  }

  function closeAddModal() {
    document.getElementById('add-modal-backdrop').classList.remove('is-open');
    const form = document.getElementById('add-item-form');
    if (form) form.reset();
    setAddFormPhoto(null);
  }

  function init() {
    var vv = window.visualViewport;
    function setViewportHeight() {
      document.documentElement.style.setProperty('--viewport-height', (vv ? vv.height : window.innerHeight) + 'px');
    }
    if (vv) {
      setViewportHeight();
      vv.addEventListener('resize', setViewportHeight);
      vv.addEventListener('scroll', setViewportHeight);
    }

    var addBackdrop = document.getElementById('add-modal-backdrop');
    var addClose = document.getElementById('add-modal-close');
    if (addBackdrop) {
      addBackdrop.addEventListener('click', (e) => {
        if (e.target !== addBackdrop) return;
        if (addBackdrop.querySelector('.autocomplete-list.is-open')) return;
        if (autocompleteSelectionInProgress) return;
        closeAddModal();
      });
    }
    if (addClose) addClose.addEventListener('click', closeAddModal);

    function openAddModal() {
      const form = document.getElementById('add-item-form');
      if (form) form.reset();
      setAddFormPhoto(null);
      document.getElementById('add-modal-backdrop').classList.add('is-open');
    }
    var addModalEl = document.getElementById('add-modal');
    if (addModalEl) {
      addModalEl.addEventListener('focusin', function (e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
          setTimeout(function () {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        }
      });
    }
    document.getElementById('add-manually-card').addEventListener('click', openAddModal);
    document.getElementById('add-manually-card').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAddModal();
      }
    });
    const emptyAddBtn = document.getElementById('items-empty-add-btn');
    if (emptyAddBtn) {
      emptyAddBtn.addEventListener('click', openAddModal);
      emptyAddBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAddModal();
        }
      });
    }

    const itemsViewToggle = document.getElementById('items-view-toggle');
    if (itemsViewToggle) {
      itemsViewToggle.addEventListener('click', () => {
        const next = getItemsViewMode() === 'list' ? 'grid' : 'list';
        const doSwitch = () => {
          setItemsViewMode(next);
          renderItems();
        };
        if (typeof document.startViewTransition === 'function') {
          document.startViewTransition(doSwitch);
        } else {
          doSwitch();
        }
      });
    }

    const deleteBackdrop = document.getElementById('delete-confirm-backdrop');
    document.getElementById('delete-confirm-yes').addEventListener('click', () => {
      if (pendingDeleteIndex != null) deleteItem(pendingDeleteIndex);
      pendingDeleteIndex = null;
      deleteBackdrop.classList.remove('is-open');
    });
    document.getElementById('delete-confirm-no').addEventListener('click', () => {
      pendingDeleteIndex = null;
      deleteBackdrop.classList.remove('is-open');
    });
    deleteBackdrop.addEventListener('click', (e) => { if (e.target === deleteBackdrop) { pendingDeleteIndex = null; deleteBackdrop.classList.remove('is-open'); } });

    const editForm = document.getElementById('edit-item-form');
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(editForm.dataset.editIndex, 10);
      if (isNaN(idx)) return;
      const item = {
        itemType: (editForm.querySelector('[name="itemType"]').value || '').trim(),
        brand: (editForm.querySelector('[name="brand"]').value || '').trim(),
        size: (editForm.querySelector('[name="size"]').value || '').trim(),
        color: (editForm.querySelector('[name="color"]').value || '').trim()
      };
      updateItem(idx, item);
      document.getElementById('edit-modal-backdrop').classList.remove('is-open');
    });
    document.getElementById('edit-cancel').addEventListener('click', () => document.getElementById('edit-modal-backdrop').classList.remove('is-open'));
    const editBackdrop = document.getElementById('edit-modal-backdrop');
    editBackdrop.addEventListener('click', (e) => {
      if (e.target !== editBackdrop) return;
      if (editBackdrop.querySelector('.autocomplete-list.is-open')) return;
      if (autocompleteSelectionInProgress) return;
      editBackdrop.classList.remove('is-open');
    });

    const photoBackdrop = document.getElementById('photo-modal-backdrop');
    document.getElementById('photo-modal-close').addEventListener('click', () => { photoBackdrop.classList.remove('is-open'); pendingPhotoIndex = null; });
    photoBackdrop.addEventListener('click', (e) => { if (e.target === photoBackdrop) { photoBackdrop.classList.remove('is-open'); pendingPhotoIndex = null; } });
    const photoInput = document.getElementById('photo-file-input');
    const photoDrop = document.getElementById('photo-drop-zone');
    function applyPhoto(file) {
      if (!file || !file.type.startsWith('image/')) return;
      var reader = new FileReader();
      reader.onload = function () {
        var raw = reader.result;
        compressImageForStorage(raw, 800, 0.82).then(function (dataUrl) {
          if (pendingPhotoIndex != null) {
            var items = getItems();
            if (pendingPhotoIndex >= 0 && pendingPhotoIndex < items.length) {
              var prev = items[pendingPhotoIndex].photo;
              items[pendingPhotoIndex].photo = dataUrl;
              if (!saveItems(items)) {
                items[pendingPhotoIndex].photo = prev;
              }
              renderItems();
            }
          }
          photoBackdrop.classList.remove('is-open');
          pendingPhotoIndex = null;
        }).catch(function () {
          if (pendingPhotoIndex != null) {
            var items = getItems();
            if (pendingPhotoIndex >= 0 && pendingPhotoIndex < items.length) {
              var prev = items[pendingPhotoIndex].photo;
              items[pendingPhotoIndex].photo = raw;
              if (!saveItems(items)) {
                items[pendingPhotoIndex].photo = prev;
              }
              renderItems();
            }
          }
          photoBackdrop.classList.remove('is-open');
          pendingPhotoIndex = null;
        });
      };
      reader.readAsDataURL(file);
    }
    photoInput.addEventListener('change', () => { if (photoInput.files && photoInput.files[0]) applyPhoto(photoInput.files[0]); });
    photoDrop.addEventListener('dragover', (e) => { e.preventDefault(); photoDrop.classList.add('is-dragover'); });
    photoDrop.addEventListener('dragleave', () => photoDrop.classList.remove('is-dragover'));
    photoDrop.addEventListener('drop', (e) => { e.preventDefault(); photoDrop.classList.remove('is-dragover'); if (e.dataTransfer.files && e.dataTransfer.files[0]) applyPhoto(e.dataTransfer.files[0]); });

    const previewBackdrop = document.getElementById('photo-preview-backdrop');
    document.getElementById('photo-preview-close').addEventListener('click', () => previewBackdrop.classList.remove('is-open'));
    previewBackdrop.addEventListener('click', (e) => { if (e.target === previewBackdrop) previewBackdrop.classList.remove('is-open'); });
    document.getElementById('photo-preview-prev').addEventListener('click', (e) => { e.stopPropagation(); goToPrevPhotoPreview(); });
    document.getElementById('photo-preview-next').addEventListener('click', (e) => { e.stopPropagation(); goToNextPhotoPreview(); });
    window.addEventListener('resize', positionPhotoPreviewArrows);

    document.getElementById('fab-answer-close').addEventListener('click', function () {
      var box = document.getElementById('fab-answer-box');
      var content = document.getElementById('fab-answer-content');
      if (content) content.innerHTML = '';
      box.classList.remove('is-visible');
    });
    const fabForm = document.getElementById('fab-form');
    const fabInput = document.getElementById('fab-input');
    fabForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = (fabInput.value || '').trim();
      if (q) answerArmadio(q);
      fabInput.value = '';
      fabInput.focus();
    });

    initAutocompleteForInput(document.getElementById('field-item-type'), 'autocomplete-list');
    initAutocompleteForInput(document.getElementById('field-brand'), 'autocomplete-list-brand');
    initAutocompleteForInput(document.getElementById('field-size'), 'autocomplete-list-size');
    initAutocompleteForInput(document.getElementById('field-color'), 'autocomplete-list-color');
    initAutocompleteForInput(document.getElementById('edit-field-item-type'), 'autocomplete-list-edit-itemType');
    initAutocompleteForInput(document.getElementById('edit-field-brand'), 'autocomplete-list-edit-brand');
    initAutocompleteForInput(document.getElementById('edit-field-size'), 'autocomplete-list-edit-size');
    initAutocompleteForInput(document.getElementById('edit-field-color'), 'autocomplete-list-edit-color');

    initAddForm();
    initAddFormPhoto();
    initFitSection();
    renderItems();
  }

  function fillFitSelect(el, key, unit) {
    if (!el) return;
    var range = FIT_RANGES[key];
    if (!range) return;
    el.innerHTML = '';
    var optEmpty = document.createElement('option');
    optEmpty.value = '';
    optEmpty.textContent = '—';
    el.appendChild(optEmpty);
    var steps = Math.round((range.max - range.min) / range.step) + 1;
    for (var i = 0; i < steps; i++) {
      var v = range.min + i * range.step;
      v = Math.round(v * 10) / 10;
      var opt = document.createElement('option');
      opt.value = String(v);
      opt.textContent = unit === 'in' ? (v / 2.54).toFixed(1) + ' in' : (range.step >= 1 ? Math.round(v) : v) + ' cm';
      el.appendChild(opt);
    }
    var data = getFit();
    var val = data[key];
    el.value = val !== undefined && val !== null && val !== '' ? String(val) : '';
  }

  function updateFitUnitDesc(unit) {
    var desc = document.getElementById('fit-section-desc');
    if (desc) desc.textContent = 'Body measurements for sizing and shopping.';
  }

  function initFitSection() {
    var unit = getFitUnit();
    updateFitUnitDesc(unit);

    var toggleWrap = document.querySelector('.fit-unit-toggle');
    if (toggleWrap) {
      toggleWrap.querySelectorAll('.fit-unit-btn').forEach(function (btn) {
        var u = btn.getAttribute('data-unit');
        btn.classList.toggle('is-active', u === unit);
        btn.setAttribute('aria-pressed', u === unit ? 'true' : 'false');
        btn.addEventListener('click', function () {
          if (u === unit) return;
          unit = u;
          setFitUnit(unit);
          toggleWrap.querySelectorAll('.fit-unit-btn').forEach(function (b) {
            var ub = b.getAttribute('data-unit');
            b.classList.toggle('is-active', ub === unit);
            b.setAttribute('aria-pressed', ub === unit ? 'true' : 'false');
          });
          updateFitUnitDesc(unit);
          FIT_KEYS.forEach(function (key) {
            fillFitSelect(document.getElementById('fit-' + key), key, unit);
          });
        });
      });
    }

    FIT_KEYS.forEach(function (key) {
      var el = document.getElementById('fit-' + key);
      if (!el) return;
      fillFitSelect(el, key, unit);
      if (el._fitListener) return;
      el._fitListener = true;
      el.addEventListener('change', function () {
        var next = getFit();
        var raw = el.value;
        if (raw === '') {
          delete next[key];
        } else {
          var num = parseFloat(raw);
          if (!isNaN(num)) next[key] = num;
        }
        saveFit(next);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
