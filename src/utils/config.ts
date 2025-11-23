interface Config {
  API_BASE_URL: string;
}

const config: { [key: string]: Config } = {
  development: {
    API_BASE_URL: import.meta.env.VITE_APP_DEV_URL,
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_APP_PROD_URL,
  },
};

const currentEnv = import.meta.env.MODE || 'development';

const urls = config[currentEnv] || config['development'];

if (!urls.API_BASE_URL) {
  // Critical error that should be visible in all environments
  // eslint-disable-next-line no-console
  console.error(`Missing API_BASE_URL for environment: ${currentEnv}`);
}

export default urls;
