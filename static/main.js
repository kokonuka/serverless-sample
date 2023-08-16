const API_URL_PREFIX =
  "https://vesyhxg5zf.execute-api.ap-northeast-1.amazonaws.com";

const taskTitleInputElement = document.getElementById("task-title-input");
const taskAddButtonElement = document.getElementById("task-add-button");
const taskListElement = document.getElementById("task-list");

async function loadTasks() {
  const resqponse = await fetch(API_URL_PREFIX + "/tasks");
  const resqponseBody = await resqponse.json();

  const tasks = resqponseBody.tasks;
  console.log(tasks);

  while (taskListElement.firstChild) {
    taskListElement.removeChild(taskListElement.firstChild);
  }

  tasks.forEach((task) => {
    //
    const liElement = document.createElement("li");
    liElement.innerText = task.title;

    taskListElement.appendChild(liElement);
  });
}

async function registerTask() {
  const title = taskTitleInputElement.value;

  const requestBody = {
    title,
  };

  await fetch(API_URL_PREFIX + "/tasks", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });

  await loadTasks();
}

async function main() {
  taskAddButtonElement.addEventListener("click", registerTask);
  await loadTasks();
}

main();
