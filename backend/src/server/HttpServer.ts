import express, { Express, Request, Response } from "express";
import http from "http";
import cors from 'cors';
import path from "path";
import dbConnection, { connectToDatabase } from "../config/db";
import { OMDBController } from "../controller/OMDBController";
import { redisService } from "../service/RedisService";

export class HttpServer {
  private app: Express;
  private port: number;
  private server: http.Server;
  private dbConnect : boolean = false;
  private dbSync : boolean = false;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.configureMiddleware();
    this.configureRoutes();
    this.connectToDatabase();
    this.connectToRedis();
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await connectToDatabase();
      console.log("Database connected successfully.");
      this.dbConnect = true;
    } catch (error) {
      console.error("Failed to connect to the database:", error);
    }
  }

  private async connectToRedis(): Promise<void> {
    try {
      await redisService['defaultClient'].ping();
      console.log("Redis connected successfully.");
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
    }
  }

  // Middleware configuration
  private configureMiddleware(): void {
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "*"],
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Serve static files from a public directory
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  private async healthCheck(req: Request, res: Response): Promise<void> {
   
      if(this.dbConnect && this.dbSync){
      res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        port: this.port,
        message : "Server is running successfully with DB Connection"
      });
    } else{
      res.status(500).json({
        status: "DOWN",
        timestamp: new Date().toISOString(),
        port: this.port,
        message : "Error in connecting to DB. Please refer to server logs"
      });
    }
  }

  // Route configuration
  private configureRoutes(): void {
    const omdbController  = new OMDBController();
    
    this.app.use("/",omdbController.router);
    this.app.get("/health", this.healthCheck.bind(this));
  }

  // Start the HTTP server
  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}