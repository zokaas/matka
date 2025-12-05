export function computeMaxAgeFromExp(expSeconds: number | undefined, defaultSec = 300) {
    if (!expSeconds) return defaultSec;
    console.log(expSeconds);
    const nowSec = Math.floor(Date.now() / 1000);
    const ttl = Math.max(1, expSeconds - nowSec);
    console.log(ttl);
    return ttl;
}
