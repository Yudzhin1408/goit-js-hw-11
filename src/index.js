import galleryCard from './templares/gallery.hbs';
import ButtonPlusDataServer from './js/button';
import Server from './js/server';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const throttle = require('lodash.throttle');
const NewButtonPlusDataServer = new ButtonPlusDataServer();
const NewServer = new Server();

let totalMax = 0;
let totalMin = 0;
let total = 0;

const ref = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};

ref.form.addEventListener('submit', submitForm);
ref.button.addEventListener('click', addPhoto);
ref.gallery.addEventListener('click', () => {
  event.preventDefault();
  console.log(event.target.nodeName);
});

const galleryBig = new SimpleLightbox('.photo-card a');
galleryBig.on('show.simplelightbox', () => {
  galleryBig.defaultOptions.captionDelay = 250;
});


async function addPhoto() {
  NewButtonPlusDataServer.buttonPreLoadung();
  NewServer.page += 1;

  await weDrawHtml();
  if (totalMax > 0) {
    noMore();
  }

}

async function generatorHtml() {
  ref.gallery.innerHTML = '';
  return weDrawHtml();
}

async function weDrawHtml() {
  const data = await NewServer.serverData();
  const hits = await data.hits;
  total += hits.length;
  totalMax = data.totalHits;
  totalMin = hits.length;

  if (totalMin === 0) {
    NewButtonPlusDataServer.buttonNoMoreHope();
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  NewButtonPlusDataServer.buttonLoadung();
  const arr = await hits.map(galleryCard);
  ref.gallery.insertAdjacentHTML('beforeend', arr.join(''));
  galleryBig.refresh();
}


function submitForm() {
  event.preventDefault();
  total = 0;
  totalMax = 0;
  totalMin = 0;
  const {
    elements: { searchQuery },
  } = event.currentTarget;
  NewServer.name = searchQuery.value;
  NewServer.page = 1;

  NewButtonPlusDataServer.buttonShow();
  NewButtonPlusDataServer.buttonPreLoadung();
  generatorHtml()
    .then(() => {
      if (totalMax > 0) {
        noMore();
      }
    })
    .then(() => {
      if (totalMax > 0) {
        Notify.success(`Hooray! We found ${totalMax} images.`);
      }
    });
}

function noMore() {
  if (totalMax === total || totalMin < 20) {
    NewButtonPlusDataServer.buttonNoMoreHope();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
throttle;

