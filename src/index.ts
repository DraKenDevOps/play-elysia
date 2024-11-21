import { Elysia, t } from "elysia";
import prom from "prom-client";
import path from "path";
import cors from "@elysiajs/cors";
import ApiRouter from "./router";
import env from "./env";
import { dateFormatter } from "./utils/functions";

let topic = "demo";
const app = new Elysia({ normalize: true });
app.use(cors())
const ews = new Elysia().ws("/ws", {
    open(ws) {
        console.info(`${ws.remoteAddress} Open/Connect id=${ws.id} ${ws.data.request.method} ${ws.data.request.url}`);
        const message = `${ws.id} has entered the chat`;
        ws.subscribe(topic);
        console.log(message);
        ws.publish(topic, message);
    },
    message(ws, message) {
        // const { id } = ws;
        if (typeof message !== "string") message = JSON.stringify(message);
        console.info(`${ws.remoteAddress} Message id=${ws.id} ${ws.data.request.method} ${ws.data.request.url} "${message}"`);
        // ws.send({
        //     id,
        //     message: "success",
        //     time: dateFormatter()
        // });
        // ws.send(message)
        ws.publish(topic, `${message}`);
    },
    close(ws) {
        console.info(`${ws.remoteAddress} Close/Disconnect id=${ws.id} ${ws.data.request.method} ${ws.data.request.url}`);
        const message = `${ws.id} has left the chat`;
        ws.unsubscribe(topic);
        console.log(message);
        ws.publish(topic, message);
    },
    error(e) {
        console.error(e);
    }
});
const register = new prom.Registry();
register.setDefaultLabels({
    worker: env.SERVICE_NAME
});
prom.collectDefaultMetrics({
    labels: { NODE_APP_INSTANCE: env.SERVICE_NAME },
    register
});

app.onTransform(function ({ body, params, path, request, server }) {
    const requestId = crypto.randomUUID();
    const reqIp = server?.requestIP(request),
        ip = reqIp?.address;
    console.info(`[INFO] ${ip} Request ${requestId} ${request.method} ${path}`, {
        body,
        params
    });
});

app.get("/", () => ({
    status: "OK",
    uptime: Math.floor(process.uptime())
}));

app.get("/metrics", async ctx => {
    ctx.set.headers["Content-Type"] = register.contentType;
    const metrics = await register.metrics();
    return metrics;
});

// app.use(jwt)
app.use(ApiRouter).onError(ctx => {
    if (ctx.code == "NOT_FOUND") return "Route not found.";
});

app.get("/image/:name", ({ params: { name } }) => {
    const filepath = path.resolve(`${env.PWD}/uploads/images/${name}`);
    const f = Bun.file(filepath);
    return f;
});

const server = app.listen({
    hostname: env.HOST,
    port: env.PORT,
    development: env.NODE_ENV == "development",
    maxRequestBodySize: 50 * 1024 * 1024
});

const wserver = ews.listen({
    hostname: env.HOST,
    port: env.PORT + 1
});

console.info(
    `${dateFormatter()} -- [INFO] REST API is running`,
    JSON.stringify({
        hostname: app.server?.hostname,
        port: app.server?.port,
        basepath: env.BASE_PATH,
        mode: app.server?.development ? "development" : "production",
        version: env.VERSION,
        timezone: env.TZ
    })
);

const signals: Array<NodeJS.Signals> = ["SIGINT", "SIGTERM", "SIGBREAK"];

for (const signal of signals) {
    process.on(signal, async () => {
        console.info(`${signal} signal received.`);
        console.info(`Closing ${env.SERVICE_NAME} server...`);
        await server.stop();
        await wserver.stop();
        console.info(`${env.SERVICE_NAME} server is closed.`);
        process.exit(0);
    });
}
