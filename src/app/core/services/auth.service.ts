import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { authCodeFlowConfig } from '../auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndLogin();

    // this.oauthService.setupAutomaticSilentRefresh();

    // Automatically load user profile
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) => this.oauthService.loadUserProfile());
  }

  public init(): void {}

  public get userName(): string | null {
    const claims: any = this.oauthService.getIdentityClaims();
    if (!claims) {
      return null;
    }
    return claims['given_name'];
  }

  public get idToken(): string {
    return this.oauthService.getIdToken();
  }

  public get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  public refresh(): void {
    this.oauthService.refreshToken();
  }

  /**
   * Log's out the user in the IdentityServer4 server, then redirect's to app landing page
   */
  logoutUser(): void {
    this.oauthService.revokeTokenAndLogout();
  }

  isUserLoggedIn(): Promise<boolean> {
    return new Promise<boolean>(() => this.oauthService.hasValidAccessToken());
  }

  /**
   * Tries to log in the user, using IdentityServer4. Redirects to IdentityServer4 server.
   *
   * After the login attempt redirects to the dashboard.
   *
   * @returns a promise contaning the log in success
   */
  loginUser(): Promise<boolean> {
    this.oauthService.initLoginFlow();
    return this.isUserLoggedIn();
  }
}
