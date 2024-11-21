import { Elysia, t } from "elysia";
import { decryptText } from "../../utils/functions";
import { findUserService } from "./services";

export const loginController = new Elysia().post(
    "/login",
    async ({ body }) => {
        const username = body["username"];
        const password = body["password"];
        const user = await findUserService(username);
        if (!user) return { status: "error", message: "Not found" };
        const _password = decryptText(user["password"]);

        if (_password !== password) return { status: "error", message: "Password incorrect" };
        return {
            status: "SUCCESS",
            username
        };
    },
    {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
);
