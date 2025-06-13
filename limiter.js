export class RateLimiter {
    constructor(maxRequests = 100, windowMs = 60000) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = new Map();
    }

    isAllowed(identifier) {
        const now = Date.now();
        const windowStart = now - this.windowMs;

        // Temizle eski kayıtları
        if (this.requests.has(identifier)) {
            const userRequests = this.requests.get(identifier);
            const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
            this.requests.set(identifier, validRequests);
        }

        // Mevcut istek sayısını kontrol et
        const currentRequests = this.requests.get(identifier) || [];
        
        if (currentRequests.length >= this.maxRequests) {
            return false;
        }

        // Yeni isteği ekle
        currentRequests.push(now);
        this.requests.set(identifier, currentRequests);
        
        return true;
    }

    getRemainingRequests(identifier) {
        const now = Date.now();
        const windowStart = now - this.windowMs;
        const currentRequests = (this.requests.get(identifier) || [])
            .filter(timestamp => timestamp > windowStart);
        
        return Math.max(0, this.maxRequests - currentRequests.length);
    }

    getResetTime(identifier) {
        const requests = this.requests.get(identifier) || [];
        if (requests.length === 0) return 0;
        
        const oldestRequest = Math.min(...requests);
        return oldestRequest + this.windowMs;
    }
}