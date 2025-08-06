// ✨ 전체 코드 리팩토링: 드래그/드롭 + 자동 폴더링 + 번호 + firebase 저장 (향후 확장 가능)

const board = document.getElementById("board");
let cardCount = 0;
let draggingCard = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function createCard(content = "새 카드") {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.style.left = Math.random() * 500 + "px";
  card.style.top = Math.random() * 300 + "px";
  card.style.position = "absolute";

  card.innerHTML = `<strong>#${++cardCount}</strong><br><div contenteditable="true">${content}</div>`;

  // drag events
  card.addEventListener("dragstart", (e) => {
    draggingCard = card;
    dragOffsetX = e.offsetX;
    dragOffsetY = e.offsetY;
    setTimeout(() => card.style.opacity = "0.5", 0);
  });

  card.addEventListener("dragend", (e) => {
    card.style.opacity = "1";
    const x = e.pageX - dragOffsetX;
    const y = e.pageY - dragOffsetY;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    draggingCard = null;

    checkForFoldering(card);
  });

  board.appendChild(card);
}

function checkForFoldering(card) {
  const cards = document.querySelectorAll(".card");
  cards.forEach((target) => {
    if (target === card) return;

    const rect1 = card.getBoundingClientRect();
    const rect2 = target.getBoundingClientRect();

    const isOverlap = !(rect1.right < rect2.left ||
                        rect1.left > rect2.right ||
                        rect1.bottom < rect2.top ||
                        rect1.top > rect2.bottom);

    if (isOverlap) {
      makeFolder([card, target]);
    }
  });
}

function makeFolder(cards) {
  const folder = document.createElement("div");
  folder.className = "card folder";
  folder.innerHTML = `<strong>📁 폴더 (${cards.length})</strong>`;
  folder.style.position = "absolute";
  folder.style.left = cards[0].style.left;
  folder.style.top = cards[0].style.top;

  cards.forEach(c => c.remove());
  board.appendChild(folder);
}

// 초기화 버튼 연결
window.createCard = createCard;

// 스타일 추가
const style = document.createElement('style');
style.innerHTML = `
  #board { position: relative; min-height: 600px; }
  .card {
    width: 150px;
    height: 120px;
    background: #fffb99;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border-radius: 8px;
    margin: 5px;
    cursor: move;
    position: absolute;
  }
  .folder {
    background: #d0e6ff;
  }
  .card[contenteditable="true"]:focus {
    outline: none;
  }
`;
document.head.appendChild(style);

// 테스트용 초기 카드
createCard("처음 아이디어");
createCard("또 다른 생각");
