import { Request, Response, Router } from "express";
import { OMDBService } from "../service/OMDBService";

export class OMDBController {
    public router: Router;
    private omdbService: OMDBService;
    constructor() {
        this.router = Router();
        this.configureRoutes();
        this.omdbService = new OMDBService();
    }

    private configureRoutes = () => {
        this.router.get('/movie', this.getMovie);
        this.router.post('/favourites', this.handleAddFavourites);
        this.router.get('/favourites', this.getFavourites);
    }

    private getMovie = async (req: Request, res: Response) => {
        try {
            const title = req.query.title?.toString() || "";
            const year = req.query.year?.toString();
            const type = req.query.type?.toString();

            const response = await this.omdbService.fetchMovie(title, year, type);
            return res.status(response.responseCode || 200).json(response);
        } catch (error: any) {
            console.error(`Error in getting movies: ${error?.message || error}`);
            res.status(500).json({
                "status": false,
                "message": error?.message || "Internal server error",
                "error": error,
                "responseCode": 500
            })
        }
    }

    private getFavourites = async (req: Request, res: Response) => {
        try {
             const title = req.query.title?.toString() || "";
            const year = req.query.year?.toString() || "";
            const type = req.query.type?.toString() || "";
            const response = await this.omdbService.getFavourites(title, year, type);
            return res.status(response.responseCode || 200).json(response);
        } catch (error: any) {
            console.error(`Error in getting Favourites: ${error?.message || error}`);
            res.status(500).json({
                "status": false,
                "message": error?.message || "Internal server error",
                "error": error,
                "responseCode": 500
            })
        }
    }

    private handleAddFavourites = async (req: Request, res: Response) => {
        try {
           const response = await this.omdbService.addFavourite(req.body);
            res.status(200).json(response);
        } catch (error: any) {
            console.error(`Error in adding favourites: ${error?.message || error}`)
            res.status(400).json({
                status: false,
                message: error?.message,
            });
        }
    }

}