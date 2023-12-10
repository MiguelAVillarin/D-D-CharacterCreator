import { DatabaseManager } from "./indexDB.js";
const dbManager = DatabaseManager.getInstance();

let hayPj = false

let menuPersonajes = document.getElementById("personajes");

function crearOpcion(element) {
    if (!hayPj) {
        menuPersonajes.innerText = "";
        hayPj = true;
    }

    let personajeDiv = document.createElement("div");
    personajeDiv.classList.add("h-25");
    personajeDiv.classList.add("row");
    personajeDiv.classList.add("justify-content-end");
    personajeDiv.classList.add("align-items-center");
    personajeDiv.classList.add("container");
    personajeDiv.classList.add("column-gap-4");

    let parte1 = document.createElement("div");
    parte1.classList.add("row");
    parte1.classList.add("flex-row");
    parte1.classList.add("flex-wrap");
    parte1.classList.add("justify-content-center");
    parte1.classList.add("column-gap-4");
    parte1.classList.add("col");
    parte1.classList.add("container");
    parte1.classList.add("menuOpcion");

    let imagen = document.createElement("img");
    imagen.src = `src/img/Clases/${element.clase}.jpeg`;
    imagen.classList.add("col");
    imagen.classList.add("imgOpcion");
    parte1.appendChild(imagen);

    let texto = document.createElement("div");
    texto.classList.add("col");

    let nombre = document.createElement("p");
    nombre.innerText = element.nombre;
    texto.appendChild(nombre);

    let raza = document.createElement("p");
    raza.innerText = element.raza.charAt(0).toUpperCase() + element.raza.slice(1);
    texto.appendChild(raza);

    parte1.appendChild(texto);
    personajeDiv.appendChild(parte1);

    let parte2 = document.createElement("div");
    parte2.classList.add("col");
    parte2.classList.add("d-flex");
    parte2.classList.add("justify-content-end");
    parte2.classList.add("me-5");

    let array = ["btn-warning", "btn-danger"];
    let nombres = ["Modify", "Delete"];

    for (let index = 0; index < array.length; index++) {
        let bot = document.createElement("button");
        bot.type = "button";
        bot.classList.add("btn");
        bot.classList.add(array[index]);
        bot.classList.add("ms-3");
        bot.innerText = nombres[index];

        switch (nombres[index]) {
            case "Modify":
                bot.addEventListener("click", function modifyF() {
                    window.location.href = 'src/html/characterCreation.html?' + 'id=' + element.id;
                })
                break;
            case "Delete":
                bot.addEventListener("click", function deleteF() {
                    dbManager.open().then(() => {
                        dbManager.delete(element.id)
                            .then(() => {
                            })
                            .catch((error) => {
                                console.error("Error addData: " + error);
                            });
                    })
                        .catch((error) => {
                            console.error("Error open: " + error);
                        });
                    window.location="../../index.html";
                })
                break;
        }

        parte2.appendChild(bot);
    }

    personajeDiv.appendChild(parte2);
    menuPersonajes.appendChild(personajeDiv);
}



dbManager.open().then(() => {
    dbManager.getAll()
        .then((e) => {
            e.forEach(element => {
                crearOpcion(element);
            });
        })
        .catch((error) => {
            console.error("Error getAll: " + error);
        });
})
    .catch((error) => {
        console.error("Error open: " + error);
    });