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

    async function registerWithEmail(username, email, password, konfirmasiPassword) {
      try {
        const result = await actor.Register(principal, username, email, password, konfirmasiPassword);
        console.log("Registrasi berhasil:", result);
      } catch (err) {
        console.log("Registrasi gagal:", err);
      }
    }

    async function loginWithEmail(password) {
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

    async function enrollUser(course_id, enrollment_date) {
      try {
        const result = await actor.enrollUser(principal, course_id, enrollment_date);
        console.log("Enroll user result:", result);
      } catch (err) {
        console.log("Enroll user gagal:", err);
      }
    }

    async function deleteCourse(courseId) {
      try {
        const result = await actor.deleteCourse(courseId);
        if ("ok" in result) {
          console.log("Course deleted successfully:", result.ok);
        } else {
          console.log("Delete course failed:", result.err);
        }
      } catch (err) {
        console.error("Delete course error:", err);
      }
    }

    async function hasAccess(course_id) {
      try {
        const result = await actor.hasAccess(principal, course_id);
        console.log("User has access to course", course_id, ":", result);
        return result;
      } catch (err) {
        console.log("Cek akses gagal:", err);
        return false;
      }
    }

    await registerWithEmail(process.env.REGISTER_USERNAME,
      process.env.REGISTER_EMAIL,
      process.env.REGISTER_PASSWORD,
      process.env.REGISTER_CONFIRM);
    await loginWithEmail(process.env.REGISTER_PASSWORD);
    await enrollUser("course-1", "2024-06-10");
    await hasAccess("course-1");
    await GetCourseById("course-1");
    await GetAllCourses("course-1");
    await deleteCourse("course-1");
  }
}); 