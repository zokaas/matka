import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis'; // Import RedisClientType

@Injectable()
export class RedisService {
  private client: RedisClientType; // Explicitly typing the client

  constructor() {
    this.client = createClient(); // Initialize client
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client
      .connect()
      .catch((err) => console.log('Redis Client Connection Error', err)); // Connect to Redis server
  }

  // Save data to Redis
  async setKey(key: string, value: string) {
    await this.client.set(key, value);
  }

  // Get data from Redis
  async getKey(key: string) {
    return await this.client.get(key);
  }

  // More methods can be added as needed (like del, setEx, etc.)
}
