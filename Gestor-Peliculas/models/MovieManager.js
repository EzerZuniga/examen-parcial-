import fs from "fs/promises";

export class MovieManager {
    constructor(path) {
        this.path = path;
    }

    async getMovies() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async saveMovies(movies) {
        await fs.writeFile(
            this.path,
            JSON.stringify(movies, null, 2)
        );
    }

    async addMovie(movie) {
        const movies = await this.getMovies();

        movies.push(movie);

        await this.saveMovies(movies);
    }

    async deleteMovie(id) {
        const movies = await this.getMovies();

        const filtered = movies.filter(movie => movie.id !== id);

        await this.saveMovies(filtered);
    }
}
