require('dotenv').config();

const sslRequired = (process.env.PGSSLMODE === 'require') || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon'));

function baseConfig() {
  const conf = { use_env_variable: 'DATABASE_URL', dialect: 'postgres' };
  if (sslRequired) {
    conf.dialectOptions = {
      ssl: {
        require: true,
        // For Neon and many managed providers, rejectUnauthorized must be false unless you provide CA
        rejectUnauthorized: false
      }
    };
  }
  return conf;
}

module.exports = {
  development: baseConfig(),
  test: baseConfig(),
  production: baseConfig()
};
