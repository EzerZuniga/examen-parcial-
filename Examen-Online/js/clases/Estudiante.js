class Estudiante {
    constructor(nombre, curso) {
        this.nombre = nombre;
        this.curso = curso;
        this.puntaje = 0;
    }

    sumarPunto() {
        this.puntaje += 2;
    }
}

export default Estudiante;
