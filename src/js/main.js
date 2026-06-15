import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '4823621-792051e21e56534e6ae2e472f';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loaderContainer = document.querySelector('.loader-container');

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const searchQuery = form.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    iziToast.warning({
      message: 'Please enter a search keyword!',
      position: 'topRight',
    });
    return;
  }

  gallery.innerHTML = '';
  showLoader();

  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  fetch(`${BASE_URL}?${searchParams}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      const markup = createGalleryMarkup(data.hits);
      gallery.innerHTML = markup;

      lightbox.refresh();
    })
    .catch(error => {
      console.error(error);
      iziToast.error({
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
      });
    })
    .finally(() => {
      hideLoader();
      form.reset();
    });
}

function createGalleryMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="info-box">
        <p class="info-item"><b>Likes</b><br>${likes}</p>
        <p class="info-item"><b>Views</b><br>${views}</p>
        <p class="info-item"><b>Comments</b><br>${comments}</p>
        <p class="info-item"><b>Downloads</b><br>${downloads}</p>
      </div>
    </li>
  `
    )
    .join('');
}

function showLoader() {
  loaderContainer.classList.remove('is-hidden');
}

function hideLoader() {
  loaderContainer.classList.add('is-hidden');
}
