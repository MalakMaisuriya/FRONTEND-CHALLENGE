let state = {
  playerName: "Adventurer",
  level: 1,
  xp: 0,
  coins: 100,
  stats: {
    strength: 10,
    intelligence: 10,
    charisma: 10,
    creativity: 10
  },
  tasks: []
};

let editIndex = null;

function saveState() {
  localStorage.setItem("questManagerState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("questManagerState");
  if (saved) state = JSON.parse(saved);
}

function openModal(id) {
  document.getElementById(id).classList.add("active");
  document.body.style.overflow = "hidden";

  document.getElementById("modalTitle").textContent =
    editIndex !== null ? "Edit Quest" : "New Quest";

  document.getElementById("submitBtn").textContent =
    editIndex !== null ? "Update Quest" : "Create Quest";
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
  document.body.style.overflow = "auto";
  document.getElementById("newTaskForm").reset();
  editIndex = null;
}

window.onclick = (e) => {
  if (e.target.classList.contains("modal")) closeModal(e.target.id);
};

function updateUI() {
  document.getElementById("playerName").textContent = state.playerName;
  document.getElementById("level").textContent = state.level;
  document.getElementById("xp").textContent = state.xp;
  document.getElementById("xpBar").style.width = `${state.xp}%`;
  document.getElementById("coins").textContent = state.coins;

  Object.keys(state.stats).forEach(stat => {
    document.getElementById(stat).textContent = state.stats[stat];
  });

  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  state.tasks.forEach((task, i) => {
    const div = document.createElement("div");
    div.className = `p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition ${task.completed ? "opacity-60" : ""}`;

    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-bold ${task.completed ? "line-through" : ""}">
            ${task.title}
          </h3>
          <p class="text-sm text-gray-400">${task.description || ""}</p>
        </div>

        <div class="flex gap-2 items-center">
          <span class="text-xs bg-purple-500/20 px-2 py-1 rounded">
            ${task.rewardType} +10
          </span>

          ${!task.completed ? `
            <button onclick="completeTask(${i})" class="text-green-400">✔</button>
          ` : ""}

          <button onclick="editTask(${i})" class="text-yellow-400">✏️</button>
          <button onclick="deleteTask(${i})" class="text-red-400">✖</button>
        </div>
      </div>
    `;

    list.appendChild(div);
  });
}

function addNewTask(e) {
  e.preventDefault();

  const title = taskTitle.value.trim();
  if (!title) return;

  const taskData = {
    title,
    description: taskDescription.value,
    rewardType: taskRewardType.value,
    completed: false
  };

  if (editIndex !== null) {
    state.tasks[editIndex] = {
      ...state.tasks[editIndex],
      ...taskData
    };
    editIndex = null;
  } else {
    state.tasks.push(taskData);
  }

  saveState();
  updateUI();
  closeModal("newTaskModal");
}

function completeTask(i) {
  const task = state.tasks[i];
  if (task.completed) return;

  task.completed = true;

  state.stats[task.rewardType] += 10;
  state.xp += 10;
  state.coins += 5;

  if (state.xp >= 100) {
    state.level++;
    state.xp -= 100;
    showToast("🎉 Level Up!");
  }

  saveState();
  updateUI();
}

function editTask(i) {
  const task = state.tasks[i];

  editIndex = i;

  taskTitle.value = task.title;
  taskDescription.value = task.description;
  taskRewardType.value = task.rewardType;

  openModal("newTaskModal");
}

function deleteTask(i) {
  state.tasks.splice(i, 1);
  saveState();
  updateUI();
}

function editName() {
  const name = prompt("Enter name:", state.playerName);
  if (name) {
    state.playerName = name;
    saveState();
    updateUI();
  }
}

function showToast(msg) {
  const div = document.createElement("div");
  div.className = "fixed top-5 right-5 bg-purple-600 text-white px-4 py-2 rounded";
  div.textContent = msg;

  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2000);
}

function init() {
  loadState();

  if (state.tasks.length === 0) {
    state.tasks.push({
      title: "Start your journey 🚀",
      description: "Create and complete your first quest",
      rewardType: "strength",
      completed: false
    });
  }

  updateUI();
}

document.addEventListener("DOMContentLoaded", init);