const input = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const playlistDiv = document.getElementById("playlist");
const songCount = document.getElementById("songCount");
const quickButtons = document.querySelectorAll(".quick-menu button");

let debounceTimer;
let controller;

let currentAudio = null;
let currentId = null;

let playlist = JSON.parse(localStorage.getItem("playlist")) || [];

quickButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    quickButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const query = btn.dataset.q;
    input.value = query;
    search(query);
  });
});

input.addEventListener("input", () => {
  const q = input.value.trim();

  clearTimeout(debounceTimer);
  if (controller) controller.abort();

  if (!q) {
    resultsDiv.innerHTML = "";
    return;
  }

  debounceTimer = setTimeout(() => search(q), 400);
});

async function search(q) {
  controller = new AbortController();

  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(q + " song")}&country=IN&entity=song&limit=15`,
    { signal: controller.signal }
  );

  const data = await res.json();
  renderResults(data.results);
}

function renderResults(items) {
  resultsDiv.innerHTML = items.map((item, i) => {
    const id = "res_" + i;

    return `
      <div class="card">
        <img src="${item.artworkUrl100}">
        <div class="info">
          <h4>${item.trackName}</h4>
          <p>${item.artistName}</p>
        </div>
        <button class="play" onclick="playAudio('${item.previewUrl}','${id}',this)">▶</button>
        <button class="add" onclick="addToPlaylist('${item.trackName}','${item.artistName}','${item.previewUrl}',this)">Add</button>
      </div>
    `;
  }).join("");
}

function playAudio(url, id, btn) {
  if (!url) return;

  const isSame = currentId === id;

  document.querySelectorAll(".play").forEach(b => {
    b.innerHTML = "▶";
    b.classList.remove("playing");
  });

  if (isSame && currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
      btn.innerHTML = "❚❚";
      btn.classList.add("playing");
    } else {
      currentAudio.pause();
      btn.innerHTML = "▶";
      btn.classList.remove("playing");
    }
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(url);
  currentId = id;

  currentAudio.play();

  btn.innerHTML = "❚❚";
  btn.classList.add("playing");

  currentAudio.onended = () => {
    btn.innerHTML = "▶";
    btn.classList.remove("playing");
  };
}

function addToPlaylist(title, artist, url, btn) {
  const exists = playlist.find(s => s.title === title);

  if (exists) {
    btn.innerText = "✓";
    return;
  }

  playlist.push({ title, artist, url });
  localStorage.setItem("playlist", JSON.stringify(playlist));

  btn.innerText = "✓";
  renderPlaylist();
}

function renderPlaylist() {
  songCount.innerText = playlist.length + " songs saved";

  playlistDiv.innerHTML = playlist.map((s, i) => {
    const id = "pl_" + i;

    return `
      <div class="card">
        <div class="info">
          <h4>${s.title}</h4>
          <p>${s.artist}</p>
        </div>
        <button class="play" onclick="playAudio('${s.url}','${id}',this)">▶</button>
        <button class="delete" onclick="removeSong(${i})">Remove</button>
      </div>
    `;
  }).join("");
}

function removeSong(i) {
  playlist.splice(i, 1);
  localStorage.setItem("playlist", JSON.stringify(playlist));
  renderPlaylist();
}

renderPlaylist();