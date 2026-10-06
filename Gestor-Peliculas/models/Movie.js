export class Movie {
    constructor(id, title, genre, director, year, watched = false) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.director = director;
        this.year = year;
        this.watched = watched;
    }
}
