import Array "mo:base/Array";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Nat "mo:base/Nat";


actor {
  type User = {
    principal: Text;
    gmail : Text;
    username : Text;
    password : Text;
    first_name:Text;
    last_name:Text;
    konfirmasi_password : Text;
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

  type Kursus = {
    id: Nat;
    title: Text;
    provider: Text;
    price: Nat;
    currency: Text;
    detailUrl: Text;
    modules:[Modul];
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


  func simpleHash(s: Text) : Text {
  var hash : Nat = 0;
  for (c in Text.toIter(s)) {
    hash += Nat.fromIntWrap(Char.toNat32(c));
  };
  Text.fromNat(hash)
  }

  public func Register(principal: Text, username : Text, email : Text, password : Text, konfirmasipassword : Text) : async Text {
    let exists = Array.find<User>(users, func u { u.principal == principal });
    if (Option.isSome(exists)) {
      return "principal already registered!";
    };
    let hashedPassword = simpleHash(password);
    let newUser : User = {
      principal = principal;
      email = email;
      username = username;
      password = hashedPassword;
      konfirmasi_password = konfirmasipassword;
    };
    users := Array.append(users, [newUser]);
    return "user registered successfully!";
  };

  public func Login(principal: Text, email: Text, password: Text) : async Text {
    let hashedPassword = simpleHash(password);
    let userOpt = Array.find<User>(users, func u {
      u.principal == principal and u.email == email and u.password == hashedPassword
    });
    if (Option.isSome(userOpt)) {
      return "login success";
    } else {
      return "Invalid principal, email, or password";
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
}
