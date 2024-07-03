const queuedForm = document.querySelector('#queued-form');
const queuedSection = document.querySelector('.queued-section');
const inputSections = document.querySelectorAll('.input-section');
const inputs = document.querySelectorAll('.input-section input');
const serverMessage = document.querySelector('.server-message');

const queuedImagesArray = [];

// QUEUED IN FRONT-END IMAGES
function deleteQueuedImage(id) {
  queuedImagesArray.splice(id, 1);
  displayQueuedImages();
}

function displayQueuedImages() {
  let images = '';

  queuedImagesArray.forEach((image, i) => {
    images += `
      <section class="image">
        <img src="${URL.createObjectURL(image)}" alt="image">
        <span class="delete-image">&times;</span>
      </section>
    `
  });

  queuedSection.innerHTML = images;
  addEventListenerToElts('.delete-image', deleteQueuedImage);
}

function addEventListenerToElts(elt, callback) {
  const elts = document.querySelectorAll(elt);

  elts.forEach((elt, id) => elt.addEventListener('click', () => callback(id)))
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

function imageToBase64(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(image);
  })
}

// With button mode
inputs.forEach(input => {
  input.addEventListener('change', async () => {
    const file = input.files[0];

    if (file.size > 1_000_000) {
      alert('fichier trop volumineux !');
      input.value = '';
      return;
    }
    
    if (queuedImagesArray.every(image => image.name !== file.name)) {
      queuedImagesArray.push(file);
    }
    
    queuedForm.reset();
    // displayQueuedImages();
    console.log(file);
    const base64 = await imageToBase64(file);
    queuedSection.innerHTML = `
      <img src="${base64.result}" alt="none" />
    `;
    console.log(base64);
  })
})

// Drag & Drop mode
// inputSections.forEach(section => {
//   section.addEventListener('drop', e => {
//     e.preventDefault();
    
//     const files = e.dataTransfer.files;
    
//     for (let i = 0; i < files.length; i++) {
//       if (!files[i].type.match('image')) continue;
//       if (queuedImagesArray.every(image => image.name !== files[i].name)) {
//         queuedImagesArray.push(files[i]);
//       }
//     }
    
//     displayQueuedImages();
//   })
// })

queuedForm.addEventListener('submit', e => {
  e.preventDefault();
  sendQueuedImagesToServer();
})