/* GLN Type Studio: original Saw Cfcr legacy-font design gallery.
   Preview images only. No legacy font binaries shipped or applied to Unicode. */
(() => {
  'use strict';
  const root = document.getElementById('legacyFontStudio');
  if (!root) return;
  const $ = id => document.getElementById(id);
  const fontNumbers = ["000", "001", "002", "003", "004", "005", "006", "007", "008", "009", "010", "011", "012", "013", "014", "015", "016", "017", "018", "019", "020", "021", "023", "024", "025", "026", "027", "028", "029", "030", "031", "032", "033", "034", "035", "036", "037", "038", "040", "041", "042", "043", "044", "045", "046", "047", "048", "049", "050", "051", "052", "053", "054", "055", "056", "057", "058", "059", "060", "061", "063", "064", "065", "066", "067", "068", "069", "070", "071", "072", "073", "074", "075", "076", "077", "078", "079", "080", "081", "082", "083", "084", "085", "086", "087", "088", "089", "090", "091", "092"];
  const styles = fontNumbers.map((id, index) => ({ id, label: `Saw cfcr${id}`, index }));
  const safeStoreGet = () => { try {
    const ids = JSON.parse(localStorage.getItem('glnSawCfcrFavoritesV1') || '[]');
    return new Set(Array.isArray(ids) ? ids.filter(x => fontNumbers.includes(x)) : []);
  } catch { return new Set(); } };
  const favorites = safeStoreGet();
  const persist = () => { try { localStorage.setItem('glnSawCfcrFavoritesV1', JSON.stringify([...favorites])); } catch {} };
  const search = $('legacyFontSearch');
  const grid = $('legacyFontGrid');
  const favoritesOnly = $('legacyFontFavoritesOnly');
  const more = $('legacyFontShowMore');
  const showing = $('legacyFontShowing');
  const selection = $('legacyFontSelection');
  const selectionName = $('legacyFontSelectedName');
  const selectionSample = $('legacyFontSelectedPreview');
  let selectedId = '';
  let visibleCount = 12;
  let onlyFavorites = false;

  function setSprite(node, index) {
    const c = index % 6;
    const r = Math.floor(index / 6);
    node.style.backgroundPosition = `${c / 5 * 100}% ${r / 14 * 100}%`;
  }
  const filtered = () => styles.filter(s => {
    const key = search.value.trim().toLowerCase().replace(/^saw\s*cfcr\s*/, '');
    return (!onlyFavorites || favorites.has(s.id)) && (!key || s.id.includes(key) || s.label.toLowerCase().includes(key));
  });
  function choose(style) {
    selectedId = style.id;
    selection.hidden = false;
    selectionName.textContent = style.label;
    setSprite(selectionSample, style.index);
    selectionSample.setAttribute('aria-label', `${style.label} original legacy font sample`);
    updateCards();
  }
  function updateCards() {
    grid.querySelectorAll('[data-style]').forEach(card => {
      const id = card.dataset.style;
      const button = card.querySelector('.legacy-font-fav');
      const chosen = card.querySelector('.legacy-font-pick');
      const saved = favorites.has(id);
      card.classList.toggle('is-selected', selectedId === id);
      chosen.setAttribute('aria-pressed', String(selectedId === id));
      button.textContent = saved ? '★' : '☆';
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${id} ${saved ? 'from' : 'to'} favorites`);
    });
  }
  function render() {
    const matches = filtered();
    const visible = matches.slice(0, visibleCount);
    const fragment = document.createDocumentFragment();
    for (const style of visible) {
      const card = document.createElement('div');
      card.className = 'legacy-font-card';
      card.dataset.style = style.id;
      card.setAttribute('role','listitem');
      const pick = document.createElement('button');
      pick.type = 'button'; pick.className = 'legacy-font-pick';
      pick.setAttribute('aria-label', `Preview ${style.label} legacy font`);
      pick.setAttribute('aria-pressed', String(style.id === selectedId));
      const sample = document.createElement('span');
      sample.className = 'legacy-font-sample';
      sample.setAttribute('role','img');
      sample.setAttribute('aria-label', 'Original Saw Cfcr legacy font key sample');
      setSprite(sample, style.index);
      const name = document.createElement('span'); name.className = 'legacy-font-name'; name.textContent = style.label;
      pick.append(sample,name);
      pick.addEventListener('click', () => choose(style));
      const fav = document.createElement('button');
      fav.className = 'legacy-font-fav'; fav.type = 'button';
      fav.addEventListener('click', () => {
        if (favorites.has(style.id)) favorites.delete(style.id); else favorites.add(style.id);
        persist();
        if (onlyFavorites) render(); else updateCards();
      });
      card.append(pick, fav);
      fragment.append(card);
    }
    grid.replaceChildren(fragment);
    grid.toggleAttribute('data-empty', !matches.length);
    if (!matches.length) {
      const empty = document.createElement('p'); empty.className = 'legacy-font-empty';
      empty.textContent = onlyFavorites ? 'No saved styles match. Turn off Favorites only or star a design.' : 'No matching styles. Try a different font number.';
      grid.append(empty);
    }
    showing.textContent = `${Math.min(visible.length,matches.length)} of ${matches.length} styles`;
    more.hidden = visible.length >= matches.length;
    more.textContent = `Show more (${matches.length-visible.length} remaining)`;
    updateCards();
  }
  search.addEventListener('input', () => { visibleCount = 12; render(); });
  favoritesOnly.addEventListener('click', () => {
    onlyFavorites = !onlyFavorites;
    favoritesOnly.setAttribute('aria-pressed', String(onlyFavorites));
    favoritesOnly.textContent = onlyFavorites ? '★ Favorites only' : '☆ Favorites only';
    visibleCount = 12; render();
  });
  more.addEventListener('click', () => { visibleCount += 18; render(); });
  render();
})();
