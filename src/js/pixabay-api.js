export const searchFormEl = document.querySelector('.js-search-form');

export function fetchImages(searchedQuery) {
  const searchParams = new URLSearchParams({
    key: '48238539-5c4f953a21d3e608577efa510',
    q: searchedQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 102,
  });

  return fetch(`https://pixabay.com/api/?${searchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}
