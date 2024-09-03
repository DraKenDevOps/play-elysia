import { Elysia, t } from "elysia";
import env from "./env";
// import { loginController } from "./APIs/auth/controllers";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { findUserService } from "./APIs/auth/services";
import { decryptText } from "./utils/functions";

const router = new Elysia({ prefix: `${env.BASE_PATH}/v1` }).use(jwt({ name: "jwt", secret: env.JWT_SECRET_KEY, exp: 3600 * 8 })).use(cookie());

router.get(
    "/refresh",
    () => {
        return {
            message: "Authorized"
        };
    },
    // {
    //     headers: t.Object({
    //         Authorization: t.String(),
    //         "X-Access-Token": t.String()
    //     })
    // }
);

router.post("/login", async req => {
    const { username, password } = req.body as any;
    const user = await findUserService(username);
    if (!user) return { status: "error", message: "Not found" };
    const _password = decryptText(user["password"]);

    const token = await req.jwt.sign({ username, use_id: user["uuid"] });
    req.cookie["auth"].set({
        value: token,
        httpOnly: true,
        maxAge: 3600 * 8
    });
    if (_password !== password) return { status: "error", message: "Password incorrect" };
    return {
        status: "SUCCESS",
        username,
        token
    };
});

// router.use(jwt).post("/login", async (req) => {
//     const token = await req.jwt.sign(req.body as any)
//     req.cookie.auth.set({
//         value: token,
//         httpOnly: true,
//         maxAge: 7 * 86400,
//         path: '/profile',
//     })

//     return req.cookie.auth.value
// });

export default router;
