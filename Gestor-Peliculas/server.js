import express from "express";
import { Movie } from "./models/Movie.js";
import { MovieManager } from "./models/MovieManager.js";

const app = express();
const PORT = 3000;
const manager = new MovieManager("./data/movies.json");

app.use(express.json());
app.use(express.static("public"));

/* OBTENER TODAS */
app.get("/movies", async (req, res) => {
    const movies = await manager.getMovies();

    res.json(movies);
});

/* CREAR */
app.post("/movies", async (req, res) => {
    const { title, genre, director, year } = req.body;
    const movie = new Movie(
        Date.now(),
        title,
        genre,
        director,
        year
    );
    await manager.addMovie(movie);
    res.json({
        message: "Película agregada",
        movie
    });
});

/* ELIMINAR */
app.delete("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);
    const movies = await manager.getMovies();
    const movieExists = movies.some(movie => movie.id === id);

    if (!movieExists) {
        return res.status(404).json({ message: "Película no encontrada" });
    }

    await manager.deleteMovie(id);
    res.json({ message: "Película eliminada" });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
