import packageInfo from '../../package.json';

export const environment = {
  API_URL:'https://api.aimagicpower.com/api',
  IMAGE_URL:'https://api.aimagicpower.com/',
  UI_URL:'https://aimagicpower.com/',
  appVersion: packageInfo.version,
  production: true
};
