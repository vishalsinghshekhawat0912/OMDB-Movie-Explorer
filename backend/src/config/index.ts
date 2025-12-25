import { HttpServer } from '../server/HttpServer';
import dotenv from 'dotenv';
dotenv.config({quiet: true, path: "../.env"});

if (!process.env.BACKEND_PORT) {
    throw new Error('PORT variable is not defined.');
  }

const port = parseInt(process.env.BACKEND_PORT, 10);

const server = new HttpServer(port);

// Start the server
server.start();