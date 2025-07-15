import { HttpAgent, Actor } from "@dfinity/agent";
import fetch from "node-fetch";
global.fetch = fetch;

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });// local :http://127.0.0.1:4943, jika mainnet : https://ic0.app
await agent.fetchRootKey() // jika lokal   

let idlFactory;
try {
  const did = await import("./auth/app.did.mjs");
  idlFactory = did.idlFactory || did.default?.idlFactory;
  if (!idlFactory) throw new Error("idlFactory not found in app.did.js");
} catch (e) {
  console.error("Gagal import idlFactory dari app.did.js:", e);
  process.exit(1);
}

const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: "rkp4c-7iaaa-aaaaa-aaaca-cai"
});

async function RegisterUsers(username, email, password, konfirmasiPassword) {
    try {
        const result = await actor.Register(username, email, password, konfirmasiPassword);
        console.log("Registrasi berhasil:", result);
    } catch (err) {
        console.log("Registrasi gagal:", err);
    }
}

async function LoginUsers(email, password) {
    try {
        const result = await actor.Login(email, password);
        console.log("Login berhasil:", result);
    } catch (err) {
        console.log("Login gagal:", err);
    }
}

(async () => {
    await RegisterUsers("nazriel", "nazriel@gmail.com", "passnaz1", "passnaz1");
    await LoginUsers("nazriel@gmail.com", "passnaz1");
})(); 