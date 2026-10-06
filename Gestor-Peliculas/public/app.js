const form = document.getElementById("movieForm");

const container = document.getElementById("moviesContainer");

/* CARGAR */
async function loadMovies() {

    const response = await fetch("/movies");

    const movies = await response.json();

    container.innerHTML = "";

    movies.forEach(movie => {

        container.innerHTML += `
            <div class="movie">

                <h3>${movie.title}</h3>

                <p>Género: ${movie.genre}</p>

                <p>Director: ${movie.director}</p>

                <p>Año: ${movie.year}</p>

                <button data-id="${movie.id}">
                    Eliminar
                </button>

            </div>
        `;
    });

    addDeleteEvents();
}

/* ELIMINAR */
async function addDeleteEvents() {
    const buttons = container.querySelectorAll("button[data-id]");

    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            try {
                const response = await fetch(`/movies/${button.dataset.id}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("No se pudo eliminar la película.");
                }

                await loadMovies();
            } catch (error) {
                alert(error.message);
            }
        });
    });
}

/* AGREGAR */
form.addEventListener("submit", async event => {
    event.preventDefault();

    const movie = {
        title: document.getElementById("title").value.trim(),
        genre: document.getElementById("genre").value.trim(),
        director: document.getElementById("director").value.trim(),
        year: Number(document.getElementById("year").value)
    };

    try {
        const response = await fetch("/movies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movie)
        });

        if (!response.ok) {
            throw new Error("No se pudo agregar la película.");
        }

        form.reset();
        await loadMovies();
    } catch (error) {
        alert(error.message);
    }
});

loadMovies();
