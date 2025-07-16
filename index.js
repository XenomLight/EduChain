import { HttpAgent, Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import fetch from "node-fetch";
global.fetch = fetch;

const authClient = await AuthClient.create();

await authClient.login({
  identityProvider: "https://nfid.one/authenticate/",
  onSuccess: async () => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toText();
    console.log("Principal user:", principal);

    const agent = new HttpAgent({
      host: "http://127.0.0.1:4943",
      identity: identity
    });
    await agent.fetchRootKey();

    let idlFactory;
    try {
      const did = await import("./auth/app.did.mjs");
      idlFactory = did.idlFactory || did.default?.idlFactory;
      if (!idlFactory) throw new Error("idlFactory not found in app.did.mjs");
    } catch (e) {
      console.error("Gagal import idlFactory dari app.did.mjs:", e);
      process.exit(1);
    }

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: "qsgjb-riaaa-aaaaa-aaaga-cai"
    });

    async function RegisterUsers(email, password, konfirmasiPassword) {
      try {
        const result = await actor.RegisterWithPrincipal(principal, email, password, konfirmasiPassword);
        console.log("Registrasi berhasil:", result);
      } catch (err) {
        console.log("Registrasi gagal:", err);
      }
    }

    async function LoginUsers(email, password) {
      try {
        const result = await actor.LoginWithPrincipal(principal, email, password);
        console.log("Login berhasil:", result);
      } catch (err) {
        console.log("Login gagal:", err);
      }
    }

    await RegisterUsers("nazriel@gmail.com", "passnaz1", "passnaz1");
    await LoginUsers("nazriel@gmail.com", "passnaz1");
  }
}); 