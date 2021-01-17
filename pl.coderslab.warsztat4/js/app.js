const apikey = 'd9fe1b40-935f-4745-8d70-5b40936a7c64';
const apihost = 'https://todo-api.coderslab.pl';



document.addEventListener('DOMContentLoaded', function() {
    function apiListTasks() {
        return fetch(
            apihost + '/api/tasks',
            {
                headers: { Authorization: apikey }
            }
        ).then(
            function (resp) {
                if(!resp.ok) {
                    alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
                }
                return resp.json();
            }
        )
    }
});