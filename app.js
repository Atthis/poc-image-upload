import loadMime from "./mimeChecker.js";

const queuedForm = document.querySelector('#queued-form');
const queuedSection = document.querySelector('.queued-section');
const inputSections = document.querySelectorAll('.input-section');
const inputs = document.querySelectorAll('.input-section input');
const serverMessage = document.querySelector('.server-message');

const queuedImagesArray = [];

// QUEUED IN FRONT-END IMAGES
function displayQueuedImages() {
  let images = '';

  queuedImagesArray.forEach((image, i) => {
    images += `
      <section class="image">
        <img src="${URL.createObjectURL(image)}" alt="image">
        <span onclick="deleteQueuedImage(${i})">&times;</span>
      </section>
    `
  });

  queuedSection.innerHTML = images;
}

function deleteQueuedImage(id) {
  queuedImagesArray.splice(id, 1);
  displayQueuedImages();
}

function sendQueuedImagesToServer() {
  const formData = new FormData(queuedForm);

  queuedImagesArray.forEach((image, i) => {
    formData.append(`file[${i}]`, image);
  })

  fetch('upload', {
    method: "POST",
    body: formData
  })
  .then(res => {
    if(res.status !== 200) {
      throw Error(res.statusText);
    }
    location.reload();
  })
  .catch(err => {
    serverMessage.innerHTML = err;
    serverMessage.style.color = '#b71c1c';
    serverMessage.style.backgroundColor = '#f8d7da';
  })
}

inputs.forEach(input => {
  input.addEventListener('change', () => {
  loadMime(input.files[0], infos => console.log(infos))

  const files = input.files;
  
  for (let i = 0; i < files.length; i++) {
    if (queuedImagesArray.every(image => image.name !== files[i].name)) {
      queuedImagesArray.push(files[i]);
    }
  }
  

  queuedForm.reset();
  displayQueuedImages();
  })
})

inputSections.forEach(section => {
  section.addEventListener('drop', e => {
  e.preventDefault();
  
  const files = e.dataTransfer.files;
  
  for (let i = 0; i < files.length; i++) {
    if (!files[i].type.match('image')) continue;
    if (queuedImagesArray.every(image => image.name !== files[i].name)) {
      queuedImagesArray.push(files[i]);
    }
  }
  
  displayQueuedImages();
  })
})

queuedForm.addEventListener('submit', e => {
  e.preventDefault();
  sendQueuedImagesToServer();
})