import { fetchImages } from './js/pixabay-api.js';
import { galleryEl, renderImageCards } from '/js/render-functions.js';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import './js/scroll-to-up';
import errorIcon from './img/error.svg';

const searchFormEl = document.querySelector('.js-search-form');
const loadBtnEl = document.querySelector('.js-load-btn');
const loaderEl = document.querySelector('.js-loader');

let userQuery = null;
let page = 1;
const perPage = 15;
let totalPages = null;

const gallery = new SimpleLightbox('.js-img-list a', {
  captionsData: 'alt',
  captionDelay: 200,
});

const onFormSubmit = async event => {
  event.preventDefault();

  galleryEl.innerHTML = '';

  loadBtnEl.classList.add('hidden');

  userQuery = searchFormEl.elements.search_request.value.trim();

  if (userQuery === '') {
    iziToast.show({
      message: 'Please enter your request!',
      position: 'topRight',
    });

    galleryEl.innerHTML = '';

    return;
  }

  loaderEl.classList.remove('hidden');

  try {
    page = 1;

    const { data } = await fetchImages(userQuery, page, perPage);

    totalPages = Math.ceil(data.totalHits / perPage);

    if (data.total === 0) {
      loaderEl.classList.add('hidden');

      iziToast.show({
        iconUrl: errorIcon,
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        maxWidth: '432px',
        backgroundColor: '#ef4040',
        theme: 'dark',
        messageColor: '#ffffff',
      });

      galleryEl.innerHTML = '';

      searchFormEl.reset();

      return;
    }

    renderImageCards(data.hits);
    gallery.refresh();

    searchFormEl.reset();

    loaderEl.classList.add('hidden');

    if (totalPages > 1) {
      loadBtnEl.classList.remove('hidden');
      loadBtnEl.addEventListener('click', onBtnClick);
    } else {
      iziToast.info({
        message:
          'We are sorry, but you have reached the end of search results.',
        position: 'topRight',
      });
    }
  } catch (err) {
    iziToast.error({
      message: err.message,
      position: 'topRight',
    });
  }
};

const onBtnClick = async () => {
  try {
    loaderEl.classList.remove('hidden');
    loadBtnEl.classList.add('hidden');

    page++;

    const { data } = await fetchImages(userQuery, page, perPage);

    renderImageCards(data.hits);
    gallery.refresh();

    const { height } = document
      .querySelector('.js-item')
      .getBoundingClientRect();
    window.scrollBy({ top: height * 2.5, behavior: 'smooth' });

    if (page === totalPages) {
      loaderEl.classList.add('hidden');
      loadBtnEl.classList.add('hidden');
      loadBtnEl.removeEventListener('click', onBtnClick);

      iziToast.info({
        message:
          'We are sorry, but you have reached the end of search results.',
        position: 'topRight',
      });

      return;
    }

    loaderEl.classList.add('hidden');
    loadBtnEl.classList.remove('hidden');
  } catch (err) {
    iziToast.error({
      message: err.message,
      position: 'topRight',
    });
  }
};

searchFormEl.addEventListener('submit', onFormSubmit);
