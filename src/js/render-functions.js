export const galleryEl = document.querySelector('.js-img-list');

function createImageCard(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  return `<li class="img-list-item js-item">
        <a href="${largeImageURL}" class="gallery-link">
          <img class="img" src="${webformatURL}" alt="${tags}" width="360" />
          <div class="info-wrapper">
            <div class="img-info">
              <p class="label">Likes</p>
              <p class="value">${likes}</p>
            </div>
            <div class="img-info">
              <p class="label">Views</p>
              <p class="value">${views}</p>
            </div>
            <div class="img-info">
              <p class="label">Comments</p>
              <p class="value">${comments}</p>
            </div>
            <div class="img-info">
              <p class="label">Downloads</p>
              <p class="value">${downloads}</p>
            </div>
          </div>
        </a>
      </li>`;
}

export function renderImageCards(images) {
  const galleryTemplate = images.map(image => createImageCard(image)).join('');
  galleryEl.innerHTML = galleryTemplate;
}
