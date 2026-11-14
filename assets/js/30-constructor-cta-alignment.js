
(function () {
  'use strict';
  var rows = Array.prototype.slice.call(document.querySelectorAll('.landing-constructor-bottom-row'));
  var constructorRow = rows[0];
  var heroCta = document.querySelector('.af-hero-actions > .btn-accent');
  if (!rows.length || !constructorRow || !heroCta) return;

  var stubMedia = window.matchMedia('(max-width: 900px)');
  var stubCtas = Array.prototype.slice.call(constructorRow.querySelectorAll('[data-landing-constructor-stub-cta]'));
  function updateStubState() {
    var isStub = stubMedia.matches;
    stubCtas.forEach(function (cta) {
      if (isStub) cta.setAttribute('aria-disabled', 'true');
      else cta.removeAttribute('aria-disabled');
    });
  }
  constructorRow.addEventListener('click', function (event) {
    var cta = event.target.closest('[data-landing-constructor-stub-cta]');
    if (!cta || !stubMedia.matches) return;
    event.preventDefault();
    event.stopPropagation();
  });
  updateStubState();
  if (typeof stubMedia.addEventListener === 'function') stubMedia.addEventListener('change', updateStubState);
  else if (typeof stubMedia.addListener === 'function') stubMedia.addListener(updateStubState);

  var queued = false;
  function align() {
    queued = false;
    if (window.innerWidth <= 1100) {
      rows.forEach(function (row) { row.style.removeProperty('--constructor-cta-offset'); });
      return;
    }
    var heroRect = heroCta.getBoundingClientRect();
    rows.forEach(function (row) {
      var rowRect = row.getBoundingClientRect();
      var offset = Math.max(0, heroRect.left - rowRect.left);
      var value = (Math.round(offset * 10) / 10) + 'px';
      if (row.style.getPropertyValue('--constructor-cta-offset') !== value) {
        row.style.setProperty('--constructor-cta-offset', value);
      }
    });
  }
  function schedule() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(align);
  }
  window.addEventListener('resize', schedule, { passive: true });
  if ('ResizeObserver' in window) {
    var observer = new ResizeObserver(schedule);
    rows.forEach(function (row) { observer.observe(row); });
    observer.observe(heroCta);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  schedule();
}());
