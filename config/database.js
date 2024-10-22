import { Sequelize } from "sequelize";
import "dotenv/config";
import fs from "fs"
import { getSecret } from './secrets';


const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  getSecret(DATABASE_PASSWORD, DATABASE_PASSWORD_FILE),
  {
    host: process.env.DATABASE_HOST,
    dialect: "postgres"
  }
);

export default sequelize;
