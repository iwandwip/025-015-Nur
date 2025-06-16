// Simple in-memory cache for API responses
class ApiCache {
  private cache = new Map<string, { data: any; expires: number }>();
  
  set(key: string, data: any, ttlMs: number = 60000) { // Default 1 minute
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlMs
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();