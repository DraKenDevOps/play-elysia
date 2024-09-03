import { type Context } from "elysia";
import { decryptText } from "../../utils/functions";
import { findUserService } from "./services";

export async function loginController(req: Context) {
    // console.log(req.body);
    const { username, password } = req.body as any;
    const user = await findUserService(username);
    if (!user) return { status: "error", message: "Not found" };
    const _password = decryptText(user["password"]);

    if (_password !== password) return { status: "error", message: "Password incorrect" };
    return {
        status: "SUCCESS",
        username
    };
}
