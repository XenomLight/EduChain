import Array "mo:base/Array";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";

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

 type Enrollment = {
    enrollment_id: Nat;
    user_id: Text;
    course_id: Nat;
    enrollment_date: Text;
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
  stable var enrollments: [Enrollment] = [];
  var next_enrollment_id: Nat = 1;

  stable var users : [User] = [];
  stable var daftarKursus: [Kursus] = [
    {
      id = 1;
      title = "Front End Developer";
      provider = "Dicoding Indonesia";
      price = 250000;
      currency = "IDR";
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
      price = 250000;
      currency = "IDR";
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
      price = 250000;
      currency = "IDR";
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
      price = 250000;
      currency = "IDR";
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
      price = 250000;
      currency = "IDR";
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

 

  public query func hasAccess(user_id: Text, course_id: Nat): async Bool {
    let exists = Array.find<Enrollment>(enrollments, func e { e.user_id == user_id and e.course_id == course_id });
    Option.isSome(exists)
  };

  func simpleHash(s: Text) : Text {
    var hash : Nat = 0;
    for (c in Text.toIter(s)) {
      hash += Nat32.toNat(Char.toNat32(c));
    };
    Nat.toText(hash)
  };

  public func Register(principal: Text, username: Text, gmail: Text, password: Text, konfirmasi_password: Text, first_name: Text, last_name: Text) : async Text {
    let exists = Array.find<User>(users, func u { u.principal == principal });
    if (Option.isSome(exists)) {
      return "principal already registered!";
    };
    let hashedPassword = simpleHash(password);
    let newUser : User = {
      principal = principal;
      gmail = gmail;
      username = username;
      password = hashedPassword;
      first_name = first_name;
      last_name = last_name;
      konfirmasi_password = konfirmasi_password;
    };
    users := Array.append(users, [newUser]);
    return "user registered successfully!";
  };

  public func Login(principal: Text, gmail: Text, password: Text) : async Text {
    let hashedPassword = simpleHash(password);
    let userOpt = Array.find<User>(users, func u {
      u.principal == principal and u.gmail == gmail and u.password == hashedPassword
    });
    if (Option.isSome(userOpt)) {
      return "login success";
    } else {
      return "Invalid principal, gmail, or password";
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
  public func enrollUser(user_id: Text, course_id: Nat, enrollment_date: Text): async Text {
    // Cek apakah sudah pernah enroll
    let exists = Array.find<Enrollment>(enrollments, func e { e.user_id == user_id and e.course_id == course_id });
    if (Option.isSome(exists)) {
      return "User already enrolled in this course!";
    };
    let newEnrollment: Enrollment = {
      enrollment_id = next_enrollment_id;
      user_id = user_id;
      course_id = course_id;
      enrollment_date = enrollment_date;
    };
   enrollments  := Array.append(enrollments, [newEnrollment]);
    next_enrollment_id += 1;
    return "Enrollment successful!";
  };
}
