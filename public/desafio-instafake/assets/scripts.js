const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password })
            })
        const { token } = await response.json();
        localStorage.setItem('jwt-token', token);
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}
const baseUrl = 'http://localhost:3000/api/photos';
const getPosts = async (url, jwt) => {
    try {
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`
            }
            })
        const { data } = await response.json();
        if(data){
            fillCard(data);
            toggleCard('js-form-wrapper');
        }
        
        // console.log(data);
        // console.log(data[0].url)
        return data
    } catch (err) {
        localStorage.clear();
        console.error(`Error: ${err}`)
    }
}
const numPage = async (n) => {
    const token = localStorage.getItem('jwt-token')
    const url = `${baseUrl}?page=${n}`;
    return getPosts(url, token);
}
const init = async () => {
    const token = localStorage.getItem('jwt-token')
    if (token) {
        getPosts(token);
    }
}
init();
const fillCard = (data) => {
    let cards = "";
        for(i=0; i < data.length; i++){
            cards += `<div class="card my-5" style="width: 30rem;" id="center-card">
                        <img src="${data[i].download_url}" class="card-img-top" alt="...">
                        <div class="card-body">
                        <h5 class="card-title">${data[i].author}${i}</h5>  
                        </div>
                    </div>`
        }
    document.querySelector("#container-insta").innerHTML += cards
}

const toggleCard = (form, boton) => {
    $(`#${form}`).toggle();
    // $(`#${card}`).toggle();
}

$('#js-form').submit( async (event) =>{
    event.preventDefault();
    const email = document.querySelector("#js-input-email").value;
    const pass = document.querySelector("#js-input-password").value;
    const JWT = await postData(email, pass);
    getPosts(baseUrl, JWT);
    // const post = await getPosts(JWT);
    // fillTable(post, "js-table-posts")
    // toggleFormAndTable("js-form-wrapper", "js-table-wrapper");
    // console.log(JWT);
})

let currentPage = 1;

let btnLoadMore = document.querySelector("#loadMore");
btnLoadMore.addEventListener("click", dataPage);

function dataPage(event){
    event.preventDefault();
    const token = localStorage.getItem('jwt-token');
    console.log(token);
    let nextPage = currentPage + 1;
    Promise.resolve().then(
        numPage(nextPage)
    )
    currentPage = nextPage;
}

document.querySelector("#log-out").addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();   

})

