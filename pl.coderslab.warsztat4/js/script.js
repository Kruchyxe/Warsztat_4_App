const apikey = 'cd9b2a65-cb4b-4d0f-9102-42d836ccfdd5';
const apihost = 'https://todo-api.coderslab.pl';

// if(apikey == '') {
//     alert('Wejdź na https://todo-api.coderslab.pl/apikey/create oraz skopiuj token i wklej do stałej "apikey", w pliku script.js. Inaczej nic się nie uda!');
// }

function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}


function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status == 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Zakończ';
        headerRightDiv.appendChild(finishButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Skasuj';
    headerRightDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', function () {
        apiDeleteTask(taskId).then(
            function () {
                section.parentElement.removeChild(section);
            }
        );
    });

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(
        function (response) {
            response.data.forEach(
                function (operation) {
                    renderOperation(ul, status, operation.id, operation.description, operation.timeSpent)
                }
            )
        }
    )

    if (status == 'open') {
        const addOperationDiv = document.createElement('div');
        addOperationDiv.className = 'card-body js-task-open-only';
        section.appendChild(addOperationDiv);

        const form = document.createElement('form');
        addOperationDiv.appendChild(form);

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        form.appendChild(inputGroup);

        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'Opis zadania');
        descriptionInput.setAttribute('minlength', '5');
        descriptionInput.className = 'form-control';
        inputGroup.appendChild(descriptionInput);

        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.className = 'input-group-append';
        inputGroup.appendChild(inputGroupAppend);

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-info';
        addButton.innerText = 'Dodaj';
        inputGroupAppend.appendChild(addButton);

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apiCreateOperationForTask(taskId, descriptionInput.value).then(
                function (response) {
                    renderOperation(ul, status, response.data.id, response.data.description, response.data.timeSpent);
             }
            )
        })
    }
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {headers: {'Authorization': apikey}}
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

// zamiana operationsList na ul
function renderOperation(ul, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    // operationsList to lista <ul> // zamiana na <ul>
    ul.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = formatTime(timeSpent);
    descriptionDiv.appendChild(time);

    if (status == "open") {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'js-task-open-only'; // skąd ta klasa ?
        li.appendChild(controlDiv);

        const addQuarterBtn = document.createElement('div');
        addQuarterBtn.className = "btn btn-outline-success btn-sm mr-2";
        addQuarterBtn.innerText = 'dodaj 15 min';
        controlDiv.appendChild(addQuarterBtn);

        const addHourBtn = document.createElement('div');
        addHourBtn.className = "btn btn-outline-success btn-sm mr-2";
        addHourBtn.innerText = 'dodaj 1 h';
        controlDiv.appendChild(addHourBtn);

    }

}

function formatTime(timeSpent) {
    const hours = Math.floor(timeSpent / 60);
    const minutes = timeSpent % 60;
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }
}

function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({description: description, timeSpent: 0}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}


document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.js-task-adding-form').addEventListener('submit', function (event) {
            event.preventDefault();
            // apiListTasks().then(
            //     function (response) {
            // "response" zawiera obiekt z kluczami "error" i "data" (zob. wyżej)
            // "data" to tablica obiektów-zadań
            // uruchamiamy funkcję renderTask dla każdego zadania jakie dał nam backend
            apiCreateTask(event.target.elements.title.value, event.target.elements.description.value).then(
                function (response) {
                    renderTask(response.data.id, response.data.title, response.data.description, response.data.status);
                }
            );
        }
    );
});



