export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    AlreadyExists: IDL.Null,
    NotFound: IDL.Null,
    InvalidCredentials: IDL.Null,
    PasswordsDoNotMatch: IDL.Null,
    Unauthorized: IDL.Null,
    IdAlreadyExists: IDL.Null
  });

  const Konten = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    body: IDL.Text
  });

  const Modul = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    contents: IDL.Vec(Konten)
  });

  const Kursus = IDL.Record({
    id: IDL.Text,
    title: IDL.Text,
    provider: IDL.Text,
    price: IDL.Nat,
    currency: IDL.Text,
    detailUrl: IDL.Text,
    modules: IDL.Vec(Modul)
  });
  const Enrollment = IDL.Record({
    user_id: IDL.Principal,
    course_id: IDL.Text,
    enrollment_date: IDL.Text
  });

  const User = IDL.Record({
    principal: IDL.Principal,
    username: IDL.Text,
    first_name: IDL.Opt(IDL.Text),
    last_name: IDL.Opt(IDL.Text),
    email: IDL.Opt(IDL.Text),
    passwordHash: IDL.Opt(IDL.Text)
  });

  const ResultUser = IDL.Variant({
    ok: User,
    err: Error
  });

  const ResultCourse = IDL.Variant({
    ok: Kursus,
    err: Error
  });
  const ResultEnrollment = IDL.Variant({
    ok: Enrollment,
    err: Error
  });

  return IDL.Service({

    // USER
    loginWithPrincipal: IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [ResultUser],
      []
    ),
    hasAccess: IDL.Func(
      [IDL.Principal, IDL.Text],
      [IDL.Bool],
      ["query"]
    ),
    
    registerWithEmail: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [ResultUser],
      []
    ),

    loginWithEmail: IDL.Func(
      [IDL.Text, IDL.Text],
      [ResultUser],
      []
    ),

    getMe: IDL.Func([], [IDL.Opt(User)], ["query"]),

    whoami: IDL.Func([], [IDL.Principal], []),
    enrollUser: IDL.Func(
      [IDL.Text, IDL.Text],
      [ResultEnrollment],
      []
    ),
    // COURSE
    getCourses: IDL.Func([], [IDL.Vec(Kursus)], ["query"]),

    getCourseById: IDL.Func([IDL.Text], [IDL.Opt(Kursus)], ["query"]),
    deleteCourse: IDL.Func([IDL.Text], [IDL.Variant({ ok: IDL.Text, err: IDLError })], []),
    getModulebyCourseID: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(Modul))], ["query"]),
    enrollUser: IDL.Func(
      [IDL.Text, IDL.Text],
      [ResultEnrollment],
      []
      
    ),
    // ADMIN
    addCourse: IDL.Func([
      IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text, IDL.Vec(Modul)
    ], [ResultCourse], []),

    // Set course price - Admin only
    setCoursePrice: IDL.Func([
      IDL.Text, IDL.Nat, IDL.Text
    ], [ResultCourse], []),

    // Get modules with access control
    getModulesWithAccess: IDL.Func([IDL.Text], [IDL.Variant({
      ok: IDL.Vec(Modul),
      err: Error
    })], ["query"]),

    // Get course content with access control
    getCourseContent: IDL.Func([IDL.Text, IDL.Nat], [IDL.Variant({
      ok: IDL.Vec(Konten),
      err: Error
    })], ["query"])
  });
};

export const init = ({ IDL }) => {
  return [];
};
