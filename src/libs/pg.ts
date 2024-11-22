import { Pool } from "pg";
import env from "../env";

const pg = new Pool({
    connectionString: env.DB_URI
});

export default pg;
