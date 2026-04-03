import postgres from "postgres";

const pgdb = postgres(process.env.DATABASE_URL); // will use psql environment variables

export default pgdb;
