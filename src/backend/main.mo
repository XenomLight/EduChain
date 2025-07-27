import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Char "mo:base/Char";
import Float "mo:base/Float";

actor {
  // ========== TYPES ==========
  public type Error = {
    #AlreadyExists;
    #NotFound;
    #InvalidCredentials;
    #PasswordsDoNotMatch;
    #Unauthorized;
    #IdAlreadyExists;
    #InvalidState;
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

  public type Course = {
    id: Text;
    title: Text;
    instructor: Text;
    category: Text;
    price: Nat;
    priceDiscount: ?Nat;
    currency: Text;
    rating: Float;
    totalRatings: Nat;
    thumbnail: Text;
    duration: Nat;
    durationText: Text;
    modules: [Modul];
    description: Text;
    level: Text;
    isFavorite: Bool;
    progress: ?Nat;
    totalStudents: Nat;
    totalModules: Nat;
    totalLessons: Nat;
    totalDuration: Nat;
    created_at: Int;
    updated_at: Int;
    bannerImage: ?Text;
    learningOutcomes: [Text];
    requirements: [Text];
    whatYouGet: [Text];
    tags: [Text];
  };

  public type Enrollment = {
    user_id: Principal;
    course_id: Text;
    enrollment_date: Text;
    status: Text;
    created_at: Int;
    updated_at: Int;
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

  public type Transaction = {
    transaksi_id: Nat;
    user_id: Nat;
    course_id: Text;
    harga_transaksi: Nat;
    currency: Text;
    tanggal_transaksi: Int;
    status: Text;
  };

  public type Result<T, E> = { #ok: T; #err: E };
  public type ResultUser = Result<User, Error>;
  public type ResultCourse = Result<Course, Error>;
  public type ResultEnrollment = Result<Enrollment, Error>;
  public type ResultBool = Result<Bool, Error>;
  public type ResultModules = Result<[Modul], Error>;
  public type ResultContents = Result<[Konten], Error>;
  // ========== STORAGE ==========
  private stable var nextUserId: Nat = 1;
  private stable var nextEnrollmentId: Nat = 1;
  private stable var nextTransactionId: Nat = 1;

  // User storage
  private stable var userEntries: [(Principal, User)] = [];
  private var users = HashMap.HashMap<Principal, User>(1, Principal.equal, Principal.hash);
  private var usersByEmail = HashMap.HashMap<Text, Principal>(1, Text.equal, Text.hash);
  private var usernames = HashMap.HashMap<Text, Principal>(1, Text.equal, Text.hash);

  // Course storage
  private stable var courseEntries: [(Text, Course)] = [];
  private var courses = HashMap.HashMap<Text, Course>(1, Text.equal, Text.hash);

  // Enrollment storage
  private stable var enrollmentEntries: [(Principal, Text, Enrollment)] = [];
  private var enrollments = HashMap.HashMap<(Principal, Text), Enrollment>(1, 
    func(a: (Principal, Text), b: (Principal, Text)): Bool { 
      Principal.equal(a.0, b.0) and a.1 == b.1 
    },
    func((p, c): (Principal, Text)): Hash.Hash {
      let h1 = Principal.hash(p);
      let h2 = Text.hash(c);
      h1 ^ h2
    }
  );

  // Transaction storage
  private stable var transactionEntries: [(Nat, Transaction)] = [];
  private var transactions = HashMap.HashMap<Nat, Transaction>(1, Nat.equal, Hash.hash);
  private var userTransactions = HashMap.HashMap<Nat, [Nat]>(1, Nat.equal, Hash.hash);

  // ========== HELPER FUNCTIONS ==========
  private func getCurrentTime(): Int {
    Time.now() / 1_000_000_000; // Convert to seconds
  };

  private func isEmailTaken(email: Text): Bool {
    usersByEmail.get(email) != null
  };

  private func isUsernameTaken(username: Text): Bool {
    usernames.get(username) != null
  };

 private func hashPassword(password: Text): Text {
  // Simple hash function for development
  // In production, use a proper password hashing library
  var hash : Nat32 = 0;
  for (c in Text.toIter(password)) {
    hash := hash *% 31 +% Char.toNat32(c);
    hash := hash +% (hash << 10);
    hash := hash ^ (hash >> 6);
  };
  hash := hash +% (hash << 3);
  hash := hash ^ (hash >> 11);
  hash := hash +% (hash << 15);
  Nat32.toText(hash);
  };

  // ========== USER MANAGEMENT ==========
  public shared (msg) func loginWithEmail(email: Text, password: Text): async ResultUser {
    switch (usersByEmail.get(email)) {
        case (?principal) {
            switch (users.get(principal)) {
                case (?user) {
                    // Verify password
                    switch (user.password_hash) {
                        case (?hash) {
                            if (hash == hashPassword(password)) {
                                #ok(user)
                            } else {
                                #err(#InvalidCredentials)
                            }
                        };
                        case null #err(#InvalidCredentials)
                    }
                };
                case null #err(#NotFound)
            }
        };
        case null #err(#NotFound)
    }
  };
  public shared (msg) func loginWithPrincipal(username: ?Text, email: ?Text): async ResultUser {
    // Return current user if exists
    switch (users.get(msg.caller)) {
        case (?user) #ok(user);
        case null #err(#NotFound)
    }
  };
  public shared query (msg) func whoami(): async Principal {
    msg.caller
  };
  public shared query (msg) func getModulesWithAccess(courseId: Text): async ResultModules {
    switch (courses.get(courseId)) {
      case (?course) {
        // Check if user has access
        let enrollmentKey = (msg.caller, courseId);
        if (enrollments.get(enrollmentKey) != null or course.price == 0) {
          #ok(course.modules)
        } else {
          #err(#Unauthorized)
        }
      };
      case null #err(#NotFound)
    }
  };

  public shared query (msg) func getCourseContent(courseId: Text, moduleId: Nat): async ResultContents {
    switch (courses.get(courseId)) {
      case (?course) {
        // Check if user has access
        let enrollmentKey = (msg.caller, courseId);
        if (enrollments.get(enrollmentKey) != null or course.price == 0) {
          // Find the module
          switch (Array.find<Modul>(course.modules, func(m: Modul): Bool { m.id == moduleId })) {
            case (?foundModule) #ok(foundModule.contents);
            case null #err(#NotFound)
          }
        } else {
          #err(#Unauthorized)
        }
      };
      case null #err(#NotFound)
    }
  };

  public shared (msg) func registerWithEmail(
    username: Text,
    email: Text,
    password: Text,
    confirmPassword: Text,
    firstName: Text,
    lastName: Text
  ): async ResultUser {
    if (password != confirmPassword) return #err(#PasswordsDoNotMatch);
    if (isEmailTaken(email) or isUsernameTaken(username)) return #err(#AlreadyExists);

    let userId = nextUserId;
    nextUserId += 1;
    let now = getCurrentTime();
    
    let newUser: User = {
      user_id = userId;
      principal = msg.caller;
      username = username;
      email = ?email;
      password_hash = ?hashPassword(password);
      first_name = ?firstName;
      last_name = ?lastName;
      created_at = now;
      updated_at = now;
    };

    // Store user data
    users.put(msg.caller, newUser);
    usersByEmail.put(email, msg.caller);
    usernames.put(username, msg.caller);
    
    #ok(newUser)
  };

  public shared query (msg) func getMe(): async ResultUser {
    switch (users.get(msg.caller)) {
      case (?user) #ok(user);
      case null #err(#NotFound);
    }
  };

  // ========== COURSE MANAGEMENT ==========
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
    duration: Nat,
    bannerImage: ?Text,
    learningOutcomes: [Text],
    requirements: [Text],
    whatYouGet: [Text],
    tags: [Text]
  ): async ResultCourse {
    switch (users.get(msg.caller)) {
      case null return #err(#Unauthorized);
      case (?_) {
        if (courses.get(id) != null) return #err(#AlreadyExists);

        let now = getCurrentTime();
        let newCourse: Course = {
          id = id;
          title = title;
          instructor = instructor;
          category = category;
          price = price;
          priceDiscount = priceDiscount;
          currency = currency;
          rating = 0.0;
          totalRatings = 0;
          thumbnail = thumbnail;
          duration = duration;
          durationText = Nat.toText(duration) # " minutes";
          modules = modules;
          description = description;
          level = level;
          isFavorite = false;
          progress = null;
          totalStudents = 0;
          totalModules = modules.size();
          totalLessons = Array.foldLeft<Modul, Nat>(modules, 0, func(acc, m) = acc + m.contents.size());
          totalDuration = duration;
          created_at = now;
          updated_at = now;
          bannerImage = bannerImage;
          learningOutcomes = learningOutcomes;
          requirements = requirements;
          whatYouGet = whatYouGet;
          tags = tags;
        };

        courses.put(id, newCourse);
        #ok(newCourse)
      }
    }
  };

  public shared query func getCourseById(courseId: Text): async ResultCourse {
    switch (courses.get(courseId)) {
      case (?course) #ok(course);
      case null #err(#NotFound);
    }
  };

  public shared query func getCourses(
    page: Nat,
    pageSize: Nat,
    sortBy: ?{
      #newest;
      #popular;
      #rating;
      #priceHighToLow;
      #priceLowToHigh;
    }
  ): async [Course] {
    let allCourses = Iter.toArray(courses.vals());
    
    // Sort courses based on the sortBy parameter
    let sortedCourses = switch(sortBy) {
      case (?#newest) { Array.sort(allCourses, func(a: Course, b: Course): Order.Order {
        Int.compare(b.created_at, a.created_at);
      }) };
      case (?#popular) { Array.sort(allCourses, func(a: Course, b: Course): Order.Order {
        Nat.compare(b.totalStudents, a.totalStudents);
      }) };
      case (?#rating) { Array.sort(allCourses, func(a: Course, b: Course): Order.Order {
        Float.compare(b.rating, a.rating);
      }) };
      case (?#priceHighToLow) { Array.sort(allCourses, func(a: Course, b: Course): Order.Order {
        Nat.compare(b.price, a.price);
      }) };
      case (?#priceLowToHigh) { Array.sort(allCourses, func(a: Course, b: Course): Order.Order {
        Nat.compare(a.price, b.price);
      }) };
      case (null) { allCourses }; // Default: no specific sort
    };

    // Calculate pagination
    let start = page * pageSize;
    
    // Return empty array if start is beyond the array size
    if (start >= sortedCourses.size()) {
      return [];
    };
    
    // Calculate end index, making sure not to exceed array bounds
    let end = Nat.min(start + pageSize, sortedCourses.size());
    
    // Extract the page of results
    Array.tabulate<Course>(
      end - start,
      func(i: Nat): Course { sortedCourses[start + i] }
    );
  };

  // ========== ENROLLMENT ==========
  public shared (msg) func enrollUser(
    courseId: Text,
    enrollmentDate: Text
  ): async ResultEnrollment {
    switch (users.get(msg.caller)) {
      case (?user) {
        // Check if course exists
        switch (courses.get(courseId)) {
          case null return #err(#NotFound);
          case (?course) {
            // Check if already enrolled
            let enrollmentKey = (msg.caller, courseId);
            if (enrollments.get(enrollmentKey) != null) {
              return #err(#AlreadyExists);
            };

            let now = getCurrentTime();
            let enrollment: Enrollment = {
              user_id = msg.caller;
              course_id = courseId;
              enrollment_date = enrollmentDate;
              status = "active";
              created_at = now;
              updated_at = now;
            };

            // Store enrollment
            enrollments.put(enrollmentKey, enrollment);

            #ok(enrollment)
          }
        }
      };
      case null #err(#Unauthorized);
    }
  };

  // ========== PAYMENT & TRANSACTIONS ==========
  public shared (msg) func createTransaction(
    courseId: Text
  ): async Result.Result<Transaction, Error> {
    switch (users.get(msg.caller)) {
      case (?user) {
        // Check if course exists
        switch (courses.get(courseId)) {
          case null return #err(#NotFound);
          case (?course) {
            // Create transaction
            let transactionId = nextTransactionId;
            nextTransactionId += 1;

            let transaction: Transaction = {
              transaksi_id = transactionId;
              user_id = user.user_id;
              course_id = courseId;
              harga_transaksi = course.price;
              currency = course.currency;
              tanggal_transaksi = getCurrentTime();
              status = "pending";
            };

            // Store transaction
            transactions.put(transactionId, transaction);

            // Create or update user's transaction list
            let existingTxns = switch (userTransactions.get(user.user_id)) {
              case (?txns) { Buffer.fromArray<Nat>(txns) };
              case null { Buffer.Buffer<Nat>(0) };
            };
            
            // Add new transaction ID
            existingTxns.add(transactionId);
            
            // Store updated transaction list
            userTransactions.put(user.user_id, existingTxns.toArray());

            #ok(transaction)
          }
        }
      };
      case null #err(#Unauthorized);
    }
  };

  public shared (msg) func confirmPayment(
    transactionId: Nat
  ): async Result.Result<{ transaction: Transaction; enrollment: ?Enrollment }, Error> {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (transactions.get(transactionId)) {
          case (?txn) {
            if (txn.user_id != user.user_id) return #err(#Unauthorized);
            if (txn.status != "pending") return #err(#InvalidState);

            // Update transaction status
            let updatedTxn = {
              txn with
              status = "completed";
            };
            transactions.put(transactionId, updatedTxn);

            // Enroll user in the course
            let enrollmentResult = await enrollUser(txn.course_id, Int.toText(getCurrentTime()));
            let enrollment = switch (enrollmentResult) {
              case (#ok(enroll)) ?enroll;
              case (#err(_)) null; // Log error but don't fail
            };

            #ok({ transaction = updatedTxn; enrollment })
          };
          case null #err(#NotFound)
        }
      };
      case null #err(#Unauthorized)
    }
  };

  public shared query (msg) func hasAccess(userPrincipal: Principal, courseId: Text): async ResultBool {
    let enrollmentKey = (userPrincipal, courseId);
    switch (courses.get(courseId)) {
      case (?course) {
        if (enrollments.get(enrollmentKey) != null or course.price == 0) {
          #ok(true)
        } else {
          #ok(false)
        }
      };
      case null #err(#NotFound)
    }
  };

  public shared (msg) func deleteCourse(courseId: Text): async ResultBool {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (courses.get(courseId)) {
          case (?course) {
            courses.delete(courseId);
            #ok(true)
          };
          case null #err(#NotFound)
        }
      };
      case null #err(#Unauthorized)
    }
  };


  public shared (msg) func updateCourseProgress(courseId: Text, progress: Nat): async ResultBool {
    switch (users.get(msg.caller)) {
      case (?user) {
        let enrollmentKey = (msg.caller, courseId);
        switch (enrollments.get(enrollmentKey)) {
          case (?enrollment) {
            // Update course progress logic here
            #ok(true)
          };
          case null #err(#Unauthorized)
        }
      };
      case null #err(#Unauthorized)
    }
  };

  public shared (msg) func toggleFavorite(courseId: Text): async ResultBool {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (courses.get(courseId)) {
          case (?course) {
            // Toggle favorite logic here
            #ok(true)
          };
          case null #err(#NotFound)
        }
      };
      case null #err(#Unauthorized)
    }
  };

  public shared (msg) func setCoursePrice(courseId: Text, price: Nat, currency: Text): async ResultCourse {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (courses.get(courseId)) {
          case (?course) {
            let updatedCourse = {
              course with
              price = price;
              currency = currency;
              updated_at = getCurrentTime();
            };
            courses.put(courseId, updatedCourse);
            #ok(updatedCourse)
          };
          case null #err(#NotFound)
        }
      };
      case null #err(#Unauthorized)
    }
  };

  public shared query func searchCourses(
    query: Text,
    category: ?Text,
    level: ?Text,
    minRating: ?Float,
    maxPrice: ?Nat,
    page: Nat,
    pageSize: Nat
  ): async [Course] {
    let allCourses = Iter.toArray(courses.vals());
    
    // Filter courses based on search criteria
    let filteredCourses = Array.filter<Course>(allCourses, func(course: Course): Bool {
      let titleMatch = Text.contains(Text.toLowercase(course.title), #text Text.toLowercase(query));
      let descMatch = Text.contains(Text.toLowercase(course.description), #text Text.toLowercase(query));
      let categoryMatch = switch (category) {
        case (?cat) course.category == cat;
        case null true;
      };
      let levelMatch = switch (level) {
        case (?lev) course.level == lev;
        case null true;
      };
      let ratingMatch = switch (minRating) {
        case (?rating) course.rating >= rating;
        case null true;
      };
      let priceMatch = switch (maxPrice) {
        case (?price) course.price <= price;
        case null true;
      };
      
      (titleMatch or descMatch) and categoryMatch and levelMatch and ratingMatch and priceMatch
    });
    
    // Apply pagination
    let start = page * pageSize;
    if (start >= filteredCourses.size()) {
      return [];
    };
    
    let end = Nat.min(start + pageSize, filteredCourses.size());
    Array.tabulate<Course>(
      end - start,
      func(i: Nat): Course { filteredCourses[start + i] }
    )
  };
  public shared query (msg) func getMyTransactions(): async Result.Result<[Transaction], Error> {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (userTransactions.get(user.user_id)) {
          case (?txnIds) {
            let txns = Array.mapFilter<Nat, Transaction>(
              txnIds,
              func(id: Nat): ?Transaction { transactions.get(id) }
            );
            #ok(txns)
          };
          case null #ok([])
        }
      };
      case null #err(#Unauthorized)
    }
  };



  // ========== SYSTEM FUNCTIONS ==========
  system func preupgrade() {
    userEntries := Iter.toArray(users.entries());
    courseEntries := Iter.toArray(courses.entries());
    enrollmentEntries := Iter.toArray(
      Iter.map<((Principal, Text), Enrollment), (Principal, Text, Enrollment)>(
        enrollments.entries(),
        func(((p, c), e)): (Principal, Text, Enrollment) { (p, c, e) }
      )
    );
    transactionEntries := Iter.toArray(transactions.entries());
  };

  system func postupgrade() {
    // Rebuild HashMaps from stable entries
    users := HashMap.fromIter<Principal, User>(userEntries.vals(), 1, Principal.equal, Principal.hash);
    courses := HashMap.fromIter<Text, Course>(courseEntries.vals(), 1, Text.equal, Text.hash);
    transactions := HashMap.fromIter<Nat, Transaction>(transactionEntries.vals(), 1, Nat.equal, Hash.hash);

    // Rebuild enrollments HashMap
    enrollments := HashMap.fromIter<(Principal, Text), Enrollment>(
      Iter.map<(Principal, Text, Enrollment), ((Principal, Text), Enrollment)>(
        enrollmentEntries.vals(),
        func((p, c, e)): ((Principal, Text), Enrollment) { ((p, c), e) }
      ),
      1,
      func(a: (Principal, Text), b: (Principal, Text)): Bool { 
        Principal.equal(a.0, b.0) and a.1 == b.1 
      },
      func((p, c): (Principal, Text)): Hash.Hash {
        let h1 = Principal.hash(p);
        let h2 = Text.hash(c);
        h1 ^ h2
      }
    );

    // Rebuild indexes
    for ((principal, user) in users.entries()) {
      switch (user.email) {
        case (?email) { usersByEmail.put(email, principal) };
        case null {};
      };
      usernames.put(user.username, principal);
    };

    // Clear stable entries
    userEntries := [];
    courseEntries := [];
    enrollmentEntries := [];
    transactionEntries := [];
  };
};