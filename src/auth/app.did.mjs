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

  return IDL.Service({

    // USER
    loginWithPrincipal: IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [ResultUser],
      []
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

    // COURSE
    getCourses: IDL.Func([], [IDL.Vec(Kursus)], ["query"]),

    getCourseById: IDL.Func([IDL.Text], [IDL.Opt(Kursus)], ["query"]),

    getModulebyCourseID: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(Modul))], ["query"]),

    // ADMIN
    addCourse: IDL.Func([
      IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Text, IDL.Vec(Modul)
    ], [ResultCourse], [])
  });
};

export const init = ({ IDL }) => {
  return [];
};
