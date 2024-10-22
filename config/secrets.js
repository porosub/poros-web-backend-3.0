import fs from "fs";
import { exit } from 'process';

/**
 * Universal method to get a secret value from either an environment variable
 * or a file-based secret (e.g., Podman or Docker secrets).
 *
 * @param {string} envVar - The environment variable for the secret.
 * @param {string} fileEnvVar - The environment variable that points to the secret file.
 * @returns {string|null} The secret value, or null if neither is set.
 */
export const getSecret = (envVar, fileEnvVar) => {
  if (process.env[fileEnvVar]) {
    try {
      return fs.readFileSync(process.env[fileEnvVar], "utf8").trim();
    } catch (err) {
      console.error(`Failed to read secret from file (${fileEnvVar}): ${err.message}`);
      exit(1);
    }
  }
  return process.env[envVar] || null;
};
