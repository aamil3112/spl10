import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getDatabase, ref, set, get, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js"

//replace with your own firebase config!
const app = initializeApp({});

const rtDatabase = getDatabase(app);
const firestore = getFirestore(app);

const form = document.getElementById("registration");

form.addEventListener("submit", function(event) {
  event.preventDefault();
  const button = document.querySelector(".submit-btn");
  const name = toTitleCase(document.getElementById("name").value.trim());
  const branch = document.getElementById("branch").value.toUpperCase();
  const id = document.getElementById("rollNo").value;
  const phoneNo = document.getElementById("phoneNo").value.replace(/\s/g, "").slice(-10);
  const email = document.getElementById("email").value;

  //required fields: name, branch, id, phoneNo, email: done!
  if (id.length != 8 || isNaN(id)) { 
    displayWarning(warnRoll);
    return;
  }
  if (phoneNo.length != 10 || isNaN(phoneNo)) {
    displayWarning(warnPhone);
    return;
  }
  button.classList.toggle("submit-btn-loading");
  button.innerHTML = `<div class="loader-wrapper"><div class="mechanics"></div></div>`;
  button.disabled = true;
  
  get(ref(rtDatabase, `users/${id}`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      displayMessage(msgAlreadyDone);
      form.reset();
    } else {

      const newData = {
        name: name,
        branch: branch,
        roll: id,
        mobile: phoneNo,
        email: email
      };
  
      set(ref(rtDatabase, `users/${id}`), newData)
        .then(() => {
          setDoc(doc(firestore, 'users', id), newData)
            .then(() =>{
              displayMessage(msgSuccess);
              form.reset();
            })
        })
        .catch((error) => {
          console.error(error);
          get(ref(rtDatabase, `users/${id}`))
            .then((snapshot) => {
            if (snapshot.exists()) {
              remove(ref(rtDatabase, `users/${id}`))
            }
          });
          displayMessage(msgFailure);
        });
    }
  })
  .catch((error) => {
    displayMessage(msgFailure);
    console.error(error);
  });
});

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s|-)\w/g, function(match) {
    return match.toUpperCase();
  });
}
document.getElementById("name").addEventListener("input", function(event) {
  event.target.value = toTitleCase(event.target.value);
});
document.getElementById("branch").addEventListener("input", function(event) {
  event.target.value = event.target.value.toUpperCase();
});

const msgSuccess = `
  <div class="reg-message">
  <p><i class="fa-solid fa-circle-check"></i> Registration Successful!</p>
  <p> Join Our <a href="https://chat.whatsapp.com/GkYvShsxSdpJrhmw3xJljv" target="_blank">WhatsApp Group</a><i class="fa-solid fa-link"></i></p>
  <p> Join Our <a href="https://discord.gg/GC3qcUvkA5" target="_blank">Discord</a><i class="fa-solid fa-link"></i></p>
  <p> Join Our <a href="https://t.me/+G3mxLby_mYEyOTll" target="_blank">Telegram</a><i class="fa-solid fa-link"></i></p>
  </div>
`;
const msgFailure = `
  <div class="reg-message">
  <p><i class="fa-solid fa-circle-xmark"></i> Registration failed!</p>
  <p>Registrations are closed now. Sorry for your inconvenience.</p>
  </div>
`;
const msgAlreadyDone = `
  <div class="reg-message">
  <p><i class="fa-solid fa-circle-exclamation"></i> You've already registered!</p>
  <p> Our <a href="https://chat.whatsapp.com/GkYvShsxSdpJrhmw3xJljv" target="_blank">WhatsApp Group</a><i class="fa-solid fa-link"></i></p>
  <p> Our <a href="https://discord.gg/GC3qcUvkA5" target="_blank">Discord</a><i class="fa-solid fa-link"></i></p>
  <p> Our <a href="https://t.me/+G3mxLby_mYEyOTll" target="_blank">Telegram</a><i class="fa-solid fa-link"></i></p>
  </div>
`;
const warnRoll = `
<p><i class="fa-solid fa-circle-exclamation"></i> Aw Snap! Invalid roll no.</p>
`;
const warnPhone = `
<p><i class="fa-solid fa-circle-exclamation"></i> Aw Snap! Invalid phone no.</p>
`;

function displayMessage(message) {
  const messageElement = document.querySelector(".reg-item-form");
  messageElement.innerHTML = message;
}
function displayWarning(message) {
  const messageElement = document.querySelector(".reg-warning");
  messageElement.innerHTML = message;
}
