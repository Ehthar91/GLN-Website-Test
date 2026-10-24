/* Saw Cfcr font gallery and opt-in local-only visual experiment. No font binaries shipped. */
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
    document.dispatchEvent(new CustomEvent('gln:cfcr-style-chosen',{detail:{id:style.id}}));
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

/* GLN Karen Font Studio: local-only, experimental Unicode -> Saw Cfcr styled preview.
   Never edits, saves, or copies converted legacy text. No legacy font binaries included.
   Preliminary chart based on a historical Sgaw Karen encoding reference (Unicode L2/05-178),
   not a claim of fully verified typesetting for each legacy font. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const editor = $('typeEditor');
  const preview = $('cfcrLivePreview');
  const upload = $('cfcrLocalFonts');
  const status = $('cfcrFontStatus');
  const detail = $('cfcrPreviewStatus');
  const pickedName = $('cfcrActiveStyle');
  const pasteHint = $('cfcrFallbackHint');
  if (!editor || !preview || !upload) return;

  // Historic Sgaw Karen keyboard encoding. Map only symbols supported by the
  // reference. Unmapped Myanmar words remain in Unicode Padauk (never guessed).
  const pairs = [
    [0x1000,'u'],[0x1001,'c'],[0x1002,'*'],[0x1003,'C'],[0x1004,'i'],
    [0x1005,'p'],[0x1006,'q'],[0x1050,'S'],[0x100A,'n'],[0x1010,'w'],
    [0x1011,'x'],[0x1012,"'"],[0x1014,'e'],[0x1015,'y'],[0x1016,'z'],
    [0x1018,'b'],[0x1019,'r'],[0x101A,'<'],[0x101B,'\\'],[0x101C,'v'],
    [0x101D,'0'],[0x101E,'o'],[0x101F,'['],[0x1021,'t'],[0x1027,'{'],
    [0x102C,'g'],[0x1036,'H'],[0x1051,'U'],[0x102F,'k'],[0x1030,'l'],
    [0x1037,'h'],[0x1032,'J'],[0x102D,'d'],[0x102E,'D'],
    [0x1052,'I'],[0x1053,'P'],[0x1038,';'],[0x1054,'O'],[0x1055,':'],
    [0x103E,'S'],[0x103B,'a'],[0x103C,']'],[0x103D,'G'],
    [0x103A,'f'],[0x104A,','],[0x104B,'.']
  ];
  for (let digit=0;digit<=9;digit++) pairs.push([0x1040+digit,String(digit)]);
  const legacyMap = new Map(pairs.map(([code, value]) => [String.fromCodePoint(code),value]));
  const myanmarCluster = /[\u1000-\u109f\uAA60-\uAA7F]+|[^\u1000-\u109f\uAA60-\uAA7F]+/gu;
  const localFiles = new Map();
  const loadedFonts = new Map();
  let currentStyle = '000';
  let currentFont = null;
  let archive = null;
  let actionVersion = 0;

  // Testable pure converter. Unknown Myanmar sequences remain unchanged.
  function convertUnicode(source) {
    let mapped = 0, total = 0, fallbacks = 0;
    const runs = [];
    for (const chunk of source.match(myanmarCluster) || []) {
      const isMyanmar = /[\u1000-\u109f\uAA60-\uAA7F]/u.test(chunk);
      if (!isMyanmar) { runs.push({text:chunk, legacy:false, missing:false}); continue; }
      const chars = [...chunk];
      total += chars.length;
      const complete = chars.every(char => legacyMap.has(char));
      if (complete) {
        mapped += chars.length;
        runs.push({text:chars.map(c=>legacyMap.get(c)).join(''), legacy:true, missing:false});
      } else {
        fallbacks += chars.length;
        runs.push({text:chunk, legacy:false, missing:true});
      }
    }
    return {runs, mapped, total, fallbacks};
  }
  // Exposed for local QA; never used to alter the editor or the clipboard.
  window.GLN_CFCR_EXPERIMENT = { convertUnicode, mappedCodepoints: pairs.map(([cp])=>cp) };

  function update() {
    const source = editor.value || 'ကညီကျိာ်';
    preview.replaceChildren();
    pickedName.textContent = 'Saw cfcr'+currentStyle;
    const selectedLang = document.querySelector('#languageSelector [data-language][aria-pressed="true"]')?.dataset.language;
    if (selectedLang && selectedLang !== 'ksw') {
      const span = document.createElement('span');
      span.textContent = editor.value || (selectedLang === 'en' ? 'Type here to preview your text' : 'Type Pwo Karen here…');
      preview.append(span);
      preview.classList.remove('cfcr-preview-enabled');
      detail.textContent = 'Saw Cfcr is a Sgaw Karen legacy-font collection; conversion is disabled for Pwo Karen and English.';
      pasteHint.textContent = 'The original Unicode or English editor text remains unchanged.';
      return;
    }
    if (!currentFont) {
      const span = document.createElement('span');
      span.textContent = source;
      preview.append(span);
      preview.classList.remove('cfcr-preview-enabled');
      detail.textContent = 'Unicode reference shown. Load your own Saw Cfcr ZIP or TTFs to enable the experimental legacy design.';
      pasteHint.textContent = 'Your original Unicode text remains in the editor. No font file is uploaded.';
      return;
    }
    preview.classList.add('cfcr-preview-enabled');
    const result = convertUnicode(source.slice(0,8000));
    for (const run of result.runs) {
      const span = document.createElement('span');
      span.textContent = run.text;
      if (run.legacy) span.style.fontFamily = `"${currentFont}", sans-serif`;
      if (run.missing) { span.className = 'cfcr-unmapped'; span.title='Unicode fallback: conversion not verified for this text'; }
      preview.append(span);
    }
    const percent = result.total ? Math.round(result.mapped/result.total*100) : 100;
    detail.textContent = `${percent}% of Myanmar characters mapped to experimental legacy codes`+
      (result.fallbacks ? ' · Unmapped words display in Padauk' : '')+
      (editor.value.length>8000 ? ' · Preview limited to first 8,000 characters' : '');
    pasteHint.textContent = 'Visual experiment only: older Saw Cfcr fonts may have misplaced vowel and tone marks. Unicode copy/download is unchanged.';
  }

  function parseZip(file) {
    return file.arrayBuffer().then(buffer => {
      const view = new DataView(buffer), bytes = new Uint8Array(buffer);
      let eocd = -1;
      for(let p=buffer.byteLength-22;p>=Math.max(0,buffer.byteLength-65557);p--) {
        if(view.getUint32(p,true)===0x06054b50){eocd=p;break;}
      }
      if(eocd<0) throw new Error('Invalid ZIP (central directory not found).');
      const count=view.getUint16(eocd+10,true);
      const offset=view.getUint32(eocd+16,true);
      if (count>500 || offset>=buffer.byteLength) throw new Error('ZIP contains too many files or is invalid.');
      let pos=offset;
      const entries=new Map();
      const decode=new TextDecoder('utf-8');
      for(let i=0;i<count;i++){
        if(view.getUint32(pos,true)!==0x02014b50) throw new Error('Invalid ZIP directory.');
        const method=view.getUint16(pos+10,true), compressed=view.getUint32(pos+20,true),
          expanded=view.getUint32(pos+24,true), nlen=view.getUint16(pos+28,true),
          elen=view.getUint16(pos+30,true), clen=view.getUint16(pos+32,true),
          local=view.getUint32(pos+42,true);
        if(pos+46+nlen>buffer.byteLength || local+30>buffer.byteLength) throw new Error('Invalid ZIP entry.');
        const name=decode.decode(bytes.subarray(pos+46,pos+46+nlen));
        const match=name.match(/Saw\s*cfcr(\d{3})\.ttf$/i);
        if(match && (method===0 || method===8) && expanded<=4_000_000 && compressed<=4_000_000)
          entries.set(match[1],{method,compressed,expanded,local});
        pos+=46+nlen+elen+clen;
      }
      if (!entries.size) throw new Error('No Saw cfcr###.ttf files found inside the ZIP.');
      return {view,bytes,entries};
    });
  }
  async function zipFont(entry) {
    const {view,bytes} = archive;
    if(view.getUint32(entry.local,true)!==0x04034b50) throw new Error('Invalid ZIP font entry.');
    const p=entry.local+30+view.getUint16(entry.local+26,true)+view.getUint16(entry.local+28,true);
    if(p+entry.compressed>bytes.length) throw new Error('Incomplete ZIP font entry.');
    const compressed=bytes.slice(p,p+entry.compressed);
    if(entry.method===0)return compressed.buffer;
    if(typeof DecompressionStream!=='function')throw new Error('This browser cannot unpack ZIPs. Choose the TTF files instead.');
    const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const output=await new Response(stream).arrayBuffer();
    if(output.byteLength!==entry.expanded)throw new Error('Font decompression size mismatch.');
    return output;
  }
  async function loadFont(style) {
    if(loadedFonts.has(style)) return loadedFonts.get(style);
    const record=localFiles.get(style);
    if(!record) return null;
    const buffer=record.kind==='file'?await record.file.arrayBuffer():await zipFont(record.entry);
    if(buffer.byteLength>4_000_000)throw new Error('Font file is too large.');
    const family='GLN-SawCfcr-Local-'+style;
    const font=new FontFace(family,buffer,{style:'normal',weight:'normal'});
    await font.load();
    document.fonts.add(font);
    loadedFonts.set(style,family);
    return family;
  }
  async function activate(style) {
    currentStyle=style;
    const version=++actionVersion;
    status.textContent=`Looking for Saw cfcr${style} on this device…`;
    try {
      const font=await loadFont(style);
      if(version!==actionVersion)return;
      currentFont=font;
      status.textContent=font?`Using Saw cfcr${style} from your local files · not uploaded`:
        `Saw cfcr${style} not loaded · choose the original ZIP or matching TTF files`;
    } catch(err) {
      if(version!==actionVersion)return;
      currentFont=null;
      status.textContent=`Unable to load font: ${err.message}`;
    }
    update();
  }
  async function loadSelectedFiles(event) {
    const files=[...event.target.files];
    if(!files.length)return;
    const version=++actionVersion;
    status.textContent='Reading local font files…';
    try {
      archive=null;localFiles.clear();loadedFonts.clear();
      for(const file of files){
        if(/\.zip$/i.test(file.name)){
          if(file.size>40_000_000)throw new Error('ZIP is too large.');
          archive=await parseZip(file);
          for (const [id,entry] of archive.entries) localFiles.set(id,{kind:'zip',entry});
        } else {
          const m=file.name.match(/Saw\s*cfcr(\d{3})\.ttf$/i);
          if(m && file.size<=4_000_000) localFiles.set(m[1],{kind:'file',file});
        }
      }
      if(!localFiles.size)throw new Error('Choose the original Saw Cfcr ZIP or Saw cfcr### TTF files.');
      status.textContent=`${localFiles.size} styles available locally. Loading selection…`;
      // Font loading is per style; no 90-font memory or network transfer.
      await activate(currentStyle);
    } catch(err) {
      if(version>actionVersion) return;
      archive=null;localFiles.clear();currentFont=null;
      status.textContent=`Cannot use the selected files: ${err.message}`;
      update();
    }
  }
  upload.addEventListener('change',loadSelectedFiles);
  editor.addEventListener('input',update);
  $('languageSelector')?.addEventListener('click',()=>queueMicrotask(update));
  $('clearBtn')?.addEventListener('click',()=>queueMicrotask(update));
  // The current gallery publishes a safe selection event on actual card clicks.
  document.addEventListener('gln:cfcr-style-chosen',ev=>{
    if(typeof ev.detail?.id==='string' && /^\d{3}$/.test(ev.detail.id))activate(ev.detail.id);
  });
  activate(currentStyle);
})();
