import { EventEmitter, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { authCodeFlowConfig } from '../auth.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService
      .loadDiscoveryDocumentAndLogin()
      .then((success) => this.userLoginEvent.emit(success));

    // this.oauthService.setupAutomaticSilentRefresh();

    // Automatically load user profile
    this.oauthService.events
      .pipe(filter((e) => e.type === 'token_received'))
      .subscribe((_) =>
        this.oauthService
          .loadUserProfile()
          .then(() => this.userLoadProfileEvent.emit())
      );
  }

  public userLoginEvent = new EventEmitter<boolean>();
  public userLoadProfileEvent = new EventEmitter<void>();

  public init(): void {}

  public get userName(): string | undefined {
    const claims: any = this.oauthService.getIdentityClaims();
    if (!claims) {
      return undefined;
    }
    return claims.preferred_username;
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
    this.oauthService.logOut();
  }

  public get isUserLoggedIn(): boolean {
    return (
      this.oauthService.hasValidAccessToken() &&
      this.oauthService.hasValidIdToken()
    );
  }
}
