import { Sequelize } from "sequelize";
import db from "../config/database.js";

// Schema

const { DataTypes } = Sequelize;

const Ipk = db.define(
  "ipk",
  {
    nim: {
      type: DataTypes.STRING,
    },
    prodi: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Ipk;
