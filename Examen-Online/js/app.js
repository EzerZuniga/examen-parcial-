import Examen from "./clases/Examen.js";
import Estudiante from "./clases/Estudiante.js";
import { obtenerPreguntas } from "./servicios/api.js";

const $ = (id) => document.getElementById(id);
const nombre = $("nombre"), curso = $("curso"), login = $("login");
const seccion = $("examen"), titulo = $("pregunta"), opciones = $("opciones");
const resultado = $("resultado"), iniciar = $("btnIniciar"), siguiente = $("btnSiguiente");
let examen;

iniciar.addEventListener("click", iniciarExamen);
siguiente.addEventListener("click", avanzar);
siguiente.disabled = true;

async function iniciarExamen() {
    if (!nombre.value.trim() || !curso.value.trim()) {
        alert("Escribe tu nombre y curso para iniciar.");
        return;
    }
    iniciar.disabled = true;
    iniciar.textContent = "Cargando...";
    try {
        examen = new Examen(new Estudiante(nombre.value.trim(), curso.value.trim()), await obtenerPreguntas());
        resultado.classList.add("hidden");
        login.classList.add("hidden");
        seccion.classList.remove("hidden");
        mostrarPregunta();
    } catch (error) {
        resultado.textContent = error.message || "No se pudo iniciar el examen.";
        resultado.classList.remove("hidden");
    } finally {
        iniciar.disabled = false;
        iniciar.textContent = "Iniciar examen";
    }
}

function mostrarPregunta() {
    const pregunta = examen.preguntaActual();
    if (!pregunta) return mostrarResultado();
    titulo.textContent = `${examen.index + 1}. ${pregunta.texto}`;
    opciones.replaceChildren(...pregunta.opciones.map((texto, indice) => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = texto;
        boton.setAttribute("aria-pressed", "false");
        boton.addEventListener("click", () => {
            examen.responder(indice);
            opciones.querySelectorAll("button").forEach((opcion, i) => {
                opcion.classList.toggle("seleccionada", i === indice);
                opcion.setAttribute("aria-pressed", String(i === indice));
            });
            siguiente.disabled = false;
        });
        return boton;
    }));
    siguiente.disabled = true;
    siguiente.textContent = examen.index === examen.preguntas.length - 1 ? "Finalizar examen" : "Siguiente";
}

function avanzar() {
    if (examen.respuestaSeleccionada === null) return;
    examen.verificar();
    examen.siguiente();
    examen.terminado() ? mostrarResultado() : mostrarPregunta();
}

function mostrarResultado() {
    const estudiante = examen.estudiante;
    const total = examen.preguntas.length;
    const correctas = estudiante.puntaje / 2;
    const nota = total ? (correctas / total * 20).toFixed(1) : "0.0";

    resultado.replaceChildren();
    const encabezado = document.createElement("h2");
    encabezado.textContent = "Examen finalizado";

    const estudianteTexto = document.createElement("p");
    estudianteTexto.className = "resultado-estudiante";
    estudianteTexto.textContent = `${estudiante.nombre} - ${estudiante.curso}`;

    const puntaje = document.createElement("div");
    puntaje.className = "resultado-puntaje";
    const etiqueta = document.createElement("span");
    etiqueta.textContent = "Nota final";
    const notaTexto = document.createElement("strong");
    notaTexto.textContent = `${nota} / 20`;
    puntaje.append(etiqueta, notaTexto);

    const detalle = document.createElement("p");
    detalle.className = "resultado-detalle";
    detalle.textContent = `Respuestas correctas: ${correctas} de ${total}`;

    resultado.append(encabezado, estudianteTexto, puntaje, detalle);
    seccion.classList.add("hidden");
    resultado.classList.remove("hidden");
}

