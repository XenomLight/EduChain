import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../../../auth/app.did.mjs';

// Load environment variables
const network = import.meta.env.VITE_DFX_NETWORK || 'local';
const canisterId =
  import.meta.env.VITE_CANISTER_ID_BACKEND || 'rjsrd-kqaaa-aaaam-qd3ta-cai'; //tolong .env diimplementasikan
// const internetIdentityCanisterId =
//   import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY ||
//   'rdmx6-jaaaa-aaaaa-aaadq-cai';

// Untuk local development, gunakan Internet Identity canister lokal
// const identityProvider =
//   network === 'ic'
//     ? 'https://identity.ic0.app'
//     : `http://localhost:4943/?canisterId=${internetIdentityCanisterId}`;

export const useAuth = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [actor, setActor] = useState<ActorSubclass | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [principal, setPrincipal] = useState<string | null>('');
  const [walletType, setWalletType] = useState<string | null>('');

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    const agent = new HttpAgent({
      host: network === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
      identity,
    });

    if (network === 'local') {
      await agent.fetchRootKey();
    }

    const actor = Actor.createActor(idlFactory as IDL.InterfaceFactory, {
      agent,
      canisterId,
    });

    const isAuthenticated = await authClient.isAuthenticated();
    const principalText = identity.getPrincipal().toText();

    setActor(actor);
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setPrincipal(principalText);

    if (!isAuthenticated) {
      const accountPrincipal = localStorage.getItem('principal');
      const accountWalletType = localStorage.getItem('walletType');
      if (accountWalletType === 'EMAIL' && accountPrincipal) {
        setIsAuthenticated(true);
        setPrincipal(accountPrincipal);
        setWalletType(accountWalletType);
      }
    }
  }

  async function loginWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    if (!actor) init();

    const result = (await actor?.loginWithEmail(email, password)) as {
      ok?: {
        principal: unknown;
      };
      err?: unknown;
    };

    if (result.err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage: any = {
        InvalidCredentials: 'Invalid password!',
        NotFound: 'Account is not exist. Please register your account first!',
      };
      return {
        status: 'error',
        message: errorMessage[Object.keys(result.err)[0]],
      };
    }

    const accountPrincipal = Principal.from(result?.ok?.principal).toText();
    localStorage.setItem('principal', accountPrincipal);
    localStorage.setItem('walletType', 'EMAIL');
    setIsAuthenticated(true);
    setPrincipal(accountPrincipal);
    setWalletType('EMAIL');

    return {
      status: 'success',
      message: 'Sign in successful!',
    };
  }

  async function registerWithEmail({
    username,
    email,
    password,
    confirmPassword,
  }: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (!actor) init();

    const result = (await actor?.registerWithEmail(
      username,
      email,
      password,
      confirmPassword,
      '',
      ''
    )) as {
      ok?: {
        principal: unknown;
      };
      err?: unknown;
    };

    if (result.err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage: any = {
        PasswordsDoNotMatch: 'Password is not match!',
        AlreadyExists: 'Account has already exist!',
      };
      return {
        status: 'error',
        message: errorMessage[Object.keys(result.err)[0]],
      };
    }

    const accountPrincipal = Principal.from(result?.ok?.principal).toText();
    localStorage.setItem('principal', accountPrincipal);
    localStorage.setItem('walletType', 'EMAIL');
    setIsAuthenticated(true);
    setPrincipal(accountPrincipal);
    setWalletType('EMAIL');

    return {
      status: 'success',
      message: 'Account registered successfully!',
    };
  }

  async function loginWithPrincipal({
    firstName,
    lastName,
    username,
    email,
  }: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  }) {
    if (!actor) init();

    const first_name = firstName;
    const last_name = lastName;

    const result = (await actor?.loginWithPrincipal(
      first_name,
      last_name,
      username,
      email
    )) as {
      ok?: {
        principal: unknown;
      };
      err?: unknown;
    };

    if (result.err) {
      return {
        status: 'error',
        message: '`loginWithPrincipal` error!',
      };
    }

    return {
      status: 'success',
      message: 'Account login successfully!',
    };
  }

  async function logout() {
    if (!authClient) {
      return {
        status: 'error',
        message: 'Logout error!',
      };
    }

    await authClient.logout();
    localStorage.removeItem('principal');
    localStorage.removeItem('walletType');
    init();

    return {
      status: 'success',
      message: 'Account logged out successfully!',
    };
  }

  return {
    loginWithPrincipal,
    loginWithEmail,
    registerWithEmail,
    logout,
    actor,
    isAuthenticated,
    setIsAuthenticated,
    principal,
    setPrincipal,
    walletType,
    setWalletType,
  };
};
