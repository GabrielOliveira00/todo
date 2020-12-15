// Vou criar um objeto para usar como armazenamento temporario
//  como ele é definido aqui e não é carregado de nenhum lugar
//  toda vez que atualizar a pagina os dados dele serão perdidos
//  poderiamos usar localstorage a principio para persistir os dados
//  A estrutura que espero usar é:
//
//  Item: { position: number, checked: boolean, element: HTMLElement }
//  { lasItems: number, items: ArrayOf<Item>, persist: boolean }
//
//  Com a flag persist posso alternar entre dados do localstorage/database
//  e dados locais.
const storage = {
  // Para não repetirmos o ID do item, aqui adicionamos 1 toda vez que criamos um TODO
  lastIndex: 0,
  // Aqui vamos guardar todos os todos
  items: [],
  // Aqui decidimos se os dados devem ser guardados no localstorage ou não
  persist: false
};

// Seletores

// Input aonde vamos preenchemos a Label do todo
const newTaskInput = document.querySelector('#taskLabel');
//  Botão que vamos usar para adicionar o todo à lista
const newTaskButton = document.querySelector('#addTaskButton');
//  A Lista que vai conter todos os todos
const taskList = document.querySelector('#taskList');
// O item que vai servir de "modelo" para adicionar novos items, sem ter que construir o HTML do zero
const Theclone = document.querySelector('#cloneMePlease');

// Eventos

//  Para melhorar a experiência do usuário vamos adicionar um evento ao input
//  para ouvir a tecla enter, que é um comportamento bem comum, escrever e apertar enter
//  Ela deve disparar a mesma ação do botão, "addTask" e limpar o campo
newTaskInput.addEventListener('keypress', function onKeyPress(keyEvent) {
  if (keyEvent.key === 'Enter') {
    doAddTask(this.value);
  }
});

// Faremos o mesmo para o botão
newTaskButton.addEventListener('click', function onClick(clickEvent) {
  clickEvent.preventDefault();
  clickEvent.stopImmediatePropagation();

  doAddTask(newTaskInput.value);
});

// clickamos no checkbox da task
/**
 * checkTask
 * @param changeEvent {Event}
 */
function checkTask(changeEvent) {
  // Como a estrutura não muda
  // nós sabemos que a raiz da task, está 2 niveis acima do checkbox
  //  div > button > [input, svg]
  //  parentNode()
  //  div > button
  //  parentNode()
  //  div  <-- Raiz da Task
  //  dava pra guardar uma referencia ao elemento, bla bla bla ? (SIM)
  //  poderiamos até mesmo usar o "bind" para quando essa função fosse chamada
  //  junto com o evento, receberiamos a task relacionada
  const taskElement = this.parentNode.parentNode;
  // Faz alguma coisa com a task
  doCheckTask(taskElement, this.checked);
}

// clickamos no delete da task
/**
 * deleteTask
 * @param clickEvent {MouseEvent}
 */
function deleteTask(clickEvent) {
  // mesmo processo do 'checkTask'
  const taskElement = this.parentNode.parentNode;
  // efetivamente remove o HTML da task da tela
  doDeleteTask(taskElement);
}

// Ações
//  Aqui vou listar funções que podem "mudar" o estado da aplicação
//  ou seja, adicionar items, remover items, qualquer coisa que gere alteração visual

// Adicionar um novo todo
/**
 * Function doAddTask
 * @param taskLabel {string}
 */
function doAddTask(taskLabel) {
  // Criamos um clone
  const taskElement = doCreateTask(taskLabel);
  // Adicionamos na lista
  taskList.appendChild(taskElement);
  // Limpamos o campo que o usuário escreveu
  newTaskInput.value = '';
  // Deveolvemos o foco ao campo caso ele queira escrever várias tarefas
  newTaskInput.focus();
}

// Uma boa forma é mudar o estilo do item para sabermos que ele foi checkado
/**
 * doCheckTask
 * @param taskElement {HTMLElement}
 * @param checked {boolean}
 */
function doCheckTask(taskElement, checked) {
  if(checked) {
    taskElement.classList.add('todo-checked');
  } else {
    taskElement.classList.remove('todo-checked');
  }
}

/**
 * doDeleteTask
 * @param taskElement {HTMLElement}
 */
function doDeleteTask(taskElement) {
  // Somente o pai do item pode removê-lo então...
  //  sim é redundante
  taskElement.parentNode.removeChild(taskElement);
}

// Função que vai criar o elemento HTML
//  como a estrutura é sempre a mesma
//  div > button > [input, svg]
//  checkbox:         clone.childNodes[0].childNodes[0]
//  label:            clone.childNodes[0].childNodes[1]
//  botão de delete:  clone.childNodes[0].childNodes[2]
/**
 * doCreateTask
 * @param label {string}
 * @returns {Node}
 */
function doCreateTask(label) {
  const clone = Theclone.cloneNode(true);
  // Identificação
  clone.setAttribute('id', `todo-${storage.lastIndex}`);
  // Checkbox
  clone.children[0].children[0].addEventListener('change', checkTask);
  // Label
  clone.children[0].children[1].innerHTML = label;
  // Delete svg
  clone.children[0].children[2].addEventListener('click', deleteTask);
  // Aumentamos a contagem para o proximo todo
  storage.lastIndex = storage.lastIndex + 1;

  // Retornamos o objeto completo
  return clone;
}

// Nesse exemplo como querenos usar drag & drop para ordenar os elementos
//  tio google me sugeriu a biblioteca chamada Sortable
Sortable.create(taskList);

// Vamos dar foco no campo de input pro usuário ja sair descendo a lenha
newTaskInput.focus();