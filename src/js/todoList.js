(function() {
    'use strict';
    class todoList {
        constructor() {
            this.init();
        }
        init() {
            this.addEvents();
            this.loadTasks();
        }
        loadTasks() {
            if(localStorage.getItem('todoList') === null) {
                return false;
            }
            const arrTasks = JSON.parse(localStorage.getItem('todoList')),
                  tasksLen = arrTasks.length;
            for(let i = 0; i < tasksLen; i++) {
                this.appendToList(arrTasks[i].value, arrTasks[i].checked); 
            }
        }
        saveTasks() {
            const allTasks = document.querySelectorAll('.todo__task'),
                  contentTasks = document.querySelectorAll('.task__content'),
                  arrData = [];
            for(let i = 0, lenTasks = allTasks.length; i < lenTasks; i++) {
                if(allTasks[i].classList.contains('todo__task_completed')) {
                    arrData.push({value: contentTasks[i].textContent, checked: true});
                } else {
                    arrData.push({value: contentTasks[i].textContent, checked: false});
                }
            }
            localStorage.setItem('todoList', JSON.stringify(arrData));
        }
        isChecked(checked) {
            if(checked !== false) {
                return 'checked';
            } 
        }
        createTask(value, checked) {
            const itemList = document.createElement('li');
            
            itemList.classList.add('todo__task');
            if(checked) {
                itemList.classList.add('todo__task_completed');
            }
            itemList.classList.add('task');
            itemList.innerHTML = `<label class="task__done checkbox">
                                    <input type="checkbox" class="checkbox__done visuallyhidden" ${this.isChecked(checked)}>
                                    <span class="checkbox__checkbox"></span>
                                    <span class="visuallyhidden">Zadanie skończone</span>
                                  </label>
                                  <div class="task__content" contenteditable="false" tabindex="0">${value}</div>
                                  <button class="task__remove remove" aria-label="Usuń zadanie">
                                    <span class="remove__span visuallyhidden">Usuń zadanie</span>
                                  </button>`;
            
            return itemList;
        }
        isValid(value) {
            if(!/<|>/g.test(value) && (value.trim().length > 0)) {
                return true;
            }
            return false;
        }
        clearInput(e) {
            e.target.value = '';
        }
        appendToList(value, checked) {
            if(!this.isValid(value)) {
                return false;
            }
            const listTodo = document.querySelector('.todo__list'),
                  newTask = this.createTask(value, checked);
                
            listTodo.appendChild(newTask);
        }
        keyHandler(e) {
            const t = e.target,
                  enterKeyCode = 13;
            if((e.keyCode !== enterKeyCode) || !t.classList.contains('todo__input')) {
                return false;
            }
            this.appendToList(t.value, false);
            this.clearInput(e);
            this.saveTasks();
        }
        removeTasks(e) {
            const t = e.target;
            if(t.classList.contains('task__remove')) {
                t.parentNode.parentNode.removeChild(t.parentNode);
            } else if(t.classList.contains('remove__span')) {
                t.parentNode.parentNode.parentNode.removeChild(t.parentNode.parentNode);
            } else {
                return false;
            }
            this.saveTasks();
        } 
        completTasks(e) {
            const t = e.target;
            if(!t.classList.contains('checkbox__done')) {
                return false;
            } else {
                const task = t.parentNode.parentNode;
                if(t.checked) {
                    task.classList.add('todo__task_completed');
                } else {
                    task.classList.remove('todo__task_completed');
                }
            }
            this.saveTasks();
        }
        editTasks(e) {
            const t = e.target;
            if(!t.classList.contains('task__content')) {
                return false;
            } else {
                if(t.contentEditable === 'true') {
                    t.contentEditable = 'false';
                    this.saveTasks();
                } else {
                    t.contentEditable = 'true';
                }
            }
        }
        clearCompletedTasks(e) {
            const t = e.target;//todo__clear-completed
            if(!t.classList.contains('buttons__button_clear-completed')) {
                return false;
            }
            const allCompletedTasks = document.querySelectorAll('.todo__task_completed'),
                  completedTasksLen = allCompletedTasks.length;
            if(completedTasksLen < 1) {
                return false;
            }
            for(let i = 0; i < completedTasksLen; i++) {
                allCompletedTasks[i].parentNode.removeChild(allCompletedTasks[i]);
            }
            this.saveTasks();
        }
        printTasks(e) {
            const t = e.target;
            if(!t.classList.contains('buttons__button_print-tasks')) {
                return false;
            }
            window.print();
        }
        addEvents() {
            document.addEventListener('keydown', this.keyHandler.bind(this));
            document.addEventListener('click', this.removeTasks.bind(this));
            document.addEventListener('change', this.completTasks.bind(this));
            document.addEventListener('dblclick', this.editTasks.bind(this));
            document.addEventListener('click', this.clearCompletedTasks.bind(this));
            document.addEventListener('click', this.printTasks.bind(this));
        }
    }
    new todoList();
}())