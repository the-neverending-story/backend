import postgres from "postgres";

const pgdb = postgres(
    {
    password: 'Pzc6CjQtUcn04fqpphl9XqPvALGrWwHR',
    host: 'tns-db-cluster.cl44isaiiamm.us-west-2.rds.amazonaws.com',
    port: 5432,
    database: 'theneverendingstory',
    user: 'postgres',
    ssl: { rejectUnauthorized: false, ca: require('fs').readFileSync('./us-west-2-bundle.pem').toString() }
}
); // will use psql environment variables

export default pgdb;
