import { createClient, RedisClientType } from "redis";
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);


class RedisService {
    private defaultClient: RedisClientType;

    constructor() {
        this.defaultClient = createClient({
            url: process.env.REDIS_URL || "redis://localhost:6379"
        });

        this.defaultClient.connect()
            .catch(err => console.error("[Redis] Connection error:", err));
    }

    async get(key: string): Promise<any | null> {
        try {
            const compressed = await this.defaultClient.get(key);
            if (!compressed) {
                //console.log(`[Redis] No value found for key: ${key}`);
                return null;
            }

            const compressedBuffer = Buffer.from(compressed, 'base64');
            const decompressedBuffer = await gunzipAsync(compressedBuffer);
            const rawString = decompressedBuffer.toString('utf-8');

            return JSON.parse(rawString);
        } catch (error) {
            console.warn(`[Redis] GET error:`, error);
            return null;
        }
    }

    async set(key: string, value: any, ttl: number = 3600): Promise<void> {
        try {
            let jsonString: string;

            // Always stringify objects, keep strings as-is
            if (typeof value === 'string') {
                jsonString = value;
            } else {
                jsonString = JSON.stringify(value);
            }

            const compressedBuffer = await gzipAsync(jsonString);
            const compressedBase64 = compressedBuffer.toString('base64');

            await this.defaultClient.set(key, compressedBase64, { EX: ttl });
        } catch (error) {
            console.warn(`[Redis] SET error:`, error);
        }
    }
}

export const redisService = new RedisService();
