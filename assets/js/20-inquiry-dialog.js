
(function () {
  'use strict';
  var overlay = document.getElementById('projectDiscussionOverlay');
  var dialog = document.getElementById('projectDiscussionDialog');
  var form = document.getElementById('projectCallbackForm');
  if (!overlay || !dialog || !form) return;
  var nameInput = document.getElementById('projectCallbackName');
  var country = document.getElementById('projectCallbackCountry');
  var phone = document.getElementById('projectCallbackPhone');
  var consent = document.getElementById('projectCallbackConsent');
  var requestType = document.getElementById('projectRequestType');
  var messageInput = document.getElementById('projectCallbackMessage');
  var messageRequired = document.getElementById('projectCallbackMessageRequired');
  var messageFeedback = document.getElementById('projectCallbackMessageFeedback');
  var modalIntro = document.getElementById('projectDiscussionIntro');
  var submit = document.getElementById('projectCallbackSubmit');
  var trigger = null;
  var savedY = 0;
  var savedBody = null;
  var savedHtmlScrollBehavior = '';
  var appWasInert = false;
  var headerWasInert = false;
  var timer = 0;

  var touched = {name:false, phone:false, consent:false, message:false};
  var submitted = false;
  var nameFeedback = document.getElementById('projectCallbackNameFeedback');
  var phoneFeedback = document.getElementById('projectCallbackPhoneFeedback');
  var consentFeedback = document.getElementById('projectCallbackConsentFeedback');

  function digits(value) { return String(value || '').replace(/\D/g, ''); }
  function phoneLength() { return country.value === '+7' ? 10 : 9; }
  function localPhoneDigits(value) {
    var d = digits(value);
    if (country.value === '+375') {
      if (d.indexOf('375') === 0) d = d.slice(3);
      if (d.indexOf('80') === 0) d = d.slice(1);
      return d.slice(0, 9);
    }
    if (d.indexOf('7') === 0 || d.indexOf('8') === 0) d = d.slice(1);
    return d.slice(0, 10);
  }
  function formatPhone(value) {
    var d = localPhoneDigits(value);
    phone.dataset.digits = d;
    if (country.value === '+7') {
      if (!d.length) return '';
      return (d.length ? '(' + d.slice(0,3) + (d.length >= 3 ? ')' : '') : '') + (d.length > 3 ? ' ' + d.slice(3,6) : '') + (d.length > 6 ? '-' + d.slice(6,8) : '') + (d.length > 8 ? '-' + d.slice(8,10) : '');
    }
    if (!d.length) return '';
    return d.slice(0,2) + (d.length > 2 ? ' ' + d.slice(2,5) : '') + (d.length > 5 ? '-' + d.slice(5,7) : '') + (d.length > 7 ? '-' + d.slice(7,9) : '');
  }
  function phoneIsValid() { return (phone.dataset.digits || '').length === phoneLength(); }
  function nameIsValid() {
    var value = nameInput.value.trim();
    return value.length <= 80 && /^[\p{L}][\p{L}\p{M}\s.'’\-]{1,79}$/u.test(value) && /\p{L}/u.test(value);
  }
  function setFeedback(node, state, message) {
    if (!node) return;
    node.dataset.state = state;
    node.textContent = message;
  }
  function validate() {
    var nameValue = nameInput.value.trim();
    var nameOK = nameIsValid();
    var phoneOK = phoneIsValid();
    var consentOK = consent.checked;
    var messageNeeded = requestType.value === 'question';
    var messageOK = !messageNeeded || messageInput.value.trim().length >= 5;
    var showName = touched.name || submitted;
    var showPhone = touched.phone || submitted;
    var showConsent = touched.consent || submitted;
    var showMessage = touched.message || submitted;

    nameInput.setAttribute('aria-invalid', String(showName && !nameOK));
    if (showName && !nameOK) setFeedback(nameFeedback, 'error', nameValue ? 'Введите имя буквами (от 2 символов), без цифр.' : 'Укажите имя.');
    else setFeedback(nameFeedback, 'hint', 'Имя — не менее двух символов, без цифр.')

    phone.setAttribute('aria-invalid', String(showPhone && !phoneOK));
    if (showPhone && !phoneOK) setFeedback(phoneFeedback, 'error', phone.value.trim() ? (country.value === '+7' ? 'Нужно ввести 10 цифр российского номера.' : 'Нужно ввести 9 цифр белорусского номера.') : 'Укажите номер телефона.');
    else setFeedback(phoneFeedback, 'hint', country.value === '+7' ? 'Россия: 10 цифр без кода +7, например (999) 123-45-67.' : 'Беларусь: 9 цифр без кода +375, например 29 123-45-67.')

    consent.setAttribute('aria-invalid', String(showConsent && !consentOK));
    if (!consentOK && showConsent) setFeedback(consentFeedback, 'error', 'Подтвердите согласие, чтобы отправить заявку.');
    else setFeedback(consentFeedback, 'hint', 'Согласие обязательно для отправки заявки.')

    messageInput.setAttribute('aria-invalid', String(showMessage && !messageOK));
    messageRequired.hidden = !messageNeeded;
    messageInput.required = messageNeeded;
    if (messageNeeded && !messageOK && showMessage) setFeedback(messageFeedback, 'error', 'Напишите вопрос (не менее 5 символов).');
    else setFeedback(messageFeedback, 'hint', messageNeeded ? 'Поле обязательно для отправки вопроса.' : 'Можно добавить детали проекта или оставить поле пустым.');

    submit.textContent = requestType.value === 'question' ? 'Отправить вопрос' : requestType.value === 'callback' ? 'Заказать обратный звонок' : 'Отправить обращение';
    submit.disabled = !(nameOK && phoneOK && consentOK && messageOK);
    return nameOK && phoneOK && consentOK && messageOK;
  }
  function showThanks() {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = 'Проверка формы пройдена. Демонстрационный режим: обращение не отправлено и не сохранено.';
    toast.hidden = false;
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(function () { toast.hidden = true; }, 5200);
  }
  function lockPage() {
    savedY = window.scrollY || window.pageYOffset || 0;
    savedBody = {position:document.body.style.position,top:document.body.style.top,left:document.body.style.left,right:document.body.style.right,width:document.body.style.width,overflow:document.body.style.overflow};
    savedHtmlScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.classList.add('project-discussion-open');
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    var app = document.getElementById('app');
    var header = document.querySelector('.site-header');
    appWasInert = !!(app && app.inert);
    headerWasInert = !!(header && header.inert);
    if (app) app.inert = true;
    if (header) header.inert = true;
  }
  function unlockPage(restoreScroll) {
    document.body.classList.remove('project-discussion-open');
    if (savedBody) {
      document.body.style.position = savedBody.position;
      document.body.style.top = savedBody.top;
      document.body.style.left = savedBody.left;
      document.body.style.right = savedBody.right;
      document.body.style.width = savedBody.width;
      document.body.style.overflow = savedBody.overflow;
    }
    document.documentElement.style.scrollBehavior = savedHtmlScrollBehavior;
    var app = document.getElementById('app');
    var header = document.querySelector('.site-header');
    if (app) app.inert = appWasInert;
    if (header) header.inert = headerWasInert;
    if (restoreScroll) window.scrollTo({top:savedY,behavior:'auto'});
    savedBody = null;
  }
  var lastInputMode = 'pointer';
  document.addEventListener('pointerdown', function () {
    lastInputMode = 'pointer';
    document.body.classList.remove('project-modal-escape-focus-restored');
  }, true);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
      document.body.classList.remove('project-modal-escape-focus-restored');
    }
    if (event.key === 'Tab' || event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') lastInputMode = 'keyboard';
  }, true);

  function close(options) {
    if (overlay.hidden) return;
    var opts = options || {};
    var returnTarget = opts.returnFocus !== false && trigger && trigger.isConnected ? trigger : null;
    var restoreKeyboardFocus = !!returnTarget && lastInputMode === 'keyboard';
    var active = document.activeElement;
    overlay.hidden = true;
    if (active && dialog.contains(active) && typeof active.blur === 'function') active.blur();
    unlockPage(opts.restoreScroll !== false);
    if (returnTarget) {
      if (restoreKeyboardFocus) {
        returnTarget.focus({preventScroll:true});
        if (opts.escapeClose) document.body.classList.add('project-modal-escape-focus-restored');
      } else if (typeof returnTarget.blur === 'function') returnTarget.blur();
    }
    trigger = null;
  }
  function applyRequestPreset(value) {
    requestType.value = value || 'callback';
    var labels = {
      callback: 'Оставьте контактные данные — мы свяжемся с вами, чтобы обсудить задачу.',
      question: 'Опишите вопрос и оставьте телефон для обратной связи.',
      'product-help': 'Поможем сориентироваться в направлениях, подобрать подходящий продукт и обсудить его состав, формат и возможности адаптации.',
      'product-adaptation': 'Обсудим, какой готовый продукт вы выбрали, какие изменения нужны и возможна ли адаптация под ваш проект.',
      'corporate-site': 'Обсудим задачи бизнеса, структуру сайта, содержание и состав работ по корпоративному сайту.',
      landing: 'Обсудим задачу, сценарий страницы и состав работ по лендингу.',
      marketplace: 'Обсудим товар, структуру инфографики и оформление карточек для Wildberries и Ozon.',
      'constructor-pro': 'Обсудим возможности расширенного доступа, состав функций и условия запуска конструктора PRO.'
    };
    modalIntro.textContent = labels[requestType.value] || labels.callback;
  }
  function open(source) {
    if (!overlay.hidden) return;
    document.body.classList.remove('project-modal-escape-focus-restored');
    form.reset();
    nameInput.value = '';
    phone.value = '';
    phone.dataset.digits = '';
    messageInput.value = '';
    phone.placeholder = country.value === '+7' ? '(999) 123-45-67' : '29 123-45-67';
    applyRequestPreset(source instanceof HTMLElement ? source.dataset.requestType : 'callback');
    touched = {name:false, phone:false, consent:false, message:false};
    submitted = false;
    validate();
    trigger = source instanceof HTMLElement ? source : document.activeElement;
    lockPage();
    overlay.hidden = false;
    window.setTimeout(function () { nameInput.focus({preventScroll:true}); }, 0);
  }
  window.ArtifyProjectModal = {open:open,close:close};

  nameInput.addEventListener('input', function () { validate(); });
  nameInput.addEventListener('blur', function () { touched.name = true; validate(); });
  phone.addEventListener('input', function () {
    var formatted = formatPhone(phone.value);
    if (phone.value !== formatted) phone.value = formatted;
    validate();
  });
  phone.addEventListener('blur', function () { touched.phone = true; validate(); });
  country.addEventListener('change', function () {
    phone.value = '';
    phone.dataset.digits = '';
    touched.phone = false;
    phone.placeholder = country.value === '+7' ? '(999) 123-45-67' : '29 123-45-67';
    phone.focus({preventScroll:true});
    validate();
  });
  consent.addEventListener('change', function () { touched.consent = true; validate(); });
  requestType.addEventListener('change', function () { touched.message = false; applyRequestPreset(requestType.value); validate(); });
  messageInput.addEventListener('input', function () { validate(); });
  messageInput.addEventListener('blur', function () { touched.message = true; validate(); });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    submitted = true;
    touched.name = touched.phone = touched.consent = touched.message = true;
    if (!validate()) { var firstInvalid = !nameIsValid() ? nameInput : !phoneIsValid() ? phone : (requestType.value === 'question' && messageInput.value.trim().length < 5) ? messageInput : consent; firstInvalid.focus({preventScroll:true}); return; }
    /* Prototype only: never claim that a real request was delivered without a server endpoint. */
    form.reset();
    nameInput.value = '';
    phone.value = '';
    phone.dataset.digits = '';
    messageInput.value = '';
    phone.placeholder = country.value === '+7' ? '(999) 123-45-67' : '29 123-45-67';
    touched = {name:false, phone:false, consent:false, message:false};
    submitted = false;
    validate();
    close();
    showThanks();
  });
  overlay.addEventListener('click', function (event) { if (event.target === overlay) close(); });
  document.addEventListener('keydown', function (event) {
    if (overlay.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close({escapeClose:true}); return; }
    if (event.key !== 'Tab') return;
    var focusable = Array.from(dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),a[href], [tabindex]:not([tabindex="-1"])')).filter(function (el) { return !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true'; });
    if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  validate();
}());
