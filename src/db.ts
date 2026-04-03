import postgres from "postgres";

const pgdb = postgres('postgresql://postgres:Pzc6CjQtUcn04fqpphl9XqPvALGrWwHR@tns-db-cluster.cl44isaiiamm.us-west-2.rds.amazonaws.com:5432/theneverendingstory'); // will use psql environment variables

export default pgdb;
