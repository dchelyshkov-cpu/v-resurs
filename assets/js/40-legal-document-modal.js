/* Artify — shared legal-document viewer, Trial 46.30.13.
   Policy and two-part Consent are approved display texts. Purchase Terms and License remain review placeholders. Viewing never checks a form consent checkbox. */
(function () {
  'use strict';

  var overlay = document.getElementById('afLegalModal');
  if (!overlay || overlay.dataset.ready === 'true') return;
  overlay.dataset.ready = 'true';

  var dialog = overlay.querySelector('.af-legal-dialog');
  var title = document.getElementById('afLegalTitle');
  var notice = document.getElementById('afLegalNotice');
  var body = document.getElementById('afLegalBody');
  var content = document.getElementById('afLegalContent');
  var previewActions = document.getElementById('afLegalPreviewActions');
  var fullActions = document.getElementById('afLegalFullActions');
  var nextButton = document.getElementById('afLegalNext');
  var readCheck = document.getElementById('afLegalReadCheck');
  var confirmButton = document.getElementById('afLegalConfirm');
  var activeTrigger = null;
  var previousOverflow = '';

  var approvedDocuments = window.ArtifyLegalDocuments || {};
  var demoNotice = 'ТЕСТОВЫЙ ДОКУМЕНТ. Текст условий покупки и лицензии ещё требует отдельного согласования; этот раздел нельзя считать утверждённым.';
  var demoDocuments = {
    policy: approvedDocuments.policy,
    consent: approvedDocuments.consent,
    'purchase-terms': {
      title: 'Условия покупки цифровых товаров',
      notice: demoNotice,
      sections: [
        ['Тестовая структура', 'Здесь будут описаны порядок оформления заказа, способы приобретения, подтверждение заказа и действия сторон. Коммерческие условия пока не утверждены.'],
        ['Цена и оплата', 'В окончательной версии будут приведены подтверждённые цены, валюта, доступные способы оплаты и порядок выставления счёта.'],
        ['Получение продукта', 'Здесь будет описан фактический способ передачи цифрового продукта, сроки и необходимые действия покупателя. Никаких обещаний мгновенной доставки этот макет не содержит.'],
        ['Обращения и спорные ситуации', 'Будет добавлен согласованный порядок обращений по заказу, техническим вопросам и иным ситуациям.']
      ]
    },
    license: {
      title: 'Описание лицензии',
      notice: demoNotice,
      sections: [
        ['Тестовая структура', 'Здесь будет описана лицензия конкретного цифрового продукта после согласования правообладателя и коммерческой модели.'],
        ['Разрешённое использование', 'В окончательной версии будут перечислены подтверждённые способы использования, допустимое количество проектов и ограничения, если они предусмотрены.'],
        ['Ограничения и передача прав', 'Здесь будут указаны ограничения на копирование, перепродажу, распространение исходных файлов и передачу прав. Ни одно из этих условий пока не считается утверждённым.'],
        ['Версия лицензии', 'Будут добавлены идентификатор, дата и связь лицензии с выбранным продуктом или заказом.']
      ]
    }
  };

  function makeDocument(key) {
    var doc = demoDocuments[key] || demoDocuments.policy;
    if (!doc) return;
    title.textContent = doc.title;
    notice.textContent = doc.notice || '';
    notice.hidden = !doc.notice;
    content.replaceChildren();
    if (typeof doc.html === 'string') {
      /* Approved HTML copy is embedded locally and shared by every legal-modal entry point. */
      content.innerHTML = doc.html;
      return;
    }
    (doc.sections || []).forEach(function (section) {
      var heading = document.createElement('h3');
      heading.textContent = Array.isArray(section) ? section[0] : section.heading;
      content.append(heading);
      var paragraphs = Array.isArray(section) ? [section[1]] : (section.paragraphs || []);
      paragraphs.forEach(function (paragraphText) {
        var paragraph = document.createElement('p');
        paragraph.textContent = paragraphText;
        content.append(paragraph);
      });
    });
  }

  function setFullMode() {
    overlay.classList.remove('is-escape-focus-suppressed');
    dialog.classList.remove('is-preview');
    dialog.classList.add('is-full');
    previewActions.hidden = true;
    fullActions.hidden = false;
    body.scrollTop = 0;
    window.requestAnimationFrame(function () { readCheck.focus({ preventScroll: true }); });
  }

  function closeDocument() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    dialog.classList.remove('is-preview', 'is-full');
    overlay.classList.remove('is-escape-focus-suppressed');
    document.body.style.overflow = previousOverflow;
    if (activeTrigger && activeTrigger.isConnected) activeTrigger.focus({ preventScroll: true });
    activeTrigger = null;
  }

  function openDocument(key, trigger) {
    activeTrigger = trigger || document.activeElement;
    overlay.classList.remove('is-escape-focus-suppressed');
    makeDocument(key);
    readCheck.checked = false;
    confirmButton.disabled = true;
    body.scrollTop = 0;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    /* Preview is the only initial state on every breakpoint. The view state is
       interaction-driven, not viewport-driven: resizing never skips or resets Далее. */
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    dialog.classList.add('is-preview');
    dialog.classList.remove('is-full');
    previewActions.hidden = false;
    fullActions.hidden = true;
    window.requestAnimationFrame(function () {
      /* Keep initial focus on the dialog itself at every viewport size. */
      dialog.focus({ preventScroll: true });
    });
  }

  function resolveDocument(link) {
    if (link.hasAttribute('data-legal-open')) return link.getAttribute('data-legal-open');
    var checkoutKey = link.getAttribute('data-legal-doc');
    if (checkoutKey === 'privacy') return 'policy';
    if (checkoutKey === 'personal-data') return 'consent';
    return checkoutKey;
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('[data-legal-open], [data-legal-doc]') : null;
    if (!link) return;
    var key = resolveDocument(link);
    if (!demoDocuments[key]) return;
    event.preventDefault();
    event.stopPropagation();
    openDocument(key, link);
  }, true);

  nextButton.addEventListener('click', setFullMode);
  readCheck.addEventListener('change', function () { confirmButton.disabled = !readCheck.checked; });
  confirmButton.addEventListener('click', function () {
    if (!readCheck.checked) return;
    closeDocument();
  });
  overlay.querySelectorAll('[data-af-legal-cancel]').forEach(function (button) {
    button.addEventListener('click', closeDocument);
  });

  document.addEventListener('keydown', function (event) {
    if (overlay.hidden || event.key !== 'Tab') return;
    var selector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
    var items = Array.prototype.slice.call(dialog.querySelectorAll(selector)).filter(function (item) {
      return !item.disabled && !item.closest('[hidden], [aria-hidden="true"], [inert]') && item.getAttribute('aria-hidden') !== 'true';
    });
    if (!items.length) {
      event.preventDefault();
      dialog.focus({ preventScroll: true });
      return;
    }
    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;
    /* The dialog itself is the initial focus target; the first Tab enters the scrollable body. */
    if (active === dialog || !dialog.contains(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus({ preventScroll: true });
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }, true);

  var requestedDocument = new URLSearchParams(window.location.search).get('openLegal');
  if (requestedDocument === 'policy' || requestedDocument === 'consent') {
    window.requestAnimationFrame(function () { openDocument(requestedDocument, null); });
  }
}());
