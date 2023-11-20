const express = require('express');
const chargebee = require('chargebee');
const bodyParser = require('body-parser');

chargebee.configure({
    site: 'fleetr',
    api_key: 'live_kZ8aVbzaTcuQzJKKvPMyw4kjAdRFRXr86'
});

async function fetchJson(url, headers) {
    const response = await fetch(url, { headers });
    return response.json();
}

async function getCustomerByEmail(customerEmail) {
    try {
        const headers = new Headers({ "Authorization": "Basic bGl2ZV9rWjhhVmJ6YVRjdVF6SktLdlBNeXc0a2pBZFJGUlhyODY6" });
        const url = `https://fleetr.chargebee.com/api/v2/customers?email[is]=${customerEmail}`;
        const result = await fetchJson(url, headers);
        return result.list[0].customer;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const app = express();
const port = 3000; // Puedes cambiar el puerto si es necesario

// Configuración de Body-Parser para analizar datos del formulario
app.use(bodyParser.urlencoded({
    extended: true
}));

// Ruta para la página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Ruta para manejar la solicitud del formulario
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer lRwGGABMT7uVXYb5wNSfWUiYy0EDy0JP34ZeHYxd");

    var raw = JSON.stringify({
        "email": email,
        "password": password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.fleetr.app/api/v1/auth/admin/local", requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                console.log(result);
                res.send('Datos recibidos correctamente');
                getCustomerByEmail(email);
            } catch (error) {
                console.error(`Error processing customer ${email}:`, error.message);
            }
        })
        .catch(error => console.log('error', error));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});