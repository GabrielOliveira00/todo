const state = {
  lastIndex: 0,
  items: [],
  persist: true,
  localstorageKey: 'todoDoMonda'
};

const newTaskInput = document.querySelector('#taskLabel');
const newTaskButton = document.querySelector('#addTaskButton');
const taskList = document.querySelector('#taskList');
const Theclone = document.querySelector('#cloneMePlease');

newTaskInput.addEventListener('keypress', function onKeyPress(keyEvent) {
  if (keyEvent.key === 'Enter') {
    doAddTask(this.value, false);
  }
});

newTaskButton.addEventListener('click', function onClick(clickEvent) {
  clickEvent.preventDefault();
  clickEvent.stopImmediatePropagation();

  doAddTask(newTaskInput.value);
});

function checkTask(changeEvent) {
  const taskElement = this.parentNode.parentNode;

  doCheckTask(taskElement, this.checked);
  buildTodoListData();
}

function deleteTask(clickEvent) {
  const taskElement = this.parentNode.parentNode;

  doDeleteTask(taskElement);
  buildTodoListData();
}

function doAddTask(taskLabel, checked) {
  const taskElement = doCreateTask(taskLabel, checked);

  taskList.append(taskElement);
  newTaskInput.value = '';
  newTaskInput.focus();

  buildTodoListData();
}

function doCheckTask(taskElement, checked) {
  if (checked) {
    taskElement.classList.add('todo-checked');
  } else {
    taskElement.classList.remove('todo-checked');
  }
}

function doDeleteTask(taskElement) {
  taskElement.parentNode.removeChild(taskElement);
}

function doCreateTask(label, checked) {
  const clone = Theclone.cloneNode(true);

  clone.setAttribute('id', `todo-${state.lastIndex}`);
  clone.children[0].children[0].addEventListener('change', checkTask);
  clone.children[0].children[0].checked = checked;
  clone.children[0].children[1].innerHTML = label;
  clone.children[0].children[2].addEventListener('click', deleteTask);

  state.lastIndex = state.lastIndex + 1;
  doCheckTask(clone, checked);

  return clone;
}

function buildTodoListData() {
  const start = new Date().valueOf();
  const tasks = Array.prototype.slice.call(taskList.children);
  state.items = tasks.map((taskElement, index) => {
    const label = taskElement.children[0].children[1].innerHTML;
    const checked = taskElement.children[0].children[0].checked;
    return {index, label, checked}
  });

  console.debug(`Updated the storage in ${new Date().valueOf() - start}ms`);
  if (state.persist) {
    localStorage.setItem(state.localstorageKey, JSON.stringify(state.items));
  }
}


Sortable.create(taskList, {
  onChange: buildTodoListData
});

if (state.persist) {
  const tasks = localStorage.getItem(state.localstorageKey);
  try {
    state.items = JSON.parse(tasks);
    state.items.forEach(task => {
      taskList.append(doCreateTask(task.label, task.checked));
    });
  } catch (exception) {
    console.error(exception);
  }
}

newTaskInput.focus();