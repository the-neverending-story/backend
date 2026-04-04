import postgres from "postgres";

const pgdb = postgres({
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  ssl: {
    rejectUnauthorized: false,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
    ca: require("fs").readFileSync("./us-west-2-bundle.pem").toString(),
  },
}); // will use psql environment variables

export default pgdb;
