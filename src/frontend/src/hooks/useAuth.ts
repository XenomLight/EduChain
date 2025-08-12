import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { idlFactory } from '../../../auth/app.did.mjs';

// Load environment variables
const network = import.meta.env.VITE_DFX_NETWORK || 'local';
const canisterId = import.meta.env.VITE_CANISTER_ID_BACKEND || 'qsgjb-riaaa-aaaaa-aaaga-cai';
const internetIdentityCanisterId = import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai';

// Untuk local development, gunakan Internet Identity canister lokal
const identityProvider = network === 'ic' 
  ? 'https://identity.ic0.app' 
  : `http://localhost:4943/?canisterId=${internetIdentityCanisterId}`;

export const useAuth = () => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actor, setActor] = useState<ActorSubclass | null>(null);
  const [principal, setPrincipal] = useState<string>('');

  useEffect(() => {
    updateActor();
  }, []);

  async function updateActor() {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    
    const agent = new HttpAgent({
      host: network === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
      identity
    });

    if (network === 'local') {
      await agent.fetchRootKey();
    }

    const actor = Actor.createActor(idlFactory as IDL.InterfaceFactory, {
      agent,
      canisterId
    });

    const isAuthenticated = await authClient.isAuthenticated();
    const principalText = identity.getPrincipal().toText();

    setActor(actor);
    setAuthClient(authClient);
    setIsAuthenticated(isAuthenticated);
    setPrincipal(principalText);
  }

  async function login() {
    if (!authClient) return;
    
    await authClient.login({
      identityProvider,
      onSuccess: updateActor
    });
  }

  async function logout() {
    if (!authClient) return;
    
    await authClient.logout();
    updateActor();
  }

  return {
    isAuthenticated,
    login,
    logout,
    actor,
    principal
  };
};






