const urlBase = "https://jsonplaceholder.typicode.com/posts";
let posts = [];

function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            posts = data;
            renderData();
        })
        .catch(error => console.log('Error al llamar a la API: ', error))
}

function renderData() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
            <!-- HTML -->
            <strong>${post.title}</strong>
            <p>${post.body}</p>

            <button onclick = "editPost(${post.id})">Editar</button>
            <button onclick = "deletePost(${post.id})">Borrar</button>
            
            <div id="editForm-${post.id}" class="editForm" style="display: none;">
                <label for="editTitle">Título: </label>
                <input id="editTitle-${post.id}" type="text" value="${post.title}" required>

                <label for="editBody">Contenido: </label>
                <textarea id="editBody-${post.id}" required></textarea>

                <button onclick="updatePost(${post.id})">Actualizar</button>
            </div>
        `;

        postList.appendChild(listItem);
    });
}

function postData() {
    const postTitle = document.getElementById('postTitle').value;
    const postBody = document.getElementById('postBody').value;

    // validación de campos vacíos
    if (postTitle.trim() == '' || postBody.trim() == '') {
        alert('Por favor, complete todos los campos.');
        return;
    };

    // fetch POST
    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
        title: postTitle,
        body: postBody,
        userId: 1,
        }),
        headers: {
        'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then(data => {
        posts.push(data);
        renderData();
    })
    .catch(error => console.log('Error al enviar datos a la API: ', error));
}