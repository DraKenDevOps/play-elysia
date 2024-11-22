import sqlite from "../../libs/sqlite";
import type { TQueryUser } from "../../types";

export function findUserService(username: string) {
    const sql = "SELECT user_id, password, email, role, status FROM users WHERE username = $username";
    try {
        const stmt = sqlite.query(sql);
        const [result] = stmt.all({
            username
        }) as unknown as Array<TQueryUser>;
        stmt.finalize();
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}
