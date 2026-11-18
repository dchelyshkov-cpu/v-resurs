/* Artify Factory · step-by-step development brief. Static-host compatible. */
(function(){
  'use strict';
  var form=document.getElementById('briefForm');
  if(!form)return;
  var STORAGE_KEY='artify-development-brief-v1';
  var legacyChoiceValues={};
  var singleChoiceIds=['designMood','colorScheme','fontPreferences'];
  var stepHost=document.getElementById('briefSteps');
  var currentTitle=document.getElementById('briefCurrentTitle');
  var stepCount=document.getElementById('briefStepCount');
  var percent=document.getElementById('briefPercent');
  var progress=document.getElementById('briefProgress');
  var progressFill=document.getElementById('briefProgressFill');
  var stepNav=document.getElementById('briefStepNav');
  var prevButton=document.getElementById('briefPrev');
  var nextButton=document.getElementById('briefNext');
  var errorBox=document.getElementById('briefStepError');
  var review=document.getElementById('briefReview');
  var reviewSummary=document.getElementById('briefReviewSummary');
  var downloadButton=document.getElementById('briefDownloadFilled');
  var mailLink=document.getElementById('briefMailLink');
  var mailNote=document.getElementById('briefMailNote');
  var consentHint=document.getElementById('briefConsentHint');
  var saveStatus=document.getElementById('briefSaveStatus');
  var currentStep=0;
  var confirmationTimestamp=null;
  var stepPanels=[];

  var steps=window.ArtifyDevelopmentBriefSchema || [];

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function fieldMarkup(f){
    var full=f.full?' full':'';
    var hint=f.hint?'<span class="brief-field-hint">'+esc(f.hint)+'</span>':'';
    var label='<span class="brief-field-label">'+esc(f.label)+(f.required?' <b aria-hidden="true">*</b>':'')+'</span>';
    var showWhen=f.showWhen||null;
    var wrapStart='<div class="brief-field'+full+((f.conditional||showWhen)?' brief-conditional-field':'')+'" data-field-wrap="'+esc(f.id)+'"'+(f.conditional?' data-conditional="'+esc(f.conditional)+'" hidden':'')+(showWhen?' data-show-when-field="'+esc(showWhen.field)+'" data-show-when-value="'+esc(showWhen.value)+'" hidden':'')+'>';
    var input='';
    if(f.type==='textarea') input='<textarea class="brief-input" id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" rows="'+(f.rows||3)+'" placeholder="'+esc(f.placeholder||'')+'"'+(f.required?' required aria-required="true"':'')+'></textarea>';
    else if(f.type==='checkboxes'||f.type==='radio'){
      var type=f.type==='checkboxes'?'checkbox':'radio';
      input='<div class="brief-choice-grid" role="'+(type==='radio'?'radiogroup':'group')+'" aria-label="'+esc(f.label)+'"'+(f.required?' aria-required="true"':'')+'>'+f.options.map(function(opt){var o=typeof opt==='string'?{label:opt,value:opt}:opt;return '<label class="brief-choice"><input type="'+type+'" name="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" value="'+esc(o.value)+'"><span>'+esc(o.label)+'</span></label>';}).join('')+'</div>';
    } else if(f.type==='select'){
      if(f.id==='budgetCurrency') input='<div class="brief-currency-control"><span class="brief-currency-symbol" aria-hidden="true">¤</span><select id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" aria-label="'+esc(f.label)+'"'+(f.required?' required aria-required="true"':'')+'><option value="">'+esc(f.emptyLabel||'Выберите вариант')+'</option>'+f.options.map(function(o){return '<option value="'+esc(o)+'">'+esc(o)+'</option>';}).join('')+'</select></div>';
      else input='<select class="brief-input" id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" aria-label="'+esc(f.label)+'"'+(f.required?' required aria-required="true"':'')+'><option value="">'+esc(f.emptyLabel||'Выберите вариант')+'</option>'+f.options.map(function(o){return '<option value="'+esc(o)+'">'+esc(o)+'</option>';}).join('')+'</select>';
    } else if(f.type==='date') input='<div class="brief-date-control"><input class="brief-input" id="bf-'+esc(f.id)+'-display" type="text" readonly aria-label="'+esc(f.label)+'" placeholder="ДД.ММ.ГГГГ" data-date-display="'+esc(f.id)+'"><input type="hidden" id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'"'+(f.required?' required aria-required="true"':'')+'><button class="brief-date-toggle" type="button" data-date-toggle="'+esc(f.id)+'" aria-label="Открыть календарь"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M7.5 3.5v3M16.5 3.5v3M3.5 9h17"/></svg></button><div class="brief-calendar" data-calendar="'+esc(f.id)+'" hidden></div></div>';
    else input='<input class="brief-input" id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" type="'+(f.type==='tel'?'tel':f.type==='email'?'email':f.type==='url'?'url':'text')+'" autocomplete="'+(f.type==='email'?'email':f.type==='tel'?'tel':f.id==='company'?'organization':'off')+'" placeholder="'+esc(f.placeholder||'')+'"'+(f.required?' required aria-required="true"':'')+'>';
    var error=f.required?'<span class="brief-field-error" id="brief-error-'+esc(f.id)+'" data-error-for="'+esc(f.id)+'" hidden></span>':'';
    return wrapStart+label+hint+input+error+'</div>';
  }
  var monthNamesRu=['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
  var weekdaysRu=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  var calendarView={};
  function isoDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function dateFromIso(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return null;var a=value.split('-').map(Number);return new Date(a[0],a[1]-1,a[2],12);}
  function ruDate(value){var d=dateFromIso(value);return d?String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear():'';}
  function renderCalendar(id){
    var panel=stepHost.querySelector('[data-calendar="'+id+'"]');if(!panel)return;
    var hidden=document.getElementById('bf-'+id);var selected=dateFromIso(hidden.value);var view=calendarView[id]||selected||new Date();
    var year=view.getFullYear(),month=view.getMonth();var first=new Date(year,month,1,12);var offset=(first.getDay()+6)%7;var start=new Date(year,month,1-offset,12);var today=isoDate(new Date());
    var html='<div class="brief-calendar-head"><button class="brief-calendar-nav" type="button" data-cal-prev="'+id+'" aria-label="Предыдущий месяц">‹</button><strong class="brief-calendar-title">'+monthNamesRu[month]+' '+year+'</strong><button class="brief-calendar-nav" type="button" data-cal-next="'+id+'" aria-label="Следующий месяц">›</button></div><div class="brief-calendar-grid">'+weekdaysRu.map(function(w){return '<span class="brief-calendar-weekday">'+w+'</span>';}).join('');
    for(var i=0;i<42;i++){var d=new Date(start.getFullYear(),start.getMonth(),start.getDate()+i,12);var iso=isoDate(d);var cls='brief-calendar-day'+(d.getMonth()!==month?' is-outside':'')+(iso===today?' is-today':'');html+='<button type="button" class="'+cls+'" data-cal-date="'+id+'" data-date-value="'+iso+'" aria-pressed="'+(selected&&isoDate(selected)===iso?'true':'false')+'">'+d.getDate()+'</button>';}
    html+='</div><div class="brief-calendar-foot"><button type="button" data-cal-clear="'+id+'">Очистить</button><button type="button" data-cal-today="'+id+'">Сегодня</button></div>';
    panel.innerHTML=html;
  }
  function openCalendar(id){var panel=stepHost.querySelector('[data-calendar="'+id+'"]');if(!panel)return;var selected=dateFromIso(document.getElementById('bf-'+id).value);calendarView[id]=selected||new Date();renderCalendar(id);panel.hidden=false;}
  function closeCalendars(){stepHost.querySelectorAll('.brief-calendar').forEach(function(el){el.hidden=true;});}
  stepHost.addEventListener('click',function(e){
    var toggle=e.target.closest('[data-date-toggle]');if(toggle){var id=toggle.dataset.dateToggle;var panel=stepHost.querySelector('[data-calendar="'+id+'"]');if(panel.hidden)openCalendar(id);else panel.hidden=true;return;}
    var prev=e.target.closest('[data-cal-prev]');if(prev){var id=prev.dataset.calPrev;var d=calendarView[id]||new Date();calendarView[id]=new Date(d.getFullYear(),d.getMonth()-1,1,12);renderCalendar(id);return;}
    var next=e.target.closest('[data-cal-next]');if(next){var id=next.dataset.calNext;var d=calendarView[id]||new Date();calendarView[id]=new Date(d.getFullYear(),d.getMonth()+1,1,12);renderCalendar(id);return;}
    var day=e.target.closest('[data-cal-date]');if(day){var id=day.dataset.calDate;document.getElementById('bf-'+id).value=day.dataset.dateValue;document.getElementById('bf-'+id+'-display').value=ruDate(day.dataset.dateValue);closeCalendars();saveState();return;}
    var clear=e.target.closest('[data-cal-clear]');if(clear){var id=clear.dataset.calClear;document.getElementById('bf-'+id).value='';document.getElementById('bf-'+id+'-display').value='';closeCalendars();saveState();return;}
    var today=e.target.closest('[data-cal-today]');if(today){var id=today.dataset.calToday;var value=isoDate(new Date());document.getElementById('bf-'+id).value=value;document.getElementById('bf-'+id+'-display').value=ruDate(value);closeCalendars();saveState();return;}
    if(!e.target.closest('.brief-date-control'))closeCalendars();
  });
  stepHost.addEventListener('click',function(e){var display=e.target.closest('[data-date-display]');if(display)openCalendar(display.dataset.dateDisplay);});
  stepHost.addEventListener('keydown',function(e){if(e.key==='Escape')closeCalendars();});
  function buildSteps(){
    steps.forEach(function(step,index){
      var panel=document.createElement('section');
      panel.className='brief-step-panel';panel.dataset.step=String(index);panel.hidden=index!==0;
      panel.innerHTML='<p class="brief-step-intro">'+esc(step.intro)+'</p><div class="brief-field-grid">'+step.fields.map(fieldMarkup).join('')+'</div>';
      stepHost.appendChild(panel);stepPanels.push(panel);
      var nav=document.createElement('button');nav.type='button';nav.innerHTML='<span class="brief-step-number">'+String(index+1).padStart(2,'0')+'.</span><span class="brief-step-label">'+esc(step.title)+'</span>';nav.dataset.stepNav=String(index);nav.setAttribute('aria-current',index===0?'step':'false');nav.addEventListener('click',function(){
        if(reviewIsOpen())resetConfirmations();
        saveState();showStep(index);
      });stepNav.appendChild(nav);
    });
    var reviewNav=document.createElement('button');reviewNav.type='button';reviewNav.className='brief-step-nav-review';reviewNav.innerHTML='<span class="brief-step-number">07.</span><span class="brief-step-label">Проверьте ответы</span>';reviewNav.dataset.stepNav=String(steps.length);reviewNav.setAttribute('aria-current','false');reviewNav.addEventListener('click',openReview);stepNav.appendChild(reviewNav);
  }
  function collectState(){
    var obj={};
    form.querySelectorAll('[data-field]').forEach(function(el){
      var id=el.dataset.field;if(!obj.hasOwnProperty(id))obj[id]=el.type==='checkbox'?[]:'';
      if(el.type==='checkbox'){if(el.checked)obj[id].push(el.value);}
      else if(el.type==='radio'){if(el.checked)obj[id]=el.value;}
      else obj[id]=el.value;
    });
    return obj;
  }
  function applyState(obj){
    form.querySelectorAll('[data-field]').forEach(function(el){
      var v=obj[el.dataset.field];
      if(el.type==='checkbox')el.checked=Array.isArray(v)&&v.indexOf(el.value)>=0;
      else if(el.type==='radio')el.checked=v===el.value;
      else if(v!=null)el.value=v;
    });
    form.querySelectorAll('[data-date-display]').forEach(function(el){var hidden=document.getElementById('bf-'+el.dataset.dateDisplay);el.value=ruDate(hidden?hidden.value:'');});
    updateConditional();
  }
  function saveState(){
    try{var state=collectState();if(Object.keys(legacyChoiceValues).length)state.__legacyChoiceValues=legacyChoiceValues;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));saveStatus.textContent='Черновик сохранён в этом браузере';}
    catch(e){saveStatus.textContent='Автосохранение недоступно в этом режиме браузера';}
  }
  function renderLegacyChoiceNotes(){
    Object.keys(legacyChoiceValues).forEach(function(id){
      var grid=form.querySelector('[data-field-wrap="'+id+'"] .brief-choice-grid');
      if(!grid)return;
      var note=document.createElement('p');note.className='brief-migration-note';note.dataset.migrationFor=id;
      note.textContent='В сохранённом черновике ранее было выбрано несколько вариантов: '+legacyChoiceValues[id].join('; ')+'. Теперь в этом пункте нужно выбрать один вариант.';
      grid.insertAdjacentElement('afterend',note);
    });
  }
  function restoreState(){
    try{
      var raw=localStorage.getItem(STORAGE_KEY);if(!raw)return;
      var state=JSON.parse(raw);if(!state||typeof state!=='object')return;
      legacyChoiceValues=state.__legacyChoiceValues&&typeof state.__legacyChoiceValues==='object'?state.__legacyChoiceValues:{};
      var migrated=false;
      singleChoiceIds.forEach(function(id){
        if(Array.isArray(state[id])){
          if(state[id].length===1)state[id]=state[id][0];
          else if(state[id].length>1){legacyChoiceValues[id]=state[id].slice();state[id]='';}
          else state[id]='';
          migrated=true;
        }
      });
      delete state.__legacyChoiceValues;
      applyState(state);renderLegacyChoiceNotes();
      if(migrated||Object.keys(legacyChoiceValues).length){saveState();if(Object.keys(legacyChoiceValues).length)saveStatus.textContent='Черновик обновлён: в пунктах 5.6–5.8 теперь выбирается по одному варианту';}
    }catch(e){saveStatus.textContent='Не удалось восстановить черновик';}
  }
  function updateConditional(){
    var state=collectState();
    var typeValues=state.siteTypes||[];var show=typeValues.indexOf('Интернет-магазин')>=0||typeValues.indexOf('Корпоративный сайт с каталогом')>=0||typeValues.indexOf('Каталог товаров без корзины')>=0;
    form.querySelectorAll('[data-conditional="ecommerce"]').forEach(function(el){el.hidden=!show;});
    form.querySelectorAll('[data-show-when-field]').forEach(function(el){var field=el.getAttribute('data-show-when-field');var value=el.getAttribute('data-show-when-value');el.hidden=String(state[field]||'')!==value;});
  }
  function reviewIsOpen(){return !review.hidden;}
  function ensureActiveNavigationVisible(index){
    var active=stepNav.querySelector('[data-step-nav="'+index+'"]');
    if(!active || !window.matchMedia('(max-width: 767px)').matches)return;
    var containerRect=stepNav.getBoundingClientRect();var activeRect=active.getBoundingClientRect();
    var target=stepNav.scrollLeft+(activeRect.left-containerRect.left)-(stepNav.clientWidth-activeRect.width)/2;
    stepNav.scrollLeft=Math.max(0,Math.min(target,stepNav.scrollWidth-stepNav.clientWidth));
  }
  function updateNavigation(index){
    stepNav.querySelectorAll('button').forEach(function(b,i){
      b.setAttribute('aria-current',i===index?'step':'false');
      b.classList.toggle('is-complete',i<index);
    });
    ensureActiveNavigationVisible(index);
  }
  window.addEventListener('resize',function(){ensureActiveNavigationVisible(reviewIsOpen()?steps.length:currentStep);});
  function showStep(index){
    currentStep=Math.max(0,Math.min(steps.length-1,index));
    review.hidden=true;form.hidden=false;
    document.querySelector('.brief-progress-header').hidden=false;
    document.querySelector('.brief-progress-track').hidden=false;
    stepNav.hidden=true;
    stepPanels.forEach(function(p,i){p.hidden=i!==currentStep;});
    currentTitle.textContent=steps[currentStep].title;
    stepCount.textContent='Раздел '+(currentStep+1)+' из '+(steps.length+1);
    var value=Math.round((currentStep+1)/(steps.length+1)*100);percent.textContent=value+'%';progressFill.style.width=value+'%';progress.setAttribute('aria-valuenow',String(value));
    prevButton.disabled=currentStep===0;nextButton.textContent=currentStep===steps.length-1?'Проверить ответы':'Продолжить';
    updateNavigation(currentStep);
    errorBox.hidden=true;
    closeCalendars();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function setFieldInvalid(field, invalid){
    var controls=Array.prototype.slice.call(form.querySelectorAll('[data-field="'+field.id+'"]'));
    controls.forEach(function(control){
      if(invalid)control.setAttribute('aria-invalid','true');
      else control.removeAttribute('aria-invalid');
    });
    if(field.type==='checkboxes'||field.type==='radio'){
      var choiceGrid=form.querySelector('[data-field-wrap="'+field.id+'"] .brief-choice-grid');
      if(choiceGrid){if(invalid)choiceGrid.setAttribute('aria-invalid','true');else choiceGrid.removeAttribute('aria-invalid');}
    }
    if(field.type==='date'){
      var dateWrap=form.querySelector('[data-field-wrap="'+field.id+'"] .brief-date-control');
      var visibleDate=form.querySelector('[data-date-display="'+field.id+'"]');
      if(dateWrap){if(invalid)dateWrap.setAttribute('aria-invalid','true');else dateWrap.removeAttribute('aria-invalid');}
      if(visibleDate){if(invalid)visibleDate.setAttribute('aria-invalid','true');else visibleDate.removeAttribute('aria-invalid');}
    }
    if(field.id==='budgetCurrency'){
      var currencyWrap=form.querySelector('[data-field-wrap="'+field.id+'"] .brief-currency-control');
      if(currencyWrap){if(invalid)currencyWrap.setAttribute('aria-invalid','true');else currencyWrap.removeAttribute('aria-invalid');}
    }
  }
  function fieldValueIsValid(field){
    if(!field.required||!fieldIsVisible(field))return true;
    var controls=Array.prototype.slice.call(form.querySelectorAll('[data-field="'+field.id+'"]'));
    if(field.type==='checkboxes'||field.type==='radio')return controls.some(function(el){return el.checked;});
    var value=controls.length?String(controls[0].value||'').trim():'';
    if(!value)return false;
    if(field.type==='email')return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return true;
  }
  function refreshInvalidField(target){
    var id=target&&target.getAttribute('data-field');
    if(!id&&target&&target.hasAttribute('data-date-display'))id=target.getAttribute('data-date-display');
    if(!id)return;
    var field=null;
    for(var i=0;i<steps.length&&!field;i++)field=steps[i].fields.find(function(item){return item.id===id;});
    if(!field||!field.required)return;
    var wrap=form.querySelector('[data-field-wrap="'+id+'"]');
    var hasError=(wrap&&wrap.querySelector('[aria-invalid="true"]'))||target.getAttribute('aria-invalid')==='true';
    if(hasError)setFieldInvalid(field,!fieldValueIsValid(field));
  }
  function checkRequiredStep(stepIndex){
    var step=steps[stepIndex];var missing=[];var firstField=null;
    step.fields.forEach(function(field){
      if(!field.required||!fieldIsVisible(field))return;
      var controls=Array.prototype.slice.call(form.querySelectorAll('[data-field="'+field.id+'"]'));
      var valid=false;
      if(field.type==='checkboxes') valid=controls.some(function(el){return el.checked;});
      else if(field.type==='radio') valid=controls.some(function(el){return el.checked;});
      else {
        var value=controls.length?String(controls[0].value||'').trim():'';
        valid=!!value;
        if(valid&&field.type==='email')valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      setFieldInvalid(field,!valid);
      if(!valid){
        if(!firstField)firstField=field.type==='date'?(form.querySelector('[data-date-display="'+field.id+'"]')||controls[0]||null):controls[0]||null;
        if(field.type==='radio')missing.push('Выберите один вариант в пункте «'+field.label.replace(/^\d+(?:\.\d+)?\.\s*/,'')+'».');
        else if(field.type==='checkboxes')missing.push('Выберите хотя бы один вариант в пункте «'+field.label.replace(/^\d+(?:\.\d+)?\.\s*/,'')+'».');
        else if(field.type==='email'&&controls[0]&&String(controls[0].value||'').trim())missing.push('Проверьте адрес электронной почты в пункте «'+field.label.replace(/^\d+(?:\.\d+)?\.\s*/,'')+'».');
        else missing.push('Заполните обязательное поле «'+field.label.replace(/^\d+(?:\.\d+)?\.\s*/,'')+'».');
      }
    });
    return {valid:missing.length===0,missing:missing,firstField:firstField};
  }
  function showValidation(result){
    errorBox.textContent=result.missing.join(' ');errorBox.hidden=false;
    if(result.firstField){result.firstField.focus();var wrap=result.firstField.closest('.brief-field');if(wrap)wrap.scrollIntoView({behavior:'smooth',block:'center'});}
  }
  function validateCurrentStep(){
    var result=checkRequiredStep(currentStep);
    if(!result.valid)showValidation(result);else errorBox.hidden=true;
    return result.valid;
  }
  function validateRequiredFields(){
    for(var i=0;i<steps.length;i++){
      var result=checkRequiredStep(i);
      if(!result.valid){showStep(i);showValidation(result);return false;}
    }
    return true;
  }
  function toText(value){if(Array.isArray(value))return value.join('; ');return String(value||'').trim();}
  function displayFieldValue(field,value){
    var text=toText(value);
    if(field.type==='date' && /^\d{4}-\d{2}-\d{2}$/.test(text)){var parts=text.split('-');return parts[2]+'.'+parts[1]+'.'+parts[0];}
    return text;
  }
  function fieldIsVisible(f){var wrap=form.querySelector('[data-field-wrap="'+f.id+'"]');return !wrap||!wrap.hidden;}
  function getSummary(){
    var lines=['Бриф на разработку сайта','','Дата заполнения: '+new Date().toLocaleDateString('ru-RU'),''];
    getSections().forEach(function(section){
      lines.push(section.title);
      section.fields.forEach(function(field){lines.push(field.label+':\n'+field.value);});
      lines.push('');
    });
    lines.push('Спасибо за заполнение брифа! Ответы помогут подготовиться к обсуждению проекта и определить следующие шаги. Если часть информации пока неизвестна, её можно будет уточнить при разговоре.');
    if(document.getElementById('briefPersonalConsent').checked && document.getElementById('briefPolicyCheck').checked) {
      lines.push('', 'Подтверждения в онлайн-форме', 'Согласие на обработку персональных данных: отметка установлена.', 'Ознакомление с Политикой конфиденциальности: подтверждено.', 'Дата и время подтверждения: '+(confirmationTimestamp || new Date().toISOString()), '');
    }
    return lines.join('\n');
  }
  function makeReview(){
    var state=collectState();reviewSummary.replaceChildren();
    steps.forEach(function(step,i){
      var section=document.createElement('section');section.className='brief-review-section';
      var h=document.createElement('h3');h.textContent=(i+1)+'. '+step.title;section.appendChild(h);
      step.fields.forEach(function(f){if(!fieldIsVisible(f))return;var value=displayFieldValue(f,state[f.id]);if(!value)return;var row=document.createElement('div');row.className='brief-review-item';var label=document.createElement('strong');label.textContent=f.label;var val=document.createElement('span');val.textContent=value;row.append(label,val);section.appendChild(row);});
      if(section.children.length>1)reviewSummary.appendChild(section);
    });
  }
  function fileBaseName(){return 'Artify_Заполненный_бриф_'+new Date().toISOString().slice(0,10);}
  function saveBlob(blob,name){var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();window.setTimeout(function(){URL.revokeObjectURL(url);},1800);}
  function getSections(){
    var state=collectState();
    return steps.map(function(step,i){return {title:(i+1)+'. '+step.title,fields:step.fields.filter(fieldIsVisible).map(function(f){return {label:f.label+(f.required?' *':''),value:displayFieldValue(f,state[f.id])};}).filter(function(x){return x.value;})};}).filter(function(section){return section.fields.length;});
  }
  function xmlEscape(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
  function wordRun(text,bold,size){return String(text==null?'':text).split(/\r?\n/).map(function(part,index){return (index?'<w:r><w:br/></w:r>':'')+'<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="'+(size||21)+'"/><w:lang w:val="ru-RU"/>'+(bold?'<w:b/>':'')+'</w:rPr><w:t xml:space="preserve">'+xmlEscape(part)+'</w:t></w:r>';}).join('');}
  function wordParagraph(text,style,bold){var size=style==='Title'?34:style==='Subtitle'?19:style==='Heading1'?25:21;var keep=style==='Heading1'?'<w:keepNext/>':'';var pageBreak=style==='Heading1'&&/^6\./.test(text)?'<w:pageBreakBefore/>':'';return '<w:p><w:pPr>'+(style?'<w:pStyle w:val="'+style+'"/>':'<w:spacing w:after="90" w:line="300" w:lineRule="auto"/>')+pageBreak+keep+'</w:pPr>'+wordRun(text,bold,size)+'</w:p>';}
  function wordTitle(text){return '<w:p><w:pPr><w:spacing w:after="180"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="34"/><w:lang w:val="ru-RU"/><w:b/><w:color w:val="1C1A17"/></w:rPr><w:t xml:space="preserve">'+xmlEscape(text)+'</w:t></w:r></w:p>'; }
  function wordField(label,value){return '<w:p><w:pPr><w:spacing w:after="100" w:line="300" w:lineRule="auto"/></w:pPr>'+wordRun(label+': ',true,21)+wordRun(value,false,21)+'</w:p>';}
  function crc32(bytes){var table=crc32.table;if(!table){table=[];for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);table[n]=c>>>0;}crc32.table=table;}var crc=0xFFFFFFFF;for(var i=0;i<bytes.length;i++)crc=table[(crc^bytes[i])&0xFF]^(crc>>>8);return (crc^0xFFFFFFFF)>>>0;}
  function makeZip(files){
    var encoder=new TextEncoder(),local=[],central=[],offset=0;
    function u16(v){return [v&255,(v>>>8)&255];}function u32(v){return [v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];}
    files.forEach(function(file){var name=encoder.encode(file.name),data=encoder.encode(file.data),crc=crc32(data);var localHeader=[0x50,0x4b,0x03,0x04].concat(u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),Array.from(name));local.push(new Uint8Array(localHeader),data);
      var centralHeader=[0x50,0x4b,0x01,0x02].concat(u16(20),u16(20),u16(0x0800),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),Array.from(name));central.push(new Uint8Array(centralHeader));offset+=localHeader.length+data.length;
    });
    var centralSize=central.reduce(function(total,item){return total+item.length;},0);var count=files.length;var eocd=new Uint8Array([0x50,0x4b,0x05,0x06].concat(u16(0),u16(0),u16(count),u16(count),u32(centralSize),u32(offset),u16(0)));
    return new Blob(local.concat(central,[eocd]),{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
  }
  function makeDocx(){
    var sections=getSections();var body=[];
    body.push(wordTitle('Бриф на разработку сайта'));
    body.push(wordParagraph('Дата заполнения: '+new Date().toLocaleDateString('ru-RU'),'Subtitle',false));
    sections.forEach(function(section){body.push(wordParagraph(section.title,'Heading1',false));section.fields.forEach(function(field){body.push(wordField(field.label,field.value));});});
    body.push(wordParagraph('Спасибо за заполнение брифа! Ответы помогут подготовиться к обсуждению проекта и определить следующие шаги. Если часть информации пока неизвестна, её можно будет уточнить при разговоре.','',false));
    if(document.getElementById('briefPersonalConsent').checked&&document.getElementById('briefPolicyCheck').checked){body.push(wordParagraph('Подтверждения в онлайн-форме','Heading1',false));body.push(wordParagraph('Согласие на обработку персональных данных: отметка установлена.','',false));body.push(wordParagraph('Ознакомление с Политикой конфиденциальности: подтверждено.','',false));body.push(wordParagraph('Дата и время подтверждения: '+confirmationTimestamp,'',false));}
    body.push('<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1020" w:right="1021" w:bottom="1020" w:left="1021" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr>');
    var contentTypes='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>';
    var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
    var docRels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    var documentXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>'+body.join('')+'</w:body></w:document>';
    var stylesXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:lang w:val="ru-RU"/><w:sz w:val="21"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="90" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:pPr><w:spacing w:after="180"/></w:pPr><w:rPr><w:b/><w:sz w:val="34"/><w:color w:val="1C1A17"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:rPr><w:color w:val="6B6760"/><w:sz w:val="19"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="260" w:after="100"/></w:pPr><w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="B8432A"/></w:rPr></w:style></w:styles>';
    return makeZip([{name:'[Content_Types].xml',data:contentTypes},{name:'_rels/.rels',data:rels},{name:'word/document.xml',data:documentXml},{name:'word/styles.xml',data:stylesXml},{name:'word/_rels/document.xml.rels',data:docRels}]);
  }
  function downloadSummary(){
    mailNote.textContent='';
    var format=document.getElementById('briefFormat').value;
    if(format==='docx'){
      saveBlob(makeDocx(),fileBaseName()+'.docx');
      return;
    }
    saveBlob(new Blob(['\ufeff'+getSummary()],{type:'text/plain;charset=utf-8'}),fileBaseName()+'.txt');
  }
  function sendBrief(event){
    event.preventDefault();
    if(mailLink.getAttribute('aria-disabled')==='true')return;
    var blob=makeDocx();
    var filename=fileBaseName()+'.docx';
    var file=new File([blob],filename,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
    var shareData={files:[file],title:'Бриф на разработку сайта',text:'Заполненный бриф для ООО «БЕЛВЕКТОРРЕСУРС».'};
    if(typeof navigator.share==='function'&&typeof navigator.canShare==='function'&&navigator.canShare({files:[file]})){
      mailNote.textContent='Открылось системное меню отправки. Выберите почтовую программу, чтобы передать заполненный DOCX как вложение.';
      navigator.share(shareData).then(function(){
        mailNote.textContent='Бриф передан выбранному приложению. Проверьте адресата, текст письма и отправьте сообщение.';
      }).catch(function(error){
        if(error&&error.name==='AbortError')mailNote.textContent='Отправка отменена. Ответы сохранены, вы можете повторить действие.';
        else mailNote.textContent='Не удалось открыть системное меню отправки. Скачайте DOCX и прикрепите его к письму вручную.';
      });
      return;
    }
    saveBlob(blob,filename);
    mailNote.textContent='Этот браузер не поддерживает передачу файла почтовому приложению. DOCX скачан, сейчас откроется подготовленное письмо. Прикрепите скачанный документ вручную.';
    window.location.href=mailLink.href;
  }
  function resetConfirmations(){
    document.getElementById('briefPersonalConsent').checked=false;
    document.getElementById('briefPolicyCheck').checked=false;
    confirmationTimestamp=null;
    mailNote.textContent='';
    updateMailLink();
  }
  function updateMailLink(){
    var consent=document.getElementById('briefPersonalConsent').checked;var policy=document.getElementById('briefPolicyCheck').checked;
    var can=consent&&policy;
    mailLink.classList.toggle('is-disabled',!can);mailLink.setAttribute('aria-disabled',String(!can));
    mailLink.setAttribute('tabindex',can?'0':'-1');
    if(consentHint){
      if(can)consentHint.textContent='Обе отметки установлены. Теперь можно отправить бриф через почтовую программу.';
      else if(consent||policy)consentHint.textContent='Осталось установить ещё одну отметку, чтобы активировать кнопку «Отправить бриф».';
      else consentHint.textContent='Для активации кнопки «Отправить бриф» отметьте обе независимые галочки.';
    }
    if(can){
      var v=collectState();var contact=(v.responsiblePerson||'').trim();var subject='Бриф на разработку сайта'+(v.company?': '+v.company:'');
      var body='Здравствуйте!\n\nНаправляю заполненный бриф на разработку сайта. Если файл не передан через системное меню отправки, прикрепите скачанный DOCX вручную.\n\nКонтактное лицо: '+contact+'\nТелефон: '+(v.responsiblePhone||'не указан')+'\nE-mail: '+(v.responsibleEmail||'не указан')+'\n\nВ онлайн-форме подтверждены: согласие на обработку персональных данных и ознакомление с Политикой.\nДата и время подтверждения: '+(confirmationTimestamp||new Date().toISOString())+'\n\nС уважением.';
      mailLink.href='mailto:info@v-resurs.by?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    } else {
      mailLink.href='#';
    }
  }
  function openReview(){
    if(!validateRequiredFields())return;
    mailNote.textContent='';
    saveState();makeReview();currentStep=steps.length;form.hidden=true;review.hidden=false;
    currentTitle.textContent='Проверьте ответы';stepCount.textContent='Раздел 7 из 7';percent.textContent='100%';progressFill.style.width='100%';progress.setAttribute('aria-valuenow','100');
    document.querySelector('.brief-progress-header').hidden=false;document.querySelector('.brief-progress-track').hidden=false;stepNav.hidden=false;
    updateNavigation(steps.length);updateMailLink();
    currentTitle.focus();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function resetForm(){
    if(!window.confirm('Заполнить бриф заново? Все введённые ответы и сохранённый черновик будут удалены.'))return;
    try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
    legacyChoiceValues={};form.querySelectorAll('[data-migration-for]').forEach(function(note){note.remove();});
    form.reset();applyState({});resetConfirmations();
    showStep(0);saveStatus.textContent='Начато новое заполнение';
    mailNote.textContent='';
    window.scrollTo({top:0,behavior:'smooth'});
  }
  buildSteps();restoreState();var restoredCurrency=document.getElementById('bf-budgetCurrency');if(restoredCurrency){var restoredMarks={BYN:'Br',USD:'$',EUR:'€',RUB:'₽'};restoredCurrency.closest('.brief-currency-control').querySelector('.brief-currency-symbol').textContent=restoredMarks[restoredCurrency.value]||'¤';}showStep(0);
  form.addEventListener('input',function(e){if(e.target.matches('[data-field]')){refreshInvalidField(e.target);saveState();updateConditional();}});
  form.addEventListener('change',function(e){if(e.target.matches('[data-field]')){if(e.target.type==='radio'){var migratedId=e.target.dataset.field;if(legacyChoiceValues[migratedId]){delete legacyChoiceValues[migratedId];var migrationNote=form.querySelector('[data-migration-for="'+migratedId+'"]');if(migrationNote)migrationNote.remove();}}refreshInvalidField(e.target);saveState();updateConditional();if(e.target.id==='bf-budgetCurrency'){var marks={BYN:'Br',USD:'$',EUR:'€',RUB:'₽'};var mark=e.target.closest('.brief-currency-control').querySelector('.brief-currency-symbol');mark.textContent=marks[e.target.value]||'¤';}}});
  nextButton.addEventListener('click',function(){if(!validateCurrentStep())return;saveState();if(currentStep<steps.length-1)showStep(currentStep+1);else openReview();});
  prevButton.addEventListener('click',function(){saveState();showStep(currentStep-1);});
  document.getElementById('briefResetForm').addEventListener('click',resetForm);
  downloadButton.addEventListener('click',downloadSummary);
  var formatSelect=document.getElementById('briefFormat');
  var formatPointerSelection=false;
  formatSelect.addEventListener('pointerdown',function(){formatPointerSelection=true;});
  formatSelect.addEventListener('keydown',function(){formatPointerSelection=false;});
  formatSelect.addEventListener('change',function(){if(formatPointerSelection){formatSelect.blur();formatPointerSelection=false;}});
  formatSelect.addEventListener('blur',function(){formatPointerSelection=false;});
  function onConfirmationChange(){
    var accepted=document.getElementById('briefPersonalConsent').checked && document.getElementById('briefPolicyCheck').checked;
    confirmationTimestamp=accepted?new Date().toISOString():null;
    updateMailLink();
  }
  document.getElementById('briefPersonalConsent').addEventListener('change',onConfirmationChange);
  document.getElementById('briefPolicyCheck').addEventListener('change',onConfirmationChange);
  mailLink.addEventListener('click',sendBrief);
})();
