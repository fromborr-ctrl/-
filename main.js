// main.js
let board = document.getElementById("board");
let cards = [];
let folders = [];
let currentView = "board"; // 'board' or folder id

let cardCount = 0;

function createCard(text = "새 카드") {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.contentEditable = true;
  card.dataset.id = `card-${++cardCount}`;
  card.dataset.type = "card";
  card.innerText = text;

  addDragDropEvents(card);
  cards.push(card);
  render();
}

function addDragDropEvents(el) {
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", el.dataset.id);
  });

  el.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  el.addEventListener("drop", (e) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");
    const source = cards.find((c) => c.dataset.id === sourceId);

    if (source && source !== el) {
      createFolder([source, el]);
    }
  });
}

function createFolder(contents) {
  const folderId = `folder-${Date.now()}`;
  const folder = document.createElement("div");
  folder.className = "card folder";
  folder.innerText = "폴더 열기";
  folder.dataset.id = folderId;
  folder.dataset.type = "folder";
  folder.addEventListener("dblclick", () => openFolder(folderId));

  folders.push({ id: folderId, items: contents });
  cards = cards.filter((c) => !contents.includes(c));
  cards.push(folder);
  render();
}

function openFolder(folderId) {
  currentView = folderId;
  render();
}

function closeFolder() {
  currentView = "board";
  render();
}

function render() {
  board.innerHTML = "";

  if (currentView === "board") {
    folders.forEach((folder) => {
      const folderEl = document.createElement("div");
      folderEl.className = "card folder";
      folderEl.innerText = `#${getCardIndex(folder.id)} 폴더 열기`;
      folderEl.dataset.id = folder.id;
      folderEl.dataset.type = "folder";
      folderEl.addEventListener("dblclick", () => openFolder(folder.id));
      addDragDropEvents(folderEl);
      board.appendChild(folderEl);
    });

    cards.forEach((card, i) => {
      card.innerText = `#${getCardIndex(card.dataset.id)} ${card.innerText.replace(/^#\d+\s/, "")}`;
      board.appendChild(card);
    });
  } else {
    const folder = folders.find((f) => f.id === currentView);
    const backBtn = document.createElement("button");
    backBtn.innerText = "🔙 뒤로 가기";
    backBtn.onclick = closeFolder;
    board.appendChild(backBtn);

    folder.items.forEach((item) => {
      item.innerText = item.innerText.replace(/^#\d+\s/, "");
      board.appendChild(item);
    });
  }
  updateOrder();
}

function updateOrder() {
  const all = [...folders.map(f => f.id), ...cards.map(c => c.dataset.id)];
  all.forEach((id, idx) => {
    const el = [...folders, ...cards].find(x => x.dataset?.id === id || x.id === id);
    if (el?.dataset?.type === "card") {
      el.innerText = `#${idx + 1} ${el.innerText.replace(/^#\d+\s/, "")}`;
    } else if (el?.dataset?.type === "folder") {
      el.innerText = `#${idx + 1} 폴더 열기`;
    }
  });
}

document.getElementById("addCardBtn").onclick = () => createCard();
