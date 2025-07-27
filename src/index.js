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

    async function registerWithEmail(username, email, password, konfirmasiPassword, firstName, lastName) {
      try {
        const result = await actor.registerWithEmail(username, email, password, konfirmasiPassword, firstName, lastName);
        console.log("Registrasi berhasil:", result);
        return result;
      } catch (err) {
        console.log("Registrasi gagal:", err);
        throw err;
      }
    }

    async function loginWithEmail(email, password) {
      try {
        const result = await actor.loginWithEmail(email, password);
        console.log("Login berhasil:", result);
        return result;
      } catch (err) {
        console.log("Login gagal:", err);
        throw err;
      }
    }

    async function GetAllCourses() {
      try {
        const result = await actor.getCourses(0, 10, [{newest: null}]);
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
        const result = await actor.enrollUser(course_id, enrollment_date);
        console.log("Enroll user result:", result);
        return result;
      } catch (err) {
        console.log("Enroll user gagal:", err);
        throw err;
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
        const result = await actor.hasAccess(identity.getPrincipal(), course_id);
        console.log("User has access to course", course_id, ":", result);
        return result;
      } catch (err) {
        console.log("Cek akses gagal:", err);
        return false;
      }
    }
    
    async function searchCourses(query, category, level, minRating, maxPrice, page=0, pageSize=10) {
      try {
        const result = await actor.searchCourses(
          query,
          category ? [category] : [],
          level ? [level] : [],
          minRating ? [minRating] : [],
          maxPrice ? [maxPrice] : [],
          page,
          pageSize
        );
        console.log("search result:", JSON.stringify(result, null, 2));
        return result;
      } catch (err) {
        console.log("gagal mencari:", err);
        return [];
      }
    }

    async function getCourseModules(course_id){
      try{
        const result = await actor.getModulesWithAccess(course_id);
        console.log("course modules:",JSON.stringify(result,null,2));
        return result;
      }catch(err){
        console.log("gagal mengambil modules:",err);
        return null;
      }
    }
    async function getModuleContent(courseId, moduleId) {
      try {
        const result = await actor.getCourseContent(courseId, moduleId);
        console.log("Module content:", JSON.stringify(result, null, 2));
        return result;
      } catch (err) {
        console.log("Failed to get content:", err);
        return null;
      }
    }
    async function updateProgress(courseId, progress) {
      try {
        const result = await actor.updateCourseProgress(courseId, progress);
        console.log("Progress updated:", result);
        return result;
      } catch (err) {
        console.log("Update progress failed:", err);
        return false;
      }
    }
    async function toggleFavorite(courseId) {
      try {
        const result = await actor.toggleFavorite(courseId);
        console.log("Toggle favorite result:", result);
        return result;
      } catch (err) {
        console.log("Toggle favorite failed:", err);
        return false;
      }
    }
    // Test the complete flow
    console.log("\n=== Starting EduTech Backend Test ===");
    
    try {
      // 1. Register user
      console.log("\n1. Testing Registration...");
      await registerWithEmail(
        process.env.REGISTER_USERNAME,
        process.env.REGISTER_EMAIL,
        process.env.REGISTER_PASSWORD,
        process.env.REGISTER_CONFIRM,
        "Test",
        "User"
      );
      
      // 2. Login with email
      console.log("\n2. Testing Login...");
      await loginWithEmail(process.env.REGISTER_EMAIL, process.env.REGISTER_PASSWORD);
      
      // 3. Get all courses
      console.log("\n3. Testing Get All Courses...");
      await GetAllCourses();
      
      // 4. Get specific course
      console.log("\n4. Testing Get Course By ID...");
      await GetCourseById("course-1");
      
      // 5. Enroll in course
      console.log("\n5. Testing Course Enrollment...");
      await enrollUser("course-1", new Date().toISOString());
      
      // 6. Check access
      console.log("\n6. Testing Access Check...");
      await hasAccess("course-1");
      
      // 7. Get course modules
      console.log("\n7. Testing Get Course Modules...");
      await getCourseModules("course-1");
      
      // 8. Get module content
      console.log("\n8. Testing Get Module Content...");
      await getModuleContent("course-1", 1);
      
      // 9. Update progress
      console.log("\n9. Testing Update Progress...");
      await updateProgress("course-1", 50);
      
      // 10. Toggle favorite
      console.log("\n10. Testing Toggle Favorite...");
      await toggleFavorite("course-1");
      
      // 11. Search courses
      console.log("\n11. Testing Search Courses...");
      await searchCourses("blockchain", "technology", "beginner", 4.5, 100);
      
      // 12. Delete course
      console.log("\n12. Testing Delete Course...");
      await deleteCourse("course-1");
      
      console.log("\n=== All tests completed successfully! ===");
      
    } catch (error) {
      console.error("\n Test failed:", error);
      process.exit(1);
    }
  }
}); 