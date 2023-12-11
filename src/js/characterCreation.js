let clasesRadio = document.getElementById("clasesRadio");
let razaRadio = document.getElementById("razaRadio");
let alignmentsSelect = document.getElementById("alignmentsSelect");
let claseExplicacion = document.getElementById("expClase");
let razaExplicacion = document.getElementById("expRaza");
let cartaPersonaje = document.getElementById("cartaPersonaje");
let imgPersonaje = document.getElementById("imgPersonaje");
let imgPersonajeClase = document.getElementById("imgPersonajeClase");
let saveButton = document.getElementById("saveButton");
let nombreInput = document.getElementById("nombrePersonaje");

let APIurl = "https://www.dnd5eapi.co";

import { DatabaseManager } from "./indexDB.js";
const dbManager = DatabaseManager.getInstance();

let clase = "";
let raza = "";
let personajeCreado;

razaRadio.addEventListener("change", isCompleted);
clasesRadio.addEventListener("change", isCompleted);
nombreInput.addEventListener("focusout", isCompleted);
alignmentsSelect.addEventListener("change", isCompleted);
saveButton.addEventListener("click", guardarBD);

razaRadio.addEventListener("change", razaSeleccionada);
clasesRadio.addEventListener("change", claseSeleccionada);

function createID() {
    return Math.random().toString(16).slice(2);
}

const Get = async (API) => {
    let result = await fetch(API)
    let data = await result.json();
    return data;
}

async function radioClases() {
    var json = await Get(`https://www.dnd5eapi.co/api/classes`);

    for (let index = 0; index < json.count; index++) {
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.classList.add("btn-check");
        radio.name = "Clases";
        radio.id = `Clase${index + 1}`;
        radio.value = json.results[index].index;
        radio.autocomplete = "off";
        let label = document.createElement("label");
        label.classList.add("btn");
        label.classList.add("btn-outline-primary");
        label.htmlFor = `Clase${index + 1}`;
        label.innerText = json.results[index].name;

        clasesRadio.appendChild(radio);
        clasesRadio.appendChild(label);
    }
    if (personajeCreado != null) {
        document.querySelector(`input[value='${personajeCreado.clase}']`).checked = true;
        claseSeleccionada();
    }
}


async function radioRazas() {
    var json = await Get(`https://www.dnd5eapi.co/api/races`);

    for (let index = 0; index < json.count; index++) {
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.classList.add("btn-check");
        radio.name = "Razas";
        radio.id = `Raza${index + 1}`;
        radio.value = json.results[index].index;
        radio.autocomplete = "off";
        let label = document.createElement("label");
        label.classList.add("btn");
        label.classList.add("btn-outline-primary");
        label.htmlFor = `Raza${index + 1}`;
        label.innerText = json.results[index].name;

        razaRadio.appendChild(radio);
        razaRadio.appendChild(label);
    }

    if (personajeCreado != null) {
        document.querySelector(`input[value='${personajeCreado.raza}']`).checked = true;
        razaSeleccionada();
    }
}

async function selectAlignment() {
    var json = await Get(`https://www.dnd5eapi.co/api/alignments`);

    for (let index = 0; index < json.count; index++) {
        let option = document.createElement("option");
        option.value = json.results[index].index;
        option.innerText = json.results[index].name;

        alignmentsSelect.appendChild(option);
    }
    if(personajeCreado!=null){
        alignmentsSelect.value=personajeCreado.alignment;
    }
}

async function claseSeleccionada() {
    claseExplicacion.innerHTML = "";
    clase = document.querySelector('input[name="Clases"]:checked').value;
    var json = await Get(`https://www.dnd5eapi.co/api/classes/${clase}`);
    imgPersonajeClase.src = `../img/Clases/${clase}.jpeg`;


    //Mostrar Carta HitDice
    let hitdice = document.createElement("div");
    hitdice.classList.add("card");
    hitdice.classList.add("HitDice");
    hitdice.classList.add("bg-info");
    hitdice.classList.add("h-100");
    hitdice.classList.add("text-white");
    let imgHitDice = document.createElement("img");
    imgHitDice.classList.add("card-img-top");
    imgHitDice.src = `../img/Dados/${json.hit_die}.png`;
    hitdice.appendChild(imgHitDice);
    let bodyHitdice = document.createElement("div");
    hitdice.classList.add("card-body");
    let titHitdice = document.createElement("h5");
    titHitdice.classList.add("card-title");
    titHitdice.classList.add("text-center");
    titHitdice.innerText = "Hit dice";
    bodyHitdice.appendChild(titHitdice);
    hitdice.appendChild(bodyHitdice);
    claseExplicacion.appendChild(hitdice);

    claseExplicacion.appendChild(await crearTablaProEq(json.proficiencies, 0, "Proficencies"));
    var featuresClase = await Get(`${APIurl}/api/classes/${clase}/levels/1`);
    claseExplicacion.appendChild(await crearTablaProEq(featuresClase.features, 2, "Features"));

    setTimeout(popOverCall, 1000);
}

/*
ValorFun
0=Proficencies
1=Tratits
2=Features
*/
async function crearTablaProEq(array, valorFun, titulo) {
    //Crear elementos tabla proficencies
    let jsonDescripcion;
    let jsonURL;
    let tableResponsive = document.createElement("div");
    tableResponsive.classList.add("table-responsive");
    let proficencies = document.createElement("table");
    proficencies.classList.add("table");
    proficencies.classList.add("table-striped");
    proficencies.classList.add("table-dark");
    let theadP = document.createElement("thead");
    let tituloTabla = document.createElement("tr");
    let tituloEl1 = document.createElement("th");
    tituloEl1.innerText = titulo;
    tituloEl1.scope = "col";
    tituloTabla.appendChild(tituloEl1);
    theadP.appendChild(tituloTabla);
    proficencies.appendChild(theadP);
    //Insertar los elementos
    let tbodyP = document.createElement("tbody");

    if (array.length == 0) {
        let fila = document.createElement("tr");
        let arma = document.createElement("td");
        arma.innerText = `❌ None`;
        fila.appendChild(arma);
        tbodyP.appendChild(fila);
    } else {
        if (valorFun == 1) {
            jsonURL = `${APIurl}/api/traits/`;
        } else {
            if (valorFun == 2) {
                jsonURL = `${APIurl}/api/features/`;
            }
        }
    }
    array.forEach(async element => {
        let fila = document.createElement("tr");
        let arma = document.createElement("td");
        arma.id = `${element.index}`;
        if (valorFun == 1 || valorFun == 2) {
            arma.innerText = `✅ ${element.name}`;
        } else {
            if (element.name.startsWith('Saving')) {
                arma.innerText = `✨ ${element.name}`;
            } else {
                if (element.name.toLowerCase().includes('armor') || element.name.toLowerCase().includes("shields")) {
                    arma.innerText = `💠 ${element.name}`;
                } else {
                    if (element.name.toLowerCase().includes('kit') || element.name.toLowerCase().includes("tool")) {
                        arma.innerText = `💡 ${element.name}`;
                    } else {
                        arma.innerText = `⚔ ${element.name}`;
                    }
                }
            }
        }
        if (valorFun == 1 || valorFun == 2) {
            jsonDescripcion = await Get(`${jsonURL}${element.index}`);

            let desc = jsonDescripcion.desc;
            arma.innerHTML = `<a href="#1" class="exp" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="${desc}">${arma.innerText}</a>`;
        }

        fila.appendChild(arma);

        tbodyP.appendChild(fila);
    })
    proficencies.appendChild(tbodyP);
    tableResponsive.appendChild(proficencies);

    return tableResponsive;
}

async function razaSeleccionada() {
    razaExplicacion.innerHTML = "";
    raza = document.querySelector('input[name="Razas"]:checked').value;;
    var json = await Get(`https://www.dnd5eapi.co/api/races/${raza}`);
    imgPersonaje.src = `../img/Razas/${raza}.png`;

    //Base carta
    let movimiento = document.createElement("div");
    movimiento.classList.add("card");
    movimiento.classList.add("bg-info");
    movimiento.classList.add("text-white");
    movimiento.classList.add("datosRaza");
    movimiento.classList.add("h-100");
    let bodyMov = document.createElement("div");
    movimiento.classList.add("card-body");
    //Información extra
    let textoTitulo = document.createElement("h5");
    textoTitulo.classList.add("card-title");
    textoTitulo.classList.add("text-center");
    textoTitulo.innerText = `About ${raza}`;
    bodyMov.appendChild(textoTitulo);
    //Movimiento
    let textoMovimiento = document.createElement("p");
    textoMovimiento.classList.add("card-text");
    textoMovimiento.classList.add("text-center");
    textoMovimiento.innerText = `${json.speed} Movement Speed`;
    bodyMov.appendChild(textoMovimiento);
    //Language
    let textoLenguaje = document.createElement("p");
    textoLenguaje.classList.add("card-text");
    textoLenguaje.classList.add("text-center");
    textoLenguaje.innerText = `${json.language_desc}`;
    bodyMov.appendChild(textoLenguaje);
    //Añadir
    movimiento.appendChild(bodyMov);
    razaExplicacion.appendChild(movimiento);

    document.getElementById("edadText").innerText = `${json.age}`;
    document.getElementById("sizeText").innerText = `${json.size_description}`;

    razaExplicacion.appendChild(await crearTablaProEq(json.traits, 1, "Traits"));
    setTimeout(popOverCall, 1000);
}
//Bootstrap popover
function popOverCall() {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })
}

function isCompleted() {
    if (clase != "" && raza != "" && nombreInput.value != "") {
        saveButton.classList.remove("disabled");
    }
}

function guardarBD() {
    let personaje = {
        id: 0,
        nombre: "",
        alignment: "",
        clase: "",
        raza: ""
    };

    personaje.alignment = alignmentsSelect.value;
    personaje.clase = clase;
    personaje.nombre = nombreInput.value;
    personaje.raza = raza;
    if(personajeCreado!=null){
        personaje.id =personajeCreado.id;
    }else{
        personaje.id = createID();
    }


    dbManager.open().then(() => {
        dbManager.addData(personaje)
            .then(() => {
            })
            .catch((error) => {
                console.error("Error addData: " + error);
            });
    });
    setTimeout(function name() {
        window.location.href = "../../index.html"
    }, 500);

}

var parametro = location.search.substring(4);
if (parametro != "") {
    dbManager.open().then(() => {
        dbManager.getData(parametro)
            .then((e) => {
                personajeCreado = {
                    id: e.id,
                    nombre: e.nombre,
                    alignment: e.alignment,
                    clase: e.clase,
                    raza: e.raza
                };
                nombreInput.value = personajeCreado.nombre;
            })
            .catch((error) => {
                console.error("Error addData: " + error);
            });
    })
        .catch((error) => {
            console.error("Error open: " + error);
        });
}

//Llenar los imputs
radioRazas();
radioClases();
selectAlignment();