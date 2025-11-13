const input = document.querySelector(".text-input");
const addBtn = document.querySelector(".add-btn");
const tasksContainer = document.querySelector(".tasks");
const allFilter = document.querySelector(".all");
const activeFilter = document.querySelector(".active");
const completedFilter = document.querySelector(".completed");
const taskCounter = document.querySelector(".task-counter");
const clearBtn = document.querySelector(".clear-completed"); // NEW

let tasks = [];
let currentFilter = "all";

// === Add Task ===
addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    isCompleted: false,
  });
  input.value = "";
  renderTasks();
  updateCounter();
}

// === Render Tasks ===
function renderTasks() {
  tasksContainer.innerHTML = "";
  if (tasks.length === 0) {
    tasksContainer.innerHTML =
      '<div class="no-tasks"><p>No tasks yet. Add one above!</p></div>';
    return;
  }

  const filteredTasks = getFilteredTasks();
  filteredTasks.forEach((task) => {
    tasksContainer.innerHTML += `
      <div class="task-item" data-id="${task.id}">
        <div class="checkbox-container">
          <input 
            class="checkbox" 
            type="checkbox" 
            ${task.isCompleted ? "checked" : ""}
            onchange="markAsDone(${task.id}, this)">
          <p class="task-text ${task.isCompleted ? "completed-item" : ""}">${
      task.text
    }</p>
        </div>
        <div class="task-buttons-container">
          <button class="delete-btn" onclick="deleteTask(${
            task.id
          })">Delete</button>
          <button class="edit-btn">Edit</button>
        </div>
      </div>
    `;
  });
}

// === Get Filtered Tasks ===
function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.isCompleted);
  if (currentFilter === "completed") return tasks.filter((t) => t.isCompleted);
  return tasks;
}

// === Delete Task ===
function deleteTask(taskId) {
  if (confirm("Press 'OK' to delete this task.")) {
    tasks = tasks.filter((t) => t.id !== taskId);
    renderTasks();
    updateCounter();
  }
}

// === Mark as Done ===
function markAsDone(taskId, checkbox) {
  const task = tasks.find((t) => t.id === taskId);
  task.isCompleted = checkbox.checked;

  const text = checkbox.nextElementSibling;
  text.classList.toggle("completed-item", checkbox.checked);

  updateCounter();
}

// === Update Counter ===
function updateCounter() {
  const completed = tasks.filter((t) => t.isCompleted).length;
  const total = tasks.length;
  taskCounter.textContent = `${completed} / ${total} completed`;
}

// === Filter Buttons ===
allFilter.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
  updateCounter();
  setActiveFilter(allFilter);
});

activeFilter.addEventListener("click", () => {
  currentFilter = "active";
  renderTasks();
  updateCounter();
  setActiveFilter(activeFilter);
});

completedFilter.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
  updateCounter();
  setActiveFilter(completedFilter);
});

// === Highlight Active Filter ===
function setActiveFilter(activeBtn) {
  [allFilter, activeFilter, completedFilter].forEach((btn) =>
    btn.classList.remove("active")
  );
  activeBtn.classList.add("active");
}

// === Clear Completed ===
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.isCompleted);
  renderTasks();
  updateCounter();
});

// === Initial Render ===
renderTasks();
updateCounter();
setActiveFilter(allFilter);
