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
  page = 1;

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

    page += 1;

    loaderEl.classList.add('hidden');
    loadBtnEl.classList.remove('hidden');

    searchFormEl.reset();

    gallery.refresh();
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

    const { data } = await fetchImages(userQuery, page, perPage);

    renderImageCards(data.hits);
    gallery.refresh();

    const cardEl = document.querySelector('.js-item');

    const { height } = cardEl.getBoundingClientRect();
    window.scrollBy({ top: height * 2.5, behavior: 'smooth' });

    page += 1;

    if (page > totalPages) {
      iziToast.info({
        message: 'We are sorry but you have reached the end of search results.',
        position: 'topRight',
      });

      loaderEl.classList.add('hidden');
      loadBtnEl.classList.add('hidden');

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
loadBtnEl.addEventListener('click', onBtnClick);
