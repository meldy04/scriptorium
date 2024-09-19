document.getElementById('addItemButton').addEventListener('click', function() {
    const input = document.getElementById('itemInput').value;

    if (input.trim() !== "") {
        const ul = document.getElementById('itemList');
        const li = document.createElement('li');

        li.textContent = input;
        ul.appendChild(li);
        document.getElementById('itemInput').value = '';
    }
});

document.getElementById('submitButton').addEventListener('click', function() {
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('repeatPasswordError').textContent = '';
    document.getElementById('successMessage').textContent = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const repeatPassword = document.getElementById('repeatPassword').value.trim();

    let isValid = true;

    if (name === '') {
        document.getElementById('nameError').textContent = 'Name is required.';

        document.getElementById('nameError').style.borderColor = 'red';
        document.getElementById('nameError').style.borderWidth = '2px';
        document.getElementById('nameError').style.borderStyle = 'solid';
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email is required.';
        document.getElementById('emailError').style.borderColor = 'red';
        document.getElementById('emailError').style.borderWidth = '2px';
        document.getElementById('emailError').style.borderStyle = 'solid';
        isValid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email.';
        document.getElementById('emailError').style.borderColor = 'red';
        document.getElementById('emailError').style.borderWidth = '2px';
        document.getElementById('emailError').style.borderStyle = 'solid';
        isValid = false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/;
    if (password === '') {
        document.getElementById('passwordError').textContent = 'Password is required.';
        document.getElementById('passwordError').style.borderColor = 'red';
        document.getElementById('passwordError').style.borderWidth = '2px';
        document.getElementById('passwordError').style.borderStyle = 'solid';
        isValid = false;
    } else if (!passwordPattern.test(password)) {
        document.getElementById('passwordError').textContent = 'Password must have at least 1 uppercase, 1 lowercase, 1 digit, and be at least 5 characters long.';
        document.getElementById('passwordError').style.borderColor = 'red';
        document.getElementById('passwordError').style.borderWidth = '2px';
        document.getElementById('passwordError').style.borderStyle = 'solid';
        isValid = false;
    }

    if (repeatPassword === '') {
        document.getElementById('repeatPasswordError').textContent = 'Confirm password is required.';
        document.getElementById('repeatPasswordError').style.borderColor = 'red';
        document.getElementById('repeatPasswordError').style.borderWidth = '2px';
        document.getElementById('repeatPasswordError').style.borderStyle = 'solid';
        isValid = false;
    } else if (password !== repeatPassword) {
        document.getElementById('repeatPasswordError').textContent = 'Passwords do not match.';
        document.getElementById('repeatPasswordError').style.borderColor = 'red';
        document.getElementById('repeatPasswordError').style.borderWidth = '2px';
        document.getElementById('repeatPasswordError').style.borderStyle = 'solid';
        isValid = false;
    }

    if (isValid) {
        document.getElementById('successMessage').textContent = 'Form submitted successfully!';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addTodoButton');
    const todoList = document.getElementById('todoList');
    const newTodoInput = document.getElementById('newTodo');

    function todoApp(task) {
        const li = document.createElement('li');
        li.textContent = task;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';

        li.appendChild(checkbox);
        li.appendChild(deleteButton);

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                li.style.textDecoration = 'line-through';
            } else {
                li.style.textDecoration = 'none';
            }
        });

        deleteButton.addEventListener('click', function() {
            todoList.removeChild(li);
        });
        return li;
    }

    addButton.addEventListener('click', function() {
        const task = newTodoInput.value.trim();
        if (task) {
            const todoItem = todoApp(task);
            todoList.appendChild(todoItem);
            newTodoInput.value = '';
        }
    });

    newTodoInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addButton.click();
        }
    });
});