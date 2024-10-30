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
      field: "image_file_name",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
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
