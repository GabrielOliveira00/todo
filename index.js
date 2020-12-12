var addTask = document.querySelector(".adicionaTask");

  addTask.addEventListener("click", function(event) {
  event.preventDefault();

  var task = document.querySelector(".mb-3");

  var tarefa = addToDo(task);

  var inputTask = createToDo(tarefa);

  var tabela = document.querySelector(".menuTask");

  tabela.appendChild(inputTask);

  console.log("Task");


});

function addToDo(task) {
    document.getElementById("newTask").value;
}



function createToDo(tarefa){

    var inputTask = document.createElement("button");
    inputTask.classList.add("adicionaTask");

    inputTask.appendChild(montaBotao(tarefa.newTask, "list-group-item list-group-item-action brd-rds"));

    return inputTask;
}

function montaBotao(dado, classe){

  var botao = document.createElement("div");
  botao.classList.add(classe);
  botao.textContent = dado;

}
