import packageInfo from '../../package.json';

export const environment = {
  API_URL:'https://api.aimagicpower.com/api',
  IMAGE_URL:'https://api.aimagicpower.com',
  appVersion: packageInfo.version,
  production: true
};
