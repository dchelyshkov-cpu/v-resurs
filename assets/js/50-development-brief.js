/* Artify Factory · step-by-step development brief. Static-host compatible. */
(function(){
  'use strict';
  var form=document.getElementById('briefForm');
  if(!form)return;
  var STORAGE_KEY='artify-development-brief-v1';
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

  var steps=[
    {title:'Контактная информация',intro:'Обязательно укажите ответственное лицо и адрес электронной почты. Телефон можно добавить дополнительно. Если ответственное лицо также является техническим контактом, повторять данные не нужно.',fields:[
      {id:'company',label:'1.1. Название компании',hint:'Полное и сокращённое наименование, если применимо.',type:'text',full:true},
      {id:'responsiblePerson',label:'1.2. Ответственное лицо',hint:'Контакт для вопросов о заключении договора, приёмке работ и организации проекта.',type:'text',required:true},
      {id:'responsiblePhone',label:'Телефон ответственного лица',hint:'Необязательное поле. Укажите номер, если удобнее связаться дополнительно по телефону.',type:'tel'},
      {id:'responsibleEmail',label:'Электронная почта ответственного лица',hint:'Обязательное поле. На этот адрес можно отправить ответ по проекту.',type:'email',required:true},
      {id:'technicalContact',label:'1.3. Контактное лицо по рабочим и техническим вопросам',hint:'Укажите имя, телефон, e-mail или другой способ связи, если это отдельный человек. Если контакт совпадает с ответственным лицом, напишите «совпадает».',type:'textarea',full:true,rows:2},
      {id:'currentSite',label:'1.4. Адрес текущего сайта (если есть)',type:'url'},
      {id:'currentSiteIssues',label:'Что устраивает или не устраивает в действующем сайте?',type:'textarea'},
      {id:'startDate',label:'1.5. Предполагаемая дата начала работ',type:'text',required:true},
      {id:'deadline',label:'Желаемая дата сдачи проекта',type:'text'},
      {id:'budget',label:'1.6. Предполагаемый бюджет',required:true,hint:'Укажите ориентировочный диапазон бюджета. Это поможет сразу рассматривать подходящие по масштабу решения.',type:'text',full:true}
    ]},
    {title:'Общая информация',intro:'Расскажите о бизнесе и людях, для которых создаётся сайт. Если пока нет ответов на все вопросы, их можно уточнить позже.',fields:[
      {id:'activity',label:'2.1. Область деятельности и направление бизнеса',hint:'Опишите деятельность компании, преимущества, отличия и особенности бизнеса.',type:'textarea',full:true,rows:4},
      {id:'geography',label:'2.2. География работы компании',hint:'Города, регионы и страны, где работает компания или находятся клиенты.',type:'textarea',rows:2},
      {id:'competitors',label:'2.3. Основные конкуренты',hint:'Укажите адреса сайтов конкурентов и коротко опишите, что вам в них нравится или не нравится.',type:'textarea',rows:3,full:true},
      {id:'siteGoals',label:'2.4. Основные цели сайта',required:true,hint:'Выберите основные задачи и при необходимости дополните свой вариант.',type:'checkboxes',full:true,options:['Продажа товаров или услуг на сайте','Привлечение новых клиентов и заявок','Презентация компании и её экспертизы','Поддержка и развитие бренда','Информирование и обслуживание клиентов','Другое (укажите ниже)']},
      {id:'otherGoals',label:'Другие цели сайта (если есть)',type:'textarea',rows:2,full:true},
      {id:'userNeeds',label:'2.5. Потребности пользователей',hint:'Что посетители должны получить от сайта? Какие вопросы, задачи или проблемы они хотят решить?',type:'textarea',rows:3,full:true},
      {id:'audience',label:'2.6. Пользовательская аудитория',hint:'Кто ваши основные клиенты? Можно описать тип клиентов, возраст, профессию, ожидания и особенности поведения.',type:'textarea',rows:3,full:true},
      {id:'targetAction',label:'2.7. Основное целевое действие',hint:'Что должен сделать посетитель, чтобы вы считали работу сайта успешной: позвонить, оставить заявку, заказать товар, записаться и т. д.?',type:'textarea',rows:2,full:true}
    ]},
    {title:'Функциональность',intro:'Отметьте нужные функции. Если пока сложно определиться с техническими решениями, оставьте пояснение или пропустите вопрос.',fields:[
      {id:'siteTypes',label:'3.1. Предполагаемый тип сайта',type:'checkboxes',required:true,full:true,options:[{label:'Сайт-визитка',value:'Сайт-визитка'},{label:'Сайт-портфолио',value:'Сайт-портфолио'},{label:'Блог',value:'Блог'},{label:'Социальная сеть / сообщество',value:'Социальная сеть / сообщество'},{label:'Корпоративный сайт с каталогом',value:'Корпоративный сайт с каталогом'},{label:'Корпоративный сайт без каталога',value:'Корпоративный сайт без каталога'},{label:'Интернет-магазин',value:'Интернет-магазин'},{label:'Информационный портал',value:'Информационный портал'},{label:'Одностраничный лендинг',value:'Одностраничный лендинг'},{label:'Многостраничный сайт / лендинг',value:'Многостраничный сайт / лендинг'},{label:'Другой тип (укажите ниже)',value:'Другой тип'}]},
      {id:'otherSiteType',label:'Другой тип сайта (если выбран)',type:'text',full:true},
      {id:'features',label:'3.2. Функциональные возможности сайта',type:'checkboxes',required:true,full:true,options:['Публикация новостей','Публикация статей','Публикация пресс-релизов','Подписка на новости / рассылку','Фотоальбомы и галереи','Быстрый поиск по сайту','Каталог товаров без корзины','Интернет-магазин с корзиной','Вакансии и отклики','Голосования и опросы','Доска объявлений','Формы обратной связи','Файлы для скачивания','Раздел «Вопросы и ответы»','Форум','Блог','Отзывы клиентов','Онлайн-консультации','Регистрация пользователей','Кабинет / поддержка клиентов','Калькулятор стоимости','Другое (укажите ниже)']},
      {id:'otherFeatures',label:'Другие функциональные возможности и требования',type:'textarea',rows:2,full:true},
      {id:'cms',label:'3.3. Предпочтительная система управления (CMS)',type:'radio',required:true,options:['Joomla','WordPress','1С-Битрикс','MODX','OpenCart','PrestaShop','Не принципиально','Другая (укажите ниже)']},
      {id:'otherCms',label:'Другая CMS или пояснения',type:'text'},
      {id:'integrations',label:'3.4. Интеграции со сторонними программами и сервисами',type:'checkboxes',required:true,full:true,options:['1С','Маркетплейсы / товарные площадки','Социальные сети','CRM (например, Битрикс24)','Системы аналитики','Платёжные сервисы','Другое (укажите ниже)']},
      {id:'otherIntegrations',label:'Дополнительные интеграции',type:'textarea',rows:2,full:true},
      {id:'languages',label:'3.5. Языковые версии сайта',type:'radio',required:true,options:['Только русский','Русский и английский','Русский и другие языки','Нужна консультация']},
      {id:'functionRequirements',label:'3.6. Основные требования и пожелания по функционалу',type:'textarea',rows:3,full:true},
      {id:'ecommerceFeatures',label:'3.7. Функции каталога и интернет-магазина',hint:'Заполняйте этот подраздел, если сайту нужен каталог товаров или интернет-магазин. Если это не относится к проекту, переходите к следующему разделу.',type:'checkboxes',full:true,conditional:'ecommerce',options:['Корзина: добавление товаров и изменение количества','Оформление заказа с передачей контактных данных','Карточка товара с описанием и характеристиками','Фильтрация товаров по параметрам','Сортировка по цене, новизне или популярности','Сравнение товаров','Рекомендуемые / сопутствующие товары','Расчёт скидок','История заказов для администратора или клиента','Самовывоз и курьерская доставка','Избранное','Похожие товары','Недавно просмотренные товары','Уведомления о статусе заказа','Расчёт стоимости доставки','Оплата картой и электронными способами','Выставление счёта / квитанции','Импорт и экспорт XLS / CSV / XML','Подключение платёжного или фискального оборудования по требованиям страны продаж']},
      {id:'ecommerceOther',label:'Дополнительные функции каталога / магазина',type:'textarea',rows:3,full:true,conditional:'ecommerce'},
      {id:'salesGeography',label:'География продаж и приёма платежей',hint:'Укажите страны, в которых планируется продавать товары или услуги.',type:'text',full:true,conditional:'ecommerce'}
    ]},
    {title:'Структура сайта',intro:'Определите основные разделы, навигацию и блоки. Список примерный: отметьте только то, что подходит вашему проекту.',fields:[
      {id:'siteSections',label:'4.1. Разделы сайта',type:'checkboxes',required:true,full:true,options:['О компании','Команда / сотрудники','Новости / статьи / блог','Услуги','Вопросы и ответы','Отзывы клиентов / покупателей','Цены / прайс-листы','События / мероприятия','Портфолио / проекты','Лицензии / сертификаты / награды','Партнёры','Документы для скачивания','Интерактивная карта','Вакансии','Фотогалерея','Контакты и реквизиты','Форма обратной связи','Доска объявлений','Система бронирования','Личный кабинет','Каталог продукции','Интернет-магазин','Другие разделы (укажите ниже)']},
      {id:'otherSections',label:'Другие разделы и подразделы',type:'textarea',rows:2,full:true},
      {id:'navigation',label:'4.2. Навигация по сайту',hint:'Какие меню и способы навигации нужны, где они должны располагаться и какие пункты включать?',type:'textarea',rows:3,full:true},
      {id:'infoBlocks',label:'4.3. Информационные блоки',hint:'Какие блоки обязательно должны быть на главной и внутренних страницах?',type:'textarea',rows:3,full:true},
      {id:'updateFrequency',label:'4.4. Периодичность обновления информации',hint:'Укажите, какие разделы и как часто будут обновляться.',type:'textarea',rows:2,full:true}
    ]},
    {title:'Компоновка и дизайн',intro:'Опишите желаемое визуальное направление. Ссылки на примеры сайтов и собственные материалы особенно полезны.',fields:[
      {id:'designApproach',label:'5.1. Подход к дизайну',required:true,hint:'Готовый дизайн или шаблон не обязательно означает низкое качество. Он может снизить бюджет, но обычно ограничивает глубину визуальных изменений. Подход и ограничения можно обсудить отдельно.',type:'radio',full:true,options:['Индивидуальный дизайн с нуля','Разработка на основе готового дизайна / шаблона','Готов рассмотреть оба варианта']},
      {id:'brandbook',label:'5.2. Наличие брендбука',type:'radio',required:true,options:['Есть брендбук / гайдлайн','Есть логотип и фирменные цвета','Материалы в разработке','Фирменного стиля пока нет']},
      {id:'likedExamples',label:'5.3. Примеры сайтов, которые вам нравятся',hint:'Укажите ссылки и опишите, что именно нравится: подача информации, дизайн, удобство, отдельные блоки.',type:'textarea',rows:3,full:true},
      {id:'dislikedExamples',label:'5.4. Примеры сайтов, которые вам не нравятся',hint:'Укажите ссылки и поясните, какие решения не подходят и почему.',type:'textarea',rows:3,full:true},
      {id:'composition',label:'5.5. Общая композиция сайта',type:'radio',options:['Левосторонняя композиция','Правосторонняя композиция','По центру','На всю ширину экрана','На усмотрение дизайнера']},
      {id:'designMood',label:'5.6. Настроение и ассоциации дизайна',type:'checkboxes',required:true,full:true,options:['Строгий корпоративный','Яркий и выразительный','Позитивный и дружелюбный','Насыщенный иллюстрациями','Минималистичный и функциональный','Нестандартные формы и композиция','Презентационный, с акцентом на продукт или услугу']},
      {id:'colorScheme',label:'5.7. Цветовая гамма и насыщенность',type:'checkboxes',full:true,options:['Только цвета фирменного стиля','Фирменные цвета и сочетаемые оттенки','Мягкие пастельные цвета','Светлый и воздушный','Сочетание светлых и тёмных блоков','Преимущественно тёмный','Монохромный','На усмотрение дизайнера']},
      {id:'fontPreferences',label:'5.8. Предпочтения по типам шрифтов',type:'checkboxes',options:['Гротеск (без засечек)','Антиква (с засечками)','Моноширинный','Рукописный','Декоративный','На усмотрение дизайнера']},
      {id:'responsive',label:'5.9. Адаптивность',type:'radio',required:true,full:true,options:['Адаптивный дизайн для компьютеров, планшетов и смартфонов','Фиксированная версия (укажите ширину ниже)','Нужна консультация']},
      {id:'fixedWidth',label:'Если нужна фиксированная ширина или есть особые требования',type:'text',full:true},
      {id:'photoMaterials',label:'5.10. Фотоматериалы и графика',hint:'Есть ли свои фотографии, видео, иллюстрации, схемы или другие материалы?',type:'textarea',rows:2,full:true},
      {id:'designRequirements',label:'5.11. Основные пожелания к визуальной концепции',type:'textarea',rows:3,full:true}
    ]},
    {title:'Дальнейшее развитие и поддержка',intro:'Отметьте, какая помощь может понадобиться после разработки сайта. Эти ответы не обязывают заказывать дополнительные услуги.',fields:[
      {id:'hostingDomain',label:'6.1. Размещение сайта в интернете',required:true,hint:'Нужна ли помощь с доменом, хостингом, DNS, SSL-сертификатом и публикацией?',type:'textarea',rows:2,full:true},
      {id:'contentFilling',label:'6.2. Наполнение сайта информацией',hint:'Кто подготовит тексты, фото и другие материалы? Какой объём информации нужно разместить?',type:'textarea',rows:2,full:true},
      {id:'seo',label:'6.3. SEO-оптимизация для поисковых сервисов',hint:'Отметьте, какие работы могут потребоваться.',type:'checkboxes',full:true,options:['Подбор семантики и ключевых запросов','Проработка структуры сайта','Подготовка SEO-текстов','Настройка SEO-заголовков и метаданных','Техническая оптимизация','Нужна консультация']},
      {id:'promotion',label:'6.4. Последующее продвижение в поисковых системах',hint:'Опишите предполагаемые задачи или ожидаемый результат.',type:'textarea',rows:2,full:true},
      {id:'paidAdvertising',label:'6.5. Платная реклама',hint:'Планируется ли реклама в Google, Яндекс или других системах? Укажите рынок и бюджет, если известны.',type:'textarea',rows:2,full:true},
      {id:'keywords',label:'6.6. Ключевые фразы',hint:'Укажите основные поисковые запросы, если они уже определены.',type:'textarea',rows:2,full:true},
      {id:'additionalNotes',label:'6.7. Дополнительные сведения и комментарии',type:'textarea',rows:3,full:true}
    ]}
  ];

  function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function fieldMarkup(f){
    var full=f.full?' full':'';
    var hint=f.hint?'<span class="brief-field-hint">'+esc(f.hint)+'</span>':'';
    var label='<span class="brief-field-label">'+esc(f.label)+(f.required?' <b aria-hidden="true">*</b>':'')+'</span>';
    var wrapStart='<div class="brief-field'+full+(f.conditional?' brief-conditional-field':'')+'" data-field-wrap="'+esc(f.id)+'"'+(f.conditional?' data-conditional="'+esc(f.conditional)+'" hidden':'')+'>';
    var input='';
    if(f.type==='textarea') input='<textarea class="brief-input" id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" rows="'+(f.rows||3)+'" placeholder="'+esc(f.placeholder||'')+'"'+(f.required?' required aria-required="true"':'')+'></textarea>';
    else if(f.type==='checkboxes'||f.type==='radio'){
      var type=f.type==='checkboxes'?'checkbox':'radio';
      input='<div class="brief-choice-grid" role="group" aria-label="'+esc(f.label)+'"'+(f.required?' aria-required="true"':'')+'>'+f.options.map(function(opt){var o=typeof opt==='string'?{label:opt,value:opt}:opt;return '<label class="brief-choice"><input type="'+type+'" name="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" value="'+esc(o.value)+'"><span>'+esc(o.label)+'</span></label>';}).join('')+'</div>';
    } else if(f.type==='select'){
      input='<select class="brief-input" id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'"'+(f.required?' required aria-required="true"':'')+'><option value="">Выберите вариант</option>'+f.options.map(function(o){return '<option value="'+esc(o)+'">'+esc(o)+'</option>';}).join('')+'</select>';
    } else input='<input class="brief-input" id="bf-'+esc(f.id)+'" data-field="'+esc(f.id)+'" type="'+(f.type==='tel'?'tel':f.type==='email'?'email':f.type==='url'?'url':'text')+'" autocomplete="'+(f.type==='email'?'email':f.type==='tel'?'tel':f.id==='company'?'organization':'off')+'" placeholder="'+esc(f.placeholder||'')+'"'+(f.required?' required aria-required="true"':'')+'>';
    var error=f.required?'<span class="brief-field-error" id="brief-error-'+esc(f.id)+'" data-error-for="'+esc(f.id)+'" hidden></span>':'';
    return wrapStart+label+hint+input+error+'</div>';
  }
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
    updateConditional();
  }
  function saveState(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(collectState()));saveStatus.textContent='Черновик сохранён в этом браузере';}
    catch(e){saveStatus.textContent='Автосохранение недоступно в этом режиме браузера';}
  }
  function restoreState(){try{var raw=localStorage.getItem(STORAGE_KEY);if(raw)applyState(JSON.parse(raw));}catch(e){saveStatus.textContent='Не удалось восстановить черновик';}}
  function updateConditional(){
    var typeValues=collectState().siteTypes||[];var show=typeValues.indexOf('Интернет-магазин')>=0||typeValues.indexOf('Корпоративный сайт с каталогом')>=0||typeValues.indexOf('Каталог товаров без корзины')>=0;
    form.querySelectorAll('[data-conditional="ecommerce"]').forEach(function(el){el.hidden=!show;});
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
      if(!valid){
        if(!firstField)firstField=controls[0]||null;
        if(field.type==='checkboxes'||field.type==='radio')missing.push('Выберите хотя бы один вариант в пункте «'+field.label.replace(/^\d+(?:\.\d+)?\.\s*/,'')+'».');
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
  var briefIntroTexts=[
    'Бриф представляет собой анкету с основными требованиями и информацией о будущем сайте. На её основе можно точнее определить задачи, структуру, функциональность, визуальное направление, предварительный бюджет и сроки проекта. Заполнение помогает заказчику сформулировать цели и представить будущие возможности сайта. Ответы помогают разработчику предложить подходящее решение и оценить объём работ. Ориентировочное время заполнения 15–20 минут. Заполняйте пункты, которые относятся к вашему проекту. Если ответа пока нет, поле можно оставить пустым.'
  ];
  function toText(value){if(Array.isArray(value))return value.join('; ');return String(value||'').trim();}
  function fieldIsVisible(f){var wrap=form.querySelector('[data-field-wrap="'+f.id+'"]');return !wrap||!wrap.hidden;}
  function getSummary(){
    var lines=['Бриф на разработку сайта'].concat(briefIntroTexts,['','Дата заполнения: '+new Date().toLocaleDateString('ru-RU'),'']);
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
      step.fields.forEach(function(f){if(!fieldIsVisible(f))return;var value=toText(state[f.id]);if(!value)return;var row=document.createElement('div');row.className='brief-review-item';var label=document.createElement('strong');label.textContent=f.label;var val=document.createElement('span');val.textContent=value;row.append(label,val);section.appendChild(row);});
      if(section.children.length>1)reviewSummary.appendChild(section);
    });
  }
  function fileBaseName(){return 'Artify_Заполненный_бриф_'+new Date().toISOString().slice(0,10);}
  function saveBlob(blob,name){var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();window.setTimeout(function(){URL.revokeObjectURL(url);},1800);}
  function getSections(){
    var state=collectState();
    return steps.map(function(step,i){return {title:(i+1)+'. '+step.title,fields:step.fields.filter(fieldIsVisible).map(function(f){return {label:f.label+(f.required?' *':''),value:toText(state[f.id])};}).filter(function(x){return x.value;})};}).filter(function(section){return section.fields.length;});
  }
  function printSummary(){
    var win=window.open('','_blank');
    if(!win){mailNote.textContent='Браузер заблокировал окно для PDF. Разрешите всплывающие окна для этой страницы и повторите попытку.';return;}
    var sections=getSections();
    var htmlSections=sections.map(function(section){return '<section><h2>'+esc(section.title)+'</h2>'+section.fields.map(function(f){return '<p><strong>'+esc(f.label)+'</strong><br>'+esc(f.value).replace(/\n/g,'<br>')+'</p>';}).join('')+'</section>';}).join('');
    var introHtml=briefIntroTexts.map(function(text){return '<p class="intro">'+esc(text).replace('15–20 минут.','<span class="accent">15–20 минут.</span>')+'</p>';}).join('');
    var legalHtml=(document.getElementById('briefPersonalConsent').checked&&document.getElementById('briefPolicyCheck').checked)?'<p class="legal-summary"><strong>Подтверждения в онлайн-форме</strong><br>Согласие на обработку персональных данных: отметка установлена.<br>Ознакомление с Политикой конфиденциальности: подтверждено.<br>Дата и время подтверждения: '+esc(confirmationTimestamp||new Date().toISOString())+'</p>':'';
    var artifyLogo=new URL('assets/images/artify-brand-lockup-light.png',document.baseURI).href;var companyLogo=new URL('assets/images/bvr-logo-on-light.png',document.baseURI).href;
    var doc='<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(fileBaseName())+'</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet"><style>@page{size:A4;margin:23mm 17mm 21mm;@bottom-left{content:"v-resurs.by · ООО «БЕЛВЕКТОРРЕСУРС»";font:8pt Onest,Arial,sans-serif;color:#6b6760}@bottom-right{content:"Бриф на разработку сайта · " counter(page);font:8pt Onest,Arial,sans-serif;color:#6b6760}}*{box-sizing:border-box}body{font:400 10.5pt/1.55 Onest,Arial,sans-serif;color:#1c1a17;margin:0}h1{font-size:22pt;line-height:1.15;margin:0 0 4mm;font-weight:600;letter-spacing:-.03em}h2{font-size:14pt;line-height:1.25;margin:7mm 0 3mm;padding-bottom:2mm;border-bottom:1px solid #ded8cf;color:#B8432A}p{margin:0 0 3mm;white-space:normal;overflow-wrap:anywhere}strong{font-weight:600}.meta{font-size:9pt;color:#6b6760;margin:0 0 5mm}.intro{font-size:10pt;color:#4f4a43;margin-bottom:5mm}.accent{color:#B8432A;font-weight:600}.print-header{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:0 0 5mm;margin:0 0 8mm;border-bottom:1px solid #ded8cf}.print-logo{display:block;width:auto;height:33pt;object-fit:contain}.artify-logo{max-width:52mm}.company-logo{max-width:59mm}section{break-inside:auto}section p{break-inside:avoid}.legal-summary{margin:2mm 0 0;padding-top:2mm;border-top:1px solid #ded8cf;font-size:8pt;line-height:1.35;color:#6b6760}@media screen{body{max-width:210mm;margin:16px auto;padding:12mm 17mm 18mm;box-shadow:0 2px 20px #0002;background:#fff}.printbar{position:sticky;top:0;padding:12px;background:#f7f4ef;margin:-12mm -17mm 10mm;display:flex;justify-content:flex-end}.printbar button{background:#b8432a;color:#fff;border:0;border-radius:8px;padding:10px 18px;font:600 14px Onest,Arial,sans-serif;cursor:pointer}}@media print{.printbar{display:none}.print-header{break-after:avoid}}</style></head><body><div class="printbar"><button onclick="window.print()">Печать / Сохранить как PDF</button></div><header class="print-header"><img class="print-logo artify-logo" src="'+esc(artifyLogo)+'" alt="Artify Factory"><img class="print-logo company-logo" src="'+esc(companyLogo)+'" alt="БЕЛВЕКТОРРЕСУРС"></header><h1>Бриф на разработку сайта</h1><p class="meta">Дата заполнения: '+esc(new Date().toLocaleDateString('ru-RU'))+'</p>'+introHtml+htmlSections+'<p>Спасибо за заполнение брифа! Ответы помогут подготовиться к обсуждению проекта и определить следующие шаги. Если часть информации пока неизвестна, её можно будет уточнить при разговоре.</p>'+legalHtml+'</body></html>';
    win.document.open();win.document.write(doc);win.document.close();
    win.focus();
    window.setTimeout(function(){try{win.print();}catch(e){}},700);
    mailNote.textContent='Открылось окно печати. В списке принтеров выберите «Сохранить как PDF», затем сохраните файл.';
  }
  function xmlEscape(value){return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
  function wordRun(text,bold,size){return String(text==null?'':text).split(/\r?\n/).map(function(part,index){return (index?'<w:r><w:br/></w:r>':'')+'<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:sz w:val="'+(size||21)+'"/><w:lang w:val="ru-RU"/>'+(bold?'<w:b/>':'')+'</w:rPr><w:t xml:space="preserve">'+xmlEscape(part)+'</w:t></w:r>';}).join('');}
  function wordParagraph(text,style,bold){var size=style==='Title'?34:style==='Subtitle'?19:style==='Heading1'?25:21;var keep=style==='Heading1'?'<w:keepNext/>':'';var pageBreak=style==='Heading1'&&/^6\./.test(text)?'<w:pageBreakBefore/>':'';return '<w:p><w:pPr>'+(style?'<w:pStyle w:val="'+style+'"/>':'<w:spacing w:after="90" w:line="300" w:lineRule="auto"/>')+pageBreak+keep+'</w:pPr>'+wordRun(text,bold,size)+'</w:p>';}
  function wordIntroParagraph(text){
    var phrase='15–20 минут.';var index=text.indexOf(phrase);var before=index>=0?text.slice(0,index):text;var after=index>=0?text.slice(index+phrase.length):'';
    var accent=index>=0?'<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="21"/><w:b/><w:color w:val="B8432A"/></w:rPr><w:t>'+xmlEscape(phrase)+'</w:t></w:r>':'';
    return '<w:p><w:pPr><w:spacing w:after="130" w:line="300" w:lineRule="auto"/></w:pPr>'+wordRun(before,false,21)+accent+wordRun(after,false,21)+'</w:p>';
  }
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
    briefIntroTexts.forEach(function(text){body.push(wordIntroParagraph(text));});
    body.push(wordParagraph('Поля, отмеченные звёздочкой, обязательны для заполнения в онлайн-форме.','',false));
    sections.forEach(function(section){body.push(wordParagraph(section.title,'Heading1',false));section.fields.forEach(function(field){body.push(wordField(field.label,field.value));});});
    body.push(wordParagraph('Спасибо за заполнение брифа! Ответы помогут подготовиться к обсуждению проекта и определить следующие шаги. Если часть информации пока неизвестна, её можно будет уточнить при разговоре.','',false));
    if(document.getElementById('briefPersonalConsent').checked&&document.getElementById('briefPolicyCheck').checked){body.push(wordParagraph('Подтверждения в онлайн-форме','Heading1',false));body.push(wordParagraph('Согласие на обработку персональных данных: отметка установлена.','',false));body.push(wordParagraph('Ознакомление с Политикой конфиденциальности: подтверждено.','',false));body.push(wordParagraph('Дата и время подтверждения: '+confirmationTimestamp,'',false));}
    var headerXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="9000"/></w:tabs><w:spacing w:after="120"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="7" w:color="DED8CF"/></w:pBdr></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="1C1A17"/></w:rPr><w:t>AF  ARTIFY FACTORY</w:t></w:r><w:r><w:rPr><w:sz w:val="13"/><w:color w:val="6B6760"/></w:rPr><w:t xml:space="preserve">  ЦИФРОВЫЕ ПРОДУКТЫ</w:t></w:r><w:r><w:tab/></w:r><w:r><w:rPr><w:b/><w:i/><w:sz w:val="18"/><w:color w:val="B8432A"/></w:rPr><w:t>БЕЛВЕКТОРРЕСУРС</w:t></w:r></w:p></w:hdr>';
    var footerXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="9000"/></w:tabs><w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="DED8CF"/></w:pBdr><w:spacing w:before="90"/></w:pPr><w:r><w:rPr><w:sz w:val="16"/><w:color w:val="6B6760"/></w:rPr><w:t>v-resurs.by · ООО «БЕЛВЕКТОРРЕСУРС»</w:t></w:r><w:r><w:tab/></w:r><w:r><w:rPr><w:sz w:val="16"/><w:color w:val="6B6760"/></w:rPr><w:t>Бриф на разработку сайта · </w:t></w:r><w:fldSimple w:instr="PAGE"><w:r><w:rPr><w:sz w:val="16"/><w:color w:val="6B6760"/></w:rPr><w:t>1</w:t></w:r></w:fldSimple></w:p></w:ftr>';
    body.push('<w:sectPr><w:headerReference w:type="default" r:id="rId2"/><w:footerReference w:type="default" r:id="rId3"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1450" w:right="1021" w:bottom="1250" w:left="1021" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>');
    var documentXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>'+body.join('')+'</w:body></w:document>';
    var stylesXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/><w:lang w:val="ru-RU"/><w:sz w:val="21"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="90" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:pPr><w:spacing w:after="180"/></w:pPr><w:rPr><w:b/><w:sz w:val="34"/><w:color w:val="1C1A17"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:rPr><w:color w:val="6B6760"/><w:sz w:val="19"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="260" w:after="100"/></w:pPr><w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="B8432A"/></w:rPr></w:style></w:styles>';
    var contentTypes='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>';
    var rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
    var docRels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>';
    return makeZip([{name:'[Content_Types].xml',data:contentTypes},{name:'_rels/.rels',data:rels},{name:'word/document.xml',data:documentXml},{name:'word/styles.xml',data:stylesXml},{name:'word/header1.xml',data:headerXml},{name:'word/footer1.xml',data:footerXml},{name:'word/_rels/document.xml.rels',data:docRels}]);
  }
  function downloadSummary(){
    var format=document.getElementById('briefFormat').value;
    if(format==='pdf'){printSummary();return;}
    if(format==='docx'){
      saveBlob(makeDocx(),fileBaseName()+'.docx');
      mailNote.textContent='Заполненный бриф в формате DOCX скачан. Для отправки можно использовать кнопку «Отправить бриф».';
      return;
    }
    saveBlob(new Blob(['\ufeff'+getSummary()],{type:'text/plain;charset=utf-8'}),fileBaseName()+'.txt');
    mailNote.textContent='Заполненный бриф в формате TXT скачан. Для отправки можно использовать кнопку «Отправить бриф».';
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
    saveState();makeReview();currentStep=steps.length;form.hidden=true;review.hidden=false;
    currentTitle.textContent='Проверьте ответы';stepCount.textContent='Раздел 7 из 7';percent.textContent='100%';progressFill.style.width='100%';progress.setAttribute('aria-valuenow','100');
    document.querySelector('.brief-progress-header').hidden=false;document.querySelector('.brief-progress-track').hidden=false;stepNav.hidden=false;
    updateNavigation(steps.length);updateMailLink();
    currentTitle.focus();
  }
  function resetForm(){
    if(!window.confirm('Заполнить бриф заново? Все введённые ответы и сохранённый черновик будут удалены.'))return;
    try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
    form.reset();applyState({});resetConfirmations();
    showStep(0);saveStatus.textContent='Начато новое заполнение';
    mailNote.textContent='На устройствах с поддержкой системной отправки файлов выберите почтовую программу в появившемся меню. В остальных браузерах DOCX скачивается отдельно, а файл нужно прикрепить к подготовленному письму вручную.';
    window.scrollTo({top:0,behavior:'smooth'});
  }
  buildSteps();restoreState();showStep(0);
  form.addEventListener('input',function(e){if(e.target.matches('[data-field]')){saveState();updateConditional();}});
  form.addEventListener('change',function(e){if(e.target.matches('[data-field]')){saveState();updateConditional();}});
  nextButton.addEventListener('click',function(){if(!validateCurrentStep())return;saveState();if(currentStep<steps.length-1)showStep(currentStep+1);else openReview();});
  prevButton.addEventListener('click',function(){saveState();showStep(currentStep-1);});
  document.getElementById('briefResetForm').addEventListener('click',resetForm);
  downloadButton.addEventListener('click',downloadSummary);
  function onConfirmationChange(){
    var accepted=document.getElementById('briefPersonalConsent').checked && document.getElementById('briefPolicyCheck').checked;
    confirmationTimestamp=accepted?new Date().toISOString():null;
    updateMailLink();
  }
  document.getElementById('briefPersonalConsent').addEventListener('change',onConfirmationChange);
  document.getElementById('briefPolicyCheck').addEventListener('change',onConfirmationChange);
  mailLink.addEventListener('click',sendBrief);
})();
