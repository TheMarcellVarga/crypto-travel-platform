import NodeCache from 'node-cache';

class Cache {
  private static instance: Cache;
  private cache: NodeCache;

  private constructor() {
    this.cache = new NodeCache();
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  async get(key: string): Promise<string | undefined> {
    return this.cache.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    this.cache.del(key);
  }
}

export const cache = Cache.getInstance();