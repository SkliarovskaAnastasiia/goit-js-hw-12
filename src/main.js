import { searchFormEl, fetchImages } from './js/pixabay-api.js';
import { galleryEl, renderImageCards } from '/js/render-functions.js';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import './js/scroll-to-up';
import errorIcon from './img/error.svg';

const loaderEl = document.querySelector('.js-loader');

const onFormSubmit = event => {
  event.preventDefault();

  galleryEl.innerHTML = '';

  const userQuery = searchFormEl.elements.search_request.value.trim();

  if (userQuery === '') {
    iziToast.show({
      message: 'Please enter your request!',
      position: 'topRight',
    });

    galleryEl.innerHTML = '';

    return;
  }

  loaderEl.classList.remove('hidden');

  fetchImages(userQuery)
    .then(imagesData => {
      if (imagesData.hits.length === 0) {
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

      renderImageCards(imagesData.hits);

      loaderEl.classList.add('hidden');

      searchFormEl.reset();

      new SimpleLightbox('.js-img-list a', {
        captionsData: 'alt',
        captionDelay: 200,
      }).refresh();
    })
    .catch(err =>
      iziToast.error({
        message: err.message,
        position: 'topRight',
      })
    );
};

searchFormEl.addEventListener('submit', onFormSubmit);
