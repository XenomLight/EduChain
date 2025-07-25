import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  // ---------- TYPES Data ----------
  
  // Helper function for custom hashing (replacing Hash.xor)
  private func customHash(a: Hash.Hash, b: Hash.Hash) : Hash.Hash {
    let a32 = a;
    let b32 = b;
    let x = (a32 +% b32) % (2**32 - 1);
    x
  };

  public type Error = {
    #AlreadyExists;
    #NotFound;
    #InvalidCredentials;
    #PasswordsDoNotMatch;
    #Unauthorized;
    #IdAlreadyExists;
    #InvalidAmount;
  };

  public type User = {
    user_id: Nat;
    principal: Principal;
    username: Text;
    first_name: ?Text;
    last_name: ?Text;
    email: ?Text;
    password_hash: ?Text;
    created_at: Int;
    updated_at: Int;
  };

  public type Transactions = {
    transaksi_id: Nat;
    user_id: Nat;  // Changed from Principal to Nat
    course_id: Text;
    harga_transaksi: Nat;
    currency: Text;
    tanggal_transaksi: Int;
    status: Text;
  };

  public type Konten = {
    id: Nat;
    title: Text;
    content_type: Text;
    content_url: ?Text;
    duration: ?Nat;
    created_at: Int;
    updated_at: Int;
  };

  public type Modul = {
    id: Nat;
    title: Text;
    description: ?Text;
    order: Nat;
    contents: [Konten];
    created_at: Int;
    updated_at: Int;
  };

  public type Kursus = {
    id: Text;
    title: Text;
    instructor: Text;         // e.g. "Alex Morgan"
    category: Text;          // e.g. "UI/UX Design"
    price: Nat;
    priceDiscount: ?Nat;     // Optional discounted price
    currency: Text;          // e.g. "USD"
    rating: Float;           // e.g. 4.8
    totalRatings: Nat;       // e.g. 12.5k
    thumbnail: Text;         // URL to course thumbnail
    duration: Nat;           // in minutes
    durationText: Text;      // e.g. "12h 30m"
    modules: [Modul];
    description: Text;
    level: Text;             // e.g. "Beginner", "Intermediate", "Advanced"
    isFavorite: Bool;        // Whether the course is favorited by the user
    progress: ?Nat;          // Optional progress percentage (0-100)
    totalStudents: Nat;      // Total number of students enrolled
    totalModules: Nat;       // Total number of modules
    totalLessons: Nat;       // Total number of lessons
    totalDuration: Nat;      // Total duration in minutes
    created_at: Int;
    updated_at: Int;
  };

  public type Enrollment = {
    user_id: Nat;  // Changed from Principal to Nat
    course_id: Text;
    enrollment_date: Text;
    status: Text;
    created_at: Int;
    updated_at: Int;
  };

  // ---------- STORAGE ----------
  private stable var nextUserId: Nat = 1;
  private stable var nextTransactionId: Nat = 1;
  
  // User storage
  private stable var usersEntries: [(Principal, User)] = [];
  private var users = HashMap.HashMap<Principal, User>(1, Principal.equal, Principal.hash);
  
  // Principal to user_id mapping
  private stable var principalToUserIdEntries: [(Principal, Nat)] = [];
  private var principalToUserId = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  
  // User ID to Principal mapping
  private stable var userIdToPrincipalEntries: [(Nat, Principal)] = [];
  private var userIdToPrincipal = HashMap.HashMap<Nat, Principal>(1, Nat.equal, Hash.hash);
  
  // Other storage
  private stable var usersByEmailEntries: [(Text, Principal)] = [];
  private var usersByEmail = HashMap.HashMap<Text, Principal>(1, Text.equal, Text.hash);
  
  private stable var usernamesEntries: [(Text, ())] = [];
  private var usernames = HashMap.HashMap<Text, ()>(1, Text.equal, Text.hash);
  
  private stable var coursesEntries: [(Text, Kursus)] = [];
  private var courses = HashMap.HashMap<Text, Kursus>(1, Text.equal, Text.hash);
  
  private stable var enrollmentsEntries: [((Principal, Text), Enrollment)] = [];
  private var enrollments = HashMap.HashMap<(Principal, Text), Enrollment>(1, 
    func(a: (Principal, Text), b: (Principal, Text)): Bool { 
      Principal.equal(a.0, b.0) and Text.equal(a.1, b.1) 
    }, 
    func((p, t): (Principal, Text)): Hash.Hash { 
      let ph = Principal.hash(p);
      let th = Text.hash(t);
      customHash(ph, th)
    }
  );
  
  private stable var transactionsEntries: [(Nat, Transactions)] = [];
  private var transactions = HashMap.HashMap<Nat, Transactions>(1, Nat.equal, Hash.hash);

  // Helper function to get current timestamp
  private func getCurrentTime(): Int {
    Time.now() / 1_000_000_000; // Convert to seconds
  };

  // Helper function to generate a new user ID
  private func getNextUserId(): Nat {
    let id = nextUserId;
    nextUserId += 1;
    id
  };

  // Helper function to generate a new transaction ID
  private func getNextTransactionId(): Nat {
    let id = nextTransactionId;
    nextTransactionId += 1;
    id
  };

  // Helper function to get user_id from Principal
  private func getUserId(principal: Principal): ?Nat {
    principalToUserId.get(principal)
  };

  // Helper function to get Principal from user_id
  private func getPrincipal(userId: Nat): ?Principal {
    userIdToPrincipal.get(userId)
  };

  // Helper function to check if email is taken
  private func isEmailTaken(email: Text): Bool {
    usersByEmail.get(email) != null
  };

  // Helper function to check if username is taken
  private func isUsernameTaken(username: Text): Bool {
    usernames.get(username) != null
  };

  // Placeholder for password hashing - replace with secure hashing in production
  private func hashPassword(password: Text): Text {
    // In a real application, use a secure hashing algorithm
    // This is just a placeholder
    let hashed = Text.map(password, func (c: Char): Char { 
      let n = Char.toNat32(c);
      let rotated = (n +% 13) % 26;
      Char.fromNat32(rotated + 97)
    });
    hashed
  };

  // ---------- AUTHENTICATION ----------
  public shared (msg) func registerWithEmail(
    first_name: Text, 
    last_name: Text, 
    username: Text, 
    email: Text, 
    password: Text, 
    confirmPassword: Text
  ): async Result.Result<User, Error> {
    if (password != confirmPassword) return #err(#PasswordsDoNotMatch);
    if (isEmailTaken(email) or isUsernameTaken(username)) return #err(#AlreadyExists);

    let userId = getNextUserId();
    let now = getCurrentTime();
    
    let newUser: User = {
      user_id = userId;
      principal = msg.caller;
      username = username;
      first_name = ?first_name;
      last_name = ?last_name;
      email = ?email;
      password_hash = ?hashPassword(password);
      created_at = now;
      updated_at = now;
    };

    // Store user data
    users.put(msg.caller, newUser);
    principalToUserId.put(msg.caller, userId);
    userIdToPrincipal.put(userId, msg.caller);
    usersByEmail.put(email, msg.caller);
    usernames.put(username, ());
    
    return #ok(newUser);
  };

  public shared (msg) func loginWithEmail(email: Text, password: Text): async Result.Result<User, Error> {
    switch (usersByEmail.get(email)) {
      case (?principal) {
        switch (users.get(principal)) {
          case (?user) {
            // In a real app, verify the password hash properly
            if (user.password_hash == ?hashPassword(password)) {
              return #ok(user);
            } else {
              return #err(#InvalidCredentials);
            }
          };
          case null return #err(#NotFound);
        }
      };
      case null return #err(#NotFound);
    }
  };

  public shared query (msg) func getMe(): async Result.Result<User, Error> {
    switch (users.get(msg.caller)) {
      case (?user) #ok(user);
      case null #err(#NotFound);
    }
  };

  public shared query (msg) func getMyTransactions(): async Result.Result<[Transactions], Error> {
    switch (getUserId(msg.caller)) {
      case (?userId) {
        let userTransactions = Array.filter(
          Iter.toArray(transactions.vals()),
          func(t: Transactions): Bool { t.user_id == userId }
        );
        #ok(userTransactions)
      };
      case null #err(#NotFound);
    }
  };

  // Update enrollUser to use user_id
  public shared (msg) func enrollUser(course_id: Text, enrollment_date: Text): async Result.Result<Enrollment, Error> {
    switch (getUserId(msg.caller)) {
      case (?userId) {
        let key = (msg.caller, course_id);
        if (enrollments.get(key) != null) {
          return #err(#AlreadyExists);
        };

        let now = getCurrentTime();
        let enrollment: Enrollment = {
          user_id = userId;
          course_id = course_id;
          enrollment_date = enrollment_date;
          status = "active";
          created_at = now;
          updated_at = now;
        };

        enrollments.put(key, enrollment);
        #ok(enrollment)
      };
      case null #err(#Unauthorized);
    }
  };

  // Update hasAccess to use user_id
  public shared query (msg) func hasAccess(course_id: Text): async Result.Result<Bool, Error> {
    switch (getUserId(msg.caller)) {
      case (?userId) {
        let key = (msg.caller, course_id);
        #ok(enrollments.get(key) != null)
      };
      case null #err(#Unauthorized);
    }
  };

  // Update getModulesWithAccess to use user_id
  public shared query (msg) func getModulesWithAccess(courseId: Text): async Result.Result<[Modul], Error> {
    let key = (msg.caller, courseId);
    
    switch (enrollments.get(key)) {
      case (?_) {
        // User is enrolled, return all modules
        switch (courses.get(courseId)) {
          case (?course) #ok(course.modules);
          case null #err(#NotFound);
        }
      };
      case null {
        // User not enrolled, check if course is free
        switch (courses.get(courseId)) {
          case (?course) {
            if (course.price == 0) {
              #ok(course.modules)
            } else {
              #err(#Unauthorized)
            }
          };
          case null #err(#NotFound);
        }
      };
    }
  };

  // Update getCourseContent to use user_id
  public shared query (msg) func getCourseContent(courseId: Text, moduleId: Nat): async Result.Result<[Konten], Error> {
    let key = (msg.caller, courseId);
    
    // Check if user has access (enrolled or course is free)
    let hasAccess = switch (enrollments.get(key)) {
      case (?enrollment) true;
      case null {
        switch (courses.get(courseId)) {
          case (?course) course.price == 0;
          case null return #err(#NotFound);
        }
      }
    };

    if (not hasAccess) return #err(#Unauthorized);
    
    // User has access, find the module
    switch (courses.get(courseId)) {
      case (?course) {
        for (m in course.modules.vals()) {
          if (m.id == moduleId) {
            return #ok(m.contents);
          }
        };
        #err(#NotFound)
      };
      case null #err(#NotFound);
    }
  };

  // Update createTransaction to use user_id
  public shared (msg) func createTransaction(
    course_id: Text,
    harga_transaksi: Nat,
    currency: Text,
    status: Text
  ): async Result.Result<Transactions, Error> {
    switch (getUserId(msg.caller)) {
      case (?userId) {
        let transaksi_id = getNextTransactionId();
        let currentTime = getCurrentTime();
        
        let newTransaction: Transactions = {
          transaksi_id = transaksi_id;
          user_id = userId;
          course_id = course_id;
          harga_transaksi = harga_transaksi;
          currency = currency;
          tanggal_transaksi = currentTime;
          status = status;
        };

        transactions.put(transaksi_id, newTransaction);
        
        // If payment is successful, enroll the user
        if (status == "completed") {
          let enrollmentResult = await enrollUser(course_id, Int.toText(currentTime));
          switch (enrollmentResult) {
            case (#err(e)) Debug.print("Enrollment failed: " # debug_show(e));
            case _ {};
          };
        };

        #ok(newTransaction)
      };
      case null #err(#Unauthorized);
    }
  };

  // Add this function after the other course-related functions
  public shared (msg) func setCoursePrice(
    courseId: Text,
    price: Nat,
    currency: Text
  ): async Result.Result<Kursus, Error> {
    // Check if the caller is authorized (e.g., admin)
    // For now, we'll allow any authenticated user to set prices
    // In production, you should add proper authorization
    
    switch (courses.get(courseId)) {
      case (?existingCourse) {
        // Update existing course price
        let updatedCourse: Kursus = {
          id = existingCourse.id;
          title = existingCourse.title;
          instructor = existingCourse.instructor;
          category = existingCourse.category;
          price = price;
          priceDiscount = existingCourse.priceDiscount;
          currency = currency;
          rating = existingCourse.rating;
          totalRatings = existingCourse.totalRatings;
          thumbnail = existingCourse.thumbnail;
          duration = existingCourse.duration;
          durationText = existingCourse.durationText;
          modules = existingCourse.modules;
          description = existingCourse.description;
          level = existingCourse.level;
          isFavorite = existingCourse.isFavorite;
          progress = existingCourse.progress;
          totalStudents = existingCourse.totalStudents;
          totalModules = existingCourse.totalModules;
          totalLessons = existingCourse.totalLessons;
          totalDuration = existingCourse.totalDuration;
          created_at = existingCourse.created_at;
          updated_at = getCurrentTime();
        };
        
        courses.put(courseId, updatedCourse);
        #ok(updatedCourse)
      };
      case null {
        // Course not found, return error
        #err(#NotFound)
      };
    }
  };

  // Update addCourse function
  public shared (msg) func addCourse(
    id: Text,
    title: Text,
    instructor: Text,
    category: Text,
    price: Nat,
    priceDiscount: ?Nat,
    currency: Text,
    thumbnail: Text,
    description: Text,
    level: Text,
    modules: [Modul],
    duration: Nat
  ): async Result.Result<Kursus, Error> {
    // Check if course already exists
    if (courses.get(id) != null) {
      return #err(#AlreadyExists);
    };

    let now = Time.now() / 1_000_000_000; // Convert to seconds
    
    // Calculate course statistics
    let totalMods = modules.size();
    let totalLessons = Array.foldLeft<Modul, Nat>(
      modules, 0, 
      func(acc: Nat, m: Modul): Nat { acc + m.contents.size() }
    );
    
    let totalDur = Array.foldLeft<Modul, Nat>(
      modules, 0,
      func(acc: Nat, m: Modul): Nat {
        acc + Array.foldLeft<Konten, Nat>(
          m.contents, 0,
          func(acc2: Nat, c: Konten): Nat { acc2 + Option.get(c.duration, 0) }
        )
      }
    );

    // Format duration as "Xh Ym"
    let hours = totalDur / 60;
    let minutes = totalDur % 60;
    let durationText = if (hours > 0) {
      if (minutes > 0) {
        debug_show(hours) # "h " # debug_show(minutes) # "m"
      } else {
        debug_show(hours) # "h"
      }
    } else {
      debug_show(minutes) # "m"
    };

    let newCourse: Kursus = {
      id = id;
      title = title;
      instructor = instructor;
      category = category;
      price = price;
      priceDiscount = priceDiscount;
      currency = currency;
      thumbnail = thumbnail;
      description = description;
      level = level;
      modules = modules;
      duration = duration;
      durationText = durationText;
      rating = 0.0;  // Default rating
      totalRatings = 0;  // No ratings yet
      isFavorite = false;  // Not favorited by default
      progress = null;  // No progress for new course
      totalStudents = 0;  // No students enrolled yet
      totalModules = totalMods;
      totalLessons = totalLessons;
      totalDuration = totalDur;
      created_at = now;
      updated_at = now;
    };

    courses.put(id, newCourse);
    #ok(newCourse)
  };

  // Update system functions for upgrade/downgrade
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    principalToUserIdEntries := Iter.toArray(principalToUserId.entries());
    userIdToPrincipalEntries := Iter.toArray(userIdToPrincipal.entries());
    usersByEmailEntries := Iter.toArray(usersByEmail.entries());
    usernamesEntries := Iter.toArray(usernames.entries());
    coursesEntries := Iter.toArray(courses.entries());
    enrollmentsEntries := Iter.toArray(enrollments.entries());
    transactionsEntries := Iter.toArray(transactions.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, User>(usersEntries.vals(), 1, Principal.equal, Principal.hash);
    principalToUserId := HashMap.fromIter<Principal, Nat>(principalToUserIdEntries.vals(), 1, Principal.equal, Principal.hash);
    userIdToPrincipal := HashMap.fromIter<Nat, Principal>(userIdToPrincipalEntries.vals(), 1, Nat.equal, Hash.hash);
    usersByEmail := HashMap.fromIter<Text, Principal>(usersByEmailEntries.vals(), 1, Text.equal, Text.hash);
    usernames := HashMap.fromIter<Text, ()>(usernamesEntries.vals(), 1, Text.equal, Text.hash);
    courses := HashMap.fromIter<Text, Kursus>(coursesEntries.vals(), 1, Text.equal, Text.hash);
    
    enrollments := HashMap.fromIter<(Principal, Text), Enrollment>(
      enrollmentsEntries.vals(), 
      1, 
      func(a: (Principal, Text), b: (Principal, Text)): Bool { 
        Principal.equal(a.0, b.0) and Text.equal(a.1, b.1) 
      }, 
      func((p, t): (Principal, Text)): Hash.Hash { 
        let ph = Principal.hash(p);
        let th = Text.hash(t);
        customHash(ph, th)
      }
    );
    
    transactions := HashMap.fromIter<Nat, Transactions>(transactionsEntries.vals(), 1, Nat.equal, Hash.hash);
    
    // Clean up
    usersEntries := [];
    principalToUserIdEntries := [];
    userIdToPrincipalEntries := [];
    usersByEmailEntries := [];
    usernamesEntries := [];
    coursesEntries := [];
    enrollmentsEntries := [];
    transactionsEntries := [];
  };
};
