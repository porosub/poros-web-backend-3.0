import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BlogPost = sequelize.define(
  "BlogPost",
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: "blogspots",
    timestamps: true,
  }
);

BlogPost.sync()
  .then(() => {})
  .catch((error) => {
    console.error("Failed to sync BlogPost model:", error);
  });

export default BlogPost;
