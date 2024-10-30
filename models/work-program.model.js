import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WorkProgram = sequelize.define(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageFileName: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "work_programs",
    timestamps: true,
  }
);

WorkProgram.sync()
  .then(() => {})
  .catch((error) => {
    console.error("Failed to sync WorkProgram model:", error);
  });

export default WorkProgram;
