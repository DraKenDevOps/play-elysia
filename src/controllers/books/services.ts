import sqlite from "../../libs/sqlite";

export function createBook(title: string, description: string, author: string, price: number) {
    const sql = "INSERT INTO books(title, description, author, price) VALUES (?,?,?,?)";
    try {
        const stmt = sqlite.prepare(sql);
        const rs = stmt.run(title, description, author, price);
        return rs.lastInsertRowid;
    } catch (e) {
        console.error(e);
        return null;
    }
}
