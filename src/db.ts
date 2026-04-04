import postgres from "postgres";

const pgdb = postgres('postgresql://postgres:Pzc6CjQtUcn04fqpphl9XqPvALGrWwHR@tns-db-cluster.cl44isaiiamm.us-west-2.rds.amazonaws.com:5432/theneverendingstory?sslmode=verify-full&sslrootcert=./global-bundle.pem'); // will use psql environment variables

export default pgdb;
