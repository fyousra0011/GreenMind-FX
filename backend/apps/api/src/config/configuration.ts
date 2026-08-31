export default () => ({
  app: {
    name: process.env.APP_NAME || 'greenmind-fx',
    port: Number(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'greenmind_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'change-me',
    ssl: process.env.DB_SSL === 'true',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: Number(process.env.REDIS_DB) || 0,
  },
  mqtt: {
    brokerHost: process.env.MQTT_BROKER_HOST || 'localhost',
    brokerPort: Number(process.env.MQTT_BROKER_PORT) || 1883,
    username: process.env.MQTT_BROKER_USERNAME || '',
    password: process.env.MQTT_BROKER_PASSWORD || '',
    clientId: process.env.MQTT_CLIENT_ID || 'greenmind-fx-dev',
    tls: process.env.MQTT_TLS === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'replace-with-a-strong-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'replace-with-a-strong-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
});
