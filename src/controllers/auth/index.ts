import { Elysia, t } from "elysia";
import { decryptText } from "../../utils/functions";
import { findUserService } from "./services";

export const loginController = new Elysia().post(
    "/login",
    ({ body }) => {
        const username = body["username"];
        const password = body["password"];
        const user = findUserService(username);
        if (!user) return { status: "error", message: "User not found" };
        if (user["status"] !== "ACTIVE") return { status: "error", message: `User '${username}' is unavailable` };
        const text = decryptText(user["password"]);
        if (text !== password) return { status: "error", message: "Invalid password" };
        return {
            status: "SUCCESS",
            message: "Login success",
            data: {
                username,
                user_id: user["user_id"],
                token: crypto.randomUUID(),
                email: user["email"],
                role: user["role"]
            }
        };
    },
    {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
);
