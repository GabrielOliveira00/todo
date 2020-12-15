var addTask = document.querySelector(".adicionaTask");
addTask.addEventListener("click", function(event) {
    event.preventDefault();

    var task = document.querySelector(".todo-items");

    var tarefa = addToDo(task);

    var inputTask = createToDo(tarefa);

    var tabela = document.querySelector(".menuTask");

    tabela.appendChild(inputTask);

    console.log("Task");


});

function addToDo (task) {

  var tarefa = {
      newTask: task.newTask.value

  }

  return tarefa;
}




function createToDo(tarefa){

    var inputTask = document.createElement("button");
    inputTask.classList.add("tarefa");

    inputTask.appendChild(montaBotao(tarefa.newTask, "list-group-item list-group-item-action brd-rds"));

    return inputTask;
}

function montaBotao(dado, classe){

  var botao = document.createElement("div");
  botao.classList.add(classe);
  botao.textContent = dado;

}

// Exclui To do

var excluir = document.querySelector(".bi-trash");

excluir.addEventListener("dblclick", function(event) {
    event.target.parentNode.classList.add("fadeOut");

    setTimeout(function() {
        event.target.parentNode.remove();
    }, 100);

});


// Função Drag and Drop

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
