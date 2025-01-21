import axios from 'axios';

export function fetchImages(searchedQuery, page, perPage) {
  const searchParams = new URLSearchParams({
    key: '48238539-5c4f953a21d3e608577efa510',
    q: searchedQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  });

  return axios.get(`https://pixabay.com/api/?${searchParams}`);
}
