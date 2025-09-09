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

getData();

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
                <textarea id="editBody-${post.id}" required>${post.body}</textarea>

                <button onclick="updatePost(${post.id})">Actualizar</button>
            </div>
        `;

        postList.appendChild(listItem);
    });
}

function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

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
        posts.unshift(data);
        renderData();
        postTitleInput.value = '';
        postBodyInput.value = '';
    })
    .catch(error => console.log('Error al enviar datos a la API: ', error));
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none';
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    if (editTitle.trim() == '' || editBody.trim() == '') {
        alert('Por favor, complete todos los campos.');
        return;
    };

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
        id: id,
        title: editTitle,
        body: editBody,
        userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id);
        if (index != -1) {
            posts[index] = data;
        } else {
            alert('Hubo un error al actualizar la información del posteo');
        }
        renderData();
    })
    .catch(error => console.log('Error al actualizar datos en la API: ', error));
} 

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok) {
            posts = posts.filter(post => post.id != id);
            renderData();
        } else {
            alert('Hubo un error al eliminar el posteo');
        }
    })
    .catch(error => console.log('Error al eliminar datos en la API: ', error));
}