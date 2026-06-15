import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// Pixabay API anahtarınız
const API_KEY = "4823621-792051e21e56534e6ae2e472f";
const BASE_URL = "https://pixabay.com/api/";

const searchForm = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loaderContainer = document.querySelector(".loader-container");

// SimpleLightbox kurulumu
let lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});

// Form gönderildiğinde tetiklenecek olay
searchForm.addEventListener("submit", handleSearch);

function handleSearch(event) {
  // 1. Tarayıcının sayfayı yenilemesini kesinlikle engelliyoruz
  event.preventDefault();

  const form = event.currentTarget;
  // 2. Input kutusuna yazılan kelimeyi alıyoruz (dog, cat vs.)
  const searchQuery = form.elements.searchQuery.value.trim();

  // Boş arama kontrolü
  if (searchQuery === "") {
    iziToast.warning({
      message: "Please enter a search keyword!",
      position: "topRight",
    });
    return;
  }

  // 3. Yeni arama başladığı için galeriyi temizle ve yükleniyor animasyonunu göster
  gallery.innerHTML = "";
  showLoader();

  // API'ye gidecek dinamik parametreler
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: searchQuery, // 👈 Yazdığınız kelime buraya gidiyor
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  });

  // Fetch isteği
  fetch(`${BASE_URL}?${searchParams}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((data) => {
      // Görsel bulunamadıysa uyarı ver
      if (data.hits.length === 0) {
        iziToast.error({
          message: "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
        return;
      }

      // Görselleri tek seferde HTML formatına çevir ve galerinin içine bas
      const markup = createGalleryMarkup(data.hits);
      gallery.innerHTML = markup;

      // Galeriyi her doldurduğumuzda lightbox'ı yenile (büyütme modali için)
      lightbox.refresh();
    })
    .catch((error) => {
      console.error(error);
      iziToast.error({
        message: "Something went wrong. Please try again later.",
        position: "topRight",
      });
    })
    .finally(() => {
      // İşlem bitince yükleyiciyi gizle ve input kutusunu temizle
      hideLoader();
      form.reset();
    });
}

// Resim kartlarının HTML yapısını oluşturan fonksiyon
function createGalleryMarkup(images) {
  return images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
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
    .join("");
}

function showLoader() {
  loaderContainer.classList.remove("is-hidden");
}

function hideLoader() {
  loaderContainer.classList.add("is-hidden");
}
