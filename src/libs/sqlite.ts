import { Database } from "bun:sqlite";
import path from "path";
import env from "../env";
const dbpath = path.resolve(`${env.PWD}/demo.db`);
const sqlite = new Database(dbpath, { strict: true });
export default sqlite;
