/* Artify Factory · switch supplied favicon assets with the active site theme. */
(function () {
  'use strict';
  var files = {
    ico: document.getElementById('siteFaviconIco'),
    png16: document.getElementById('siteFavicon16'),
    png32: document.getElementById('siteFavicon32')
  };
  function syncFavicon() {
    var theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    if (files.ico) files.ico.href = 'assets/favicons/' + theme + '/favicon.ico?v=46-30-19';
    if (files.png16) files.png16.href = 'assets/favicons/' + theme + '/favicon-16x16.png?v=46-30-19';
    if (files.png32) files.png32.href = 'assets/favicons/' + theme + '/favicon-32x32.png?v=46-30-19';
  }
  syncFavicon();
  window.addEventListener('artify:theme-change', syncFavicon);
}());
