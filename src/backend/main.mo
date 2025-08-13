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
  public type CourseUpdate = {
    title: ?Text;
    description: ?Text;
    price: ?Nat;
    priceDiscount: ?Nat;  
    currency: ?Text;
    thumbnail: ?Text;
    bannerImage: ?Text;
    isPublished: ?Bool;
    duration: ?Nat;
    durationText: ?Text;
    totalStudents: ?Nat;
    totalModules: ?Nat;
    totalLessons: ?Nat;
    totalDuration: ?Nat;
    modules: ?[ModuleUpdate];
    level: ?Text;
    learningOutcomes: ?[Text];
    requirements: ?[Text];
    whatYouGet: ?[Text];
    tags: ?[Text];
  };
  public type ModuleUpdate = {
    id: Nat;
    title: ?Text;
    description: ?Text;
    order: ?Nat;
    contents: ?[ContentUpdate];
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

  public type ContentUpdate = {
  id: Nat;
  title: ?Text;
  content_type: ?Text;
  content_url: ?Text;
  duration: ?Nat;
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
    isPublished: Bool; 
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

  public type Wallet = {
    address: Text;
    wallet_type: Text; // "NFID", "Plug", dll
    is_primary: Bool;
    connected_at: Int;
  };

  public type User = {
    user_id: Nat;
    principal: Principal;
    username: Text;
    first_name: ?Text;
    last_name: ?Text;
    email: ?Text;
    password_hash: ?Text;
    date_of_birth: ?Text; // Format: "YYYY-MM-DD"
    gender: ?Text; // "male", "female", "other"
    wallets: [Wallet]; // Daftar wallet yang terhubung
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
    payment_method: Text; // "ICP" or "QRIS"
    payment_proof: ?Text; // For payment proof if needed
  };

  public type PaymentHistory = {
    id: Nat;
    user_principal: Principal;
    user_id: Nat;
    course_id: Text;
    course_title: Text;
    transaction_id: Nat;
    payment_method: Text; // "ICP" or "QRIS"
    amount: Nat;
    currency: Text;
    status: Text; // "pending", "completed", "failed"
    created_at: Int;
    completed_at: ?Int;
    enrollment_status: Text; // "enrolled", "not_enrolled"
  };



  public type Result<T, E> = { #ok: T; #err: E };
  public type ResultUser = Result<User, Error>;
  public type ResultCourse = Result<Course, Error>;
  public type ResultEnrollment = Result<Enrollment, Error>;
  public type ResultBool = Result<Bool, Error>;
  public type ResultModules = Result<[Modul], Error>;
  public type ResultContents = Result<[Konten], Error>;
  public type ResultTransaction = Result<Transaction, Error>;
  public type ResultPaymentHistory = Result<[PaymentHistory], Error>;
  public type ResultPaymentHistoryItem = Result<PaymentHistory, Error>;
  // ========== STORAGE ==========
  private stable var nextUserId: Nat = 1;
  private stable var nextEnrollmentId: Nat = 1;
  private stable var nextTransactionId: Nat = 1;
  private stable var nextPaymentHistoryId: Nat = 1;

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
  stable var stableEnrollments : [(Principal, Text, Enrollment)] = [];
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

  // Payment history storage
  private stable var paymentHistoryEntries: [(Nat, PaymentHistory)] = [];
  private var paymentHistories = HashMap.HashMap<Nat, PaymentHistory>(1, Nat.equal, Hash.hash);
  private var userPaymentHistories = HashMap.HashMap<Principal, [Nat]>(1, Principal.equal, Principal.hash);

  // ========== WALLET & PROFILE FUNCTIONS ==========
  
  // Update profil pengguna
  public shared (msg) func updateProfile(
    firstName: ?Text,
    lastName: ?Text,
    dateOfBirth: ?Text,
    gender: ?Text
  ): async Result.Result<User, Error> {
    switch (users.get(msg.caller)) {
      case (?user) {
        let updatedUser: User = {
          user with
          first_name = firstName;
          last_name = lastName;
          date_of_birth = dateOfBirth;
          gender = gender;
          updated_at = Time.now();
        };
        users.put(msg.caller, updatedUser);
        #ok(updatedUser);
      };
      case null { #err(#NotFound); };
    };
  };

  // Hubungkan wallet baru
  public shared (msg) func connectWallet(
    address: Text,
    walletType: Text
  ): async Result.Result<Wallet, Error> {
    switch (users.get(msg.caller)) {
      case (?user) {
        // Cek apakah wallet sudah terdaftar
        let existingWallet = Array.find<Wallet>(
          user.wallets,
          func(w: Wallet): Bool { w.address == address }
        );
        
        if (existingWallet != null) {
          return #err(#AlreadyExists);
        };
        
        let newWallet: Wallet = {
          address = address;
          wallet_type = walletType;
          is_primary = user.wallets.size() == 0; // Jadikan primary jika wallet pertama
          connected_at = Time.now();
        };
        
        let updatedWallets = Array.append<Wallet>(user.wallets, [newWallet]);
        let updatedUser: User = {
          user with
          wallets = updatedWallets;
          updated_at = Time.now();
        };
        
        users.put(msg.caller, updatedUser);
        #ok(newWallet);
      };
      case null { #err(#NotFound); };
    };
  };

  // Dapatkan daftar wallet pengguna
  public shared query (msg) func getMyWallets(): async Result.Result<[Wallet], Error> {
    switch (users.get(msg.caller)) {
      case (?user) { #ok(user.wallets); };
      case null { #err(#NotFound); };
    };
  };

  // Set wallet utama
  public shared (msg) func setPrimaryWallet(
    address: Text
  ): async Result.Result<[Wallet], Error> {
    switch (users.get(msg.caller)) {
      case (?user) {
        // Reset semua wallet ke non-primary
        let updatedWallets = Array.map<Wallet, Wallet>(
          user.wallets,
          func(w: Wallet): Wallet {
            {
              w with
              is_primary = w.address == address;
            }
          }
        );
        
        // Perbarui user dengan wallet yang sudah diupdate
        let updatedUser: User = {
          user with
          wallets = updatedWallets;
          updated_at = Time.now();
        };
        
        users.put(msg.caller, updatedUser);
        #ok(updatedWallets);
      };
      case null { #err(#NotFound); };
    };
  };

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
    
    // Check if principal is already registered with a different email
    switch (users.get(msg.caller)) {
      case (?existingUser) {
        // If principal exists and email is different, return error
        if (existingUser.email != ?email) {
          return #err(#IdAlreadyExists);
        };
        // If principal exists with same email, it's a duplicate registration attempt
        return #err(#AlreadyExists);
      };
      case null {}; // Principal doesn't exist, continue with registration
    };

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
      date_of_birth = null; // Inisialisasi dengan null
      gender = null;        // Inisialisasi dengan null
      wallets = [];         // Inisialisasi array kosong untuk wallet
      created_at = now;
      updated_at = now;
    };

    // Store user data
    users.put(msg.caller, newUser);
    usersByEmail.put(email, msg.caller);
    usernames.put(username, msg.caller);
    
    #ok(newUser)
  };

  public shared (msg) func updateCourse(
    courseId: Text,
    updates: CourseUpdate
  ): async Result.Result<Course, Error> {
    switch (courses.get(courseId)) {
      case null { 
        return #err(#NotFound); 
      };
      case (?existingCourse) {
        // Verify the user is the course instructor
        let callerId = Principal.toText(msg.caller);
        if (existingCourse.instructor != callerId) {
          return #err(#Unauthorized);
        };

        // Create the updated course by explicitly specifying all fields
        let updatedCourse: Course = {
          id = existingCourse.id;
          title = Option.get(updates.title, existingCourse.title);
          instructor = existingCourse.instructor; // Cannot be updated
          category = existingCourse.category;     // Cannot be updated
          price = Option.get(updates.price, existingCourse.price);
          priceDiscount = updates.priceDiscount; // Can be null
          currency = Option.get(updates.currency, existingCourse.currency);
          rating = existingCourse.rating; // Cannot be updated directly
          totalRatings = existingCourse.totalRatings; // Cannot be updated directly
          thumbnail = Option.get(updates.thumbnail, existingCourse.thumbnail);
          duration = Option.get(updates.duration, existingCourse.duration);
          durationText = Option.get(updates.durationText, existingCourse.durationText);
          
          // Handle optional fields
          bannerImage = switch(updates.bannerImage) {
            case (?banner) ?banner;
            case null existingCourse.bannerImage;
          };
          
          // Modules are handled separately below
          
          description = Option.get(updates.description, existingCourse.description);
          level = Option.get(updates.level, existingCourse.level);
          isFavorite = existingCourse.isFavorite; // Cannot be updated here
          isPublished = Option.get(updates.isPublished, existingCourse.isPublished);
          progress = existingCourse.progress; // Cannot be updated here
          totalStudents = Option.get(updates.totalStudents, existingCourse.totalStudents);
          totalModules = Option.get(updates.totalModules, existingCourse.totalModules);
          totalLessons = Option.get(updates.totalLessons, existingCourse.totalLessons);
          totalDuration = Option.get(updates.totalDuration, existingCourse.totalDuration);
          created_at = existingCourse.created_at; // Cannot be updated
          updated_at = getCurrentTime();
          
          // Handle array fields
          learningOutcomes = Option.get(updates.learningOutcomes, existingCourse.learningOutcomes);
          requirements = Option.get(updates.requirements, existingCourse.requirements);
          whatYouGet = Option.get(updates.whatYouGet, existingCourse.whatYouGet);
          tags = Option.get(updates.tags, existingCourse.tags);
          
          // Update modules if provided
          modules = switch(updates.modules) {
            case null { existingCourse.modules };
            case (?moduleUpdates) { 
              // Map ModuleUpdate to Modul
              Array.map<ModuleUpdate, Modul>(moduleUpdates, func(update) {
                // Find existing module or create new one
                let existingModule = Array.find<Modul>(existingCourse.modules, func(m: Modul) : Bool { m.id == update.id });
                let baseModule = switch(existingModule) {
                  case (?m) m;
                  case null {
                    // Create new module if not found
                    {
                      id = update.id;
                      title = "";
                      description = null;
                      order = 0;
                      contents = [];
                      created_at = getCurrentTime();
                      updated_at = getCurrentTime();
                    }
                  }
                };
                
                // Update module fields
                {
                  baseModule with
                  title = Option.get(update.title, baseModule.title);
                  description = switch(update.description) {
                    case null baseModule.description;
                    case (?desc) {
                      if (desc == "") {
                        null
                      } else {
                        ?desc
                      }
                    };
                  };
                  order = Option.get(update.order, baseModule.order);
                  updated_at = getCurrentTime();
                }
              });
            };
          };
        };

        // Save changes
        courses.put(courseId, updatedCourse);
        #ok(updatedCourse)
      }
    }
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
    description: Text,
    instructor: Text,
    category: Text,
    price: Nat
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
          priceDiscount = null;
          currency = "IDR";
          rating = 0.0;
          totalRatings = 0;
          thumbnail = "";
          duration = 0;
          durationText = "0 minutes";
          modules = [];
          description = description;
          level = "Beginner";
          isFavorite = false;
          isPublished = false; // Default to false when creating a new course
          progress = null;
          totalStudents = 0;
          totalModules = 0;
          totalLessons = 0; // Initialize to 0 since modules array is empty
          totalDuration = 0; // Initialize to 0 since we're not calculating it yet
          created_at = now;
          updated_at = now;
          bannerImage = null;
          learningOutcomes = [];
          requirements = [];
          whatYouGet = [];
          tags = [];
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
              payment_method = "ICP";
              payment_proof = null;
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

            // Create PaymentHistory entry
            let paymentHistoryId = nextPaymentHistoryId;
            nextPaymentHistoryId += 1;

            let paymentHistory: PaymentHistory = {
              id = paymentHistoryId;
              user_principal = msg.caller;
              user_id = user.user_id;
              course_id = courseId;
              course_title = course.title;
              transaction_id = transactionId;
              payment_method = "ICP";
              amount = course.price;
              currency = course.currency;
              status = "pending";
              created_at = getCurrentTime();
              completed_at = null;
              enrollment_status = "not_enrolled";
            };

            // Store payment history
            paymentHistories.put(paymentHistoryId, paymentHistory);

            // Update user's payment history list
            let existingHistories = switch (userPaymentHistories.get(msg.caller)) {
              case (?histories) { Buffer.fromArray<Nat>(histories) };
              case null { Buffer.Buffer<Nat>(0) };
            };
            existingHistories.add(paymentHistoryId);
            userPaymentHistories.put(msg.caller, existingHistories.toArray());

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

            // Update PaymentHistory status
            let userHistories = switch (userPaymentHistories.get(msg.caller)) {
              case (?histories) histories;
              case null [];
            };
            
            // Find and update the corresponding PaymentHistory
            for (historyId in userHistories.vals()) {
              switch (paymentHistories.get(historyId)) {
                case (?history) {
                  if (history.transaction_id == transactionId) {
                    let updatedHistory = {
                      history with
                      status = "completed";
                      completed_at = ?getCurrentTime();
                      enrollment_status = "enrolled";
                    };
                    paymentHistories.put(historyId, updatedHistory);
                  };
                };
                case null {};
              };
            };

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
    searchQuery: Text,
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
      // Simple case-insensitive search by converting both to lowercase
      let searchLower = searchQuery;
      let titleLower = course.title;
      let descLower = course.description;
      
      // Check if title or description contains the search term (case sensitive for now)
      let titleMatch = Text.contains(titleLower, #text searchLower);
      let descMatch = Text.contains(descLower, #text searchLower);
      
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
    
    // Extract the page of results
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

  // Get payment history by user (principal)
  public shared query (msg) func getMyPaymentHistory(): async ResultPaymentHistory {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (userPaymentHistories.get(msg.caller)) {
          case (?historyIds) {
            let histories = Array.mapFilter<Nat, PaymentHistory>(
              historyIds,
              func(id: Nat): ?PaymentHistory { paymentHistories.get(id) }
            );
            // Sort by created_at descending (newest first)
            let sortedHistories = Array.sort<PaymentHistory>(histories, func(a: PaymentHistory, b: PaymentHistory): Order.Order {
              Int.compare(b.created_at, a.created_at)
            });
            #ok(sortedHistories)
          };
          case null #ok([])
        }
      };
      case null #err(#Unauthorized)
    }
  };

  // Get payment history by course
  public shared query (msg) func getPaymentHistoryByCourse(courseId: Text): async ResultPaymentHistory {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (userPaymentHistories.get(msg.caller)) {
          case (?historyIds) {
            let histories = Array.mapFilter<Nat, PaymentHistory>(
              historyIds,
              func(id: Nat): ?PaymentHistory { 
                switch (paymentHistories.get(id)) {
                  case (?history) {
                    if (history.course_id == courseId) {
                      ?history
                    } else {
                      null
                    }
                  };
                  case null null;
                }
              }
            );
            // Sort by created_at descending (newest first)
            let sortedHistories = Array.sort<PaymentHistory>(histories, func(a: PaymentHistory, b: PaymentHistory): Order.Order {
              Int.compare(b.created_at, a.created_at)
            });
            #ok(sortedHistories)
          };
          case null #ok([])
        }
      };
      case null #err(#Unauthorized)
    }
  };

  // Get payment history by user principal and course (combined)
  public shared query (msg) func getPaymentHistoryByUserAndCourse(courseId: Text): async ResultPaymentHistory {
    switch (users.get(msg.caller)) {
      case (?user) {
        switch (userPaymentHistories.get(msg.caller)) {
          case (?historyIds) {
            let histories = Array.mapFilter<Nat, PaymentHistory>(
              historyIds,
              func(id: Nat): ?PaymentHistory { 
                switch (paymentHistories.get(id)) {
                  case (?history) {
                    if (history.course_id == courseId and history.user_principal == msg.caller) {
                      ?history
                    } else {
                      null
                    }
                  };
                  case null null;
                }
              }
            );
            // Sort by created_at descending (newest first)
            let sortedHistories = Array.sort<PaymentHistory>(histories, func(a: PaymentHistory, b: PaymentHistory): Order.Order {
              Int.compare(b.created_at, a.created_at)
            });
            #ok(sortedHistories)
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
    // Convert enrollment entries to the correct format for stable storage
    stableEnrollments := Array.map<((Principal, Text), Enrollment), (Principal, Text, Enrollment)>(
    Iter.toArray(enrollments.entries()),
    func((key, value)) = (key.0, key.1, value)
    );

    transactionEntries := Iter.toArray(transactions.entries());
    paymentHistoryEntries := Iter.toArray(paymentHistories.entries());
  };

  system func postupgrade() {
    // Rebuild users
    users := HashMap.fromIter<Principal, User>(userEntries.vals(), userEntries.size(), Principal.equal, Principal.hash);
    
    // Rebuild courses
    courses := HashMap.fromIter<Text, Course>(courseEntries.vals(), courseEntries.size(), Text.equal, Text.hash);
    
     enrollments := HashMap.fromIter<(Principal, Text), Enrollment>(
    Array.map<(Principal, Text, Enrollment), ((Principal, Text), Enrollment)>(
      enrollmentEntries,
      func((userId, courseId, enrollment)) = ((userId, courseId), enrollment)
    ).vals(),
    enrollmentEntries.size(),
    func(a: (Principal, Text), b: (Principal, Text)): Bool { 
      Principal.equal(a.0, b.0) and a.1 == b.1 
    },
    func((p, c): (Principal, Text)): Hash.Hash {
      let h1 = Principal.hash(p);
      let h2 = Text.hash(c);
      h1 ^ h2
    }
    );
  
    // Rebuild transactions
    transactions := HashMap.fromIter<Nat, Transaction>(transactionEntries.vals(), transactionEntries.size(), Nat.equal, Hash.hash);
    
    // Rebuild payment histories
    paymentHistories := HashMap.fromIter<Nat, PaymentHistory>(paymentHistoryEntries.vals(), paymentHistoryEntries.size(), Nat.equal, Hash.hash);

    // Rebuild user payment histories index
    userPaymentHistories := HashMap.HashMap<Principal, [Nat]>(1, Principal.equal, Principal.hash);
    for ((id, history) in paymentHistories.entries()) {
    let existingHistories = switch (userPaymentHistories.get(history.user_principal)) {
      case (?histories) { Buffer.fromArray<Nat>(histories) };
      case null { Buffer.Buffer<Nat>(0) };
    };
    existingHistories.add(id);
    userPaymentHistories.put(history.user_principal, Buffer.toArray(existingHistories));
    };

    // Clear temporary storage
    userEntries := [];
    courseEntries := [];
    enrollmentEntries := [];
    transactionEntries := [];
    paymentHistoryEntries := [];
  };
};