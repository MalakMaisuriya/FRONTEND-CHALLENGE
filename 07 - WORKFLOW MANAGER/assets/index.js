const addToDoTaskButton = document.getElementById("Add-To-Do-Task");
const addInProgressTaskButton = document.getElementById("Add-In-Progress-Task");
const addIsDoneTaskButton = document.getElementById("Add-Is-Done-Task");

document.addEventListener("DOMContentLoaded", () => {
  console.log("Local Storage at Load:", Object.entries(localStorage));

  if (localStorage.length === 0) {

    localStorage.setItem("Learn Advanced JS", "to-do");
    localStorage.setItem("Learn ML In Python", "to-do");
    localStorage.setItem("Mastering Web Dev.", "in-progress");
    localStorage.setItem("Mastering Python", "in-progress");
    localStorage.setItem("Completed DSA In Java", "is-done");

    console.log("Newly Added Local Storage:", Object.entries(localStorage));

    setTimeout(() => {
      location.reload();
    }, 100);
  } else {

    const boardMap = {
      "to-do": document.getElementById("to-do"),
      "in-progress": document.getElementById("in-progress"),
      "is-done": document.getElementById("is-done"),
    };

    Object.keys(localStorage).forEach((taskName) => {
      let boardName = localStorage.getItem(taskName);
      let boardElement = boardMap[boardName];

      addTask(taskName, boardElement);
    });
  }

  setNumberOfTasks();
});

function setNumberOfTasks() {
  allBoards.forEach((board) => {
    let count = board.querySelectorAll(".kanban-card").length;
    let numberElement = board.querySelector(".number");
    numberElement.textContent = count;
  });
}

const toDoKanbanBoard = document.getElementById("to-do");
const inProgressKanbanBoard = document.getElementById("in-progress");
const isDoneKanbanBoard = document.getElementById("is-done");

function attachDragEvents(target) {
  target.addEventListener("dragstart", () => {
    target.classList.add("flying");
  });

  target.addEventListener("dragend", () => {
    target.classList.remove("flying");
  });
}

function getFormattedDateTime() {
  let now = new Date();

  let day = now.getDate();
  let month = now.toLocaleString("en-US", { month: "short" });
  let year = now.getFullYear();

  let time = now.toLocaleTimeString("en-US", { hour12: true });

  return `${day} ${month} ${year} At ${time}`;
}

function addTask(inputTask, KanbanBoard) {
  let newToDoTask = document.createElement("div");
  newToDoTask.className = "kanban-card gap-2 p-2";
  newToDoTask.setAttribute("draggable", "true");

  let taskText = document.createElement("p");
  taskText.className = "mb-0 flex-grow-1";
  taskText.textContent = `${inputTask}`;

  let editButton = document.createElement("button");
  editButton.className = "btn btn-primary btn-sm";
  editButton.innerHTML = `<i class="fas fa-plus"></i>`;
  editButton.addEventListener("click", () => {
    let updatedTask = prompt("Edit Task:", taskText.textContent);
    if (updatedTask) {
      let editedTag = newToDoTask.querySelector("p").textContent;
      localStorage.setItem(updatedTask, localStorage.getItem(editedTag));
      localStorage.removeItem(editedTag);
      taskText.textContent = updatedTask;
    }
  });

  let deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger btn-sm";
  deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteButton.addEventListener("click", () => {
    newToDoTask.remove();
    localStorage.removeItem(newToDoTask.querySelector("p").textContent);
    setNumberOfTasks();
  });

  const DateAndTime = document.createElement("p");
  let currentDateAndTime = getFormattedDateTime();
  DateAndTime.textContent = currentDateAndTime;
  DateAndTime.className = "mb-0 text-end text-muted small mt-2";

  const taskRow = document.createElement("div");
  taskRow.className =
    "d-flex align-items-center justify-content-between gap-2 w-100";

  taskRow.appendChild(taskText);
  taskRow.appendChild(editButton);
  taskRow.appendChild(deleteButton);


  newToDoTask.appendChild(taskRow);
  newToDoTask.appendChild(DateAndTime);

  attachDragEvents(newToDoTask);

  KanbanBoard.appendChild(newToDoTask);
  localStorage.setItem(inputTask, KanbanBoard.id);
  setNumberOfTasks();
}

addToDoTaskButton.addEventListener("click", () => {
  let inputTask = prompt("Enter The Task To Be Done");
  if (!inputTask) return;
  addTask(inputTask, toDoKanbanBoard);
});

addInProgressTaskButton.addEventListener("click", () => {
  let inputTask = prompt("Enter The Task In Progress");
  if (!inputTask) return;
  addTask(inputTask, inProgressKanbanBoard);
});

addIsDoneTaskButton.addEventListener("click", () => {
  let inputTask = prompt("Enter The Task Which Is Done");
  if (!inputTask) return;
  addTask(inputTask, isDoneKanbanBoard);
});

const allBoards = document.querySelectorAll(".kanban-board");
const allItems = document.querySelectorAll(".kanban-card");

allItems.forEach((item) => attachDragEvents(item));

allBoards.forEach((board) => {
  board.addEventListener("dragover", () => {
    const flyingElement = document.querySelector(".flying");
    if (flyingElement) {
      const paraTags = flyingElement.querySelectorAll("p");
      if (paraTags.length > 1) {
        paraTags[paraTags.length - 1].innerText = getFormattedDateTime();
        let editedTag = paraTags[0].textContent;
        localStorage.setItem(editedTag, board.id);
      }
    }
    board.appendChild(flyingElement);
    console.log(flyingElement);
    setNumberOfTasks();
  });
});
