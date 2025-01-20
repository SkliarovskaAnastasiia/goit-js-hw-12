const arrowEl = document.querySelector('.js-arrow');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    arrowEl.classList.add('is-shown');
  } else {
    arrowEl.classList.remove('is-shown');
  }
});
