import { name, version } from "../package.json";

export default {
    PWD: process.cwd(),
    VERSION: version,
    SERVICE_NAME: name,
    NODE_ENV: Bun.env["NODE_ENV"] as "development" | "production",
    TZ: Bun.env["TZ"] || "Asia/Bangkok",
    HOST: Bun.env["HOST"],
    PORT: Number(Bun.env["PORT"]) || 8000,
    BASE_PATH: Bun.env["BASE_PATH"] || "api",
    DB_URI: Bun.env["DB_URI"],
    ENCRYPTION_KEY: Bun.env["ENCRYPTION_KEY"] || "7nB3rrON3PrDR4y4s6liBNC4M4P562kg",
    JWT_PRIVATE_KEY: Bun.env["JWT_PRIVATE_KEY"] ?? "",
    JWT_PUBLIC_KEY: Bun.env["JWT_PUBLIC_KEY"] ?? "",
    JWT_SECRET_KEY: Bun.env["JWT_SECRET_KEY"] || "Commandfailedwithexitcode3221225786"
};
