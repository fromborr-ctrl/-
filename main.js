function createCard() {
  const board = document.getElementById("board");
  const card = document.createElement("div");
  card.className = "card";
  card.contentEditable = true;
  card.innerText = "새 카드";
  board.appendChild(card);
}

window.createCard = createCard;
