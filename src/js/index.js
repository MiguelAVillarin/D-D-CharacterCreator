let clasesRadio = document.getElementById("clasesRadio");
let razaRadio = document.getElementById("razaRadio");
let claseExplicacion = document.getElementById("expClase");
let razaExplicacion = document.getElementById("expRaza");
let cartaPersonaje=document.getElementById("cartaPersonaje");
let imgPersonaje=document.getElementById("imgPersonaje");
let imgPersonajeClase=document.getElementById("imgPersonajeClase");

let clase = "";
let raza = "";

razaRadio.addEventListener("change", razaSeleccionada);
clasesRadio.addEventListener("change", claseSeleccionada);
function Get(yourUrl) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function radioClases() {
    var json = JSON.parse(Get(`https://www.dnd5eapi.co/api/classes`));

    for (let index = 0; index < json.results.length; index++) {
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.classList.add("btn-check");
        radio.name = "Clases";
        radio.id = `Clase${index + 1}`;
        radio.value = json.results[index].index;
        radio.autocomplete = "off";
        let label = document.createElement("label");
        label.classList.add("btn");
        label.classList.add("btn-outline-success");
        label.htmlFor = `Clase${index + 1}`;
        label.innerText = json.results[index].name;

        clasesRadio.appendChild(radio);
        clasesRadio.appendChild(label);
    }
}


function radioRazas() {
    var json = JSON.parse(Get(`https://www.dnd5eapi.co/api/races`));
    
    for (let index = 0; index < json.results.length; index++) {
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
}

function claseSeleccionada() {
    claseExplicacion.innerHTML="";
    clase = document.querySelector('input[name="Clases"]:checked').value;;
    var json = JSON.parse(Get(`https://www.dnd5eapi.co/api/classes/${clase}`));
    imgPersonajeClase.src=`/src/img/Clases/${clase}.jpeg`;


    //Mostrar Carta HitDice
    let hitdice=document.createElement("div");
    hitdice.classList.add("card");
    hitdice.classList.add("HitDice");
    let imgHitDice=document.createElement("img");
    imgHitDice.classList.add("card-img-top");
    imgHitDice.src=`/src/img/Dados/${json.hit_die}.png`;
    hitdice.appendChild(imgHitDice);
    let bodyHitdice=document.createElement("div");
    hitdice.classList.add("card-body");
    let titHitdice=document.createElement("h5");
    titHitdice.classList.add("card-title");
    titHitdice.classList.add("text-center");
    titHitdice.innerText="Hit dice";
    bodyHitdice.appendChild(titHitdice);
    hitdice.appendChild(bodyHitdice);
    claseExplicacion.appendChild(hitdice);

    claseExplicacion.appendChild(crearTablaProEq(json.proficiencies,false,"Proficencies"));

    console.log(json);
}

function crearTablaProEq(array,traitsS,titulo) {
    //Crear elementos tabla proficencies
    let tableResponsive=document.createElement("div");
    tableResponsive.classList.add("table-responsive");
    let proficencies=document.createElement("table");
    proficencies.classList.add("table");
    proficencies.classList.add("table-striped");
    proficencies.classList.add("table-dark");
    let theadP=document.createElement("thead");
    let tituloTabla=document.createElement("tr");
    let tituloEl1=document.createElement("th");
    tituloEl1.innerText=titulo;
    tituloEl1.scope="col";
    tituloTabla.appendChild(tituloEl1);
    theadP.appendChild(tituloTabla);
    proficencies.appendChild(theadP);
    //Insertar los elementos
    let tbodyP=document.createElement("tbody");
    if(array.length==0){
        let fila=document.createElement("tr");
        let arma=document.createElement("td");
        arma.innerText=`❌ None`;
        fila.appendChild(arma);
        tbodyP.appendChild(fila);
    }
    array.forEach(element => {
        let fila=document.createElement("tr");
        let arma=document.createElement("td");
        arma.id=`${element.index}`;
        if(traitsS){
            arma.innerText=`✅ ${element.name}`;
        }else{
            if(element.name.startsWith('Saving')){
                arma.innerText=`✨ ${element.name}`;
            }else{
                if(element.name.toLowerCase().includes('armor') || element.name.toLowerCase().includes("shields")){
                    arma.innerText=`💠 ${element.name}`;
                }else{
                    if(element.name.toLowerCase().includes('kit') || element.name.toLowerCase().includes("tool")){
                        arma.innerText=`💡 ${element.name}`;
                    }else{
                        arma.innerText=`⚔ ${element.name}`;
                    }
                }
            }
        }
        
        fila.appendChild(arma);

        tbodyP.appendChild(fila);
    });
    proficencies.appendChild(tbodyP);
    tableResponsive.appendChild(proficencies);
    return tableResponsive;
}

function razaSeleccionada() {
    razaExplicacion.innerHTML="";
    raza = document.querySelector('input[name="Razas"]:checked').value;;
    var json = JSON.parse(Get(`https://www.dnd5eapi.co/api/races/${raza}`));
    imgPersonaje.src=`/src/img/Razas/${raza}.png`;

    razaExplicacion.appendChild(crearTablaProEq(json.traits,true,"Traits"));

    console.log(json);
}

radioRazas();
radioClases();