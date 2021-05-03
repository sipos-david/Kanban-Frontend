import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://localhost:5443',

  // URL of the SPA to redirect the user to after login
  redirectUri: environment.app.url.dashboard,

  loginUrl: environment.app.url.dashboard,

  logoutUrl: environment.app.url.dashboard,

  postLogoutRedirectUri: environment.app.url.dashboard,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: 'angular',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',
  dummyClientSecret: '49C1A7E1-0C79-4A89-A3D6-A37998FB86B0',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  // scope: 'openid profile email offline_access api kanbanboard.interactive',
  scope: 'openid profile kanbanboard.user',
  showDebugInformation: true,
};
