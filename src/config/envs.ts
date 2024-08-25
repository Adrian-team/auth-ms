import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MONGO_URL: string;
  NATS_SERVERS: string;
  SECRET_TOKEN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URL: joi.string().required(),
    SECRET_TOKEN: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Config validation error ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  mongoURL: envVars.MONGO_URL,
  natsServers: envVars.NATS_SERVERS,
  secretToken: envVars.SECRET_TOKEN,
};
