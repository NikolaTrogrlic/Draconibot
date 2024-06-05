export function createID(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function average(values: number[]): number{
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = (sum / values.length) || 0;
    return Math.round(avg);
}

export function wrapInAnsi(message: string): string{
    return "```ansi\n" + message + "\n```";
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));