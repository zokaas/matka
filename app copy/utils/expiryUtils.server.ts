export function computeMaxAgeFromExp(expSeconds: number | undefined, defaultSec = 300) {
    if (!expSeconds) return defaultSec;
    const nowSec = Math.floor(Date.now() / 1000);
    const ttl = Math.max(1, expSeconds - nowSec);
    return ttl;
}
