//Declaracion de variables, objetos y arreglos.
class Restaurant {
    constructor(nombre, tipoComida, barrio, valorCenaPromedio, codigo) {
        this.nombre = nombre;
        this.tipoComida = tipoComida;
        this.barrio = barrio;
        this.valorCenaPromedio = valorCenaPromedio;
        this.codigo = codigo;
    }
}

let nuevosRestaurantes = []
let restaurantes = [];
let favs = [];
let restaurant;
let contenedorResultados;
let carta;
let barrio;
let formularioBuscador;
let contenedorFavoritos;
let nombreIngresado;
let barrioIngresado;
let valorCenaIngresado;
let comidaIngresada;

//Funciones de inicializacion 

function inicializarElementos() {

    contenedorResultados = document.getElementById("contenedor-resultados");
    contenedorFavoritos = document.getElementById("contenedor-favoritos");
    formularioBuscador = document.getElementById("formularioBuscador");
    carta = document.getElementById("carta");
    barrio = document.getElementById("barrio");
    nombreIngresado = document.getElementById("nombre");
    barrioIngresado = document.getElementById("barrio");
    valorCenaIngresado = document.getElementById("valorCena");
    comidaIngresada = document.getElementById("comida");
}

function inicializarPropiedades() {

    window.addEventListener('DOMContentLoaded', async () => {
        const dataRestaurantes = await cargarRestaurantesRequest();
        restaurantes.push(...dataRestaurantes);
        const datafavs = await cargarFavsRequest();
        cargarFavs(datafavs);
    })

    btnBuscar.addEventListener("click", buscador);

    btnFavoritos.addEventListener("click", async () => {
        const datafavs = await cargarFavsRequest();
        cargarFavs(datafavs);
        pintarTarjetasFavoritos(favs);
    })

    btnEnvio.addEventListener("click", (event) => validarFormulario(event));

}

//Funciones asincronas que consultan/envian informacion a un MockApi

//Solicitar arreglo de objetos a la API para la busqueda
async function cargarRestaurantesRequest() {
    const response = await fetch("https://62f19f23b1098f1508032a3d.mockapi.io/restaurantes");
    return await response.json();
}

//Para enviar restaurantes a la API

async function enviarRestaurantRequest(restaurant) {

    fetch("https://62f19f23b1098f1508032a3d.mockapi.io/restaurantes", {
            method: "POST",
            body: JSON.stringify(restaurant),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then((response) => response.json())
        .then((data) => console.log(data));
}

//Solicitar los favoritos a la API

function cargarFavs(data) {
    if (favs !== []){
        favs = [];
    }
    favs.push(...data);
}

async function cargarFavsRequest() {
    const response = await fetch("https://62f19f23b1098f1508032a3d.mockapi.io/favs");
    return await response.json();
}

//Agregar a favoritos

function onClickFavs(favCodigo) {
    
    if (!perteneceFav(favCodigo)){    
        const favorito = restaurantes.find(resto => parseInt(resto.codigo) === favCodigo);
        enviarFavRequest(favorito);
        mostrarToastSatisfactorio()
    }
}

function perteneceFav (favCodigo) {

    for (const favorito of favs) {
        if (favorito.codigo === favCodigo) {
            mostrarToastInsatisfactorio()
            return true
            break
        }
    }

}

async function enviarFavRequest(fav) {

    fetch("https://62f19f23b1098f1508032a3d.mockapi.io/favs", {
            method: "POST",
            body: JSON.stringify(fav),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then((response) => response.json())
        .then((data) => console.log(data));
}

//Eliminar favoritos

async function eliminarFavorito(favID) {
    try {
        let response = await eliminarFavRequest(favID)
        let favoritosFiltrados = favs.filter(
            (fav) => parseInt(fav ?.id) !== favID
        );
        favs = [...favoritosFiltrados];
        pintarTarjetasFavoritos(favs);
    } catch (error) {
        console.log("Algo salio mal che");
        showToast("error", 3600);
    }

}

async function eliminarFavRequest(favID) {
    fetch(`https://62f19f23b1098f1508032a3d.mockapi.io/favs/${favID}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    })
}

//Funcion de filtro

function buscador() {
    if (nuevosRestaurantes !== []) {
        nuevosRestaurantes = [];
    }

    if (barrio.value !== "Elegir barrio..." && carta.value !== "Elegir comida..."){
        filtrarPorComidayBarrio();
    } else {
        if (barrio.value !== "Elegir barrio...") {
            filtrarPorBarrio ();
        } else {
            if (carta.value !== "Elegir comida...") {
                filtrarPorComida ();
            }
        }
    }
}

function  filtrarPorComidayBarrio () {

    restaurantes.filter(restaurant => {
        if (restaurant.barrio.toLowerCase() === barrio.value.toLowerCase() && restaurant.tipoComida.includes(carta.value) ){
            nuevosRestaurantes.push(restaurant);

        }
        pintarTarjetasBusqueda(nuevosRestaurantes);
})}

function  filtrarPorComida () {

    restaurantes.filter(restaurant => {
        if (restaurant.tipoComida.includes(carta.value) ){
            nuevosRestaurantes.push(restaurant);

        }
        pintarTarjetasBusqueda(nuevosRestaurantes);
})}

function  filtrarPorBarrio () {

    restaurantes.filter(restaurant => {
        if (barrio.value === restaurant.barrio ){
            nuevosRestaurantes.push(restaurant);

        }
        pintarTarjetasBusqueda(nuevosRestaurantes);
})}

//Funciones que pintan las tarjetas

function pintarTarjetasBusqueda(restaurantes) {

    ocultarInnerHtml(contenedorResultados);
    for (const restaurant of restaurantes) {

        let columna = document.createElement("div");
        columna.calssName = "col-md-4 mt-3"
        columna.id = `columna-${restaurant.id}`
        columna.innerHTML = `
            <div class = "card">
                <div class = "card-body">
                    <p class = "card-text"><b>${restaurant.nombre}</b></p>
                    <p class = "card-text"><b>${restaurant.tipoComida}</b></p>
                    <p class = "card-text"><b>${restaurant.barrio}</b></p>
                    <p class = "card-text"><b>$${restaurant.valorCenaPromedio}</b></p>
                    <button class="btn btn-info " type="submit" onclick="onClickFavs(${restaurant.codigo})" id="btnFavs-${restaurant.id}">Favoritos</button>
                </div>
            </div>`

        contenedorResultados.append(columna);
    }
}

function pintarTarjetasFavoritos(restaurantes) {

    ocultarInnerHtml(contenedorFavoritos);
    let titulo = document.createElement("h1");
    titulo.innerHTML = "Estos son tus favoritos"
    contenedorFavoritos.append(titulo);

    for (const restaurant of restaurantes) {

        let columna = document.createElement("div");
        columna.calssName = "col-md-4 mt-3"
        columna.id = `columna-${restaurant.id}`
        columna.innerHTML = `
            <div class = "card">
                <div class = "card-body">
                    <p class = "card-text"><b>${restaurant.nombre}</b></p>
                    <p class = "card-text"><b>${restaurant.tipoComida}</b></p>
                    <p class = "card-text"><b>${restaurant.barrio}</b></p>
                    <p class = "card-text"><b>$${restaurant.valorCenaPromedio}</b></p>
                    <button class="btn btn-info " type="submit" onclick="confirmacionEliminarFav(${restaurant.id})" id="btnFavs-${restaurant.id}">Quitar</button>
                </div>
            </div>`

        contenedorFavoritos.append(columna);
    }
}

function ocultarInnerHtml (contenedor) {
    if (contenedor !== undefined){
        contenedor.innerHTML = ``;
    }    
}

//Funciones que muestran toast/Sweet Alert

function mostrarToastSatisfactorio() {
    Toastify({
        text: "Agregado a favoritos!",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}

function mostrarToastInsatisfactorio() {
    Toastify({
        text: "Este restaurant ya esta en tus favoritos!",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}

function mostrarToastNoAprobado() {
    Toastify({
        text: "Por favor completa todos los datos",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}

function mostrarToastAprobado() {
    
    Toastify({
        text: "Gracias por tu recomendacion!",
        duration: 3000,
        close: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
    
}

//Funcion confirmacion de informacion

function confirmacionEliminarFav(ID) {

    Swal.fire({
            title: "Seguro que deseas eliminar de favorito?",
            text: "¿Eliminar?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        .then(resultado => {
            if (resultado.value) {
                // Hicieron click en "Sí"
                eliminarFavorito(ID);
            } else {
                // Dijeron que no
                console.log("*NO se elimina la venta*");
            }
        });

}

function buscarElUltimoRestaurant (restaurantes) {
    let ultimoRestaurant = restaurantes[restaurantes.length-1];
    let ultimoCodigo = ultimoRestaurant.codigo;
    return ultimoCodigo
}

//Funcion para validar y enviar formularios

function validarFormulario(event) {

    event.preventDefault();

    let nombre = nombreIngresado.value;
    let barrio = barrioIngresado.value;
    let cena = parseFloat(valorCenaIngresado.value);
    let comida = comidaIngresada.value;
    let codigo = buscarElUltimoRestaurant(restaurantes)+ 1;

    if (nombre == "" || barrio == "" || cena == "" || comida == "") {
        
        mostrarToastNoAprobado();
    } 
    else {

        let provincia = new Restaurant(
            nombre,
            comida,
            barrio,
            cena,
            codigo
        );
        console.log(provincia);
        enviarRestaurantRequest(provincia);
        formulario.reset();
        mostrarToastAprobado();
    }
}

function main() {

    inicializarPropiedades();
    inicializarElementos();
    cargarRestaurantesRequest();
}

main();