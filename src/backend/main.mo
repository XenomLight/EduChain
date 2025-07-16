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
    id:Nat:
    title: Text;
    provider:Text;
    currency:Text; 
  }
  stable var users : [User] = [];

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
}