import dotenv from "dotenv";
import { redisService } from "./RedisService";
import { OMDBRepository } from "../repository/OMDBRepository";
type ApiResponse = { status: boolean, message: string, data: any, responseCode: number };

dotenv.config({ quiet: true, path: "../.env" });
export class OMDBService {
    private omdbRepository: OMDBRepository;
    constructor() {
        this.omdbRepository = new OMDBRepository();
    }

    public async fetchMovie(title: string, year?: string, type?: string): Promise<ApiResponse> {

        try {
            let response: ApiResponse = { status: true, message: `${type || "Movie"} fetched successfully`, data: null, responseCode: 200 };

            if (!title) {
                response.status = false;
                response.message = "Please provide title";
                response.responseCode = 400
                return response;
            }

            const redisKey = `movie_${title}${year ? `_${year}` : ''}${type ? `_${type}` : ''}`;
            const cachedData = await redisService.get(redisKey);
            if (cachedData) {
                console.log("Returning redis data");
                response.data = cachedData;
                return response;
            }

            const url = process.env.OMDB_BASE_URL;
            const apikey = process.env.OMDB_API_KEY;

            if (!url || !apikey) {
                response.status = false;
                response.message = "Internal Server Error";
                response.responseCode = 500
                return response;
            }

            const queryParams: any = {
                apikey,
                t: title,
            }
            if (year) queryParams.y = year;
            if (type) queryParams.type = (type === "Series" || type === "Movie") ? type : "Movie";

            const searchParams = new URLSearchParams(queryParams).toString();
            const finalUrl = `${url}?${searchParams}`;

            const data = await fetch(finalUrl);

            if (!data.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await data.json();

            if (result.Response === "False") {
                response.status = false;
                response.message = result.Error || `${type || "Movie"} Not Found`;
                response.responseCode = 200
                return response;
            }

            response.data = {
                title: result.Title,
                year: result.Year,
                poster: result.Poster,
                director: result.Director,
                actors: result.Actors,
                plot: result.Plot,
                rating: result.imdbRating,
                genre: result.Genre,
                writers: result.Writer,
                language: result.Language,
                time: result.Runtime,
                collection: result.BoxOffice,
                type: result.Type
            }
            await redisService.set(redisKey, response.data, 600);
            return response;
        } catch (error: any) {
            console.error(`Error in fetchMovie: ${error?.message || error}`);
            throw error;
        }
    }

    public async addFavourite(movie: any): Promise<ApiResponse> {
        try {
            let response: ApiResponse = { status: true, message: `Favourite Added Successfully`, data: null, responseCode: 200 };

            if (!movie?.title) {
                response.status = false;
                response.message = "Invalid movie data";
                response.responseCode = 400
                return response;
            }

            await this.omdbRepository.insertFavourite(movie);
            return response;

        } catch (error: any) {
            console.log(`Error in addFavourite: ${error?.message || error}`);
            throw error;
        }
    };

    public async getFavourites(title: string, year: string, type: string): Promise<ApiResponse> {
        try {
            let response: ApiResponse = { status: true, message: `Favourite fetched Successfully${title ? `for title: ${title}` : ''}`, data: null, responseCode: 200 };
            if(title && year && type){
                const fav = await this.omdbRepository.findFavouriteByKey(title, year, type);
                if(!fav){
                response.status = false;
                response.message = "No Favourite found";
                return response;
                }
                response.data = fav;
            }else {
                const favourites = await this.omdbRepository.findAllFavourites();
                if(!favourites || (Array.isArray(favourites) && !favourites.length)){
                response.status = false;
                response.message = "No Favourite found";
                return response;
                }
                response.data = favourites;
            }
            return response;
        } catch (error: any) {
            console.log(`Error in getFavourites: ${error?.message || error}`);
            throw error;
        }
    }
}