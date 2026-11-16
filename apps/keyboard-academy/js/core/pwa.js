// У версії для ІТ-Майстерні без встановлення та роботи офлайн (без PWA).
export const canInstall = () => false;
export const isStandalone = () => false;
export async function promptInstall() { return false; }
export function initPWA() {}
