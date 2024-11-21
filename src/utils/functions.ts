import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import crypto from "crypto";
import env from "../env";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(env.TZ);

const ENCRYPTION_KEY = Buffer.from(env.ENCRYPTION_KEY);
const algorithm = "aes-256-cbc";
const encode = "hex" as BufferEncoding;

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(null), ms));
}

export function encryptText(text: string) {
    const iv = crypto.randomBytes(16);
    // @ts-ignore
    const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
    let encrypt = cipher.update(text);
    // @ts-ignore
    encrypt = Buffer.concat([encrypt, cipher.final()]);
    return `${iv.toString(encode)}:${encrypt.toString(encode)}`;
}

export function decryptText(text: string) {
    const _iv = text.split(":").shift();
    const _encrypted = text.split(":").pop();
    if (_iv && _encrypted) {
        const iv = Buffer.from(_iv, encode);
        const pw = Buffer.from(_encrypted, encode);
        // @ts-ignore
        const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
        // @ts-ignore
        let decrypt = decipher.update(pw);
        // @ts-ignore
        decrypt = Buffer.concat([decrypt, decipher.final()]);
        return decrypt.toString();
    } else {
        return "";
    }
}

export function generateId(length: number = 7, prefix?: string) {
    let text = "";
    if (prefix) text + prefix;
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export function setFileName() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 27; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

export function genUUID() {
    const uuid = crypto.randomUUID();
    return uuid;
}

export function dateFormatter(date?: any, format?: string) {
    let formatted = "";
    if (date && format) {
        formatted = dayjs(date).format(format);
    } else if (!date || !format) {
        formatted = dayjs().format();
    }
    return formatted;
}

export function hexToByteArray(hex: string) {
    let byteArray = [] as number[];
    const bytePairs = hex.match(/([0-9a-f]{2})/gi);
    if (bytePairs) byteArray = bytePairs.map(pair => parseInt(pair, 16));
    return byteArray;
}
