import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Member = sequelize.define(
  "Member",
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
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    group: {
      type: DataTypes.STRING,
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
      field: "created_at",
    },
  },
  {
    tableName: "members",
    timestamps: true,
  }
);

Member.sync()
  .then(() => {})
  .catch((error) => {
    console.error("Failed to sync Member model:", error);
  });

export default Member;
