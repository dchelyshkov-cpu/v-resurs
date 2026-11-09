
  (function () {
    'use strict';
    var app = document.getElementById('app');
    var cartStorageKey = 'artify-cart-v1';
    function readCartState() { try { return window.localStorage.getItem(cartStorageKey) === 'true'; } catch (_) { return false; } }
    function persistCartState() { try { window.localStorage.setItem(cartStorageKey, cart ? 'true' : 'false'); } catch (_) {} }
    var cart = readCartState();
    var directPurchase = false;
    var buyerType = 'INDIVIDUAL';
    var purchaseMethod = 'ONLINE';
    var checkoutStep = 'DETAILS';
    var touched = {};
    var attemptedSubmit = false;
    var activeTab = 'overview';
    var currentPage = 'home';
    var toastTimer;
    var labels = {system:'Как на устройстве',light:'Светлая',dark:'Тёмная'};
    var currentHoverLink = null;
    function toast(message) {
      var el = document.getElementById('toast');
      el.textContent = message;
      el.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { el.hidden = true; }, 3200);
    }
    

function artMarkup() {
      return '<div class="product-art" aria-label="Визуальный макет продукта ALEN"><div class="art-paper"><small>ARTIFY FACTORY / PRODUCT</small><strong>A<br>LEN.</strong><small style="position:absolute;left:20px;bottom:18px">DIGITAL PRODUCT · ALEN</small></div></div>';
    }
    /* B-02.14 · Variant A: home is intentionally concise; detailed directions render as dedicated views. */
    function homeMarkup() {
      return `<section class="af-hero" id="top"><div class="container"><div class="af-bento">
        <article class="af-bento-card af-bento-main bento-main-v2">
          <div class="bento-main-bg" aria-hidden="true"></div>
          <div class="bento-main-content">
            <h1>Решение, которое не придётся переделывать</h1>
            <div class="bento-manifest-lead">
              <p class="bento-manifest">Продукт, который работает, а не просто выглядит красиво.</p>
              <p class="lead">Готовые цифровые решения для быстрого запуска или разработка «с нуля» под вашу конкретную задачу.</p>
            </div>
            <p class="bento-process-copy">Сначала разберем, какую задачу вы хотите решить, и потом соберем структуру: общий смысл, тексты, дизайн и поведение на сайте в один уникальный сценарий. Начнем с брифа, далее прототип, корректировки и завершим финальной сборкой.</p>
            <p class="bento-hero-closing">Выберите, какое решение нужно именно вам, и двигайтесь по понятному пути.</p>
          </div>
        </article>
        <article class="af-bento-card bento-updates-card">
          <div class="bento-card-bg bento-updates-bg" aria-hidden="true"></div>
          <div class="bento-card-content"><span class="bento-kicker">Обновления</span><h2>Что нового</h2>
            <div class="bento-update"><time datetime="2026-10-22">22.10</time><span>Artify Factory — новая версия</span></div>
            <div class="bento-update"><time datetime="2026-10-18">18.10</time><span>ALEN — новая версия</span></div>
            <div class="bento-update"><time datetime="2026-10-15">15.10</time><span>CoffeeConstructor — шаблон</span></div>
            <div class="bento-update"><time datetime="2026-10-11">11.10</time><span>UI Kit — новые компоненты</span></div>
            <div class="bento-update"><time datetime="2026-10-08">08.10</time><span>Artify — обновление каталога</span></div>
          </div>
        </article>
        <article class="af-bento-card bento-paths-card" id="constructor-intro">
          <div class="bento-card-bg bento-paths-bg" aria-hidden="true"></div>
          <div class="bento-card-content"><span class="bento-kicker">Три понятных пути</span><h2>Выберите свой маршрут</h2>
            <div class="bento-path-row"><span>01</span><div><strong>Конструктор</strong><p>Попробуйте бесплатно создать свой первый лендинг с помощью нашего конструктора.</p></div></div>
            <div class="bento-path-row"><span>02</span><div><strong>Готовые продукты</strong><p>Шаблоны и цифровые комплекты с понятным составом и лицензией.</p></div></div>
            <div class="bento-path-row"><span>03</span><div><strong>Разработка</strong><p>Сайт или иное решение под вашу задачу: структура, дизайн и интерфейс.</p></div></div>
          </div>
        </article>
        <article class="af-bento-card bento-links-card" id="directions-short">
          <div class="bento-card-bg bento-links-bg" aria-hidden="true"></div>
          <div class="bento-card-content"><span class="bento-kicker">Куда дальше</span><h2>Продолжите выбранный маршрут</h2>
            <a href="#landing-constructor" data-route="home" data-scroll="landing-constructor">Конструктор</a>
            <a href="#landing-products" data-route="home" data-scroll="landing-products">Готовые продукты</a>
            <a href="#landing-development" data-route="home" data-scroll="landing-development">Разработка</a>
          </div>
        </article>
        <article class="af-bento-card bento-image-card bento-image-card-copy" aria-label="Artify — идеи становятся решениями">
          <div class="bento-image-bg" aria-hidden="true"></div>
          <div class="bento-image-copy-shade" aria-hidden="true"></div>
          <div class="bento-image-copy">
            <span class="bento-image-copy-kicker">ARTIFY FACTORY · ЦИФРОВЫЕ ПРОДУКТЫ</span>
            <h2>Идеи становятся решениями</h2>
            <p>Создавайте, вдохновляйтесь, развивайте свой проект вместе с Artify Factory.</p>
          </div>
        </article>
        <div class="af-hero-actions" aria-label="Основные действия">
          <a class="btn btn-accent" href="#landing-products" data-route="home" data-scroll="landing-products">Купить продукт</a>
          <a class="btn btn-secondary-hero" href="#projectDiscussionOverlay" data-action="discuss-project" data-request-type="callback" aria-haspopup="dialog">Заказать звонок</a>
        </div>
      </div></div></section>
      ${landingConstructorMarkup()}
      ${landingProductsMarkup()}
      ${landingDevelopmentMarkup()}
      <section class="section af-full-contacts" id="contacts" aria-labelledby="contacts-title">
        <div class="container contacts-inner">
          <header class="contacts-head">
            <span class="eyebrow landing-section-label">Artify Factory · контакты</span>
            <h2 class="landing-section-heading" id="contacts-title">Свяжитесь удобным способом</h2>
            <p class="artify-contact-intro">Выберите удобный канал связи по вопросам цифровых продуктов и индивидуальной разработки.</p>
          </header>
          <div class="contacts-grid" aria-label="Способы связи">
            <article class="artify-contact-card">
              <div class="artify-contact-heading">
                <span class="landing-constructor-step-number" aria-hidden="true">01</span>
                <span class="landing-constructor-step-copy artify-contact-heading-copy"><strong>Телефон</strong></span>
              </div>
              <div class="landing-constructor-step-copy artify-contact-copy">
                <small>Для обсуждения проекта, консультации и рабочих вопросов.</small>
                <a class="artify-contact-value" href="tel:+375296579412">+375 (29) 657-94-12</a>
              </div>
            </article>
            <article class="artify-contact-card">
              <div class="artify-contact-heading">
                <span class="landing-constructor-step-number" aria-hidden="true">02</span>
                <span class="landing-constructor-step-copy artify-contact-heading-copy"><strong>Электронная почта</strong></span>
              </div>
              <div class="landing-constructor-step-copy artify-contact-copy">
                <small>Напишите нам, если удобнее подробно описать задачу письменно.</small>
                <a class="artify-contact-value" href="mailto:info@v-resurs.by">info@v-resurs.by</a>
              </div>
            </article>
            <article class="artify-contact-card artify-contact-messengers">
              <div class="artify-contact-heading">
                <span class="landing-constructor-step-number" aria-hidden="true">03</span>
                <span class="landing-constructor-step-copy artify-contact-heading-copy"><strong>Мессенджеры</strong></span>
              </div>
              <div class="landing-constructor-step-copy artify-contact-copy">
                <small>Выберите привычный способ для Вас способ связи. Ссылки будут открываться в новом окне.</small>
                <div class="artify-messenger-list" role="group" aria-label="Доступные каналы связи в мессенджерах">
                  <a class="artify-messenger-icon artify-messenger-icon--telegram" href="https://t.me/+375296579412" target="_blank" rel="noopener noreferrer" aria-label="Написать в Telegram"><img src="assets/images/messengers/telegram.svg" alt="" width="24" height="24"></a>
                  <a class="artify-messenger-icon artify-messenger-icon--whatsapp" href="https://wa.me/375296579412" target="_blank" rel="noopener noreferrer" aria-label="Написать в WhatsApp"><img src="assets/images/messengers/whatsapp.svg" alt="" width="24" height="24"></a>
                  <a class="artify-messenger-icon artify-messenger-icon--viber" href="viber://chat?number=%2B375296579412" target="_blank" rel="noopener noreferrer" aria-label="Написать в Viber"><img src="assets/images/messengers/viber.svg" alt="" width="24" height="24"></a>
                </div>
              </div>
            </article>
          </div>
          <aside class="contact-legal-panel" aria-label="Реквизиты компании">
            <div class="contact-legal-heading"><span class="artify-contact-label">Реквизиты компании</span></div>
            <div class="contact-legal-details">
              <p><strong>Общество с ограниченной ответственностью «БелВекторРесурс»</strong></p>
              <p><span>УНП</span><strong>193359398</strong></p>
              <p><span>Юридический адрес</span><strong>Республика Беларусь, 220036, г. Минск, ул. Карла Либкнехта, д. 66, оф. 212, пом. 71.</strong></p>
              <div class="artify-contact-location">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="9" r="2.3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>
                <span class="artify-contact-coordinates">53.897323, 27.529007</span>
                <a class="artify-contact-map-link" href="https://yandex.by/maps/?pt=27.529007%2C53.897323&amp;z=17&amp;l=map" target="_blank" rel="noopener noreferrer" aria-label="Открыть координаты 53.897323, 27.529007 в Яндекс Картах">Открыть в Яндекс Картах</a>
              </div>
            </div>
          </aside>
        </div>
      </section>`;
    }
    function constructorMarkup() {
      return `<section class="section af-full-constructor" id="constructor">
        <div class="container constructor-container">
          <div class="constructor-hero-grid">
            <div class="constructor-hero-copy">
              <span class="eyebrow landing-section-label">Artify Factory · визуальный конструктор</span>
              <h1 class="constructor-page-title">От структуры до готового лендинга.</h1>
              <p class="lead">Соберите основу страницы, заполните содержание, настройте визуальный стиль и проверьте результат на разных экранах — в одном редакторе.</p>
              <div class="actions constructor-hero-actions">
                <a href="editor/index.html" target="_blank" rel="noopener noreferrer" class="btn btn-accent constructor-try-btn">Попробовать</a>
                <a href="#constructor-gallery" class="btn constructor-secondary-btn">Посмотреть 4 этапа</a>
              </div>
              <div class="constructor-benefits" aria-label="Возможности конструктора">
                <span><i aria-hidden="true">01</i> Секции и содержание</span>
                <span><i aria-hidden="true">02</i> Цвета и типографика</span>
                <span><i aria-hidden="true">03</i> Desktop / Tablet / Mobile</span>
                <span><i aria-hidden="true">04</i> Экспорт HTML</span>
              </div>
              <p class="constructor-desktop-note"><strong>Для сборки — компьютер.</strong> На смартфоне удобно изучить этапы; рабочий редактор использует три колонки и рекомендует ширину окна от 1101 px.</p>
            </div>
            <div class="constructor-preview-column">
              <figure class="constructor-preview-frame">
                <div class="constructor-preview-chrome"><span></span><span></span><span></span><b>Artify Factory · Landing Builder</b><small>РЕАЛЬНЫЙ ИНТЕРФЕЙС</small></div>
                <img src="assets/images/constructor-preview.webp" alt="Рабочий интерфейс Artify Factory: дерево секций, центральная панель настроек и предпросмотр сайта" width="1320" height="880" loading="eager">
              </figure>
              <p class="constructor-preview-caption">Три рабочие области: структура проекта, настройки и визуальный предпросмотр.</p>
            </div>
          </div>

          <div class="constructor-gallery-head" id="constructor-gallery">
            <div><span class="eyebrow">Четыре информационных экрана</span><h2>От структуры до готового файла.</h2></div>
            <p>Посмотрите, как проходит работа — от выбора секций до проверки адаптивности и экспорта.</p>
          </div>

          <nav class="constructor-step-tabs" aria-label="Этапы работы в конструкторе">
            <button type="button" class="constructor-step-tab is-active" aria-current="step" data-step-go="0"><span>01</span> Структура</button>
            <button type="button" class="constructor-step-tab" data-step-go="1"><span>02</span> Контент</button>
            <button type="button" class="constructor-step-tab" data-step-go="2"><span>03</span> Дизайн</button>
            <button type="button" class="constructor-step-tab" data-step-go="3"><span>04</span> Проверка</button>
          </nav>

          <div class="constructor-carousel-shell">
            <button type="button" class="constructor-story-arrow constructor-story-prev" data-constructor-scroll="prev" aria-label="Предыдущий экран">←</button>
            <div class="constructor-track constructor-story-track" id="constructor-track" role="region" aria-label="Четыре этапа работы в Artify Factory" tabindex="0">
              <article class="constructor-slide constructor-story-slide" data-step="0" aria-hidden="false">
                <div class="constructor-story-grid">
                  <div class="constructor-slide-copy">
                    <span class="constructor-step-kicker">ЭКРАН 01 / 04</span>
                    <h3>Начните со структуры</h3>
                    <p>Включите нужные секции и отключите лишние: шапку, первый экран, продукты, процесс, блок доверия, форму или подвал.</p>
                    <p class="constructor-step-detail">Сначала — логика будущей страницы, а не декоративные элементы.</p>
                  </div>
                  <figure class="constructor-step-shot"><img src="assets/images/constructor-step-01.webp" alt="Реальная панель Artify Factory со списком секций и элементами управления их видимостью" width="805" height="510" loading="lazy" decoding="async"><figcaption>Секции и дерево проекта</figcaption></figure>
                </div>
              </article>
              <article class="constructor-slide constructor-story-slide" data-step="1" aria-hidden="true">
                <div class="constructor-story-grid">
                  <div class="constructor-slide-copy">
                    <span class="constructor-step-kicker">ЭКРАН 02 / 04</span>
                    <h3>Заполните содержанием</h3>
                    <p>Добавьте название, предложение, заголовок первого экрана, описание и необходимые данные. Подсказки помогают понять, для чего нужно поле.</p>
                    <p class="constructor-step-detail">Демо-тексты заменяются вашими данными перед публикацией.</p>
                  </div>
                  <figure class="constructor-step-shot"><img src="assets/images/constructor-step-02.webp" alt="Реальная форма редактирования текстов и заголовков в Artify Factory" width="526" height="510" loading="lazy" decoding="async"><figcaption>Поля контента и пояснения</figcaption></figure>
                </div>
              </article>
              <article class="constructor-slide constructor-story-slide" data-step="2" aria-hidden="true">
                <div class="constructor-story-grid">
                  <div class="constructor-slide-copy">
                    <span class="constructor-step-kicker">ЭКРАН 03 / 04</span>
                    <h3>Настройте визуальный стиль</h3>
                    <p>Выберите подходящий характер дизайна, основной и акцентный цвета, шрифт. Предпросмотр обновляется по мере изменения параметров.</p>
                    <p class="constructor-step-detail">Не нужно редактировать CSS вручную для базовых настроек оформления.</p>
                  </div>
                  <figure class="constructor-step-shot"><img src="assets/images/constructor-step-03.webp" alt="Реальная панель настройки стиля, цветов и шрифта конструктора Artify Factory" width="526" height="510" loading="lazy" decoding="async"><figcaption>Параметры оформления</figcaption></figure>
                </div>
              </article>
              <article class="constructor-slide constructor-story-slide" data-step="3" aria-hidden="true">
                <div class="constructor-story-grid">
                  <div class="constructor-slide-copy">
                    <span class="constructor-step-kicker">ЭКРАН 04 / 04</span>
                    <h3>Проверьте и скачайте</h3>
                    <p>Переключайте предпросмотр Desktop, Tablet и Mobile, проверьте композицию и скачайте результат в формате HTML для дальнейшей работы.</p>
                    <p class="constructor-step-detail">Просмотр адаптивности доступен в редакторе. Саму сборку удобнее выполнять на компьютере.</p>
                  </div>
                  <figure class="constructor-step-shot"><img src="assets/images/constructor-step-04.webp" alt="Реальный экран редактора Artify Factory с режимами Desktop, Tablet и Mobile и предпросмотром сайта на смартфоне" width="610" height="560" loading="lazy" decoding="async"><figcaption>Предпросмотр устройства и экспорт HTML</figcaption></figure>
                </div>
              </article>
            </div>
            <button type="button" class="constructor-story-arrow constructor-story-next" data-constructor-scroll="next" aria-label="Следующий экран">→</button>
          </div>
          <div class="constructor-track-footer"><span id="constructor-step-count" aria-live="polite">Экран 01 из 04</span><div class="constructor-step-progress" aria-hidden="true"><i class="is-active"></i><i></i><i></i><i></i></div><span class="constructor-mobile-hint">На узком экране листайте экраны свайпом</span></div>

          <div class="constructor-bottom-cta">
            <div><span class="eyebrow">Начните с демо-проекта</span><h3>Попробуйте конструктор на практике.</h3><p>Редактор откроется отдельной страницей. Изменения сохраняются в текущем браузере, готовый HTML можно скачать.</p></div>
            <a href="editor/index.html" target="_blank" rel="noopener noreferrer" class="btn btn-accent constructor-try-btn">Попробовать</a>
          </div>
        </div>
      </section>`;
    }
    

function developmentBlockMarkup(standalone) {
      var heading = standalone
        ? '<h1 id="development-page-title">Индивидуальная разработка сайтов и лендингов</h1>'
        : '<h2 class="landing-section-heading" id="landing-development-title">Разработка индивидуального решения</h2>';
      var eyebrow = standalone
        ? '<span class="eyebrow landing-section-label">Индивидуальная работа · под задачу</span>'
        : '<span class="eyebrow landing-section-label">Artify Factory · индивидуальная разработка</span>';
      var intro = standalone
        ? '<p class="lead landing-development-intro">Создаём корпоративные сайты и лендинги под задачи бизнеса. Сначала разбираемся в целях и содержании проекта, затем согласуем структуру, визуальное направление и объём разработки.</p>'
        : '<p class="lead landing-development-intro">Вы можете начать с готового цифрового продукта с возможностью его адаптации или перейдите к разработке корпоративного сайта либо лендинга под вашу задачу, с проработкой структуры, дизайна и адаптивной версии.</p>';
      return '<section class="landing-development-content" id="development" aria-labelledby="' + (standalone ? 'development-page-title' : 'landing-development-title') + '">' +
        '<header class="landing-development-head">' + eyebrow + heading + intro + '</header>' +
        '<div class="landing-development-services" id="development-services" aria-label="Форматы индивидуальной разработки">' +
          '<article class="landing-development-service" id="service-corporate-sites">' +
            '<div class="landing-development-service-index">01</div>' +
            '<div class="landing-development-service-body"><h3>Корпоративный сайт</h3><p>Многостраничный сайт для компании, бренда или организаций с понятной структурой, представлением услуг и необходимыми разделами.</p>' +
            '<ul><li>Структура страниц и навигация</li><li>Дизайн ключевых разделов</li><li>Адаптивная разработка</li></ul></div>' +
          '</article>' +
          '<article class="landing-development-service" id="service-landing-pages">' +
            '<div class="landing-development-service-index">02</div>' +
            '<div class="landing-development-service-body"><h3>Лендинг и(или) промостраница</h3><p>Одностраничные решения для запуска продукта, отдельного предложения или рекламной кампании с акцентом на содержание и целевое действие.</p>' +
            '<ul><li>Сценарий и логика страницы</li><li>Визуальная подача предложения</li><li>Адаптивная разработка</li></ul></div>' +
          '</article>' +
        '</div>' +
        '<section class="landing-development-process" aria-labelledby="development-process-title">' +
          '<h3 id="development-process-title">Как проходит работа</h3>' +
          '<ol>' +
            '<li><span>01</span><div><strong>Бриф и обсуждение</strong><p>Уточняем задачу, аудиторию, содержание и ограничения проекта.</p></div></li>' +
            '<li><span>02</span><div><strong>Структура и дизайн</strong><p>Согласуем страницы, основные сценарии и визуальное направление.</p></div></li>' +
            '<li><span>03</span><div><strong>Разработка и передача</strong><p>Собираем адаптивный сайт, проверяем результат и согласуем передачу проекта.</p></div></li>' +
          '</ol>' +
        '</section>' +
        '<section class="landing-development-cta" aria-labelledby="development-contact-title">' +
          '<div class="landing-development-cta-copy"><h3 id="development-contact-title">Есть другая задача?</h3><p>Закажите обратный звонок и обсудим подходящий формат работы и следующие шаги, либо скачайте бриф и сразу приступайте к заполнению.</p></div>' +
          '<div class="landing-development-cta-actions" aria-label="Действия по индивидуальной разработке">' +
            '<button class="btn btn-accent landing-development-brief-placeholder" type="button" disabled aria-disabled="true" title="Бриф будет доступен позже">Скачать бриф</button>' +
            '<a class="btn btn-secondary-hero" href="#projectDiscussionOverlay" data-action="discuss-project" data-request-type="callback" aria-haspopup="dialog">Заказать звонок</a>' +
          '</div>' +
        '</section>' +
      '</section>';
    }
    function developmentMarkup() {
      return '<section class="page-head"><div class="container"><div class="eyebrow landing-section-label">Индивидуальная работа · под задачу</div><p class="lead">Заказная разработка корпоративных сайтов и лендингов. Готовые цифровые продукты и шаблоны представлены отдельно в каталоге.</p></div></section>' +
        '<section class="section af-full-development"><div class="container">' + developmentBlockMarkup(true) + '</div></section>';
    }
    function pinterestMarkup() {
      return "<section class=\"page-head\"><div class=\"container\"><div class=\"eyebrow\">Визуальный канал</div><h1>Пинтерест.</h1><p class=\"lead\">Путь от визуальной идеи к конкретной странице продукта, кейсу или услуги Artify.</p></div></section>" + "<section class=\"section af-full-pinterest\" id=\"pinterest\"><div class=\"container pinterest-layout\"><div><span class=\"eyebrow\">Пинтерест · визуальный канал</span><h2>Идея начинается<br>с пина</h2><p class=\"lead\">Каждый пин должен вести на конкретную карточку продукта, кейс или страницу услуги — без тупиковых ссылок.</p><div class=\"pinterest-steps\"><div><span>1</span><div><strong>Пин</strong><p>Визуальная идея в ленте.</p></div></div><div><span>2</span><div><strong>Страница Artify</strong><p>Переход на релевантную страницу.</p></div></div><div><span>3</span><div><strong>Продукт или услуга</strong><p>Состав, формат или процесс работы.</p></div></div><div><span>4</span><div><strong>Действие</strong><p>Покупка продукта или заявка.</p></div></div></div><a class=\"btn btn-accent\" href=\"#catalog\" data-route=\"catalog\">Перейти к продуктам </a></div><div class=\"pin-mosaic\" aria-label=\"Декоративные примеры будущих пинов\"><div><small>PIN 01</small><strong>Artify</strong></div><div><small>PIN 02</small><strong>Design</strong></div><div><small>PIN 03</small><strong>Useful</strong></div><div><small>PIN 04</small><strong>Systems</strong></div><div><small>PIN 05</small><strong>Digital</strong></div><div><small>PIN 06</small><strong>Ideas</strong></div></div></div></section>";
    }
function catalogMarkup() {
      return '<section class="page-head"><div class="container"><div class="eyebrow landing-section-label">Каталог · цифровые продукты</div><h1>Сначала — продукт, а не обещание.</h1><p class="lead">В каталоге показываем только позиции с понятными составом, форматом, лицензией и ценой. Сейчас в рабочем контуре проверяем первый продукт ALEN.</p></div></section><section class="section"><div class="container"><div class="catalog-grid"><article class="catalog-card">' + artMarkup() + '<div class="catalog-card-body"><span class="tag">Первый SKU · на проверке</span><h3>ALEN</h3><p>Страница продукта и два варианта покупки. Данные о комплектации, форматах, лицензии и цене отмечены как требующие подтверждения до публикации.</p><div class="actions"><a href="#product" data-route="product" class="btn btn-accent">Открыть продукт </a></div></div></article><article class="catalog-card"><div class="product-art" style="display:grid;place-items:center"><div style="max-width:270px;padding:24px"><span class="eyebrow">Следующие SKU</span><h3 style="margin:16px 0">Добавляем по одному</h3><p style="color:var(--text-muted)">Остальные позиции подключим после проверки реальных данных каталога. Демопродукты и ссылки example.com не считаем подтверждённым ассортиментом.</p></div></div><div class="catalog-card-body"><span class="tag">План работ</span><p>Не создаём вымышленные категории или карточки для заполнения пустого места.</p></div></article></div></div></section>';
    }

    /* Home sections use the same content as the dedicated views below, only the outer anchor and title level differ. */
    

window.ARTIFY_CONTENT = window.ARTIFY_CONTENT || {};
    window.ARTIFY_CONTENT.landingConstructor = Object.assign({
      eyebrow: "Artify Factory · визуальный конструктор",
      title: "От структуры до готового лендинга",
      description: "Соберите свою первую страницу бесплатно и без ручной вёрстки за 15 минут: выберите секции, заполните контент, настройте стиль и сразу проверьте результат на разных экранах."
    }, window.ARTIFY_CONTENT.landingConstructor || {});

    function landingConstructorMarkup() {
      var content = window.ARTIFY_CONTENT.landingConstructor;
      return `<section class="section af-full-constructor landing-constructor-block" id="landing-constructor" aria-labelledby="landing-constructor-title">
        <div class="container landing-constructor-container">
          <header class="landing-constructor-head">
            <div class="landing-constructor-intro">
              <span class="eyebrow landing-section-label">${escapeHtml(content.eyebrow)}</span>
              <h2 class="landing-section-heading" id="landing-constructor-title">${escapeHtml(content.title)}<span class="landing-constructor-info-tip" id="landing-constructor-info-tip" role="img" aria-label="Для работы в редакторе нужна ширина окна от 1101 px. Это ограничение касается только интерфейса редактора, готовую страницу можно проверять в режимах Desktop, Tablet и Mobile."><span class="landing-constructor-info-trigger" aria-hidden="true">i</span><span class="landing-constructor-info-tooltip" id="landing-constructor-info-tooltip" role="tooltip" aria-hidden="true">Для работы в редакторе нужна ширина окна от 1101 px. Это ограничение касается только интерфейса редактора, готовую страницу можно проверять в режимах Desktop, Tablet и Mobile.</span></span></h2>
              <p>${escapeHtml(content.description).replace('бесплатно', '<span class="landing-constructor-free">бесплатно</span>')}</p>
            </div>
          </header>
          <aside class="landing-constructor-usage-note landing-constructor-action-card" role="note" aria-label="Условия использования редактора">
            <div class="landing-constructor-action-row">
              <p>Для работы в редакторе нужна ширина окна от 1101 px. Это ограничение касается только интерфейса редактора, готовую страницу можно проверять в режимах Desktop, Tablet и Mobile.</p>
            </div>
          </aside>
          <div class="landing-constructor-workflow landing-constructor-workflow-unified" aria-label="Единая карточка этапов и визуализаций интерфейса">
            <div class="landing-constructor-detail-panel">
              <div class="landing-constructor-detail-layout">
                <div class="landing-constructor-steps" role="group" aria-label="Четыре этапа работы в конструкторе">
                  <article class="landing-constructor-step" data-landing-step="0">
                    <span class="landing-constructor-step-number">01</span><span class="landing-constructor-step-copy"><strong>Секции и содержание</strong><small>Включите нужные секции страницы и заполните поля выбранного раздела: от сведений о проекте до формы заявки.</small></span>
                  </article>
                  <article class="landing-constructor-step" data-landing-step="1">
                    <span class="landing-constructor-step-number">02</span><span class="landing-constructor-step-copy"><strong>Цвета и типографика</strong><small>Выберите один из шести стилей, затем настройте основной и акцентный цвета и шрифт страницы.</small></span>
                  </article>
                  <article class="landing-constructor-step" data-landing-step="2">
                    <span class="landing-constructor-step-number">03</span><span class="landing-constructor-step-copy"><strong>Desktop / Tablet / Mobile</strong><small>Переключайтесь между Desktop, Tablet и Mobile. Проверьте переносы текста, размеры элементов и расположение секций.</small></span>
                  </article>
                  <article class="landing-constructor-step" data-landing-step="3">
                    <span class="landing-constructor-step-number">04</span><span class="landing-constructor-step-copy"><strong>Экспорт HTML</strong><small>Скачайте страницу одним HTML-файлом. Откройте его в браузере и отдельно загрузите на хостинг.</small></span>
                  </article>
                </div>
                <div class="landing-constructor-detail-view" id="landing-constructor-test-gallery" role="group" aria-label="Визуализация выбранного этапа редактора">
                  <figure class="landing-constructor-test-shot landing-constructor-test-shot-composed is-active" data-landing-step-shot="0">
                    <div class="landing-constructor-stage-composition landing-constructor-stage-composition-details">
                      <button class="landing-constructor-image-trigger landing-constructor-stage-image-trigger" type="button" data-constructor-image-open data-image-caption="Этап 01 · Секции и содержание · визуализация интерфейса" aria-haspopup="dialog" aria-label="Увеличить визуализацию этапа 01 — Секции и содержание">
                        <img src="assets/images/constructor-stage-01.svg" alt="Векторная визуализация редактора: список секций, поля первого экрана и предпросмотр страницы" width="1400" height="960" loading="eager" decoding="async">
                      </button>
                      <aside class="landing-constructor-stage-explainer" aria-label="Как устроена работа с секциями и содержанием">
                        <span class="landing-constructor-stage-kicker">Структура страницы</span>
                        <h3>Соберите страницу из нужных разделов</h3>
                        <p>Включите нужные секции и заполните поля выбранного раздела. Изменения сразу отображаются в предпросмотре.</p>
                        <div class="landing-constructor-stage-feature-list">
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">01</span><span><strong>Состав страницы</strong><small>Шапка, первый экран, цифры, продукты, кейсы, форма и подвал</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">02</span><span><strong>Содержание</strong><small>Заголовки, описания, списки, контакты и другие поля</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">03</span><span><strong>Видимость</strong><small>Включайте или скрывайте отдельные секции</small></span></div>
                        </div>
                        <p class="landing-constructor-stage-footnote">Скрытые секции не попадут в экспорт.</p>
                      </aside>
                    </div>
                  </figure>
                  <figure class="landing-constructor-test-shot landing-constructor-test-shot-composed" data-landing-step-shot="1">
                    <div class="landing-constructor-stage-composition landing-constructor-stage-composition-details">
                      <button class="landing-constructor-image-trigger landing-constructor-stage-image-trigger" type="button" data-constructor-image-open data-image-caption="Этап 02 · Стиль и оформление · визуализация интерфейса" aria-haspopup="dialog" aria-label="Увеличить визуализацию этапа 02 — Стиль и оформление">
                        <img src="assets/images/constructor-stage-02.svg" alt="Векторная визуализация настроек шести стилей, основного и акцентного цветов и шрифта" width="1400" height="960" loading="lazy" decoding="async">
                      </button>
                      <aside class="landing-constructor-stage-explainer" aria-label="Что можно настроить в оформлении">
                        <span class="landing-constructor-stage-kicker">Визуальный стиль</span>
                        <h3>Задайте единое оформление</h3>
                        <p>Выберите один из шести стилей — редактор задаст базовые цвета. Затем настройте основной и акцентный цвета, а также шрифт.</p>
                        <div class="landing-constructor-stage-feature-list">
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">01</span><span><strong>Стиль</strong><small>Шесть готовых вариантов оформления</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">02</span><span><strong>Цвета</strong><small>Настройка двух цветов страницы</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">03</span><span><strong>Типографика</strong><small>Выбор гарнитуры из доступного списка</small></span></div>
                        </div>
                        <p class="landing-constructor-stage-footnote">Оформление можно менять до экспорта.</p>
                      </aside>
                    </div>
                  </figure>
                  <figure class="landing-constructor-test-shot landing-constructor-test-shot-composed" data-landing-step-shot="2">
                    <div class="landing-constructor-stage-composition landing-constructor-stage-composition-details">
                      <button class="landing-constructor-image-trigger landing-constructor-stage-image-trigger" type="button" data-constructor-image-open data-image-caption="Этап 03 · Проверка адаптивности · визуализация интерфейса" aria-haspopup="dialog" aria-label="Увеличить визуализацию этапа 03 — Проверка адаптивности">
                        <img src="assets/images/constructor-stage-03.svg" alt="Векторная визуализация режимов Desktop, Tablet и Mobile с мобильным предпросмотром" width="1400" height="960" loading="lazy" decoding="async">
                      </button>
                      <aside class="landing-constructor-stage-explainer landing-constructor-stage-explainer-responsive" aria-label="Как проверяется адаптивность">
                        <span class="landing-constructor-stage-kicker">Адаптивный предпросмотр</span>
                        <h3>Проверьте страницу на трёх экранах</h3>
                        <p>Переключайте Desktop, Tablet и Mobile, чтобы проверить переносы текста, размеры элементов и расположение секций до экспорта.</p>
                        <div class="landing-constructor-stage-feature-list landing-constructor-responsive-feature-list">
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">01</span><span><strong>Desktop</strong><small>Предпросмотр страницы на широком экране — 1440 × 900 px</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">02</span><span><strong>Tablet</strong><small>Проверка компоновки на планшете — 834 × 1194 px</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">03</span><span><strong>Mobile</strong><small>Проверка мобильной версии — 393 × 852 px</small></span></div>
                        </div>
                        <p class="landing-constructor-stage-footnote">На изображении выбран режим Mobile.</p>
                      </aside>
                    </div>
                  </figure>
                  <figure class="landing-constructor-test-shot landing-constructor-test-shot-composed" data-landing-step-shot="3">
                    <div class="landing-constructor-stage-composition landing-constructor-stage-composition-details">
                      <button class="landing-constructor-image-trigger landing-constructor-stage-image-trigger" type="button" data-constructor-image-open data-image-caption="Этап 04 · Экспорт HTML · визуализация интерфейса" aria-haspopup="dialog" aria-label="Увеличить визуализацию этапа 04 — Экспорт HTML">
                        <img src="assets/images/constructor-stage-04.svg" alt="Векторная визуализация скачивания одного HTML-файла и последующей проверки страницы" width="1400" height="960" loading="lazy" decoding="async">
                      </button>
                      <aside class="landing-constructor-stage-explainer landing-constructor-stage-explainer-export" aria-label="Что происходит после экспорта">
                        <span class="landing-constructor-stage-kicker">Файл страницы</span>
                        <h3>Скачайте HTML-файл и проверьте его</h3>
                        <p>Редактор скачивает готовую страницу одним HTML-файлом. Откройте его в браузере, затем при необходимости загрузите на свой хостинг.</p>
                        <div class="landing-constructor-stage-feature-list">
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">01</span><span><strong>Скачать</strong><small>Сохранить HTML-файл на устройство</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">02</span><span><strong>Проверить локально</strong><small>Открыть HTML-файл в браузере</small></span></div>
                          <div class="landing-constructor-stage-feature"><span class="landing-constructor-stage-feature-mark">03</span><span><strong>Загрузить на хостинг</strong><small>Публикация выполняется отдельно</small></span></div>
                        </div>
                        <p class="landing-constructor-stage-footnote">Обработка заявок настраивается отдельно.</p>
                      </aside>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
          <figure class="landing-constructor-overview-panel">
            <div class="landing-constructor-overview-open">
              <img class="landing-constructor-overview-image" src="assets/images/constructor-overview.svg" alt="Векторный обзор первого экрана редактора Artify Factory: список разделов проекта, поля выбранного блока и предпросмотр готового лендинга" width="1364" height="924" loading="lazy" decoding="async">
            </div>
          </figure>
          <div class="landing-constructor-bottom-row">
            <div class="landing-constructor-action-card">
              <div class="landing-constructor-action-row">
                <p>Базовый сценарий включает структуру, контент, настройки стиля, адаптивный предпросмотр и экспорт HTML.</p>
              </div>
            </div>
            <div class="landing-constructor-try-row">
              <div class="landing-constructor-try-align">
                <a id="landing-constructor-try" href="editor/index.html" target="_blank" rel="noopener noreferrer" class="btn btn-accent landing-constructor-try" data-landing-constructor-stub-cta>Попробовать</a>
              </div>
            </div>
          </div>
          <article class="landing-products-pro landing-constructor-pro-panel" aria-labelledby="landing-constructor-pro-title">
            <div class="landing-products-pro-copy">
              <h3 class="eyebrow landing-section-label landing-constructor-pro-heading" id="landing-constructor-pro-title">Визуальный конструктор PRO · расширенный доступ</h3>
              <p>Дополнительные возможности визуального редактора по отдельной модели доступа. Состав функций, период и стоимость будут указаны после утверждения условий.</p>
            </div>
          </article>
          <div class="landing-constructor-bottom-row landing-constructor-pro-cta-bottom-row">
            <div class="landing-constructor-try-row">
              <div class="landing-constructor-try-align landing-constructor-pro-cta-align">
                <a class="btn btn-secondary-hero landing-constructor-try landing-constructor-pro-cta" href="#projectDiscussionOverlay" data-action="discuss-project" data-request-type="constructor-pro" aria-haspopup="dialog">Заказать звонок</a>
              </div>
            </div>
          </div>
          <p class="landing-constructor-mobile-note">Для работы в редакторе нужна ширина окна от 1101 px. Это ограничение касается только интерфейса редактора, готовую страницу можно проверять в режимах Desktop, Tablet и Mobile.</p>
        </div>
      </section>`;
    }

        function landingProductsMarkup() {
      return `
        <section class="landing-route-section landing-products-section" id="landing-products" aria-labelledby="landing-products-title">
          <div class="container landing-products-container">
            <header class="landing-products-head">
              <div class="landing-products-heading-group">
                <span class="eyebrow landing-section-label">Artify Factory · цифровые продукты</span>
                <h2 class="landing-section-heading" id="landing-products-title">Готовые решения для разных задач</h2>
              </div>
              <p class="lead landing-products-intro">Веб-шаблоны, материалы для маркетплейсов, печатные наборы и дизайн-комплекты. Выбирайте направление, а в карточке конкретного продукта проверяйте состав, формат и условия использования.</p>
            </header>

            <p class="landing-card-touch-hint landing-products-categories-touch-hint" id="products-category-touch-hint">Откройте карточку направления, в котором уже есть готовый продукт.</p>
            <div class="landing-products-grid" id="landing-products-categories" aria-label="Направления цифровых продуктов">
              <a class="product-category-card" data-category="web" href="#category-sites" data-route="category-sites" aria-label="Категория: Сайты и лендинги" aria-describedby="products-category-touch-hint">
                <div class="category-heading"><span class="category-type">Сайты и лендинги</span></div>
                <div class="product-category-visual product-category-visual-web"><img class="category-cover" src="assets/images/category-sites.webp" alt="Пример оформления сайта и адаптивной мобильной версии" width="768" height="512" loading="lazy" decoding="async">
                </div>
                <div class="category-copy">
<p class="category-description">Готовые веб-шаблоны и комплекты для адаптации под свой проект. Состав файлов, формат и условия использования указываются в карточке продукта.</p>
                  <span class="category-footnote category-footnote-available">Для самостоятельного запуска</span>
</div>
              </a>

              <a class="product-category-card" data-category="marketplace" href="#category-marketplaces" data-route="category-marketplaces" aria-label="Категория: Карточки для маркетплейсов" aria-describedby="products-category-touch-hint">
                <div class="category-heading"><span class="category-type">Карточки для маркетплейсов</span></div>
                <div class="product-category-visual product-category-visual-marketplace"><img class="category-cover" src="assets/images/category-marketplaces.webp" alt="Визуальные карточки косметического товара для маркетплейса" width="768" height="512" loading="lazy" decoding="async">
                </div>
                <div class="category-copy">
<p class="category-description">Редактируемые макеты инфографики и визуальных карточек. Индивидуальное оформление конкретного товара — отдельная услуга.</p>
                  <span class="category-footnote category-footnote-not-listed">Готовые шаблоны</span>
</div>
              </a>

              <a class="product-category-card" data-category="print" href="#category-print" data-route="category-print" aria-label="Категория: Материалы для печати" aria-describedby="products-category-touch-hint">
                <div class="category-heading"><span class="category-type">Материалы для печати</span></div>
                <div class="product-category-visual product-category-visual-print"><img class="category-cover" src="assets/images/category-print.webp" alt="Макеты печатных материалов и рабочих листов" width="768" height="512" loading="lazy" decoding="async">
                </div>
                <div class="category-copy">
<p class="category-description">Судоку, кроссворды и тематические PDF-сборники для самостоятельной печати. Конкретные наборы ещё предстоит подготовить.</p>
                  <span class="category-footnote category-footnote-planned">Направление в разработке</span>
</div>
              </a>

              <a class="product-category-card" data-category="design-kits" href="#category-design-kits" data-route="category-design-kits" aria-label="Категория: Шаблоны и дизайн-комплекты" aria-describedby="products-category-touch-hint">
                <div class="category-heading"><span class="category-type">Шаблоны и дизайн-комплекты</span></div>
                <div class="product-category-visual product-category-visual-kits"><img class="category-cover" src="assets/images/category-design-kits.webp" alt="Набор шаблонов, интерфейсных элементов и типографики" width="768" height="512" loading="lazy" decoding="async">
                </div>
                <div class="category-copy">
<p class="category-description">Презентации, UI-наборы и визуальные материалы для работы с контентом. Комплектация и формат будут указаны у каждой позиции.</p>
                  <span class="category-footnote category-footnote-not-listed">Цифровые наборы и шаблоны</span>
</div>
              </a>
            </div>
            
            <div class="landing-products-featured-heading">
              <span class="landing-products-kicker">В центре внимания · выбор Artify</span>
              <p class="landing-card-touch-hint landing-products-featured-touch-hint" id="products-featured-touch-hint">Нажмите на карточку, чтобы открыть описание продукта.</p>
            </div>
            <div class="landing-products-bottom" aria-label="Рекомендуемые цифровые продукты">
              <a class="landing-products-featured landing-products-featured-alen" href="#product" data-route="product" aria-label="Продукт ALEN" aria-describedby="products-featured-touch-hint">
                <div class="landing-products-featured-visual landing-products-featured-visual-alen" aria-hidden="true">
                  ${artMarkup()}
                </div>
                <div class="landing-products-featured-copy">
                  <span class="landing-products-product-type">Цифровой продукт</span>
                  <h3>ALEN</h3>
                  <p>Первый продукт Artify Factory. Откройте карточку, чтобы увидеть описание, доступные материалы и условия покупки.</p>
                </div>
              </a>

              <a class="landing-products-featured landing-products-featured-coffee" href="#product-coffee-constructor" data-route="product-coffee-constructor" aria-label="Продукт CoffeeConstructor" aria-describedby="products-featured-touch-hint">
                <div class="landing-products-featured-visual landing-products-featured-visual-coffee" aria-hidden="true">
                  <svg class="featured-coffee-art" viewBox="0 0 520 300" role="presentation" focusable="false">
                    <rect x="28" y="26" width="464" height="248" rx="16" fill="var(--surface)" stroke="var(--border-strong)"/>
                    <rect x="28" y="26" width="464" height="34" rx="16" fill="var(--surface-muted)"/>
                    <path d="M28 48v12h464V48" fill="var(--surface-muted)"/>
                    <circle cx="49" cy="43" r="4" fill="var(--accent)"/><circle cx="64" cy="43" r="4" fill="var(--border-strong)"/><circle cx="79" cy="43" r="4" fill="var(--border-strong)"/>
                    <text x="54" y="88" fill="var(--text-muted)" font-size="10" letter-spacing="2.2">COFFEE / YOUR PLACE</text>
                    <text x="54" y="128" fill="var(--text)" font-size="31" font-weight="700" letter-spacing="-1.2">Coffee</text>
                    <text x="54" y="160" fill="var(--text)" font-size="31" font-weight="700" letter-spacing="-1.2">made personal.</text>
                    <rect x="54" y="181" width="126" height="28" rx="5" fill="var(--accent)"/>
                    <rect x="54" y="224" width="185" height="5" rx="2.5" fill="var(--border-strong)"/><rect x="54" y="237" width="142" height="4" rx="2" fill="var(--border)"/>
                    <circle cx="365" cy="152" r="83" fill="var(--surface-muted)"/>
                    <path d="M316 119h91v70c0 21-17 38-38 38h-15c-21 0-38-17-38-38z" fill="#B8432A" opacity=".88"/>
                    <path d="M407 136h16c17 0 22 27 7 39-7 6-16 8-23 8" fill="none" stroke="#B8432A" stroke-width="10" stroke-linecap="round"/>
                    <path d="M341 101c-9-12 9-17 2-31M367 101c-9-12 9-17 2-31M392 101c-9-12 9-17 2-31" fill="none" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/>
                    <ellipse cx="362" cy="229" rx="72" ry="9" fill="var(--border-strong)" opacity=".55"/>
                  </svg>
                </div>
                <div class="landing-products-featured-copy">
                  <span class="landing-products-product-type">Готовое цифровое решение</span>
                  <h3>CoffeeConstructor</h3>
                  <p>Основа сайта для кофейного проекта: страницы, контентные блоки и визуальные темы, которые можно адаптировать под свой бренд.</p>
                </div>
              </a>
            </div>

          </div>
          <div class="container landing-products-cta-container">
            <div class="landing-products-cta" aria-label="Помощь с выбором цифрового продукта">
              <div class="landing-products-cta-copy">
                <h3>Не нашли подходящий продукт или нужна помощь с выбором?</h3>
                <p>Поможем выбрать подходящее готовое решение, разобраться в его составе и формате, и при необходимости обсудить адаптацию под вашу задачу.</p>
              </div>
              <div class="landing-constructor-bottom-row landing-constructor-pro-cta-bottom-row landing-products-cta-single-button-row" aria-label="Помощь с выбором цифрового продукта">
                <div class="landing-constructor-try-row">
                  <div class="landing-constructor-try-align landing-constructor-pro-cta-align">
                    <a class="btn btn-secondary-hero landing-constructor-try landing-constructor-pro-cta" href="#projectDiscussionOverlay" data-action="discuss-project" data-request-type="callback" aria-haspopup="dialog">Заказать звонок</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>`;
    }

    function landingDevelopmentMarkup() {
      return '<section class="landing-route-section landing-development-section" id="landing-development" aria-label="Artify Factory · индивидуальная разработка">' +
        '<div class="container">' + developmentBlockMarkup(false) + '</div>' +
      '</section>';
    }

    /* Product catalog source of truth for the landing UI.
       Later this local list is replaced by the public product API response;
       private product files must never be bundled into this frontend data. */
    var productCatalogSource = [
      {
        id: 'alen',
        categoryId: 'sites',
        route: 'product',
        title: 'ALEN',
        type: 'Цифровой продукт',
        description: 'Первый продукт Artify Factory. Откройте карточку, чтобы увидеть описание, доступные материалы и условия покупки.',
        catalogVisible: true
      },
      {
        id: 'coffee-constructor',
        categoryId: 'sites',
        route: 'product-coffee-constructor',
        title: 'CoffeeConstructor',
        type: 'Готовое цифровое решение',
        description: 'Основа сайта для кофейного проекта: страницы, контентные блоки и визуальные темы, которые можно адаптировать под свой бренд.',
        catalogVisible: true
      }
    ];

    var landingCategoryCardMap = {
      web: { categoryId: 'sites', route: 'category-sites' },
      marketplace: { categoryId: 'marketplaces', route: 'category-marketplaces' },
      print: { categoryId: 'print', route: 'category-print' },
      'design-kits': { categoryId: 'design-kits', route: 'category-design-kits' }
    };

    

function getCategoryProducts(categoryId) {
      return productCatalogSource.filter(function(product) {
        return product.categoryId === categoryId && product.catalogVisible === true;
      });
    }

    function productCountLabel(count) {
      var mod100 = count % 100;
      var mod10 = count % 10;
      var word = (mod100 >= 11 && mod100 <= 14) ? 'продуктов' :
        (mod10 === 1 ? 'продукт' : (mod10 >= 2 && mod10 <= 4 ? 'продукта' : 'продуктов'));
      return count + ' ' + word + ' в направлении';
    }

    function syncLandingCategoryCards() {
      var cards = document.querySelectorAll('#landing-products-categories .product-category-card');
      cards.forEach(function(card) {
        var config = landingCategoryCardMap[card.dataset.category];
        if (!config) return;
        var products = getCategoryProducts(config.categoryId);
        var footnote = card.querySelector('.category-footnote');

        if (products.length) {
          card.classList.remove('is-unavailable');
          card.classList.add('is-available');
          card.setAttribute('href', '#' + config.route);
          card.setAttribute('data-route', config.route);
          card.removeAttribute('aria-disabled');
          card.removeAttribute('role');
          card.removeAttribute('tabindex');
          if (footnote) {
            footnote.classList.remove('category-footnote-not-listed', 'category-footnote-planned');
            footnote.classList.add('category-footnote-available');
            footnote.textContent = productCountLabel(products.length);
          }
          return;
        }

        /* A category without catalog entries becomes a non-interactive block,
           not an anchor with a dead route. This also removes it from keyboard focus. */
        var disabledCard = document.createElement('div');
        Array.prototype.forEach.call(card.attributes, function(attribute) {
          if (attribute.name === 'href' || attribute.name === 'data-route' || attribute.name === 'aria-describedby') return;
          disabledCard.setAttribute(attribute.name, attribute.value);
        });
        disabledCard.classList.remove('is-available');
        disabledCard.classList.add('is-unavailable');
        disabledCard.setAttribute('role', 'group');
        disabledCard.setAttribute('aria-disabled', 'true');
        disabledCard.setAttribute('aria-label', 'Направление временно недоступно: готовых продуктов пока нет.');
        disabledCard.innerHTML = card.innerHTML;
        if (footnote) {
          var disabledFootnote = disabledCard.querySelector('.category-footnote');
          if (disabledFootnote) {
            disabledFootnote.classList.remove('category-footnote-available');
            if (!disabledFootnote.classList.contains('category-footnote-planned')) {
              disabledFootnote.classList.add('category-footnote-not-listed');
            }
          }
        }
        card.replaceWith(disabledCard);
      });
    }

    var landingCategoryData = {
      'category-sites': {
        title: 'Сайты и лендинги',
        description: 'Готовые веб-шаблоны и комплекты для адаптации под свой проект. Состав файлов, формат и условия использования будут указаны в карточке каждой позиции.',
        status: 'Подборка готовится',
        note: 'В этом разделе появятся проверенные веб-шаблоны и комплекты с демонстрацией результата, составом файлов и условиями использования.'
      },
      'category-marketplaces': {
        title: 'Карточки для маркетплейсов',
        description: 'Редактируемые макеты инфографики и визуальных карточек для самостоятельной адаптации под товары.',
        status: 'Подборка готовится',
        note: 'Здесь будут размещаться готовые шаблоны. Индивидуальное оформление карточек WB / Ozon под конкретный товар доступно отдельно как услуга разработки.'
      },
      'category-print': {
        title: 'Материалы для печати',
        description: 'Судоку, кроссворды и тематические PDF-сборники для самостоятельной печати.',
        status: 'Направление в разработке',
        note: 'Подборка появится после подготовки и проверки самих файлов, форматов и условий использования.'
      },
      'category-design-kits': {
        title: 'Шаблоны и дизайн-комплекты',
        description: 'Презентации, UI-наборы и визуальные материалы для работы с контентом.',
        status: 'Подборка готовится',
        note: 'В каталоге будут показаны только готовые наборы с примерами, перечнем файлов и совместимостью.'
      }
    };
    function categoryMarkup(route) {
      var item = landingCategoryData[route];
      if (!item) return '<section class="page-head"><div class="container"><h1>Раздел не найден</h1><a class="btn btn-accent" href="#landing-products" data-route="home" data-scroll="landing-products">Вернуться к направлениям</a></div></section>';
      var categoryId = route === 'category-sites' ? 'sites' :
        route === 'category-marketplaces' ? 'marketplaces' :
        route === 'category-print' ? 'print' : 'design-kits';
      var products = getCategoryProducts(categoryId);
      var catalogContent;

      if (products.length) {
        catalogContent = '<div class="category-products-summary"><span class="landing-products-product-type">' + escapeHtml(productCountLabel(products.length)) + '</span><p>Выберите продукт, чтобы открыть его описание, материалы и условия использования.</p></div>' +
          '<div class="category-products-grid" aria-label="Продукты направления">' + products.map(function(product) {
            return '<a class="category-listing-product" href="#' + escapeHtml(product.route) + '" data-route="' + escapeHtml(product.route) + '" aria-label="Открыть продукт ' + escapeHtml(product.title) + '">' +
              '<span class="landing-products-product-type">' + escapeHtml(product.type) + '</span>' +
              '<h2>' + escapeHtml(product.title) + '</h2>' +
              '<p>' + escapeHtml(product.description) + '</p>' +
              '<span class="category-listing-product-link">Открыть продукт <span aria-hidden="true">→</span></span>' +
            '</a>';
          }).join('') + '</div>';
      } else {
        catalogContent = '<section class="category-empty-state" aria-label="Состояние каталога"><span class="category-empty-mark" aria-hidden="true">AF</span><div><span class="landing-products-product-type">' + escapeHtml(item.status) + '</span><h2>Готовим подборку продуктов</h2><p>' + escapeHtml(item.note) + '</p>' + (route === 'category-marketplaces' ? '<a class="category-service-link" href="#projectDiscussionOverlay" data-action="discuss-project" data-request-type="marketplace">Заказать индивидуальное оформление WB / Ozon →</a>' : '') + '</div></section>';
      }

      return '<section class="category-page"><div class="container">' +
        '<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="#home" data-route="home">Главная</a><span aria-hidden="true">/</span><a href="#landing-products" data-route="home" data-scroll="landing-products">Цифровые продукты</a><span aria-hidden="true">/</span><span aria-current="page">' + escapeHtml(item.title) + '</span></nav>' +
        '<header class="category-page-head"><span class="eyebrow landing-section-label">Каталог · направление</span><h1>' + escapeHtml(item.title) + '</h1><p class="lead">' + escapeHtml(item.description) + '</p></header>' +
        catalogContent +
        '<div class="category-page-actions"><a class="btn btn-accent" href="#landing-products" data-route="home" data-scroll="landing-products">Вернуться к направлениям</a><a class="btn btn-secondary-hero" href="#projectDiscussionOverlay" data-action="discuss-project" data-request-type="callback">Заказать звонок</a></div>' +
        '</div></section>';
    }
    function coffeeConstructorProductMarkup() {
      return '<section class="product-hero"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">Главная</a><span>/</span><a href="#landing-products" data-route="home" data-scroll="landing-products">Цифровые продукты</a><span>/</span><span>CoffeeConstructor</span></div>' +
        '<div class="product-detail-grid"><div class="coffee-product-detail-art"><div class="coffee-product-detail-mark"><span>COFFEE</span><strong>CONSTRUCTOR</strong><small>WEBSITE KIT</small></div></div><div class="product-copy"><span class="tag">Цифровой продукт · проектная версия</span><h1>CoffeeConstructor</h1><p>Основа сайта для кофейного проекта: готовая структура страниц, контентные блоки и выбор визуальной темы. Материалы можно адаптировать под собственный бренд и ассортимент.</p><div class="data-specs"><div class="spec"><small>Страницы</small><strong>8</strong></div><div class="spec"><small>Блоки</small><strong>7</strong></div><div class="spec"><small>Темы</small><strong>3</strong></div><div class="spec"><small>Демо-позиции</small><strong>4</strong></div></div><div class="data-warning"><strong>Перед публикацией:</strong> сверить финальный архив, комплектацию, лицензии, цены и условия поддержки. Варианты лицензий и цены из черновой спецификации не считаются публично утверждёнными.</div><div class="actions"><a class="btn btn-accent" href="#contacts" data-route="home" data-scroll="contacts">Уточнить готовность продукта</a><a class="btn" href="#landing-products" data-route="home" data-scroll="landing-products">К другим продуктам</a></div></div></div></div></section>';
    }

    function productMarkup() {
      return '<section class="product-hero"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">Главная</a><span>/</span><a href="#catalog" data-route="catalog">Каталог</a><span>/</span><span>ALEN</span></div><div class="product-detail-grid">' + artMarkup() + '<div class="product-copy"><span class="tag">Первый SKU · проверка продукта</span><h1>ALEN</h1><p>Рабочая карточка продукта. Структура уже позволяет пройти путь от просмотра к корзине и оформлению, но реальные характеристики нужно внести из исходных материалов до запуска продажи.</p><div class="data-warning"><strong>Данные продукта требуют подтверждения.</strong> В прототипе намеренно не придуманы цена, форматы, комплектность или лицензионные права.</div><div class="data-specs"><div class="spec"><small>Состав</small><strong>Уточнить по файлам</strong></div><div class="spec"><small>Форматы</small><strong>Уточнить</strong></div><div class="spec"><small>Лицензия</small><strong>Подтвердить условия</strong></div><div class="spec"><small>Стоимость</small><strong>Не утверждена</strong></div><div class="spec"><small>Версия</small><strong>Зафиксировать</strong></div><div class="spec"><small>Получение</small><strong>Не обещаем до настройки выдачи</strong></div></div><div class="actions"><button class="btn btn-accent" data-action="add-cart">Добавить в корзину</button><button class="btn" data-action="buy-now">Купить сразу </button></div><p class="muted-note">«Добавить в корзину» оставляет вас на карточке. «Купить сразу» открывает оформление напрямую и не изменяет корзину. В прототипе данные не отправляются.</p></div></div><div class="tabs" role="tablist" aria-label="Информация о продукте"><button class="tab" role="tab" data-tab="overview" aria-selected="true">Описание</button><button class="tab" role="tab" data-tab="included" aria-selected="false">Комплектация</button><button class="tab" role="tab" data-tab="license" aria-selected="false">Лицензия</button></div><div class="tab-panel" id="tab-panel">Описание и назначение ALEN будут заполнены после сверки фактических файлов и целевого сценария использования.</div></div></section>';
    }
    function artMini() { return '<div class="cart-thumb" aria-hidden="true">ALEN</div>'; }
    function cartMarkup() {
      if (!cart) return '<section class="page-head"><div class="container"><div class="eyebrow">Корзина</div><h1>Пока здесь пусто.</h1><p>Добавьте ALEN, чтобы пройти сценарий оформления заказа. Это локальный прототип, он не резервирует товар.</p><div class="actions"><a class="btn btn-accent" href="#product" data-route="product">Открыть ALEN </a><a class="btn" href="#catalog" data-route="catalog">Вернуться в каталог</a></div></div></section>';
      return '<section class="page-head"><div class="container"><div class="eyebrow">Шаг 1 · корзина</div><h1>Проверьте выбор.</h1><p>Перед оформлением можно вернуться к карточке продукта. Фактическая цена ALEN пока не подтверждена.</p></div></section><section class="section"><div class="container cart-layout"><div class="cart-main"><div class="cart-row">' + artMini() + '<div><h3>ALEN</h3><p>Первый SKU Artify Factory. Данные по составу, формату, лицензии и цене требуют подтверждения.</p><button class="remove" type="button" data-action="remove-cart">Удалить из корзины</button><div style="margin-top:9px"><a class="text-link" href="#product" data-route="product" style="font-size:var(--af-font-px-11);text-decoration:underline">Вернуться к карточке</a></div></div><div class="cart-price">Стоимость<strong>Уточняется</strong></div></div><p class="muted-note">Сумма заказа не показана как подтверждённая: в источниках проекта нет утверждённой цены ALEN.</p></div><aside class="summary"><h2>Ваш заказ</h2><div class="summary-line"><span>Продукт</span><strong>ALEN</strong></div><div class="summary-line"><span>Лицензия</span><strong>Уточняется</strong></div><div class="summary-line"><span>Итого</span><strong>Цена не утверждена</strong></div><div class="notice" style="margin-top:16px">Перед публикацией подставить подтверждённую цену, валюту и лицензионный вариант.</div><button class="btn btn-accent btn-wide" type="button" data-action="checkout">Перейти к оформлению </button></aside></div></section>';
    }
    function isBusiness() { return buyerType !== 'INDIVIDUAL'; }
    function checkoutSummary() { return '<aside class="summary"><h2>Ваш заказ</h2><div class="summary-card-art">ALEN</div><div class="summary-line"><span>Продукт</span><strong>ALEN</strong></div><div class="summary-line"><span>Тип покупателя</span><strong>' + (buyerType === 'INDIVIDUAL' ? 'Частное лицо' : buyerType === 'SOLE_PROPRIETOR' ? 'ИП' : 'Юридическое лицо') + '</strong></div><div class="summary-line"><span>Способ</span><strong>' + (purchaseMethod === 'ONLINE' ? 'Оплата онлайн' : 'Запросить счёт') + '</strong></div><div class="summary-line"><span>Стоимость</span><strong>Уточняется</strong></div><p class="muted-note">Цена и лицензия ALEN должны быть подтверждены до реальной продажи.</p></aside>'; }
    function field(id,label,placeholder,required,full,extra) {
      var existing = document.getElementById(id);
      var val = Object.prototype.hasOwnProperty.call(values, id) ? values[id] : (existing ? existing.value : '');
      return '<label class="field' + (full ? ' full' : '') + '" for="' + id + '">' + label + (required ? '<span class="required">*</span>' : '') + '<input id="' + id + '" name="' + id + '" type="' + (id === 'email' ? 'email' : 'text') + '" value="' + escapeHtml(val) + '" placeholder="' + escapeHtml(placeholder) + '" ' + (required ? 'required' : '') + ' autocomplete="' + (id === 'email' ? 'email' : 'off') + '">' + (extra || '') + '<small class="validation" data-error-for="' + id + '" hidden></small></label>';
    }
    function escapeHtml(s) { return String(s).replace(/[&<>"']/g,function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }
    function checkoutMarkup() {
      var html = document.getElementById('checkout-v4-template').innerHTML;
      var returnRoute = (directPurchase || !cart) ? 'product' : 'cart';
      var returnLabel = returnRoute === 'cart' ? 'Назад к корзине' : 'Назад к ALEN';
      return html.replace(/<a class="checkout-back-link"[^>]*data-checkout-return(?:="")?[^>]*>[^<]*<\/a>/, '<a class="checkout-back-link" href="#' + returnRoute + '" data-route="' + returnRoute + '" data-checkout-return>' + returnLabel + '</a>');
    }
    function choice(name,value,label,description,selected,disabled) {
      return '<label class="choice' + (selected?' selected':'') + (disabled?' disabled':'') + '"><input type="radio" name="' + name + '" value="' + value + '" ' + (selected?'checked':'') + (disabled?' disabled':'') + '><span><strong>' + label + '</strong><small>' + description + '</small></span></label>';
    }
    var values = {};
    function getValue(id) { var el=document.getElementById(id); if(el) values[id]=el.type==='checkbox'?(el.checked?'yes':''):el.value; return values[id]||''; }
    function validForm() {
      var name = getValue('buyerName').trim(); var email = getValue('email').trim(); var agree=getValue('agree')==='yes';
      var ok = !!name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && agree;
      if (isBusiness()) ok = ok && !!getValue('companyName').trim() && !!getValue('taxId').trim();
      return ok;
    }
    function refreshSubmit() {
      var btn=document.getElementById('submit-checkout'); if(btn) btn.disabled=!validForm();
      var form=document.getElementById('checkout-form'); if(!form) return;
      form.querySelectorAll('input[type="text"],input[type="email"],input[type="checkbox"]').forEach(function(el){
        var label=el.closest('.field'); if(label) label.classList.toggle('has-value',!!el.value.trim());
      });
      form.querySelectorAll('label.choice').forEach(function(l){var input=l.querySelector('input');l.classList.toggle('selected',!!input&&input.checked);});
      refreshValidation();
    }
    function refreshValidation() {
      var checks = {
        buyerName: {required:true, message:'Это обязательное поле.'},
        email: {required:true, message:'Это обязательное поле.'},
        companyName: {required:isBusiness(), message:'Это обязательное поле.'},
        taxId: {required:isBusiness(), message:'Это обязательное поле.'},
        agree: {required:true, message:'Подтвердите согласие, чтобы продолжить.'}
      };
      Object.keys(checks).forEach(function(id) {
        var out = document.querySelector('[data-error-for="'+id+'"]'); if(!out) return;
        var el = document.getElementById(id);
        var value = id==='agree' ? (el && el.checked ? 'yes' : '') : (el ? el.value.trim() : '');
        var message = '';
        if ((touched[id] || attemptedSubmit) && checks[id].required && !value) message = checks[id].message;
        if (id==='email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && (touched[id] || attemptedSubmit)) message = 'Введите email в формате name@example.com.';
        out.textContent = message; out.hidden = !message;
      });
    }
    function getFormValues() {
      ['buyerName','email','phone','companyName','taxId','address','comment'].forEach(function(id){var el=document.getElementById(id); values[id]=el?el.value:'';});
      var agree=document.getElementById('agree'); values.agree=agree&&agree.checked?'yes':'';
    }
    function bindCheckoutV4() {
      var root=app.querySelector('.checkout-v4-shell'); if(!root) return;
      var buyerRadios=Array.prototype.slice.call(root.querySelectorAll('input[name="buyer"]'));
      var methodRadios=Array.prototype.slice.call(root.querySelectorAll('input[name="method"]'));
      var invoiceFields=root.querySelector('#invoiceFields');
      var businessFields=root.querySelector('#businessFields');
      var contact=root.querySelector('input[name="contact"]');
      var company=root.querySelector('input[name="company"]');
      var taxid=root.querySelector('input[name="taxid"]');
      var methodHint=root.querySelector('#methodHint');
      var onlineNote=root.querySelector('#onlineNote');
      var invoiceNote=root.querySelector('#invoiceNote');
      var invoiceMethod=root.querySelector('#invoiceMethod');
      var form=root.querySelector('#checkoutForm');
      var submitButton=root.querySelector('#submitButton');
      var buttonHint=root.querySelector('#buttonHint');
      var formError=root.querySelector('#error');
      var checkoutStage=root.querySelector('#checkoutStage');
      var paymentStage=root.querySelector('#paymentStage');
      var cardForm=root.querySelector('#cardForm');
      var cardName=root.querySelector('input[name="cardName"]');
      var cardNumber=root.querySelector('input[name="cardNumber"]');
      var cardExpiry=root.querySelector('input[name="cardExpiry"]');
      var payButton=root.querySelector('#payButton');
      var cardHint=root.querySelector('#cardButtonHint');
      var cardError=root.querySelector('#cardError');
      var phoneCountry=root.querySelector('select[name="phoneCountry"]');
      var phone=root.querySelector('input[name="phone"]');
      var result=root.querySelector('#result');
      var summaryMethod=root.querySelector('#summaryMethod');
      var legalOverlay=root.querySelector('#legalPreviewOverlay');
      var attempted=false;
      if(!form || !submitButton) return;
      function picked(name){var item=root.querySelector('input[name="'+name+'"]:checked');return item?item.value:'';}
      function decorate(radios){radios.forEach(function(r){var label=r.closest('label');if(label)label.classList.toggle('selected',r.checked);});}
      function formatPhone(){var digits=phone.value.replace(/\D/g,'');if(!digits){phone.value='';phone.dataset.digits='';phone.placeholder=phoneCountry.value==='BY'?'12 345-67-89':'(123) 456-78-90';return;}if(phoneCountry.value==='BY'){if(digits.indexOf('375')===0)digits=digits.slice(3);else if(digits.indexOf('80')===0)digits=digits.slice(1);digits=digits.slice(0,9);var p=[digits.slice(0,2),digits.slice(2,5),digits.slice(5,7),digits.slice(7,9)].filter(Boolean);phone.value=p[0]+(p[1]?' '+p[1]:'')+(p[2]?'-'+p[2]:'')+(p[3]?'-'+p[3]:'');phone.dataset.digits=digits;}else{if(digits.indexOf('7')===0)digits=digits.slice(1);digits=digits.slice(0,10);var q=[digits.slice(0,3),digits.slice(3,6),digits.slice(6,8),digits.slice(8,10)].filter(Boolean);phone.value=(q[0]?'('+q[0]+')':'')+(q[1]?' '+q[1]:'')+(q[2]?'-'+q[2]:'')+(q[3]?'-'+q[3]:'');phone.dataset.digits=digits;}phone.placeholder=phoneCountry.value==='BY'?'12 345-67-89':'(123) 456-78-90';}
      function phoneValid(){return !phone.value.trim() || (phone.dataset.digits||'').length===(phoneCountry.value==='BY'?9:10);}
      function updateButton(){var phoneOk=phoneValid();phone.setCustomValidity(phoneOk?'':'Проверьте номер телефона или оставьте поле пустым.');submitButton.disabled=!form.checkValidity()||!phoneOk;buttonHint.textContent=submitButton.disabled?'Заполните обязательные поля и отметьте согласие, чтобы продолжить.':'Все обязательные поля заполнены. Можно продолжить.';}
      function update(){var buyer=picked('buyer');var business=buyer==='sole'||buyer==='company';var invoiceRadio=methodRadios.find(function(r){return r.value==='invoice';});invoiceMethod.classList.toggle('disabled',!business);invoiceRadio.disabled=!business;if(!business&&picked('method')==='invoice')root.querySelector('input[name="method"][value="online"]').checked=true;var invoice=picked('method')==='invoice';decorate(buyerRadios);decorate(methodRadios);invoiceFields.classList.toggle('hidden',!invoice);businessFields.classList.toggle('hidden',!(invoice&&business));contact.required=invoice;company.required=invoice&&business;taxid.required=invoice&&business;onlineNote.classList.toggle('hidden',invoice);invoiceNote.classList.toggle('hidden',!invoice);methodHint.textContent=business?'Для ИП и юридического лица доступны оба способа приобретения.':'Для частного лица доступна только оплата картой онлайн.';submitButton.textContent=invoice?'Проверить демо-запрос счёта':'Продолжить к этапу оплаты';summaryMethod.textContent=invoice?'Запрос счёта':'Оплата картой';formError.classList.remove('show');updateButton();}
      function showResult(title,text){root.querySelector('#resultTitle').textContent=title;root.querySelector('#resultText').textContent=text;checkoutStage.classList.add('hidden');paymentStage.classList.remove('show');result.classList.add('show');result.scrollIntoView({behavior:'auto',block:'center'});}
      function updateCardButton(){var num=cardNumber.value.replace(/\D/g,'');var expiry=cardExpiry.value.trim();var match=/^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);var future=false;if(match){var current=new Date();var month=Number(match[1]);var year=2000+Number(match[2]);future=year>current.getFullYear()||(year===current.getFullYear()&&month>=current.getMonth()+1);}var valid=Boolean(cardName.value.trim())&&num.length===16&&Boolean(match)&&future;payButton.disabled=!valid;payButton.textContent='Проверить демонстрационный этап';cardHint.textContent=valid?'Демо-форма заполнена. Платёж не будет проведён.':'Заполните имя, 16 цифр тестового номера и будущий срок ММ/ГГ. Не используйте реальные реквизиты.';cardError.classList.remove('show');}
      buyerRadios.forEach(function(r){r.addEventListener('change',update);});methodRadios.forEach(function(r){r.addEventListener('change',update);});
      phoneCountry.addEventListener('change',function(){phone.value='';phone.dataset.digits='';formatPhone();updateButton();});phone.addEventListener('input',function(){formatPhone();updateButton();});
      form.addEventListener('input',function(){formError.classList.remove('show');updateButton();});form.addEventListener('change',function(){formError.classList.remove('show');updateButton();});
      form.addEventListener('submit',function(e){e.preventDefault();attempted=true;formError.classList.remove('show');updateButton();if(submitButton.disabled){formError.classList.add('show');formError.textContent='Проверьте обязательные поля, email, телефон и согласие.';return;}if(picked('method')==='invoice'){showResult('Демо-запрос счёта проверен','Обязательные поля заполнены. Запрос не отправлен и не сохранён, счёт не создан, оплата не получена и продукт не выдан.');return;}checkoutStage.classList.add('hidden');paymentStage.classList.add('show');cardForm.reset();payButton.disabled=true;cardHint.textContent='Заполните только тестовые значения для проверки вида формы. Не используйте реальные реквизиты.';summaryMethod.textContent='Оплата картой · этап 2';updateCardButton();paymentStage.scrollIntoView({behavior:'auto',block:'start'});});
      root.querySelector('#backToCheckout').addEventListener('click',function(){paymentStage.classList.remove('show');checkoutStage.classList.remove('hidden');summaryMethod.textContent=picked('method')==='invoice'?'Запрос счёта':'Оплата картой';document.querySelector('.checkout-v4-shell .panel').scrollIntoView({behavior:'auto',block:'start'});});
      cardNumber.addEventListener('input',function(){var d=cardNumber.value.replace(/\D/g,'').slice(0,16);cardNumber.value=d.replace(/(.{4})/g,'$1 ').trim();updateCardButton();});cardExpiry.addEventListener('input',function(){var d=cardExpiry.value.replace(/\D/g,'').slice(0,4);cardExpiry.value=d.length>2?d.slice(0,2)+'/'+d.slice(2):d;updateCardButton();});cardName.addEventListener('input',updateCardButton);
      cardForm.addEventListener('submit',function(e){e.preventDefault();updateCardButton();if(payButton.disabled){cardError.classList.add('show');return;}var save=root.querySelector('#saveCard').checked;showResult('Демо-этап оплаты проверен',save?'Поля проверены. Реальный платёж не произведён; карта и запрос на сохранение не записаны и не отправлены. В рабочей версии токенизацию выполняет только подключённый платёжный провайдер.':'Поля проверены. Реальный платёж не произведён, данные карты не отправлены и не сохранены. В рабочей версии здесь должен открываться защищённый платёжный провайдер.');});
      root.querySelector('#resetButton').addEventListener('click',function(){result.classList.remove('show');checkoutStage.classList.remove('hidden');paymentStage.classList.remove('show');form.classList.remove('hidden');formError.classList.remove('show');update();root.querySelector('.panel').scrollIntoView({behavior:'auto',block:'start'});});
      function closeLegal(){legalOverlay.hidden=true;}
      root.querySelectorAll('[data-legal-doc]').forEach(function(link){link.addEventListener('click',function(e){e.preventDefault();var key=link.dataset.legalDoc;var title=link.textContent.trim();root.querySelector('#legalPreviewTitle').textContent=title+' — черновик';root.querySelector('#legalPreviewText').textContent='В текущем прототипе этот документ не опубликован и не утверждён. Перед запуском нужно добавить утверждённый текст и ссылку на его актуальную редакцию.';legalOverlay.hidden=false;root.querySelector('#legalPreviewClose').focus();});});
      root.querySelector('#legalPreviewClose').addEventListener('click',closeLegal);root.querySelector('#legalPreviewOk').addEventListener('click',closeLegal);legalOverlay.addEventListener('click',function(e){if(e.target===legalOverlay)closeLegal();});root.addEventListener('keydown',function(e){if(e.key==='Escape')closeLegal();});
      formatPhone();update();
    }


    

function initConstructorPlaceholderDimensions() {
      var block = document.getElementById('landing-constructor');
      if (!block || block.dataset.placeholderMeasureReady === 'true') return;
      block.dataset.placeholderMeasureReady = 'true';
      var targets = Array.prototype.slice.call(block.querySelectorAll('[data-placeholder-size]'));
      if (!targets.length) return;
      function update() {
        targets.forEach(function (target) {
          var label = target.querySelector('[data-placeholder-size-label]');
          if (!label) return;
          var rect = target.getBoundingClientRect();
          var width = Math.round(rect.width);
          var height = Math.round(rect.height);
          label.textContent = width > 0 && height > 0 ? width + ' × ' + height + ' px' : 'Появится при отображении';
        });
      }
      update();
      if (typeof ResizeObserver === 'function') {
        var observer = new ResizeObserver(update);
        targets.forEach(function (target) { observer.observe(target); });
        block.__artifyPlaceholderResizeObserver = observer;
      } else {
        window.addEventListener('resize', update, { passive: true });
      }
    }

    function initLandingConstructorSteps() {
      var block = document.getElementById('landing-constructor');
      if (!block) return;
      var steps = Array.prototype.slice.call(block.querySelectorAll('[data-landing-step]'));
      var shots = Array.prototype.slice.call(block.querySelectorAll('[data-landing-step-shot]'));
      if (!steps.length) return;
      /* The stage gallery is visible only above 900px. Below that point the cards are informational text. */
      var interactiveMedia = window.matchMedia('(min-width: 901px)');
      var activeIndex = 0;

      function setStep(index) {
        if (!interactiveMedia.matches) return;
        activeIndex = Math.max(0, Math.min(steps.length - 1, index));
        steps.forEach(function (item, i) {
          var active = i === activeIndex;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        shots.forEach(function (shot, i) {
          shot.classList.toggle('is-active', i === activeIndex);
        });
      }

      function updateInteractionMode() {
        var interactive = interactiveMedia.matches;
        steps.forEach(function (step) {
          if (interactive) {
            step.setAttribute('role', 'button');
            step.setAttribute('tabindex', '0');
          } else {
            step.removeAttribute('role');
            step.removeAttribute('tabindex');
            step.removeAttribute('aria-pressed');
            step.classList.remove('is-active');
          }
        });
        if (interactive) {
          setStep(activeIndex);
        } else {
          shots.forEach(function (shot) { shot.classList.remove('is-active'); });
        }
      }

      steps.forEach(function (step, index) {
        step.addEventListener('click', function () {
          if (!interactiveMedia.matches) return;
          setStep(index);
        });
        step.addEventListener('keydown', function (event) {
          if (!interactiveMedia.matches) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setStep(index);
            return;
          }
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          var target = Math.max(0, Math.min(steps.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
          setStep(target);
          steps[target].focus();
        });
      });

      updateInteractionMode();
      if (typeof interactiveMedia.addEventListener === 'function') interactiveMedia.addEventListener('change', updateInteractionMode);
      else if (typeof interactiveMedia.addListener === 'function') interactiveMedia.addListener(updateInteractionMode);
      initConstructorPlaceholderDimensions();
    }

    function initConstructorEmailModal() {
      var overlay = document.getElementById('constructor-email-overlay');
      var form = document.getElementById('constructor-email-form');
      var email = document.getElementById('constructor-email-input');
      var emailError = document.getElementById('constructor-email-error');
      var consent = document.getElementById('constructor-email-consent');
      var policy = document.getElementById('constructor-email-policy');
      var consentRow = document.getElementById('constructor-email-consent-row');
      var policyRow = document.getElementById('constructor-email-policy-row');
      var status = document.getElementById('constructor-email-status');
      var trigger = null;
      var lastFocus = null;
      var modalScrollY = 0;
      var policyTrigger = null;
      if (!overlay || !form || !email) return;
      if (overlay.dataset.modalReady === 'true') return;
      overlay.dataset.modalReady = 'true';
      function setBodyLock(lock) {
        if (lock) {
          modalScrollY = window.scrollY || window.pageYOffset || 0;
          document.body.dataset.constructorModalScrollY = String(modalScrollY);
          document.body.classList.add('constructor-overlay-lock');
        } else {
          document.body.classList.remove('constructor-overlay-lock');
          var oldY = Number(document.body.dataset.constructorModalScrollY || modalScrollY || 0);
          delete document.body.dataset.constructorModalScrollY;
          window.scrollTo({top:oldY, behavior:'auto'});
        }
      }
      function openModal(source) {
        trigger = source || null;
        lastFocus = document.activeElement;
        overlay.hidden = false;
        setBodyLock(true);
        window.setTimeout(function(){ email.focus({preventScroll:true}); }, 0);
      }
      function closeModal() {
        if (overlay.hidden) return;
        overlay.hidden = true;
        setBodyLock(false);
        if (trigger && trigger.isConnected) trigger.focus({preventScroll:true});
        else if (lastFocus && lastFocus.isConnected) lastFocus.focus({preventScroll:true});
      }
      var stubCtaMedia = window.matchMedia('(max-width: 900px)');
      document.addEventListener('click', function(event) {
        var tryButton = event.target && event.target.closest ? event.target.closest('#landing-constructor-try') : null;
        if (!tryButton) return;
        /* At all small breakpoints (<=900px) the CTA is a deliberate visual stub, including phone widths. */
        if (stubCtaMedia.matches && tryButton.hasAttribute('data-landing-constructor-stub-cta')) {
          event.preventDefault();
          return;
        }
        if (!window.matchMedia('(max-width: 1100px)').matches) return;
        event.preventDefault();
        openModal(tryButton);
      }, true);
      overlay.querySelectorAll('[data-constructor-email-close]').forEach(function (button) { button.addEventListener('click', closeModal); });
      overlay.addEventListener('click', function(event){ if(event.target === overlay) closeModal(); });
      document.addEventListener('keydown', function(event){
        var policyOverlayForKeys = document.getElementById('constructor-policy-overlay');
        if (policyOverlayForKeys && !policyOverlayForKeys.hidden && event.key === 'Escape') {
          policyOverlayForKeys.hidden = true;
          if (policyTrigger && policyTrigger.isConnected) policyTrigger.focus({preventScroll:true});
          else email.focus({preventScroll:true});
          return;
        }
        if (overlay.hidden) return;
        if (event.key === 'Escape') { closeModal(); return; }
        if (event.key === 'Tab') {
          var items = Array.prototype.slice.call(overlay.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href]')).filter(function(el){return el.offsetParent !== null;});
          if (!items.length) return;
          var first = items[0], last = items[items.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      });
      function setEmailError(message) {
        emailError.textContent = message || '';
        emailError.hidden = !message;
        email.setAttribute('aria-invalid', String(!!message));
      }
      function validate() {
        var value = email.value.trim();
        var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(!value ? 'Укажите e-mail, на который отправить ссылку.' : (!emailOk ? 'Введите e-mail в формате name@example.com.' : ''));
        var consentOk = consent.checked;
        var policyOk = policy.checked;
        consentRow.setAttribute('aria-invalid', String(!consentOk));
        policyRow.setAttribute('aria-invalid', String(!policyOk));
        return emailOk && consentOk && policyOk;
      }
      email.addEventListener('input', function(){ if(!emailError.hidden) setEmailError(''); email.removeAttribute('aria-invalid'); });
      consent.addEventListener('change', function(){ consentRow.setAttribute('aria-invalid', String(!consent.checked)); });
      policy.addEventListener('change', function(){ policyRow.setAttribute('aria-invalid', String(!policy.checked)); });
      form.addEventListener('submit', function(event){
        event.preventDefault();
        status.hidden = true;
        status.textContent = '';
        if (!validate()) {
          if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) email.focus();
          else if (!consent.checked) consent.focus();
          else policy.focus();
          return;
        }
        status.textContent = 'Форма проверена. Это локальный прототип: адрес не сохранён и письмо не отправлено. Перед запуском нужно подключить серверное сохранение адреса, регистрацию согласия и отправку ссылки.';
        status.hidden = false;
      });
      document.addEventListener('click', function(event){
        var link = event.target && event.target.closest ? event.target.closest('[data-constructor-legal]') : null;
        if (!link) return;
        event.preventDefault();
        var policyOverlay = document.getElementById('constructor-policy-overlay');
        var policyTitle = document.getElementById('constructor-policy-title');
        var policyCopy = document.getElementById('constructor-policy-copy');
        if(!policyOverlay || !policyTitle || !policyCopy) return;
        policyTrigger = link;
        var kind = link.getAttribute('data-constructor-legal');
        policyTitle.textContent = kind === 'consent' ? 'Согласие на обработку персональных данных — черновик' : 'Политика обработки персональных данных — черновик';
        policyCopy.textContent = 'Окончательная редакция документа ещё не утверждена. В рабочей версии здесь должна открываться актуальная политика/форма согласия с указанием оператора, цели и условий обработки адреса e-mail, срока хранения, порядка отзыва согласия и контакта для обращений. Эта заглушка не является юридическим документом.';
        policyOverlay.hidden = false;
        var closeBtn = policyOverlay.querySelector('[data-constructor-policy-close]');
        if(closeBtn) closeBtn.focus({preventScroll:true});
      });
      var policyOverlay = document.getElementById('constructor-policy-overlay');
      if(policyOverlay){
        policyOverlay.querySelectorAll('[data-constructor-policy-close]').forEach(function(btn){btn.addEventListener('click',function(){policyOverlay.hidden=true;if(policyTrigger&&policyTrigger.isConnected)policyTrigger.focus({preventScroll:true});else email.focus({preventScroll:true});});});
        policyOverlay.addEventListener('click',function(event){if(event.target===policyOverlay){policyOverlay.hidden=true;if(policyTrigger&&policyTrigger.isConnected)policyTrigger.focus({preventScroll:true});else email.focus({preventScroll:true});}});
      }
    }

    function initConstructorImageZoom() {
      var triggerSelector = '[data-constructor-image-open]';
      var trigger = document.querySelector(triggerSelector);
      var overlay = document.getElementById('constructor-image-overlay');
      if (!trigger || !overlay || overlay.dataset.zoomReady === 'true') return;
      overlay.dataset.zoomReady = 'true';
      var closeButtons = Array.prototype.slice.call(overlay.querySelectorAll('[data-constructor-image-close]'));
      var largeImage = document.getElementById('constructor-image-large');
      var imageDialog = overlay.querySelector('.constructor-image-dialog');
      var caption = document.getElementById('constructor-image-title');
      var zoomImageWidth = 1320;
      var zoomImageHeight = 880;
      function fitZoomDialogToImage() {
        if (!imageDialog || overlay.hidden) return;
        var style = window.getComputedStyle(overlay);
        var horizontalPadding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
        var verticalPadding = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
        var availableWidth = Math.max(1, overlay.clientWidth - horizontalPadding);
        var availableHeight = Math.max(1, overlay.clientHeight - verticalPadding);
        var sourceWidth = (largeImage && largeImage.naturalWidth) || zoomImageWidth;
        var sourceHeight = (largeImage && largeImage.naturalHeight) || zoomImageHeight;
        var scale = Math.min(Math.min(1600, availableWidth) / sourceWidth, availableHeight / sourceHeight);
        if (!Number.isFinite(scale) || scale <= 0) return;
        imageDialog.style.width = Math.round(sourceWidth * scale) + 'px';
        imageDialog.style.height = Math.round(sourceHeight * scale) + 'px';
      }
      if (largeImage) largeImage.addEventListener('load', fitZoomDialogToImage);
      window.addEventListener('resize', fitZoomDialogToImage);
      var returnFocus = null;
      var restoredFocusClass = 'constructor-image-zoom-focus-restored';
      var pointerOpenClass = 'constructor-image-zoom-pointer-opened';
      var pointerPressClass = 'constructor-image-zoom-pointer-press';
      function open(triggerElement, pointerInitiated) {
        returnFocus = triggerElement || document.activeElement;
        var sourceImage = triggerElement && triggerElement.querySelector('img');
        if (sourceImage && largeImage) {
          zoomImageWidth = sourceImage.naturalWidth || sourceImage.width || 1400;
          zoomImageHeight = sourceImage.naturalHeight || sourceImage.height || 960;
          largeImage.width = zoomImageWidth;
          largeImage.height = zoomImageHeight;
          largeImage.alt = sourceImage.alt || 'Скриншот редактора Artify Factory';
          largeImage.src = sourceImage.currentSrc || sourceImage.src;
        }
        if (caption) caption.textContent = triggerElement.getAttribute('data-image-caption') || 'Скриншот Artify Factory · Landing Builder';
        document.body.classList.remove(restoredFocusClass, pointerPressClass);
        document.body.classList.toggle(pointerOpenClass, !!pointerInitiated);
        overlay.hidden = false;
        fitZoomDialogToImage();
        document.body.classList.add('constructor-overlay-lock');
        var close = overlay.querySelector('[data-constructor-image-close]');
        if (close) close.focus({preventScroll:true});
      }
      function close() {
        if (overlay.hidden) return;
        overlay.hidden = true;
        document.body.classList.remove('constructor-overlay-lock', pointerOpenClass);
        document.body.classList.add(restoredFocusClass);
        if (returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll:true});
      }
      document.addEventListener('click', function(event) {
        var target = event.target && event.target.closest ? event.target.closest(triggerSelector) : null;
        if (target) open(target, event.detail > 0);
        else document.body.classList.remove(pointerPressClass);
      });
      closeButtons.forEach(function(button) { button.addEventListener('click', close); });
      overlay.addEventListener('click', function(event) { if (event.target === overlay) close(); });
      document.addEventListener('keydown', function(event) {
        if (!overlay.hidden && event.key === 'Escape') {
          event.preventDefault();
          close();
        }
      });
      document.addEventListener('keyup', function(event) {
        if (event.key === 'Tab') {
          document.body.classList.remove(pointerOpenClass, pointerPressClass);
          if (overlay.hidden) document.body.classList.remove(restoredFocusClass);
        }
      });
      document.addEventListener('pointerdown', function(event) {
        var target = event.target && event.target.closest ? event.target.closest(triggerSelector) : null;
        document.body.classList.toggle(pointerPressClass, !!(target && overlay.hidden));
        if (overlay.hidden) document.body.classList.remove(restoredFocusClass);
        else document.body.classList.remove(pointerOpenClass);
      }, true);
      document.addEventListener('pointercancel', function() {
        document.body.classList.remove(pointerPressClass);
      }, true);
    }
    function initConstructorCarousel() {
      var track = document.getElementById('constructor-track');
      if (!track || track.dataset.carouselReady === 'true') return;
      track.dataset.carouselReady = 'true';
      var slides = Array.prototype.slice.call(track.querySelectorAll('[data-step]'));
      var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-step-go]'));
      var counter = document.getElementById('constructor-step-count');
      var progress = Array.prototype.slice.call(document.querySelectorAll('.constructor-step-progress i'));
      function currentIndex() {
        if (!slides.length || track.clientWidth <= 0) return 0;
        return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
      }
      function updateState(index) {
        index = Math.max(0, Math.min(slides.length - 1, index));
        tabs.forEach(function(tab, i) {
          var active = i === index;
          tab.classList.toggle('is-active', active);
          if (active) tab.setAttribute('aria-current', 'step'); else tab.removeAttribute('aria-current');
        });
        slides.forEach(function(slide, i) { slide.setAttribute('aria-hidden', i === index ? 'false' : 'true'); });
        progress.forEach(function(dot, i) { dot.classList.toggle('is-active', i === index); });
        if (counter) counter.textContent = 'Экран ' + String(index + 1).padStart(2, '0') + ' из ' + String(slides.length).padStart(2, '0');
      }
      tabs.forEach(function(tab, i) {
        tab.addEventListener('click', function() {
          var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          track.scrollTo({left: i * track.clientWidth, behavior: reduced ? 'auto' : 'smooth'});
          updateState(i);
        });
      });
      var scrollTimer = 0;
      track.addEventListener('scroll', function() { window.clearTimeout(scrollTimer); scrollTimer = window.setTimeout(function() { updateState(currentIndex()); }, 100); }, {passive:true});
      track.addEventListener('keydown', function(event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        var next = currentIndex() + (event.key === 'ArrowRight' ? 1 : -1);
        next = Math.max(0, Math.min(slides.length - 1, next));
        track.scrollTo({left: next * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
        updateState(next);
      });
      updateState(0);
    }

    function render(page, opts) {
      currentPage=page;
      if(page==='home') { app.innerHTML=homeMarkup(); syncLandingCategoryCards(); }
      else if(page==='catalog') app.innerHTML=catalogMarkup();
      else if(page==='product') app.innerHTML=productMarkup();
      else if(page==='product-coffee-constructor') app.innerHTML=coffeeConstructorProductMarkup();
      else if(page.indexOf('category-')===0) app.innerHTML=categoryMarkup(page);
      else if(page==='cart') app.innerHTML=cartMarkup();
      else if(page==='checkout') app.innerHTML=checkoutMarkup();
      else if(page==='constructor') app.innerHTML=constructorMarkup();
      else if(page==='development') app.innerHTML=developmentMarkup();
      else if(page==='pinterest') app.innerHTML=pinterestMarkup();
      if(page==='home') { initLandingConstructorSteps(); initConstructorEmailModal(); initConstructorImageZoom(); }
      if(page==='home' || page==='constructor') initConstructorCarousel();
      document.body.classList.toggle('checkout-mode', page==='checkout');
      var checkoutShell=app.querySelector('.checkout-v4-shell');
      app.setAttribute('role', page==='checkout' ? 'presentation' : 'main');
      if(checkoutShell) checkoutShell.dataset.theme=document.documentElement.dataset.theme || 'light';
      updateHeader();
      if(page==='checkout') bindCheckoutV4();
      if(opts && opts.keepValues && page==='checkout' && document.getElementById('checkout-form')) refreshSubmit();
      if(opts && opts.scroll) window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    }
    

function visiblePrimaryNav() {
      return window.matchMedia('(max-width: 900px)').matches
        ? document.querySelector('.mobile-nav')
        : document.querySelector('.site-header .nav');
    }
    function clearPrimaryNavState() {
      document.querySelectorAll('.site-header .nav a[data-route], .mobile-nav a[data-route]').forEach(function(a){
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      });
    }
    function setPrimaryNavCurrent(selector) {
      clearPrimaryNavState();
      if(!selector) return;
      var nav=visiblePrimaryNav();
      if(!nav) return;
      var link=nav.querySelector(selector);
      if(link){link.classList.add('active');link.setAttribute('aria-current','page');}
    }
    function updateHeader() {
      var n=cart?1:0; document.getElementById('cart-count').textContent=String(n);
      currentHoverLink=null;
      if(currentPage==='home'){
        clearPrimaryNavState();
      } else {
        var routeSelector='a[data-route="'+currentPage+'"]';
        if(currentPage==='constructor') routeSelector='a[data-scroll="landing-constructor"]';
        if(currentPage==='catalog'||currentPage==='product'||currentPage==='product-coffee-constructor'||currentPage.indexOf('category-')===0||currentPage==='cart'||currentPage==='checkout') routeSelector='a[data-scroll="landing-products"]';
        if(currentPage==='development') routeSelector='a[data-scroll="landing-development"]';
        setPrimaryNavCurrent(routeSelector);
      }
      renderIndicator();
      var details=document.getElementById('theme-control'); if(details) details.open=false; var themeTrigger=document.getElementById('theme-trigger'); if(themeTrigger) themeTrigger.setAttribute('aria-expanded','false');
      closeMobileNav();
      if(currentPage==='home') syncHomeNavigation();
    }
    var mobileNavScrollY = 0;
    var mobileNavScrollLocked = false;
    var mobileNavSavedBodyStyle = null;
    var mobileNavSavedScrollBehavior = '';
    function hasOrphanedMobileNavBodyLock() {
      var body=document.body;
      var top=parseFloat(body.style.top);
      var fixedStyle=body.style.position==='fixed' && body.style.left==='0px' && body.style.right==='0px' && body.style.width==='100%' && Number.isFinite(top) && top<=0;
      return body.classList.contains('mobile-nav-lock') || body.dataset.artifyMenuScrollLock==='true' || fixedStyle;
    }
    function lockMobileNavScroll() {
      if (mobileNavScrollLocked) return;
      mobileNavScrollY = window.scrollY || window.pageYOffset || 0;
      mobileNavSavedBodyStyle = { position: document.body.style.position, top: document.body.style.top, left: document.body.style.left, right: document.body.style.right, width: document.body.style.width };
      mobileNavSavedScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.classList.add('mobile-nav-lock');
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + mobileNavScrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.dataset.artifyMenuScrollLock = 'true';
      mobileNavScrollLocked = true;
    }
    function unlockMobileNavScroll() {
      var body=document.body;
      var bodyLockPresent=hasOrphanedMobileNavBodyLock();
      if (!mobileNavScrollLocked && !bodyLockPresent) return;
      var staleTop=parseFloat(body.style.top);
      var restoreY=mobileNavScrollLocked ? mobileNavScrollY : (Number.isFinite(staleTop) && staleTop<=0 ? Math.max(0,-staleTop) : (window.scrollY||window.pageYOffset||0));
      body.classList.remove('mobile-nav-lock');
      body.removeAttribute('data-artify-menu-scroll-lock');
      var saved = mobileNavSavedBodyStyle || {};
      body.style.position = saved.position || '';
      body.style.top = saved.top || '';
      body.style.left = saved.left || '';
      body.style.right = saved.right || '';
      body.style.width = saved.width || '';
      mobileNavSavedBodyStyle = null;
      mobileNavScrollLocked = false;
      /* Reflow first, then restore the exact saved scroll position without smooth animation. */
      document.documentElement.style.scrollBehavior = 'auto';
      window.requestAnimationFrame(function () {
        window.scrollTo(0, restoreY);
        window.requestAnimationFrame(function () {
          document.documentElement.style.scrollBehavior = mobileNavSavedScrollBehavior || '';
        });
      });
    }
    function closeMobileNav(returnFocus, escapeClose) {
      var nav = document.getElementById('mobile-nav');
      var toggle = document.getElementById('mobile-toggle');
      var backdrop = document.getElementById('mobile-nav-backdrop');
      var wasOpen = !!(nav && nav.classList.contains('open'));
      var themeControl = document.getElementById('theme-control');
      var cartControl = document.querySelector('.site-header .nav-cart');
      if (nav) { nav.classList.remove('open'); nav.setAttribute('aria-hidden', 'true'); nav.setAttribute('inert', ''); }
      if (backdrop) { backdrop.classList.remove('open'); backdrop.setAttribute('aria-hidden', 'true'); }
      [themeControl, cartControl].forEach(function(control){
        if (!control) return;
        control.removeAttribute('inert');
        control.removeAttribute('aria-disabled');
      });
      if (escapeClose) document.body.classList.add('menu-escape-focus-restored');
      if (toggle) {
        toggle.removeAttribute('data-menu-focus-return');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Открыть меню');
        if (returnFocus && wasOpen) { try { toggle.focus({ preventScroll: true }); } catch (_) { toggle.focus(); } }
      }
      unlockMobileNavScroll();
    }
    /* Escape is handled at capture phase while the mobile menu is open, before focused links or other overlays can intercept it. */
    document.addEventListener('keydown', function(event) {
      if (event.key !== 'Escape') return;
      var nav = document.getElementById('mobile-nav');
      if (!nav || !nav.classList.contains('open')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeMobileNav(true, true);
    }, true);
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') document.body.classList.remove('menu-escape-focus-restored');
    }, true);
    document.addEventListener('pointerdown', function() {
      document.body.classList.remove('menu-escape-focus-restored');
    }, true);
    function openMobileNav() {
      document.body.classList.remove('menu-escape-focus-restored');
      if (window.matchMedia('(min-width: 1151px)').matches) return;
      var nav = document.getElementById('mobile-nav');
      var toggle = document.getElementById('mobile-toggle');
      var backdrop = document.getElementById('mobile-nav-backdrop');
      if (!nav || !toggle || nav.classList.contains('open')) return;
      var themeControl = document.getElementById('theme-control');
      var themeTrigger = document.getElementById('theme-trigger');
      var cartControl = document.querySelector('.site-header .nav-cart');
      /* The menu owns mobile-header interaction. Close any open picker and
         remove theme/cart controls from pointer and keyboard interaction. */
      if (themeControl) { themeControl.open = false; themeControl.setAttribute('inert', ''); themeControl.setAttribute('aria-disabled', 'true'); }
      if (themeTrigger) themeTrigger.setAttribute('aria-expanded', 'false');
      if (cartControl) { cartControl.setAttribute('inert', ''); cartControl.setAttribute('aria-disabled', 'true'); }
      lockMobileNavScroll();
      nav.removeAttribute('inert');
      nav.setAttribute('aria-hidden', 'false');
      nav.classList.add('open');
      if (backdrop) { backdrop.classList.add('open'); backdrop.setAttribute('aria-hidden', 'false'); }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
      window.setTimeout(function(){ try { nav.focus({ preventScroll: true }); } catch (_) { nav.focus(); } }, 0);
    }
    /* Keep mobile menu and scroll-lock state in sync after browser viewport transitions or restored page state. */
    function repairMobileNavInvariant() {
      var nav=document.getElementById('mobile-nav');
      var toggle=document.getElementById('mobile-toggle');
      var backdrop=document.getElementById('mobile-nav-backdrop');
      var themeControl=document.getElementById('theme-control');
      var cartControl=document.querySelector('.site-header .nav-cart');
      if(!nav)return;
      var open=nav.classList.contains('open');
      var locked=document.body.classList.contains('mobile-nav-lock');
      var bodyLockPresent=hasOrphanedMobileNavBodyLock();
      var backdropOpen=!!(backdrop&&backdrop.classList.contains('open'));
      var controlsInert=!!((themeControl&&themeControl.hasAttribute('inert'))||(cartControl&&cartControl.hasAttribute('inert')));
      if(!open && (locked||backdropOpen||controlsInert||mobileNavScrollLocked||bodyLockPresent)) {
        closeMobileNav(false);
        return;
      }
      if(open) {
        if(!mobileNavScrollLocked && bodyLockPresent) {
          var staleTop=parseFloat(document.body.style.top);
          mobileNavScrollY=Number.isFinite(staleTop)&&staleTop<=0?Math.max(0,-staleTop):(window.scrollY||window.pageYOffset||0);
          mobileNavSavedBodyStyle={position:'',top:'',left:'',right:'',width:''};
          mobileNavSavedScrollBehavior=document.documentElement.style.scrollBehavior;
          mobileNavScrollLocked=true;
          document.body.classList.add('mobile-nav-lock');
          document.body.dataset.artifyMenuScrollLock='true';
        } else if(!mobileNavScrollLocked) lockMobileNavScroll();
        nav.removeAttribute('inert');
        nav.setAttribute('aria-hidden','false');
        if(backdrop){backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');}
        if(toggle){toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Закрыть меню');}
        if(themeControl){themeControl.open=false;themeControl.setAttribute('inert','');themeControl.setAttribute('aria-disabled','true');}
        if(cartControl){cartControl.setAttribute('inert','');cartControl.setAttribute('aria-disabled','true');}
      }
    }
    document.addEventListener('pointerdown',repairMobileNavInvariant,true);
    window.addEventListener('resize',repairMobileNavInvariant,{passive:true});

    function navigate(route, scrollId, navOptions) {
      var transientToast=document.getElementById('toast'); if(transientToast) transientToast.hidden=true;
      if(route==='checkout' && !cart && !directPurchase) { toast('Сначала добавьте ALEN в корзину или нажмите «Купить сразу».'); route='product'; }
      if(route!=='checkout') directPurchase=false;
      if(route==='checkout') { checkoutStep='DETAILS'; touched={}; }
      if(route==='product') activeTab='overview';
      var restoringHistory=!!(navOptions && navOptions.fromHistory);
      /* Reuse the current home DOM when only moving between landing sections.
         This preserves the selected constructor step and prevents competing scroll-to-top
         and scroll-to-section animations. The initial route still needs its first render. */
      var alreadyRenderedSameRoute = currentPage===route && app && app.childElementCount>0;
      if(!(alreadyRenderedSameRoute && scrollId)) {
        render(route,{scroll:!restoringHistory && !scrollId});
      } else {
        updateHeader();
      }
      if(scrollId) setTimeout(function(){
        var target=document.getElementById(scrollId);
        if(!target)return;
        var root=document.documentElement;
        var savedScrollBehavior=root.style.scrollBehavior;
        if(restoringHistory)root.style.scrollBehavior='auto';
        target.scrollIntoView({behavior:restoringHistory||window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
        if(restoringHistory)window.requestAnimationFrame(function(){root.style.scrollBehavior=savedScrollBehavior||'';});
      },restoringHistory?0:60);
      if(!(navOptions && navOptions.fromHistory)) {
        var hash = route==='home' && scrollId ? scrollId : route;
        try { history.pushState({artifyRoute:true,route:route,scrollId:scrollId||null},'','#'+hash); } catch (_) {}
      }
      if(route==='home') setTimeout(syncHomeNavigation,120);
    }
    function restoreRouteFromLocation() {
      var key = (window.location.hash || '#home').slice(1);
      var sectionIds = ['landing-constructor','landing-products','landing-development','contacts'];
      var routes = ['home','catalog','product','product-coffee-constructor','category-sites','category-marketplaces','category-print','category-design-kits','cart','checkout','constructor','development','pinterest'];
      if(key==='constructor-gallery') { navigate('constructor',key,{fromHistory:true}); return; }
      if(sectionIds.indexOf(key)>=0) { navigate('home',key,{fromHistory:true}); return; }
      if(routes.indexOf(key)>=0) { navigate(key,null,{fromHistory:true}); return; }
      navigate('home',null,{fromHistory:true});
    }
    window.addEventListener('popstate',function(event){
      if(event.state && event.state.artifyRoute) navigate(event.state.route,event.state.scrollId,{fromHistory:true});
      else restoreRouteFromLocation();
    });
    function setBuyer(next) {
      getFormValues(); buyerType=next;
      if(!isBusiness() && purchaseMethod==='INVOICE') purchaseMethod='ONLINE';
      render('checkout',{keepValues:true});
    }
    function setMethod(next) { getFormValues(); purchaseMethod=next; render('checkout',{keepValues:true}); }
    document.addEventListener('click',function(event){
      /* Modal markup is below this script in the HTML, so use delegation and resolve it at click time. */
      var dialogCloser=event.target.closest('#projectDiscussionClose');
      if(dialogCloser){event.preventDefault();if(window.ArtifyProjectModal)window.ArtifyProjectModal.close();return;}
      var activeOverlayBg=document.getElementById('projectDiscussionOverlay');
      if(activeOverlayBg && event.target===activeOverlayBg){if(window.ArtifyProjectModal)window.ArtifyProjectModal.close();return;}
      if (document.body.classList.contains('mobile-nav-lock') && event.target.closest('#theme-control, .site-header .nav-cart')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      var constructorArrow=event.target.closest('[data-constructor-scroll]');
      if(constructorArrow){
        event.preventDefault();
        var track=document.getElementById('constructor-track');
        if(track){
          var sign=constructorArrow.dataset.constructorScroll==='next'?1:-1;
          var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          var distance=Math.max(260,Math.round(track.clientWidth*0.98))*sign;
          if(typeof track.scrollBy==='function') track.scrollBy({left:distance,behavior:reduced?'auto':'smooth'});
          else track.scrollLeft+=distance;
        }
        return;
      }
      var themeButton=event.target.closest('[data-mode]');
      if(themeButton){ window.ArtifyTheme.setMode(themeButton.dataset.mode); var d=document.getElementById('theme-control'); if(d) d.open=false; var trigger=document.getElementById('theme-trigger'); if(trigger) trigger.setAttribute('aria-expanded','false'); event.stopPropagation(); return; }
      var discussionDetails=event.target.closest('#projectDiscussionDetails');
      if(discussionDetails){event.preventDefault();if(window.ArtifyProjectModal)window.ArtifyProjectModal.close({returnFocus:false});navigate('home','landing-development');return;}
      var discussCta=event.target.closest('[data-action="discuss-project"]');
      if(discussCta){event.preventDefault();if(window.ArtifyProjectModal)window.ArtifyProjectModal.open(discussCta);return;}
      var modeNav=event.target.closest('[data-route]');
      if(modeNav){ event.preventDefault(); navigate(modeNav.dataset.route,modeNav.dataset.scroll); return; }
      var action=event.target.closest('[data-action]');
      if(action){
        var act=action.dataset.action;
        if(act==='add-cart'){var already=cart;cart=true;persistCartState();updateHeader();toast(already?'ALEN уже находится в локальной корзине.':'ALEN добавлен в локальную корзину.');}
        if(act==='buy-now'){directPurchase=true;navigate('checkout');}
        if(act==='remove-cart'){cart=false;persistCartState();render('cart',{scroll:true});toast('ALEN удалён из корзины.');}
        if(act==='checkout'){directPurchase=false;navigate('checkout');}
        if(act==='back-details'){checkoutStep='DETAILS';render('checkout',{scroll:true});}
        if(act==='payment-preview-done'){checkoutStep='DETAILS';cart=false;persistCartState();render('success',{scroll:true}); app.innerHTML='<section class="section"><div class="container"><div class="success-box"><div class="eyebrow">Сценарий проверен</div><h2>Онлайн-этап просмотрен.</h2><p>Платёж не выполнялся. Для продолжения работы подтвердите цену, лицензию ALEN и подключение провайдера.</p><div class="actions"><a class="btn btn-accent" href="#product" data-route="product">Вернуться к ALEN</a><a class="btn" href="#home" data-route="home">На главную</a></div></div></div></section>';updateHeader();}
        if(act==='legal-doc'){event.preventDefault();toast('Это место ссылки на юридический документ. Перед запуском добавить утверждённую страницу.');}
      }
      var tab=event.target.closest('[data-tab]');
      if(tab){activeTab=tab.dataset.tab;document.querySelectorAll('[data-tab]').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.tab===activeTab));});var panel=document.getElementById('tab-panel');if(panel){panel.textContent=activeTab==='overview'?'Описание и назначение ALEN будут заполнены после сверки фактических файлов и целевого сценария использования.':activeTab==='included'?'Список файлов, форматы и комплектность требуется сверить с реальным дистрибутивом ALEN; до этого в карточке не обещаем состав.':'Условия лицензии ALEN необходимо подтвердить для конкретного SKU. Не подставляем общую лицензию без проверки.';}}
    });
    document.getElementById('mobile-toggle').addEventListener('click', function(){ var nav = document.getElementById('mobile-nav'); if (nav && nav.classList.contains('open')) closeMobileNav(); else openMobileNav(); });
    var mobileNavMedia=window.matchMedia('(max-width: 900px)');
    function syncMobileNavBreakpoint(){if(!mobileNavMedia.matches)closeMobileNav(false);}
    if(mobileNavMedia.addEventListener)mobileNavMedia.addEventListener('change',syncMobileNavBreakpoint);else if(mobileNavMedia.addListener)mobileNavMedia.addListener(syncMobileNavBreakpoint);
    syncMobileNavBreakpoint();
    document.getElementById('mobile-nav').addEventListener('click', function(event){ if (event.target.closest('a[data-route], a[href^="tel:"]')) closeMobileNav(true); });
    document.getElementById('mobile-nav-backdrop').addEventListener('click', function(){ closeMobileNav(true); });
    function syncHomeNavigation(){
      if(currentPage!=='home') return;
      /* Opening the fixed mobile panel locks the page with body{position:fixed}, so window.scrollY can temporarily read as zero. Preserve the selected section while the menu is open instead of clearing it. */
      var mobileNavForState=document.getElementById('mobile-nav');
      if(mobileNavForState && mobileNavForState.classList.contains('open')) return;
      var sections=[
        {id:'landing-constructor',selector:'a[data-scroll="landing-constructor"]'},
        {id:'landing-products',selector:'a[data-scroll="landing-products"]'},
        {id:'landing-development',selector:'a[data-scroll="landing-development"]'},
        {id:'contacts',selector:'a[data-scroll="contacts"]'}
      ];
      var doc=document.documentElement;
      var pageHeight=Math.max(doc.scrollHeight,document.body ? document.body.scrollHeight : 0);
      var atPageEnd=(window.scrollY+window.innerHeight)>=pageHeight-4;
      var marker=Math.max(120,Math.min(window.innerHeight*0.30,280));
      var active=null;
      /* No active item on the initial hero. Once the visitor scrolls, show exactly one relevant destination. */
      if((window.scrollY||0)>80){
        if(atPageEnd){
          active=sections[sections.length-1];
        } else {
          for(var i=0;i<sections.length;i++){
            var section=document.getElementById(sections[i].id);
            if(section && section.getBoundingClientRect().top<=marker) active=sections[i];
          }
        }
      }
      setPrimaryNavCurrent(active ? active.selector : null);
      renderIndicator();
    }
    function renderIndicator(){
      var nav=document.querySelector('.site-header .nav');
      var indicator=nav&&nav.querySelector('.nav-indicator');
      if(!nav||!indicator)return;
      if(window.matchMedia('(max-width: 900px)').matches){indicator.classList.remove('is-visible','is-hover');return;}
      var target=currentHoverLink&&currentHoverLink.isConnected&&nav.contains(currentHoverLink)
        ? currentHoverLink
        : nav.querySelector('a[aria-current="page"]');
      if(!target){indicator.classList.remove('is-visible','is-hover');return;}
      indicator.classList.toggle('is-hover',target===currentHoverLink);
      indicator.style.width=target.offsetWidth+'px';
      indicator.style.transform='translateX('+target.offsetLeft+'px)';
      indicator.classList.add('is-visible');
    }
    (function initNavIndicator(){
      var nav=document.querySelector('.site-header .nav');
      if(!nav)return;
      nav.addEventListener('pointerover',function(event){var link=event.target.closest('a');if(link&&nav.contains(link)){currentHoverLink=link;renderIndicator();}});
      nav.addEventListener('pointerleave',function(){currentHoverLink=null;renderIndicator();});
      nav.addEventListener('focusin',function(event){var link=event.target.closest('a');if(link&&nav.contains(link)){currentHoverLink=link;renderIndicator();}});
      nav.addEventListener('focusout',function(event){if(!nav.contains(event.relatedTarget)){currentHoverLink=null;renderIndicator();}});
      window.addEventListener('resize',renderIndicator,{passive:true});
      if(window.ResizeObserver){new ResizeObserver(renderIndicator).observe(nav);}
    })();
    window.addEventListener('scroll',function(){repairMobileNavInvariant();syncHomeNavigation();},{passive:true});
    /* Recompute the active destination/indicator after Android browser chrome changes the visual viewport. */
    function refreshNavigationAfterViewportChange(){
      window.requestAnimationFrame(function(){
        repairMobileNavInvariant();
        if(currentPage==='home')syncHomeNavigation();
        else renderIndicator();
      });
    }
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize',refreshNavigationAfterViewportChange,{passive:true});
      window.visualViewport.addEventListener('scroll',refreshNavigationAfterViewportChange,{passive:true});
    }
    window.addEventListener('pageshow',refreshNavigationAfterViewportChange,{passive:true});
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(refreshNavigationAfterViewportChange).catch(function(){});}
    window.addEventListener('resize',function(){
      syncMobileNavBreakpoint();
      if(currentPage==='home'){
        syncHomeNavigation();
      } else {
        var routeSelector='a[data-route="'+currentPage+'"]';
        if(currentPage==='constructor') routeSelector='a[data-scroll="landing-constructor"]';
        if(currentPage==='catalog'||currentPage==='product'||currentPage==='product-coffee-constructor'||currentPage.indexOf('category-')===0||currentPage==='cart'||currentPage==='checkout') routeSelector='a[data-scroll="landing-products"]';
        if(currentPage==='development') routeSelector='a[data-scroll="landing-development"]';
        setPrimaryNavCurrent(routeSelector);
        renderIndicator();
      }
    });
    window.addEventListener('hashchange',function(){requestAnimationFrame(syncHomeNavigation);});
    document.getElementById('mobile-toggle').addEventListener('click',function(){requestAnimationFrame(syncHomeNavigation);});
        document.getElementById('theme-trigger').addEventListener('click',function(){setTimeout(function(){document.getElementById('theme-trigger').setAttribute('aria-expanded',String(document.getElementById('theme-control').open));},0);});
    document.addEventListener('click',function(event){if(!event.target.closest('#theme-control')){var d=document.getElementById('theme-control');if(d)d.open=false;var trigger=document.getElementById('theme-trigger');if(trigger)trigger.setAttribute('aria-expanded','false');}});
    document.addEventListener('keydown',function(event){if(event.key!=='Escape')return;var d=document.getElementById('theme-control');if(d)d.open=false;var trigger=document.getElementById('theme-trigger');if(trigger)trigger.setAttribute('aria-expanded','false');},true);
    function refreshThemeMenuStatus(){
      var mode=window.ArtifyTheme.getMode();
      var theme=window.ArtifyTheme.getTheme();
      document.querySelectorAll('[data-mode]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.mode===mode));});
      var trigger=document.getElementById('theme-trigger');
      if(trigger){trigger.title='Тема: '+labels[mode];trigger.setAttribute('aria-label','Цветовая тема. Выбрано: '+labels[mode]);}
      var status=document.getElementById('theme-menu-status');
      if(status) status.textContent='Выбрано: '+labels[mode]+'. Сейчас отображается '+(theme==='dark'?'тёмная':'светлая')+' тема.';
      var shell=document.querySelector('.checkout-v4-shell');if(shell)shell.dataset.theme=theme;
    }
    window.addEventListener('artify:theme-change',refreshThemeMenuStatus);
    document.addEventListener('change',function(event){var t=event.target;if(t.name==='buyer-type'){setBuyer(t.value);return;}if(t.name==='purchase-method'){setMethod(t.value);return;}if(t.id==='agree'){values.agree=t.checked?'yes':'';refreshSubmit();}});
    document.addEventListener('input',function(event){if(event.target.closest('#checkout-form')){var t=event.target;if(t.id) values[t.id]=t.value;refreshSubmit();}});
    document.addEventListener('focusout',function(event){var t=event.target;if(t.closest('#checkout-form') && t.id){values[t.id]=t.type==='checkbox'?(t.checked?'yes':''):t.value;touched[t.id]=true;refreshSubmit();}});
    document.addEventListener('submit',function(event){if(event.target.id!=='checkout-form')return;event.preventDefault();getFormValues();attemptedSubmit=true;if(!validForm()){['buyerName','email','companyName','taxId','agree'].forEach(function(key){touched[key]=true;});refreshSubmit();toast('Проверьте обязательные поля и согласие.');return;}if(purchaseMethod==='ONLINE'){checkoutStep='PAYMENT';render('checkout',{scroll:true});}else{currentPage='success';app.innerHTML='<section class="section"><div class="container"><div class="success-box"><div class="eyebrow">Локальный сценарий</div><h2>Запрос счёта показан.</h2><p>Запрос не был отправлен и не сохранён. Для рабочей версии требуется серверная обработка, уведомление и подтверждённая спецификация ALEN.</p><div class="actions"><a class="btn btn-accent" href="#product" data-route="product">Вернуться к ALEN</a><a class="btn" href="#home" data-route="home">На главную</a></div></div></div></section>';updateHeader();window.scrollTo({top:0,behavior:'smooth'});}});
    /* If the browser restores focus onto the home logo on reload, clear that stale focus.
       A deliberate keyboard Tab later enables the normal visible focus state. */
    (function clearRestoredHomeLogoFocus(){
      var homeLogo=document.querySelector('.site-header a.brand');
      if(homeLogo && document.activeElement===homeLogo) homeLogo.blur();
    })();

    /* Track navigation modality for the logo only. A browser-restored focus does not
       activate the outline on page load; deliberate Tab navigation restores it. */
    (function trackLogoKeyboardFocus(){
      var root=document.documentElement;
      document.addEventListener('keydown',function(event){
        if(event.key==='Tab') root.classList.add('artify-keyboard-navigation');
      },true);
      document.addEventListener('pointerdown',function(){
        root.classList.remove('artify-keyboard-navigation');
      },true);
    })();

    refreshThemeMenuStatus();restoreRouteFromLocation();requestAnimationFrame(syncHomeNavigation);
    // CarLifeGroup pattern: full consent notice until choice, then a small persistent settings button.
    (function(){
      var banner=document.getElementById('cookieConsent');
      var settingsTrigger=document.getElementById('cookieSettingsTrigger');
      var settings=document.getElementById('cookieSettings');
      var backdrop=document.getElementById('cookieBackdrop');
      var backToTop=document.getElementById('backToTop');
      var floatingGroup=document.getElementById('floatingControlsGroup');
      var analytics=document.getElementById('cookieAnalytics');
      var advertising=document.getElementById('cookieAdvertising');
      var key='artify-cookie-consent-v1';
      if(!banner || !settingsTrigger || !settings || !backdrop || !backToTop || !floatingGroup) return;
      function readConsent(){
        try {
          var value=JSON.parse(localStorage.getItem(key)||'null');
          if(value && value.necessary===true && typeof value.analytics==='boolean' && typeof value.advertising==='boolean') return value;
        } catch(_) {}
        return null;
      }
      function writeConsent(value){try{localStorage.setItem(key,JSON.stringify(value));}catch(_) {}}
      function applyConsent(value){
        if(analytics) analytics.checked=!!(value && value.analytics);
        if(advertising) advertising.checked=!!(value && value.advertising);
      }
      function showBanner(){banner.hidden=false;settingsTrigger.hidden=true;updateFloatingControls();}
      function hideBanner(){banner.hidden=true;settingsTrigger.hidden=false;updateFloatingControls();}
      function setSettings(open){
        settings.hidden=!open;
        backdrop.hidden=!open;
        document.body.classList.toggle('cookie-lock',!!open);
        if(open){setTimeout(function(){var close=settings.querySelector('[data-cookie-action="close-settings"]');if(close)close.focus();},0);}
      }
      function save(value){
        var consent={necessary:true,analytics:!!value.analytics,advertising:!!value.advertising};
        writeConsent(consent); applyConsent(consent); hideBanner(); setSettings(false);
      }
      var stored=readConsent();
      if(stored){applyConsent(stored);hideBanner();}else{applyConsent({analytics:false,advertising:false});showBanner();}
      document.addEventListener('click',function(event){
        var actionButton=event.target.closest('[data-cookie-action]'); if(!actionButton) return;
        var action=actionButton.getAttribute('data-cookie-action');
        if(action==='accept') save({analytics:true,advertising:true});
        else if(action==='reject') save({analytics:false,advertising:false});
        else if(action==='settings'){applyConsent(readConsent()||{analytics:false,advertising:false});setSettings(true);}
        else if(action==='close-settings') setSettings(false);
        else if(action==='save-settings') save({analytics:!!(analytics&&analytics.checked),advertising:!!(advertising&&advertising.checked)});
      });
      backdrop.addEventListener('click',function(){setSettings(false);});
      document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!settings.hidden)setSettings(false);});
      function updateFloatingControls(){
        backToTop.hidden=window.scrollY<=500;
        var wideLayout=window.matchMedia('(min-width:768px)').matches;
        var edge=window.matchMedia('(max-width:520px)').matches?10:16;
        if(wideLayout){
          backToTop.style.bottom='';
          floatingGroup.style.bottom='var(--floating-controls-footer-bottom)';
          if(backToTop.hidden||banner.hidden) return;
          var groupRect=floatingGroup.getBoundingClientRect(), wideBannerRect=banner.getBoundingClientRect();
          var groupOverlapsBanner=groupRect.left<wideBannerRect.right&&groupRect.right>wideBannerRect.left&&groupRect.top<wideBannerRect.bottom&&groupRect.bottom>wideBannerRect.top;
          if(groupOverlapsBanner) floatingGroup.style.bottom=(banner.offsetHeight+edge*2)+'px';
          return;
        }
        floatingGroup.style.bottom='';
        backToTop.style.bottom='var(--float-edge)';
        if(backToTop.hidden||banner.hidden) return;
        var buttonRect=backToTop.getBoundingClientRect(), bannerRect=banner.getBoundingClientRect();
        var overlaps=buttonRect.left<bannerRect.right&&buttonRect.right>bannerRect.left&&buttonRect.top<bannerRect.bottom&&buttonRect.bottom>bannerRect.top;
        if(overlaps) backToTop.style.bottom=(banner.offsetHeight+edge*2)+'px';
      }
      window.addEventListener('scroll',updateFloatingControls,{passive:true});
      window.addEventListener('resize',updateFloatingControls,{passive:true});
      if(window.ResizeObserver)new ResizeObserver(updateFloatingControls).observe(banner);
      backToTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
      updateFloatingControls();
    }());
  }());
  