import { Elysia, t } from "elysia";
import prom from "prom-client";
import ApiRouter from "./router";
import env from "./env";

const app = new Elysia({ normalize: true });
const register = new prom.Registry();
register.setDefaultLabels({
    worker: env.SERVICE_NAME
});
prom.collectDefaultMetrics({
    labels: { NODE_APP_INSTANCE: env.SERVICE_NAME },
    register
});

app.onRequest(ctx => {
    const requestId = crypto.randomUUID();
    // ctx.set.headers["X-Request-Id"] = requestId;
    // console.info(ctx.request);
    const method = ctx.request.method,
        url = ctx.request.url;
    // body = await ctx.request.json();
    // host = ctx.request.headers.get("host");
    // console.info(ctx.server);
    // console.info(ctx.server?.requestIP(ctx.request));
    const reqIp = ctx.server?.requestIP(ctx.request),
        ip = reqIp?.address;
    console.info("Request", {
        requestId,
        url,
        method,
        ip
    });
});

// app.onAfterResponse(ctx => {
//     // const requestId = ctx.request.headers.get("X-Request-Id");
//     console.info("Response", ctx.response);
// });

app.get("/", () => ({
    status: "OK",
    uptime: Math.floor(process.uptime())
}));

app.get("/metrics", async ctx => {
    ctx.set.headers["Content-Type"] = register.contentType;
    const metrics = await register.metrics();
    return metrics;
});

app.post(
    "/post-body",
    ({ body }) => {
        // const body = ctx.request.body;
        return body;
    },
    {
        body: t.Object({
            fullname: t.String()
        })
    }
);

// app.use(jwt)
app.use(ApiRouter).onError((ctx) => {
    if (ctx.code == "NOT_FOUND") return "Route not found."
});

app.listen({
    hostname: env.HOST,
    port: env.PORT,
    development: env.NODE_ENV == "development",
    maxRequestBodySize: 50 * 1024 * 1024
});

console.info(
    `${new Date()} -- [INFO] REST API is running`,
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
    process.on(signal, () => {
        console.warn(`${signal} signal received.`);
        console.warn(`Closing ${env.SERVICE_NAME} server...`);
        console.warn(`${env.SERVICE_NAME} server is closed.`);
        process.exit(0);
    });
}
