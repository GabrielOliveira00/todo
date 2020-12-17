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
const state = {
  // Para não repetirmos o ID do item, aqui adicionamos 1 toda vez que criamos um TODO
  lastIndex: 0,
  // Aqui vamos guardar todos os todos
  items: [],
  // Aqui decidimos se os dados devem ser guardados no localstorage ou não
  persist: true,
  localstorageKey: 'todoDoMonda'
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
    doAddTask(this.value, false);
  }
});

// Faremos o mesmo para o botão
newTaskButton.addEventListener('click', function onClick(clickEvent) {
  clickEvent.preventDefault();
  clickEvent.stopImmediatePropagation();

  doAddTask(newTaskInput.value);
});

// clickamos no checkbox da task
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
  // Update storage
  buildTodoListData();
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
  // Update storage
  buildTodoListData();
}

// Ações
//  Aqui vou listar funções que podem "mudar" o estado da aplicação
//  ou seja, adicionar items, remover items, qualquer coisa que gere alteração visual

// Adicionar um novo todo
function doAddTask(taskLabel, checked) {
  // Criamos um clone
  const taskElement = doCreateTask(taskLabel, checked);
  // Adicionamos na lista
  taskList.append(taskElement);
  // Limpamos o campo que o usuário escreveu
  newTaskInput.value = '';
  // Deveolvemos o foco ao campo caso ele queira escrever várias tarefas
  newTaskInput.focus();
  // Update storage
  buildTodoListData();
}

// Uma boa forma é mudar o estilo do item para sabermos que ele foi checkado
function doCheckTask(taskElement, checked) {
  if (checked) {
    taskElement.classList.add('todo-checked');
  } else {
    taskElement.classList.remove('todo-checked');
  }
}

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
function doCreateTask(label, checked) {
  const clone = Theclone.cloneNode(true);
  // Identificação
  clone.setAttribute('id', `todo-${state.lastIndex}`);
  // Checkbox
  clone.children[0].children[0].addEventListener('change', checkTask);
  clone.children[0].children[0].checked = checked;
  // Atualiza o estado do checkbox
  doCheckTask(clone, checked);
  // Label
  clone.children[0].children[1].innerHTML = label;
  // Delete svg
  clone.children[0].children[2].addEventListener('click', deleteTask);
  // Aumentamos a contagem para o proximo todo
  state.lastIndex = state.lastIndex + 1;

  // Retornamos o objeto completo
  return clone;
}

// Storage

// Aqui vamos iterar o filhos do da tasklist
// e através dos dados deles, atualizar o storage
// para coletar os dados eu poderia usar o dataset
// mas estamos evitando por enquanto
function buildTodoListData() {
  // Sobrescrevemos a lista inteira e para fins de debug calculamos quanto tempo levou
  const start = new Date().valueOf();
  // Problema comum no javascript
  // a coleção de filhos HTML não herda as funções basicas de Array
  // portanto usamos slice para "recortar" os items e criar uma nova array a partir deles
  const tasks = Array.prototype.slice.call(taskList.children);
  // Geramos uma lista de objetos com as informações que precisamos
  // pra construir a lista do jeito que está eu preciso de:
  //  - Index, a posição em que o elemento está
  //  - Label, o texto que está escrito
  //  - Checked, se o usuário marcou o checkbox ou não
  // com essas dados consigo reconstruir essa lista do jeito que está
  state.items = tasks.map((taskElement, index) => {
    // Mesma estrutura que usamos no clone
    const label = taskElement.children[0].children[1].innerHTML;
    const checked = taskElement.children[0].children[0].checked;
    return {index, label, checked}
  });

  console.debug(`Updated the storage in ${new Date().valueOf() - start}ms`);
  if (state.persist) {
    // Aqui é que guardamos no localstorage do browser
    // ele pede uma chave pra você pegar de volta depois o valor guardado
    // temos de "encodar" o nosso objeto pois podemos guardar apenas valores simples como string, numero, booleano etc..
    localStorage.setItem(state.localstorageKey, JSON.stringify(state.items));
  }
}


// Nesse exemplo como querenos usar drag & drop para ordenar os elementos
//  tio google me sugeriu a biblioteca chamada Sortable
Sortable.create(taskList, {
  // Ja temos como saber quando adicionamos e deletamos um item
  // Falta apenas um gatilho para quando ordenamos, alterar a posição nos dados salvos
  // Temos 2 formas de proceder
  // 1) Sempre que houver qualquer alteração, nós analizamos a lista inteira e construimos
  //    os dados do zero
  // 2) Sempre que houver uma alteração, procuramos pelo elemento específico na lista e alteramos somente ele
  //
  // As duas opções são válidas, depende do programador e de quantas linhas serão gastas
  //  geralmente é mais complicado procurar e atualizar items, ao invés de descartar tudo e reconstruir
  //  a lista baseado no estado atual
  // Por enquanto vamos usar a primeira alternativa
  onChange: buildTodoListData
});

// Vamos dar foco no campo de input pro usuário ja sair descendo a lenha
newTaskInput.focus();

// Inicialização
// Se tivermos persist como true, devemos carregar os dados do localstorage do navegador

if (state.persist) {
  // Pegamos a string encodada do localstorage
  const tasks = localStorage.getItem(state.localstorageKey);
  // tentamos recuperar os dados:
  try {
    state.items = JSON.parse(tasks);
    state.items.forEach(task => {
      taskList.append(doCreateTask(task.label, task.checked));
    });
  } catch (exception) {
    console.error(exception);
    // Qualquer merda que der não nos interessa
    // Apenas deixamos a lista vazia novamente YOLO
    // Para isso basta ignorar, items ja foi inicializado com "[]"
  }
}