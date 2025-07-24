import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";

actor {

  // ---------- TYPES Data ----------
  public type Error = {
    #AlreadyExists;
    #NotFound;
    #InvalidCredentials;
    #PasswordsDoNotMatch;
    #Unauthorized;
    #IdAlreadyExists;
  };

  type User = {
    principal: Principal;
    username: Text;
    first_name: ?Text;
    last_name: ?Text;
    email: ?Text;
    passwordHash: ?Text;
  };

  type Konten = {
    id: Nat;
    title: Text;
    body: Text;
  };

  type Modul = {
    id: Nat;
    title: Text;
    contents: [Konten];
  };

  type Kursus = {
    id: Text;
    title: Text;
    provider: Text;
    price: Nat;
    currency: Text;
    detailUrl: Text;
    modules: [Modul];
  };

  // ---------- STORAGE ----------
  private stable var _users: [(Principal, User)] = [];
  private stable var _usersByEmail: [(Text, User)] = [];
  private stable var _usernames: [(Text, ())] = [];
  private stable var _courses: [(Text, Kursus)] = [];

  let users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
  let usersByEmail = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);
  let usernames = HashMap.HashMap<Text, ()>(0, Text.equal, Text.hash);
  let courses = HashMap.HashMap<Text, Kursus>(0, Text.equal, Text.hash);

  stable var seed: Nat = 1;

  // ---------- HELPERS ----------
  private func hashPassword(password: Text): Text {
    return "hashed_" # password # "_hashed"; // dummy hash
  };

  private func isEmailTaken(email: Text): Bool {
    return usersByEmail.get(email) != null;
  };

  private func isUsernameTaken(username: Text): Bool {
    return usernames.get(username) != null;
  };

  private func nextRandom(): Nat {
    let a: Nat = 1664525;
    let c: Nat = 1013904223;
    let m: Nat = 4294967296;
    seed := (a * seed + c) % m;
    return seed;
  };

  private func generateUniqueUsername(): Text {
    loop {
      let candidate = "User_" # Nat.toText(nextRandom());
      if (not isUsernameTaken(candidate)) return candidate;
    }
  };

  // ---------- USER ----------
  public shared (msg) func loginWithPrincipal(first_name: ?Text, last_name: ?Text): async Result.Result<User, Error> {
    let caller = msg.caller;
    switch (users.get(caller)) {
      case (?user) return #ok(user);
      case null {
        let newUser: User = {
          principal = caller;
          username = generateUniqueUsername();
          first_name = first_name;
          last_name = last_name;
          email = null;
          passwordHash = null;
        };
        users.put(caller, newUser);
        usernames.put(newUser.username, ());
        return #ok(newUser);
      }
    };
  };

  public shared (msg) func registerWithEmail(first_name: Text, last_name: Text, username: Text, email: Text, password: Text, confirmPassword: Text): async Result.Result<User, Error> {
    if (password != confirmPassword) return #err(#PasswordsDoNotMatch);
    if (isEmailTaken(email) or isUsernameTaken(username)) return #err(#AlreadyExists);

    let newUser: User = {
      principal = msg.caller;
      username = username;
      first_name = ?first_name;
      last_name = ?last_name;
      email = ?email;
      passwordHash = ?hashPassword(password);
    };

    users.put(newUser.principal, newUser);
    usersByEmail.put(email, newUser);
    usernames.put(username, ());
    return #ok(newUser);
  };

  public func loginWithEmail(email: Text, password: Text): async Result.Result<User, Error> {
    switch (usersByEmail.get(email)) {
      case (?user) {
        if (user.passwordHash == ?hashPassword(password)) {
          return #ok(user);
        } else {
          return #err(#InvalidCredentials);
        }
      };
      case null return #err(#NotFound);
    }
  };

  public shared query (msg) func getMe(): async ?User {
    return users.get(msg.caller);
  };

  public shared (msg) func whoami(): async Principal {
    return msg.caller;
  };

  // ---------- COURSE ----------
  public query func getCourses(): async [Kursus] {
    return Iter.toArray(courses.vals());
  };

  public query func getCourseById(id: Text): async ?Kursus {
    return courses.get(id);
  };

  public query func getModulebyCourseID(id: Text): async ?[Modul] {
    switch (courses.get(id)) {
      case (?course) return ?course.modules;
      case null return null;
    }
  };

  // ---------- ADMIN ----------
  public shared (msg) func addCourse(
    id: Text,
    title: Text,
    provider: Text,
    price: Nat,
    currency: Text,
    detailUrl: Text,
    modulesParam: [Modul]
  ): async Result.Result<Kursus, Error> {
    let admin: Principal = Principal.fromText("q6txp-dokbc-yq2x2-5w3ex-ywtty-w6dzx-vt4nf-zfay7-6pj57-d3nba-cae");
    if (msg.caller != admin) return #err(#Unauthorized);
    if (courses.get(id) != null) return #err(#IdAlreadyExists);

    let newCourse: Kursus = {
      id = id;
      title = title;
      provider = provider;
      price = price;
      currency = currency;
      detailUrl = detailUrl;
      modules = modulesParam;
    };

    courses.put(id, newCourse);
    return #ok(newCourse);
  };

  // ---------- SYSTEM ----------
  system func preupgrade() {
    _users := Iter.toArray(users.entries());
    _usersByEmail := Iter.toArray(usersByEmail.entries());
    _usernames := Iter.toArray(usernames.entries());
    _courses := Iter.toArray(courses.entries());
  };

  system func postupgrade() {
    for ((p, user) in _users.vals()) users.put(p, user);
    for ((e, user) in _usersByEmail.vals()) usersByEmail.put(e, user);
    for ((u, _) in _usernames.vals()) usernames.put(u, ());
    for ((id, c) in _courses.vals()) courses.put(id, c);
  };

};
