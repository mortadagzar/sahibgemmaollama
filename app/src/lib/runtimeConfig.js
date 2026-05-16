const requiredKeys = ['APP_DATABASE_REST_URL', 'APP_DATABASE_SERVICE_KEY'];

export function getRuntimeConfig() {
  const config = {
    databaseRestUrl: process.env.APP_DATABASE_REST_URL,
    databaseServiceKey: process.env.APP_DATABASE_SERVICE_KEY,
    activeProviderFilter: process.env.APP_PROVIDER_FILTER || 'is_active=eq.true'
  };

  const missingKeys = requiredKeys.filter((key) => !process.env[key]);
  return { config, missingKeys };
}
