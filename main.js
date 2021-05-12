// Task Class -> Represents a Task
class Task {
    constructor(title, description, date) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.id = createUUID();
    }
}


// Planner Class -> Handle UI Tasks
class Planner {
    static displayTasks() {
        const tasks = Store.getTasks();
        tasks.forEach(task => Planner.addTaskToList(task));
    }

    static addTaskToList(task) {
        const list = document.querySelector("#task-list");
        const row = document.createElement("tr");

        row.innerHTML = `
        <td></td>
        <td>${task.title}</td>
        <td>${task.description}</td>
        <td>${task.date}</td>
        <td id="identifier" class="hidden">${task.id}</td>
        <td><a href="#" class="btn btn-success btn-sm cross-out">Done</a></td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
    `;
        list.appendChild(row);
    }

    static deleteTask(item) {
        if (item.classList.contains("delete")) {
            item.parentElement.parentElement.remove();

            // Show success message
            Planner.showAlert("Task removed", "success");

            // Remove task from store
            Store.removeTask(event.target.parentElement.parentElement.querySelector("#identifier").textContent);
        }
    }

    static crossOutTask(item) {
        if (item.classList.contains("cross-out")) {

            if (item.textContent == "Done") {
                item.parentElement.parentElement.style = "text-decoration: line-through";
                item.textContent = "Not done";
                Planner.changeCheckMark(item);
            } else {
                item.parentElement.parentElement.style = "";
                item.textContent = "Done";
                Planner.changeCheckMark(item, "-");

            }
            item.classList.toggle("btn-warning");
            item.classList.toggle("btn-success");
        }
    }

    static changeCheckMark(item, type = "+") {
        if (type === "+") {
            item.parentElement.parentElement.querySelector("td:first-child").innerHTML = `<i class="fas fa-check-circle text-success">`;
        } else if (type === "-") {
            item.parentElement.parentElement.querySelector("td:first-child").innerHTML = "";
        } else throw new Error(`Incorrect operation, you can use only "+" or "-".`);
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#task-form");
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#date").value = "";
    }
}


// Store Class -> Handles Storage
class Store {
    static getTasks() {
        let tasks;
        if (localStorage.getItem("tasks") === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }
        return tasks;
    }

    static addTask(task) {
        const tasks = Store.getTasks();
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    static removeTask(id) {
        const tasks = Store.getTasks();
        tasks.forEach((task, index) => {
            if (task.id === id) {
                tasks.splice(index, 1);
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}


// Event -> Display Tasks
document.addEventListener("DOMContentLoaded", Planner.displayTasks);

// Event -> Add a Task
document.querySelector("#task-form").addEventListener("submit", (event) => {
    // Prevent actual submit
    event.preventDefault();

    // Get form values
    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const date = document.querySelector("#date").value;

    // Validate
    if (title === "" || description === "" || date === "") {
        Planner.showAlert("Please fill in all fields", "danger");
    } else {
        // Instatiate task
        const task = new Task(title, description, date);

        // Add task to planner
        Planner.addTaskToList(task);

        // Add task to store
        Store.addTask(task);

        // Show success message
        Planner.showAlert("Task added", "success");

        // Clear fields
        Planner.clearFields();
    }
})

// Event -> Remove a Task
document.querySelector("#task-list").addEventListener("click", event => {
    // Remove task from planner
    Planner.deleteTask(event.target);
});

// Event -> Make a Task done
document.querySelector("#task-list").addEventListener("click", event => Planner.crossOutTask(event.target));