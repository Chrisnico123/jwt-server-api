import { Sequelize } from "sequelize";
import db from "../config/database.js";

// Schema

const { DataTypes } = Sequelize;

const Mahasiswa = db.define(
  "mahasiswa",
  {
    name: {
      type: DataTypes.STRING,
    },
    nim: {
      type: DataTypes.STRING,
    },
    nomorIjasah: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Mahasiswa;
