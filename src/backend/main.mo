import Array "mo:base/Array";
import Option "mo:base/Option";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor {
  type User = {
    email : Text;
    username : Text;
    password : Text;
    konfirmasi_password : Text;
  };
  
  type Kursus = {
    id: Nat;
    title: Text;
    provider: Text;
    price: Nat;
    currency: Text;
    detailUrl: Text;
    modules:[Modul];
  };
  type Konten = {
    id:Nat;
    title:Text;
    body:Text;
  };

  type Modul = {
    id: Nat;
    title: Text;
    contents: [Konten];
  };

  // User Progress Tracking Types
  type UserProgress = {
    userId: Text; // email sebagai identifier
    courseId: Nat;
    completedModules: [Nat]; // array of module IDs yang sudah selesai
    completedContents: [Nat]; // array of content IDs yang sudah selesai
    totalModules: Nat;
    totalContents: Nat;
    completionPercentage: Float;
    lastAccessed: Text; // timestamp
  };

  type ProgressUpdate = {
    userId: Text;
    courseId: Nat;
    moduleId: Nat;
    contentId: Nat;
    isCompleted: Bool;
  };

  stable var users : [User] = [];
  stable var daftarKursus: [Kursus] = [
    {
      id = 1;
      title = "Front End Developer";
      provider = "Dicoding Indonesia";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/1";
      modules = 
      [
      {
        id = 1;
        title = "Pengenalan HTML";
        contents = [
          { id = 1; title = "Apa itu HTML?"; body = "HTML adalah " },
          { id = 2; title = "Struktur Dasar HTML"; body = "Struktur dasar"}
        ];
      },
      {
        id = 2;
        title = "Pengenalan CSS";
        contents = [
           { id = 1; title = "Apa itu CSS?"; body = "CSS adalah " },
           { id = 2; title = "Cara implementasi?"; body = "implementasinya...... " }
        ];
      }
      ]
    },
    {
      id = 2;
      title = "Back End Developer";
      provider = "Dicoding Indonesia";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/2";
      modules = [
        {
          id = 1;
          title = "Pengenalan Backend";
          contents = [
            { id = 1; title = "Apa itu Backend?"; body = "Backend adalah bagian dari aplikasi yang berjalan di server" }
          ];
        }
      ];
    },
    {
      id = 3;
      title = "Full-Stack Web Developer";
      provider = "hariSenin";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/3";
      modules = [
        {
          id = 1;
          title = "Integrasi Frontend & Backend";
          contents = [
            { id = 1; title = "API dan Fetch"; body = "Cara menghubungkan frontend dan backend dengan API" }
          ];
        }
      ];
    },
    {
      id = 4;
      title = "UI/UX Design";
      provider = "hariSenin";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/4";
      modules = [
        {
          id = 1;
          title = "cara desain baik dan benar sesuai human computer interaction";
          contents = [
            { id = 1; title = "desain 101"; body = "bagaimana bikin styling dan components" }
          ];
        }
      ];
    },
    {
      id = 5;
      title = "Data Analyst";
      provider = "Dicoding Indonesia";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/5";
      modules = [
        {
          id = 2;
          title = "Dasar-dasar Analisis Data";
          contents = [
            { id = 1; title = "Pengantar Analisis Data"; body = "Analisis data adalah proses menginspeksi, membersihkan, dan memodelkan data." }
          ];
        }
      ];
    }
  ];

  // User Progress Storage
  private var userProgressMap = HashMap.HashMap<Text, [UserProgress]>(0, Text.equal, Text.hash);

  public func Register(username : Text, email : Text, password : Text, konfirmasipassword : Text) : async Text {
    let exists = Array.find<User>(users, func u { u.username == username });

    if (Option.isSome(exists)) {
      return "username already exists!";
    };

    let newUser : User = {
      email = email;
      username = username;
      password = password;
      konfirmasi_password = konfirmasipassword;
    };

    users := Array.append(users, [newUser]);
    return "user registered successfully!";
  };

  public func Login(email : Text, password : Text) : async Text {
    let userOpt = Array.find<User>(users, func u { u.email == email and u.password == password });

    if (Option.isSome(userOpt)) {
      return "login success";
    } else {
      return "Invalid email or password";
    }
  };
  public query func getCourses() : async [Kursus] {
    return daftarKursus;
  };

  public query func getCourseById(id:Nat):async ? Kursus {
    for (kursus in daftarKursus.vals()){
      if (kursus.id == id) return ? kursus;
    };
    return null;
  };

  public func addCourse(newCourse:Kursus): async Text{
    let exists = Array.find<Kursus>(daftarKursus,func k {k.id == newCourse.id});
    if(Option.isSome(exists)){
      return "Kursus dengan ID tersebut sudah ada";
    };
    daftarKursus := Array.append(daftarKursus, [newCourse]);
    return "Kursus berhasil ditambahkan!";
  }
  public func initializeUserProgress(userId: Text, courseId: Nat) : async Text {
    let courseOpt = await getCourseById(courseId);
    switch (courseOpt) {
      case null { return "Course tidak ditemukan"; };
      case (?course) {
        let totalModules = course.modules.size();
        var totalContents = 0;
        for (module in course.modules.vals()) {
          totalContents += module.contents.size();
        };
        
        let newProgress : UserProgress = {
          userId = userId;
          courseId = courseId;
          completedModules = [];
          completedContents = [];
          totalModules = totalModules;
          totalContents = totalContents;
          completionPercentage = 0.0;
          lastAccessed = "now";
        };
        
        let existingProgress = userProgressMap.get(userId);
        switch (existingProgress) {
          case null { userProgressMap.put(userId, [newProgress]); };
          case (?progressList) {
            let exists = Array.find<UserProgress>(progressList, func p { p.courseId == courseId });
            if (Option.isSome(exists)) {
              return "Progress untuk course ini sudah dimulai ";
            };
            userProgressMap.put(userId, Array.append(progressList, [newProgress]));
          };
        };
        return "Progress berhasil ";
      };
    };
  };

  public func updateUserProgress(update: ProgressUpdate) : async Text {
    let existingProgress = userProgressMap.get(update.userId);
    switch (existingProgress) {
      case null { return "User progress tidak ditemukan"; };
      case (?progressList) {
        let courseProgressOpt = Array.find<UserProgress>(progressList, func p { p.courseId == update.courseId });
        switch (courseProgressOpt) {
          case null { return "Progress untuk course ini belum diinisialisasi"; };
          case (?courseProgress) {      
            var updatedCompletedModules = courseProgress.completedModules;
            var updatedCompletedContents = courseProgress.completedContents;
            
            if (update.isCompleted) {
              let moduleExists = Array.find<Nat>(courseProgress.completedModules, func m { m == update.moduleId });
              if (Option.isNone(moduleExists)) {
                updatedCompletedModules := Array.append(updatedCompletedModules, [update.moduleId]);
              };
              let contentExists = Array.find<Nat>(courseProgress.completedContents, func c { c == update.contentId });
              if (Option.isNone(contentExists)) {
                updatedCompletedContents := Array.append(updatedCompletedContents, [update.contentId]);
              };
            };
            let modulePercentage = Float.fromInt(updatedCompletedModules.size()) / Float.fromInt(courseProgress.totalModules);
            let contentPercentage = Float.fromInt(updatedCompletedContents.size()) / Float.fromInt(courseProgress.totalContents);
            let overallPercentage = (modulePercentage + contentPercentage) / 2.0 * 100;
            let updatedProgress : UserProgress = {
              userId = courseProgress.userId;
              courseId = courseProgress.courseId;
              completedModules = updatedCompletedModules;
              completedContents = updatedCompletedContents;
              totalModules = courseProgress.totalModules;
              totalContents = courseProgress.totalContents;
              completionPercentage = overallPercentage;
              lastAccessed = "now";
            };
            
            let updatedProgressList = Array.map<UserProgress, UserProgress>(
              progressList,
              func p { if (p.courseId == update.courseId) updatedProgress else p }
            );
            
            userProgressMap.put(update.userId, updatedProgressList);
            return "Progress berhasil diupdate";
          };
        };
      };
    };
  };

  public query func getUserProgress(userId: Text, courseId: Nat) : async ? UserProgress {
    let existingProgress = userProgressMap.get(userId);
    switch (existingProgress) {
      case null { return null; };
      case (?progressList) {
        return Array.find<UserProgress>(progressList, func p { p.courseId == courseId });
      };
    };
  };
  public query func getAllUserProgress(userId: Text) : async [UserProgress] {
    let existingProgress = userProgressMap.get(userId);
    switch (existingProgress) {
      case null { return; };
      case (?progressList) { return progressList; };
    };
  };

  public query func getCourseCompletionStatus(userId: Text, courseId: Nat) : async ? Float {
    let progressOpt = await getUserProgress(userId, courseId);
    switch (progressOpt) {
      case null { return null; };
      case (?progress) { return ?progress.completionPercentage; };
    };
  };
};