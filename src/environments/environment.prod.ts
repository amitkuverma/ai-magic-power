import packageInfo from '../../package.json';

export const environment = {
  API_URL:'https://api.aimagicpower.com/api',
  appVersion: packageInfo.version,
  production: true
};
