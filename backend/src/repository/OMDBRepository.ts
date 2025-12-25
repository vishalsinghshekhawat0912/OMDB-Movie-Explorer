import dbConnection from "../config/db";

export class OMDBRepository {

    public async insertFavourite(movie: any) {
        const {
            title,
            year,
            type,
            poster,
            director,
            actors,
            plot,
            rating,
            genre,
            writers,
            language,
            time,
            collection
        } = movie;

        const query = `
        INSERT INTO favourites
        (title, year, type, poster, director, actors, plot, rating, genre, writers, language, time, collection)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            poster = VALUES(poster),
            director = VALUES(director),
            actors = VALUES(actors),
            plot = VALUES(plot),
            rating = VALUES(rating),
            genre = VALUES(genre),
            writers = VALUES(writers),
            language = VALUES(language),
            time = VALUES(time),
            collection = VALUES(collection),
            updated_at = CURRENT_TIMESTAMP
    `;

        await dbConnection.query(query, [
            title,
            year,
            type,
            poster,
            director,
            actors,
            plot,
            rating,
            genre,
            writers,
            language,
            time,
            collection
        ]);
    }

    public async findAllFavourites() {
        const [rows] = await dbConnection.query(`
        SELECT title, year, type, poster
        FROM favourites
        ORDER BY updated_at DESC
    `);

        return rows;
    }

    public async findFavouriteByKey(
        title: string,
        year: string,
        type: string
    ) {
        const [rows]: any = await dbConnection.query(
            `
        SELECT *
        FROM favourites
        WHERE title = ? AND year = ? AND type = ?
        `,
            [title, year, type]
        );

        return rows[0] || null;
    }



}
