import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB55FLGruyHNwxhI1LFEjxuiN9AYVS4JTY",
  authDomain: "corkboard-588ee.firebaseapp.com",
  projectId: "corkboard-588ee",
  storageBucket: "corkboard-588ee.appspot.com",
  messagingSenderId: "396106577962",
  appId: "1:396106577962:web:6ef0c17097d58e7cc02b53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const board = document.getElementById("board");

async function createCard() {
  const cardText = prompt("카드 내용을 입력하세요:");
  if (cardText) {
    const docRef = await addDoc(collection(db, "card"), { text: cardText });
    renderCard({ id: docRef.id, text: cardText });
  }
}

function renderCard(cardData) {
  const div = document.createElement("div");
  div.className = "card";
  div.innerText = cardData.text;
  board.appendChild(div);
}

async function loadCards() {
  const querySnapshot = await getDocs(collection(db, "card"));
  querySnapshot.forEach((doc) => {
    renderCard({ id: doc.id, ...doc.data() });
  });
}

window.createCard = createCard;
loadCards();
