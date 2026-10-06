import Pregunta from "../clases/Pregunta.js";

export async function obtenerPreguntas() {
    const respuesta = await fetch(new URL("../../data/preguntas.json", import.meta.url));
    if (!respuesta.ok) throw new Error("No se pudieron cargar las preguntas.");
    const datos = await respuesta.json();
    if (!Array.isArray(datos) || !datos.length) throw new Error("No hay preguntas disponibles.");

    return datos.map((dato, i) => {
        const opciones = dato.opciones;
        const correcta = dato.respuestaCorrecta;
        const texto = dato.texto ?? dato.pregunta;
        if (typeof texto !== "string" || !Array.isArray(opciones) || !opciones.length ||
            !Number.isInteger(correcta) || correcta < 0 || correcta >= opciones.length) {
            throw new Error(`La pregunta ${i + 1} tiene un formato invalido.`);
        }
        return new Pregunta(texto, opciones, correcta);
    });
}
