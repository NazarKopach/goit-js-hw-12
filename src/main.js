import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import { createGalleryCard } from './js/render-functions';
import { fetchPhotos } from './js/pixabay-api';

const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const btnLoadMore = document.querySelector('.load-more-btn');

let searchValue = '';
let currentPage = 1;
let totalHits = 0;
let loadedHits = 0;
let cardHeight = 0;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const onSearchFormSubmit = async event => {
  try {
    event.preventDefault();

    searchValue = searchForm.elements.user_query.value.trim();

    if (!searchValue) {
      galleryEl.innerHTML = '';
      searchForm.reset();
      return;
    }

    currentPage = 1;
    totalHits = 0;
    loadedHits = 0;
    galleryEl.innerHTML = '';
    searchForm.reset();
    loader.classList.remove('is-hidden');

    const response = await fetchPhotos(searchValue, currentPage);

    if (response.data.hits.length === 0) {
      iziToast.error({
        message:
          'There are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      btnLoadMore.classList.add('is-hidden');
      loader.classList.add('is-hidden');
      return;
    }

    totalHits = response.data.totalHits;
    loadedHits = response.data.hits.length;

    const galleryCardsTemplate = response.data.hits
      .map(imgDetails => createGalleryCard(imgDetails))
      .join('');
    galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate);
    lightbox.refresh();

    const galleryCardEl = galleryEl.querySelector('li');
    cardHeight = galleryCardEl.getBoundingClientRect().height;

    if (loadedHits < totalHits) {
      btnLoadMore.classList.remove('is-hidden');
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      btnLoadMore.classList.add('is-hidden');
    }

  } catch (err) {
    console.log(err);
  } finally {
    loader.classList.add('is-hidden');
  }
};

const onLoadMoreClick = async event => {
  try {
    currentPage++;

    const response = await fetchPhotos(searchValue, currentPage);

    loadedHits += response.data.hits.length;

    const galleryCardsTemplate = response.data.hits
      .map(imgDetails => createGalleryCard(imgDetails))
      .join('');
    galleryEl.insertAdjacentHTML('beforeend', galleryCardsTemplate);
    lightbox.refresh();

    scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    })

    if (loadedHits >= totalHits) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      btnLoadMore.classList.add('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
};

searchForm.addEventListener('submit', onSearchFormSubmit);
btnLoadMore.addEventListener('click', onLoadMoreClick);
