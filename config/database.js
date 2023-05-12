import { Sequelize } from "sequelize";

const database = "jwt_server";
const root = "root";
const password = "";

const db = new Sequelize(database, root, password, {
  host: "localhost",
  dialect: "mysql",
});

export default db;
