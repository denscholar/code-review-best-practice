const input = document.querySelector("#todo-input");
const form = document.querySelector("form");
const taskList = document.querySelector(".task-list");
const todoList = document.querySelector(".task-list");

class Store {
    // get the task
    static getTask() {
      let tasks;
      // check if there is an item called task in local storage
      if (localStorage.getItem("tasks") === null) {
        tasks = [];
      } else {
        tasks = JSON.parse(localStorage.getItem("tasks"));
      }
      return tasks;
    }
  
    // add task to storage
    static addTask(task) {
      const tasks = Store.getTask();
      tasks.push(task);
      Store.save(tasks);
      displayTasks();
    }
  
    // Delete task from storage
    static deleteTask = () => {
      const tasks = Store.getTask();
      const deleteBtn = document.getElementsByClassName("fa-trash");
      for (let i = 0; i < deleteBtn.length; i += 1) {
        deleteBtn[i].addEventListener("click", () => {
          const filteredTask = tasks.filter((task) => task.index - 1 !== i);
          filteredTask.forEach((task, index) => {
            task.index = index + 1;
          });
          Store.save(filteredTask);
          displayTasks();
        });
      }
    };
  
    static clearTask = () => {
      const tasks = Store.getTask();
      const clearBtn = document.querySelector(".clear-button");
      clearBtn.addEventListener("click", () => {
        const filteredTask = tasks.filter((task) => task.completed !== true);
        filteredTask.forEach((task, index) => {
          task.index = index + 1;
        });
        Store.save(filteredTask);
        displayTasks();
      });
    };
  
    static save(tasks) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    static check = () => {
      const tasks = Store.getTask();
      const checkboxes = document.getElementsByClassName("check");
      for (let i = 0; i < checkboxes.length; i += 1) {
        checkboxes[i].addEventListener("change", () => {
          if (tasks[i].completed === true) {
            tasks[i].completed = false;
          } else {
            tasks[i].completed = true;
          }
          Store.save(tasks);
          displayTasks();
          Store.check();
        });
      }
    };
  }

class Todo {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }
}

createTask = (task) => {
  let todoObj = "";
  if (task.completed === true) {
    todoObj = `
          <li id="${task.index}" class="task-item">
              <input class="check" type="checkbox" value="${task.completed}" checked>
              <input type="text" id="${task.index}" class="task-text line-through" value="${task.description}" readonly>
              <button><i id="" class="fas fa-ellipsis-v"></i></button>
              <button class="btn"><i id="taskdelete" class="fas fa-trash"></i></button>
          </li>`;
  } else {
    todoObj = `
            <li  id="${task.index}" class="task-item">
              <input class="check" type="checkbox" value="${task.completed}">
              <input type="text" id="${task.index}" class="task-text" value="${task.description}" readonly>
              <button><i id="" class="fas fa-ellipsis-v"></i></button>
              <button class="btn"><i id="taskdelete" class="fas fa-trash"></i></button>
            </li>`;
  }
  todoList.innerHTML += todoObj;
};


displayTasks = () => {
  const tasks = Store.getTask();
  const sortedList = tasks.sort((a, b) => {
    if (a.index > b.index) {
      return 1;
    }
    if (a.index < b.index) {
      return -1;
    }
    return 0;
  });
  sortedList.forEach((task) => {
    createTask(task);
  });

  Store.save(sortedList);
  Store.check();
  Store.deleteTask();
  Store.clearTask();
};

displayTasks();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const index = Store.getTask().length + 1;
  const inputText = input.value;
  const completed = false;
  if (inputText === "") {
    return;
  }
  // instatiate the Todo
  const todo = new Todo(inputText, completed, index);

  // add Task to UI
  Store.addTask(todo);
  input.value = "";
});

// event for checked and strike and edit
document.querySelector(".task-list").addEventListener("click", (e) => {
  checkStrikeAndEdit(e);
});

//check strike and edit
const checkStrikeAndEdit = (e) => {
  const tasks = Store.getTask();
  const item = e.target;
  const index = item.id - 1;
  const description = item.parentElement.childNodes[3];
  if (item.className === "task-text") {
    item.removeAttribute("readOnly");
    description.addEventListener("keypress", (e) => {
      tasks[index].description = description.value;
      if (e.key === "Enter") {
        item.setAttribute("readonly", true);
        Store.save(tasks);
        displayTasks();
      }
    });
  }
};

