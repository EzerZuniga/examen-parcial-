class Examen {
    constructor(estudiante, preguntas) {
        this.estudiante = estudiante;
        this.preguntas = preguntas;
        this.index = 0;
        this.respuestaSeleccionada = null;
    }

    preguntaActual() {
        return this.preguntas[this.index] ?? null;
    }

    responder(indice) {
        const pregunta = this.preguntaActual();

        if (!pregunta || !Number.isInteger(indice) || indice < 0 || indice >= pregunta.opciones.length) {
            return false;
        }

        this.respuestaSeleccionada = indice;
        return true;
    }

    verificar() {
        const pregunta = this.preguntaActual();
        const esCorrecta = pregunta && this.respuestaSeleccionada === pregunta.respuestaCorrecta;

        if (esCorrecta && typeof this.estudiante?.sumarPunto === "function") {
            this.estudiante.sumarPunto();
        }

        return Boolean(esCorrecta);
    }

    siguiente() {
        if (!this.terminado()) {
            this.index += 1;
            this.respuestaSeleccionada = null;
        }

        return this.preguntaActual();
    }

    terminado() {
        return this.index >= this.preguntas.length;
    }
}

export default Examen;
