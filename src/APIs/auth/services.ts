import pg from "../../utils/pg";

export async function findUserService(username: string) {
    try {
        const result = await pg.query("SELECT uuid, password FROM delta_test.users WHERE username = $1", [username]);
        const [user] = result.rows;
        return user as { password: string, uuid: string };
    } catch (error) {
        console.error(`[ERROR] Find user service`, error);
        return null;
    }
}
