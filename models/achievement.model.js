import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Achievement = sequelize.define(
  "Achievement",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    competitionName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "competition_name",
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "team_name",
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
    tableName: "achievements",
    timestamps: true,
  }
);

Achievement.sync({ force: true })
  .then(() => {})
  .catch((error) => {
    console.error("Failed to sync Achievement model:", error);
  });

export default Achievement;
