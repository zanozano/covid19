const token = localStorage.getItem('jwt-token')
if (token) {
    document.getElementById("link-covid-chile").style.display = "block"
    document.getElementById("link-sesion").style.display = "none"
    document.getElementById("link-cerrar-sesion").style.display = "block"

} else {
    document.getElementById("link-covid-chile").style.display = "none"
    document.getElementById("link-sesion").style.display = "block"
    document.getElementById("link-cerrar-sesion").style.display = "none"
}

$("#link-cerrar-sesion").on("click", () => {
    localStorage.clear();
    location.reload();
})


$('#js-form').submit(async (event) => {

    event.preventDefault()
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    const email = document.getElementById('js-input-email').value
    const password = document.getElementById('js-input-password').value

    if (emailRegex.test(email)) {
        if (password != "") {
            const JWT = await postData(email, password)

            if (JWT) {

                $('#sesionModal').modal('toggle');
                document.getElementById("link-covid-chile").style.display = "block"
                document.getElementById("link-sesion").style.display = "none"
                document.getElementById("link-cerrar-sesion").style.display = "block"
            }
        } else {
            alert("Debe ingresar una contraseña.")
        }
    } else {
        alert("ha ingresado un email con formato no válido.")
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