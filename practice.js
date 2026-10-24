/* GLN Guided Typing Tutor.
   GLN's original Unicode keyboard remains the single source of truth.
   A keyboard exercise has three lengths; lesson choices are grouped by level.
*/
const karenLessons=[
  {title:'Basic letters',focus:'ဆ တ န မ အ ပ က င သ စ',text:'ဆ တ န မ အ ပ က င သ စ ဆ တ န မ အ ပ က င သ စ'},
  // Use reachable keys from the GLN/KarenKNU keyboard (no standalone U+1031 on Sgaw A).
  {title:'Vowels and marks',focus:'ါ ိ ု ူ ၢ ၣ် ၤ ဲ ့ း',text:'ါ ိ ု ူ ၢ ၣ် ၤ ဲ ့ း ါ ိ ု ူ ၢ ၣ် ၤ ဲ ့ း'},
  {title:'Family words',focus:'ဟံၣ်ဖိဃီဖိ',text:'ဟံၣ်ဖိဃီဖိ မိၢ် ပၢ် မိၢ်ပၢ် ဖိခွါ ဖိမုၣ်'},
  {title:'Days of the week',focus:'မုၢ်ဒဲး',text:'မုၢ်ဒဲး မုၢ်ဆၣ် မုၢ်ယူာ် မုၢ်ပျဲၤ မုၢ်လ့ဧိၤ'},
  {title:'Food words',focus:'တၢ်အီၣ်',text:'တၢ်အီၣ် မ့ၤ ညၣ် ဆီညၣ် ထိးညၣ် ကျီၢ်ညၣ်'},
  {title:'Time expressions',focus:'ကိးနံၤဒဲး',text:'ကိးနံၤဒဲး ကိးဂီၤဒဲး ကိးဟါဒဲး ကိးနၤဒဲး ကိးနွံဒဲး'}
];
const englishLessons=[
  {title:'Home row',focus:'a s d f j k l',text:'a s d f j k l a s d f j k l'},
  {title:'Top row',focus:'q w e r t y u i o p',text:'q w e r t y u i o p q w e r t y'},
  {title:'Bottom row',focus:'z x c v b n m',text:'z x c v b n m z x c v b n m'},
  {title:'Common words',focus:'the and you',text:'the and you can type with good form'},
  {title:'School words',focus:'class book pencil',text:'class teacher student book pencil folder'},
  {title:'Capital letters',focus:'Shift + letter',text:'Karen English School Monday Friday'}
];
const pwoLessons=[
  {title:'Basic letters',focus:'ဆ တ န မ အ ပ က င သ စ',text:'ဆ တ န မ အ ပ က င သ စ ဆ တ န မ အ ပ က င သ စ'},
  {title:'Vowels and marks',focus:'ေ ျ ိ ် ါ ့ ြ ု ူ း',text:'ေ ျ ိ ် ါ ့ ြ ု ူ း ေ ျ ိ ် ါ ့ ြ ု ူ း'},
  {title:'Lower row',focus:'ဖ ထ ခ လ ဘ ည ာ',text:'ဖ ထ ခ လ ဘ ည ာ ဖ ထ ခ လ ဘ ည ာ'},
  {title:'Shift letters',focus:'ဇ ဝ ၞ ၟ ဍ ဥ ၚ ဳ ဏ',text:'ဇ ဝ ၞ ၟ ဍ ဥ ၚ ဳ ဏ ဇ ဝ ၞ ၟ ဍ'},
  {title:'More shift letters',focus:'ဗ ှ ီ ္ ွ ံ ဲ ဒ ဓ ဂ',text:'ဗ ှ ီ ္ ွ ံ ဲ ဒ ဓ ဂ ဗ ှ ီ ္ ွ'},
  {title:'Punctuation',focus:'၊ ။',text:'ဆ တ န၊ မ အ ပ။ က င သ၊ စ ဟ ဖ။'}
];
function lessonsForLanguage(){return typingLanguage==='en'?englishLessons:typingLanguage==='pwo'?pwoLessons:karenLessons}
const typeView=document.querySelector('#typeView'),practiceView=document.querySelector('#practiceView'),navType=document.querySelector('#navType'),navPractice=document.querySelector('#navPractice');
const lessonSelect=document.querySelector('#lessonSelect'),levelSelect=document.querySelector('#practiceLevel'),exerciseSelect=document.querySelector('#practiceExercise');
const targetText=document.querySelector('#targetText'),practiceKeyboard=document.querySelector('#practiceKeyboard'),practiceInput=document.querySelector('#practiceInput');
const levels=['Beginner','Intermediate','Advanced'];
function lessonStorageKey(){return typingLanguage==='en'?'englishLesson':typingLanguage==='pwo'?'pwoLesson':'karenLesson'}
function exerciseStorageKey(){return `glnTutorExercise_${typingLanguage}`}
let lessons=lessonsForLanguage();
let lessonIndex=Math.max(0,Math.min(lessons.length-1,Number(localStorage.getItem(lessonStorageKey())||0)||0));
let levelIndex=Math.floor(lessonIndex/2);
let exerciseIndex=Math.max(0,Math.min(2,Number(localStorage.getItem(exerciseStorageKey())??1)));
let position=0,attempts=0,errors=0,startTime=0,chunks=[],practiceShifted=false,physicalShiftHeld=false,overrideShift=null,fingerGuideVisible=true;
let lastGoodText='';
function allMappings(){return mappingsForLanguage(typingLanguage)}
function exerciseText(){const text=lessons[lessonIndex].text;if(exerciseIndex===1)return text;if(exerciseIndex===2)return `${text} ${text}`;const words=text.trim().split(/\s+/);return words.slice(0,Math.max(5,Math.ceil(words.length*.55))).join(' ')}
function expectedMapping(){const text=exerciseText();if(position>=text.length)return null;
  if(text[position]===' ')return {key:'Space',value:' ',shift:false};
  return allMappings().find(m=>m.value&&text.startsWith(m.value,position))||null;
}
function rebuildLessonOptions(){const available=lessons.map((lesson,i)=>({lesson,i})).filter(({i})=>Math.floor(i/2)===levelIndex);lessonSelect.innerHTML='';available.forEach(({lesson,i})=>{const option=document.createElement('option');option.value=i;option.textContent=`${i+1}. ${lesson.title}`;lessonSelect.appendChild(option)});if(!available.some(({i})=>i===lessonIndex))lessonIndex=available[0]?.i??0;lessonSelect.value=String(lessonIndex);levelSelect.value=String(levelIndex);exerciseSelect.value=String(exerciseIndex)}
function showView(view){const practice=view==='practice';typeView.hidden=practice;practiceView.hidden=!practice;
  const games=document.querySelector('#gamesView');if(games)games.hidden=true;
  const quiz=document.querySelector('#quizView');if(quiz)quiz.hidden=true;
  if(typeof closeRace==='function')closeRace();
  navType.classList.toggle('active',!practice);navPractice.classList.toggle('active',practice);
  const gamesNav=document.querySelector('#navGames');if(gamesNav)gamesNav.classList.remove('active');
  const quizNav=document.querySelector('#navQuiz');if(quizNav)quizNav.classList.remove('active');
  if(practice){renderLesson();setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),0)}else editor.focus()
}
navType.onclick=()=>showView('type');navPractice.onclick=()=>showView('practice');
function splitGraphemes(text){if(typeof Intl!=='undefined'&&typeof Intl.Segmenter==='function')return [...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)].map(x=>({segment:x.segment,index:x.index}));let i=0;return Array.from(text,ch=>{const obj={segment:ch,index:i};i+=ch.length;return obj})}
function renderTarget(){const text=exerciseText();targetText.textContent='';let activeMarked=false;
  splitGraphemes(text).forEach(({segment,index})=>{const span=document.createElement('span');span.textContent=segment;
    if(index+segment.length<=position)span.className='done';else if(!activeMarked){span.className='current';activeMarked=true}else span.className='pending';
    targetText.appendChild(span)});
  const complete=position>=text.length;
  document.querySelector('#nextLesson').hidden=!complete;
  if(complete){document.querySelector('#typePrompt').textContent='Exercise complete! Great work.';document.querySelector('#typePrompt').className='type-prompt complete'}
  else if(errors===0||!startTime){document.querySelector('#typePrompt').textContent='Use your English keyboard or the on-screen keys.';document.querySelector('#typePrompt').className='type-prompt'}
  const current=targetText.querySelector('.current');if(current&&position>0&&typeof current.scrollIntoView==='function'){
    const parent=targetText.getBoundingClientRect(),rect=current.getBoundingClientRect();
    if(rect.bottom>parent.bottom-10||rect.top<parent.top+4)targetText.scrollTop+=rect.top-parent.top-26;
  }
  const expected=expectedMapping();const keyText=complete?'✓':expected?(expected.shift?`⇧ ${expected.key}`:expected.key==='Space'?'␣':expected.key):'—';
  document.querySelector('#nextKey').textContent=keyText;
  document.querySelector('#practiceCompletion').textContent=complete?'✓ Lesson finished':'';
  updateFingerGuide(expected);
}
const fingerMap=Object.freeze({
  '`':['Left','pinky'],'1':['Left','pinky'],'q':['Left','pinky'],'a':['Left','pinky'],'z':['Left','pinky'],
  '2':['Left','ring'],'w':['Left','ring'],'s':['Left','ring'],'x':['Left','ring'],
  '3':['Left','middle'],'e':['Left','middle'],'d':['Left','middle'],'c':['Left','middle'],
  '4':['Left','index'],'5':['Left','index'],'r':['Left','index'],'t':['Left','index'],'f':['Left','index'],'g':['Left','index'],'v':['Left','index'],'b':['Left','index'],
  '6':['Right','index'],'7':['Right','index'],'y':['Right','index'],'u':['Right','index'],'h':['Right','index'],'j':['Right','index'],'n':['Right','index'],'m':['Right','index'],
  '8':['Right','middle'],'i':['Right','middle'],'k':['Right','middle'],',':['Right','middle'],
  '9':['Right','ring'],'o':['Right','ring'],'l':['Right','ring'],'.':['Right','ring'],
  '0':['Right','pinky'],'-':['Right','pinky'],'=':['Right','pinky'],'p':['Right','pinky'],'[':['Right','pinky'],']':['Right','pinky'],'\\':['Right','pinky'],';':['Right','pinky'],"'":['Right','pinky'],'/':['Right','pinky'],
  'Space':['Either','thumb']
});
function updateFingerGuide(expected){const key=document.querySelector('#practiceFingerKey'),name=document.querySelector('#practiceFingerName'),instruction=document.querySelector('#practiceFingerInstruction'),tip=document.querySelector('#practiceShiftTip');
  if(!expected){key.textContent=position>=exerciseText().length?'✓':'?';name.textContent=position>=exerciseText().length?'Great job!':'Character guide unavailable';instruction.textContent=position>=exerciseText().length?'Choose the next exercise to keep going.':'This character is not available on the selected keyboard layout.';tip.textContent='Check the current language and keyboard layout.';return}
  const hand=fingerMap[expected.key]||['Either','finger'];const keyName=expected.key==='Space'?'Space':expected.key.toUpperCase();key.textContent=keyName;name.textContent=hand[0]==='Either'?'Either thumb':`${hand[0]} ${hand[1]}`;
  instruction.textContent=expected.key==='Space'?'Press the spacebar with a thumb.':`Press ${keyName} with your ${hand[0].toLowerCase()} ${hand[1]}.`;
  tip.textContent=expected.shift?`Hold ${hand[0]==='Left'?'right':'left'} Shift with the opposite pinky.`:'Keep the other fingers resting near the home row.';
}
function renderPracticeKeyboard(){practiceKeyboard.innerHTML='';const expected=expectedMapping();const shownShift=physicalShiftHeld|| (overrideShift===null?!!expected?.shift:overrideShift);practiceShifted=shownShift;
  document.querySelector('#practiceNormal').classList.toggle('active',!shownShift);document.querySelector('#practiceShift').classList.toggle('active',shownShift);
  if(!phoneKeyboard()){
    renderUnifiedDesktopKeyboard(practiceKeyboard,{language:typingLanguage,shifted:shownShift,expected:expected||null,hintShift:!!expected?.shift,
      onKey:value=>handlePractice(value),onBackspace:backspacePractice,onEnter:()=>handlePractice('\n'),onShift:on=>setPracticeShift(on),onCaps:on=>setPracticeShift(on)});
  } else {
    practiceKeyboard.classList.remove('real-keyboard');
    rowsForLanguage().forEach((row,rowIndex)=>{const line=document.createElement('div');line.className='key-row';
      if(rowIndex===3){const b=document.createElement('button');b.type='button';b.className='key wide shift-key';b.textContent='⇧ Shift';b.onclick=()=>setPracticeShift(!shownShift);line.appendChild(b)}
      row.forEach(([code,normal,shift])=>{const b=document.createElement('button');b.type='button';b.className='key';b.dataset.code=code;const small=document.createElement('small');small.textContent=code;b.appendChild(small);b.append(document.createTextNode(shownShift?shift:normal));b.onclick=()=>handlePractice(shownShift?shift:normal);line.appendChild(b)});
      practiceKeyboard.appendChild(line)});
    const bottom=document.createElement('div');bottom.className='key-row';[['Space',' ',()=>handlePractice(' ')],['Backspace','⌫',backspacePractice]].forEach(([code,label,act])=>{const b=document.createElement('button');b.type='button';b.dataset.code=code;b.className='key wide';b.textContent=code==='Space'?'Space':label;b.onclick=act;bottom.appendChild(b)});practiceKeyboard.appendChild(bottom);
  }
  practiceKeyboard.querySelectorAll('.key').forEach(key=>{key.classList.toggle('expected',!!expected&&key.dataset.code===expected.key);if(expected&&key.dataset.code===expected.key&&fingerGuideVisible)key.classList.add('practice-finger-highlight')});
}
function setPracticeShift(on){overrideShift=!!on;renderPracticeKeyboard();practiceInput.focus({preventScroll:true})}
function completeStep(){const text=exerciseText();if(position>=text.length){localStorage.setItem(lessonStorageKey(),String(lessonIndex));const {wpm,accuracy}=getMetrics();document.querySelector('#typePrompt').textContent=`Completed · ${accuracy}% accuracy · ${wpm} WPM`;document.querySelector('#typePrompt').className='type-prompt complete'}}
function handlePractice(value){const text=exerciseText();if(position>=text.length||!value)return;
  if(document.activeElement!==practiceInput)practiceInput.focus({preventScroll:true});
  if(!startTime)startTime=Date.now();attempts++;
  if(text.startsWith(value,position)){chunks.push(value);position+=value.length;overrideShift=null;lastGoodText=chunks.join('');practiceInput.value=lastGoodText;practiceInput.classList.remove('wrong');renderTarget();renderPracticeKeyboard();updateStats();completeStep()}
  else{errors++;practiceInput.classList.add('wrong');document.querySelector('#typePrompt').textContent='Not quite—try the highlighted key again.';document.querySelector('#typePrompt').className='type-prompt error';updateStats();
    const key=practiceKeyboard.querySelector('.key.expected');if(key){key.classList.add('wrong');window.setTimeout(()=>key.classList.remove('wrong'),250)}}
}
function backspacePractice(){if(document.activeElement!==practiceInput)practiceInput.focus({preventScroll:true});if(!chunks.length)return;position-=chunks.pop().length;lastGoodText=chunks.join('');practiceInput.value=lastGoodText;overrideShift=null;practiceInput.classList.remove('wrong');renderTarget();renderPracticeKeyboard();updateStats()}
function getMetrics(){const accuracy=attempts?Math.max(0,Math.round((attempts-errors)/attempts*100)):100;const elapsed=startTime?Math.max((Date.now()-startTime)/60000,1/60):0;const typed=Array.from(chunks.join('')).length;const wpm=elapsed?Math.max(0,Math.round((typed/5)/elapsed)):0;return {wpm,accuracy}}
function updateStats(){const text=exerciseText(),progress=text.length?Math.min(100,Math.round(position/text.length*100)):0;const {accuracy,wpm}=getMetrics();
  document.querySelector('#progressStat').textContent=`${progress}%`;document.querySelector('#accuracyStat').textContent=`${accuracy}%`;document.querySelector('#errorsStat').textContent=String(errors);document.querySelector('#wpmStat').textContent=String(wpm);document.querySelector('#progressBar').style.width=`${progress}%`;document.querySelector('#practiceProgressTrack').setAttribute('aria-valuenow',String(progress))}
function renderLesson(){rebuildLessonOptions();const lesson=lessons[lessonIndex];targetText.lang=languageTag();practiceInput.lang=languageTag();
  document.querySelector('#lessonNumber').textContent=`${levels[levelIndex]} · Lesson ${lessonIndex+1} · Exercise ${exerciseIndex+1}`;
  document.querySelector('#lessonFocus').textContent=lesson.title;
  renderTarget();renderPracticeKeyboard();updateStats();}
function resetLesson(){position=0;attempts=0;errors=0;startTime=0;chunks=[];lastGoodText='';overrideShift=null;physicalShiftHeld=false;practiceInput.value='';practiceInput.classList.remove('wrong');renderLesson()}
levelSelect.onchange=()=>{levelIndex=Number(levelSelect.value);lessonIndex=levelIndex*2;localStorage.setItem(lessonStorageKey(),String(lessonIndex));resetLesson()};
lessonSelect.onchange=()=>{lessonIndex=Number(lessonSelect.value);levelIndex=Math.floor(lessonIndex/2);localStorage.setItem(lessonStorageKey(),String(lessonIndex));resetLesson()};
exerciseSelect.onchange=()=>{exerciseIndex=Number(exerciseSelect.value);localStorage.setItem(exerciseStorageKey(),String(exerciseIndex));resetLesson()};
document.querySelector('#restartLesson').onclick=()=>{resetLesson();practiceInput.focus({preventScroll:true})};
document.querySelector('#nextLesson').onclick=()=>{if(exerciseIndex<2)exerciseIndex++;else{exerciseIndex=0;lessonIndex=(lessonIndex+1)%lessons.length;levelIndex=Math.floor(lessonIndex/2)}localStorage.setItem(lessonStorageKey(),String(lessonIndex));localStorage.setItem(exerciseStorageKey(),String(exerciseIndex));resetLesson();practiceInput.focus({preventScroll:true})};
document.querySelector('#practiceNormal').onclick=()=>setPracticeShift(false);document.querySelector('#practiceShift').onclick=()=>setPracticeShift(true);
document.querySelector('#practiceGuideToggle').onclick=()=>{fingerGuideVisible=!fingerGuideVisible;practiceView.classList.toggle('practice-guide-hidden',!fingerGuideVisible);document.querySelector('#practiceGuideToggle').setAttribute('aria-pressed',String(fingerGuideVisible));document.querySelector('#practiceGuideToggle').textContent=fingerGuideVisible?'Finger guide on':'Finger guide off';renderPracticeKeyboard()};
function handleTutorKeydown(e){if(practiceView.hidden||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.target!==practiceInput&&e.target.closest&&e.target.closest('input,textarea,select,[contenteditable],button'))return;
  if(e.key==='Shift'){physicalShiftHeld=true;renderPracticeKeyboard();return}
  if(e.key==='Backspace'){e.preventDefault();backspacePractice();return}
  if(e.key===' '){e.preventDefault();handlePractice(' ');return}
  const code=physicalKey(e),match=rowsForLanguage().flat().find(([mapped])=>mapped===code);
  if(match){e.preventDefault();handlePractice(e.shiftKey?match[2]:match[1])}
}
document.addEventListener('keydown',handleTutorKeydown);
document.addEventListener('keyup',e=>{if(e.key==='Shift'&&!practiceView.hidden){physicalShiftHeld=false;renderPracticeKeyboard()}});
window.addEventListener('blur',()=>{if(physicalShiftHeld){physicalShiftHeld=false;renderPracticeKeyboard()}});
// The input is a focusable, accessible visual record of accepted typing; the tutor owns its contents.
practiceInput.addEventListener('input',()=>{if(practiceInput.value===lastGoodText)return;
  const extra=practiceInput.value.startsWith(lastGoodText)?practiceInput.value.slice(lastGoodText.length):'';
  practiceInput.value=lastGoodText;
  for(const item of splitGraphemes(extra))handlePractice(item.segment)
});
practiceInput.addEventListener('paste',e=>{e.preventDefault();document.querySelector('#typePrompt').textContent='Type the exercise to practice—pasting is disabled.'});
window.addEventListener('typinglanguagechange',()=>{lessons=lessonsForLanguage();lessonIndex=Math.max(0,Math.min(lessons.length-1,Number(localStorage.getItem(lessonStorageKey())||0)||0));levelIndex=Math.floor(lessonIndex/2);exerciseIndex=Math.max(0,Math.min(2,Number(localStorage.getItem(exerciseStorageKey())??1)));resetLesson()});
window.setInterval(()=>{if(!practiceView.hidden&&startTime&&position<exerciseText().length)updateStats()},1000);
renderLesson();
