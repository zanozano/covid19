var dataPhotos;
var count = 0;
var countPage = 1;

$('#js-form').submit(async (event) => {
    event.preventDefault()
    const email = document.getElementById('js-input-email').value
    const password = document.getElementById('js-input-password').value
    const JWT = await postData(email, password)

    if (JWT) {
        document.getElementById("js-form").style.display = "none"
        getPhotos(JWT)
    } else {

    }

})



const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        const {
            token
        } = await response.json()
        if (response.status != 200) {
            alert("Se ha ingresado un usuario incorrecto.")
        } else {
            localStorage.setItem('jwt-token', token)
            return token
        }
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

const getPhotos = async (jwt, page = 1) => {
    try {
        let url;
        if (page == 1) {
            url = 'http://localhost:3000/api/photos'
        } else {
            url = `http://localhost:3000/api/photos?page=${page}`
        }
        console.log(url)

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {
            data
        } = await response.json()
        if (data) {
            dataPhotos = data;
            pintar(data);
        }
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

const init = async () => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        document.getElementById("js-form").style.display = "none";
        getPhotos(token)
    }
    if (token == "undefined") {
        document.getElementById("js-form").style.display = "block";
        localStorage.clear()
    }
}
init();

const salir = () => {
    localStorage.clear()
    document.getElementById("js-form").style.display = "block";
    document.getElementById("pictures").style.display = "none";
    document.getElementById("footer").style.display = "none";
    const email = document.getElementById('js-input-email').value = ""
    const password = document.getElementById('js-input-password').value = ""
}

const pintar = (data) => {
    data = data.slice(1, 5)
    count = data.length;
    let text = "";
    document.getElementById("pictures").style.display = "block";
    document.getElementById("footer").style.display = "block";
    data.forEach(f => {

        text += `
            <div id="${f.id}" class="pictures_img col-12">
            <a href="${f.url}" target="_blank">
                <img alt="InstaPicture" src="${f.download_url}" width="100%">
            </a>
        </div>
        <div class="pictures_author" class="col-12 py-2">
        <h4>Autor: ${f.author}</h4>
        </div>
        `
    });
    document.getElementById("pictures_content").innerHTML = text;

}

const mostrarMas = () => {
    if (count < dataPhotos.length - 1) {
        count += 1;
        let data = dataPhotos[count]
        let text = `
            <div id="${data.id}" class="pictures_img col-12">
            <a href="${data.url}" target="_blank">
                <img alt="InstaPicture" src="${data.download_url}" width="100%">
            </a>
        </div>
        <div class="pictures_author" class="col-12 py-2">
        <h4>Autor: ${data.author}</h4>
        </div>
        `
        $("#pictures_content").append(text);
        var element = document.getElementById(data.id);

        setTimeout(function () {
            element.scrollIntoView();
        }, 2000);


    } else {
        alert("No hay más imagenes por mostrar.")
    }

}

const cambiar = () => {
    const token = localStorage.getItem('jwt-token');
    countPage += 1;
    if (countPage > 10) {
        countPage = 1;
    }
    getPhotos(token, countPage);


}