import { HttpAgent, Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
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

    async function RegisterUsers(username, email, password, konfirmasiPassword) {
      try {
        const result = await actor.Register(principal, username, email, password, konfirmasiPassword);
        console.log("Registrasi berhasil:", result);
      } catch (err) {
        console.log("Registrasi gagal:", err);
      }
    }

    async function LoginUsers(password) {
      try {
        const result = await actor.Login(principal, password);
        console.log("Login berhasil:", result);
      } catch (err) {
        console.log("Login gagal:", err);
      }
    }

    async function GetAllCourses() {
      try {
        const result = await actor.getCourses();
        console.log("All courses:", JSON.stringify(result, null, 2));
      } catch (err) {
        console.log("Gagal ambil courses:", err);
      }
    }
    async function GetCourseById(id) {
      try {
        const result = await actor.getCourseById(id);
        console.log("Course by id:", JSON.stringify(result, null, 2));
      } catch (err) {
        console.log("Gagal ambil course by id:", err);
      }
    }


    await RegisterUsers(process.env.REGISTER_USERNAME,
      process.env.REGISTER_EMAIL,
      process.env.REGISTER_PASSWORD,
      process.env.REGISTER_CONFIRM);
    await LoginUsers(process.env.REGISTER_PASSWORD);
  }
}); 