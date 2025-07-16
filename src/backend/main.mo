import Array "mo:base/Array";
import Option "mo:base/Option";

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
    },
    {
      id = 2;
      title = "Back End Developer";
      provider = "Dicoding Indonesia";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/2";
    },
    {
      id = 3;
      title = "Full-Stack Web Developer";
      provider = "hariSenin";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/3";
    },
    {
      id = 4;
      title = "UI/UX Design";
      provider = "hariSenin";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/4";
    },
    {
      id = 5;
      title = "Data Analyst";
      provider = "Dicoding Indonesia";
      price = 12345678;
      currency = "Rp.";
      detailUrl = "/course/5";
    }
  ];

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
  }
}