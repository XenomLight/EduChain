import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent } from '@dfinity/agent';
import type { Identity } from '@dfinity/agent';

export type WalletType = 'internet-identity';

export interface AuthState {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: string | null;
  authClient: AuthClient | null;
  walletType: WalletType | string | null;
}

class AuthService {
  private authClient: AuthClient | null = null;
  private _identity: Identity | null = null;
  private _isAuthenticated: boolean = false;
  private _walletType: WalletType | null = null;

  async init(): Promise<void> {
    this.authClient = await AuthClient.create();
    this._isAuthenticated = await this.authClient.isAuthenticated();

    if (this._isAuthenticated) {
      this._identity = this.authClient.getIdentity();
      this._walletType = 'internet-identity';
    }
  }

  async loginWithInternetIdentity(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve) => {
      // For local development, use the standard local II URL
      // For production, use the mainnet II URL
      const identityProvider =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
          ? 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943'
          : 'https://identity.ic0.app';

      this.authClient!.login({
        identityProvider,
        onSuccess: () => {
          this._isAuthenticated = true;
          this._identity = this.authClient!.getIdentity();
          this._walletType = 'internet-identity';
          resolve(true);
        },
        onError: (error) => {
          console.error('Internet Identity login failed:', error);
          resolve(false);
        },
      });
    });
  }

  async logout(): Promise<void> {
    await this?.authClient?.logout();
    this._isAuthenticated = false;
    this._identity = null;
    this._walletType = null;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get identity(): Identity | null {
    return this._identity;
  }

  get principal(): string | null {
    return this._identity ? this._identity.getPrincipal().toString() : null;
  }

  get walletType(): WalletType | null {
    return this._walletType;
  }

  getAuthClient(): AuthClient | null {
    return this.authClient;
  }

  createActor<T>(canisterId: string, interfaceFactory: never): T {
    if (!this._identity) {
      throw new Error('Not authenticated');
    }

    // Default to regular agent for Internet Identity
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    const agent = new HttpAgent({
      identity: this._identity,
      host: isLocal ? 'http://localhost:4943' : 'https://ic0.app',
    });

    if (isLocal) {
      agent.fetchRootKey().catch((err) => {
        console.warn(
          'Unable to fetch root key. Check to ensure that your local replica is running'
        );
        console.error(err);
      });
    }

    return Actor.createActor(interfaceFactory, {
      agent,
      canisterId,
    });
  }
}

export const authService = new AuthService();
