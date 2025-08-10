export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    AlreadyExists: IDL.Null,
    NotFound: IDL.Null,
    InvalidCredentials: IDL.Null,
    PasswordsDoNotMatch: IDL.Null,
    Unauthorized: IDL.Null,
    IdAlreadyExists: IDL.Null,
    InvalidState: IDL.Null
  });

  const Konten = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    content_type: IDL.Text,
    content_url: IDL.Opt(IDL.Text),
    duration: IDL.Opt(IDL.Nat),
  });

  const Modul = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    description: IDL.Opt(IDL.Text),
    order: IDL.Nat,
    contents: IDL.Vec(Konten),
  });

  const Kursus = IDL.Record({
    id: IDL.Text,
    title: IDL.Text,
    provider: IDL.Text,
    category: IDL.Text,
    price: IDL.Nat,
    priceDiscount: IDL.Opt(IDL.Nat),
    currency: IDL.Text,
    rating: IDL.Float,
    totalRatings: IDL.Nat,
    thumbnail: IDL.Text,
    duration: IDL.Nat,
    durationText: IDL.Text,
    modules: IDL.Vec(Modul),
    description: IDL.Text,
    level: IDL.Text,
    isFavorite: IDL.Bool,
    progress: IDL.Opt(IDL.Nat),
    totalStudents: IDL.Nat,
    totalModules: IDL.Nat,
    totalLessons: IDL.Nat,
    totalDuration: IDL.Nat,
    bannerImage: IDL.Opt(IDL.Text),
    learningOutcomes: IDL.Vec(IDL.Text),
    requirements: IDL.Vec(IDL.Text),
    whatYouGet: IDL.Vec(IDL.Text),
    tags: IDL.Vec(IDL.Text)
  });
  const Enrollment = IDL.Record({
    user_id: IDL.Principal,
    course_id: IDL.Text,
    enrollment_date: IDL.Int,
    status: IDL.Text,
  });

  const Transaction = IDL.Record({
    transaksi_id: IDL.Nat,
    user_id: IDL.Nat,
    course_id: IDL.Text,
    amount: IDL.Nat,
    currency: IDL.Text,
    transaction_date: IDL.Int,
    status: IDL.Text,
    payment_method: IDL.Text,
    payment_proof: IDL.Opt(IDL.Text)
  });

  const PaymentHistory = IDL.Record({
    id: IDL.Nat,
    user_principal: IDL.Principal,
    user_id: IDL.Nat,
    course_id: IDL.Text,
    course_title: IDL.Text,
    transaction_id: IDL.Nat,
    payment_method: IDL.Text,
    amount: IDL.Nat,
    currency: IDL.Text,
    status: IDL.Text,

    completed_at: IDL.Opt(IDL.Int),
    enrollment_status: IDL.Text
  });


  const ContentUpdate = IDL.Record({
    id: IDL.Nat,
    title: IDL.Opt(IDL.Text),
    content_type: IDL.Opt(IDL.Text),
    content_url: IDL.Opt(IDL.Text),
    duration: IDL.Opt(IDL.Nat)
  });

  const ModuleUpdate = IDL.Record({
    id: IDL.Nat,
    title: IDL.Opt(IDL.Text),
    description: IDL.Opt(IDL.Text),
    order: IDL.Opt(IDL.Nat),
    contents: IDL.Opt(IDL.Vec(ContentUpdate))
  });

  const CourseUpdate = IDL.Record({
    title: IDL.Opt(IDL.Text),
    provider: IDL.Opt(IDL.Text),
    category: IDL.Opt(IDL.Text),
    price: IDL.Opt(IDL.Nat),
    priceDiscount: IDL.Opt(IDL.Nat),
    currency: IDL.Opt(IDL.Text),
    thumbnail: IDL.Opt(IDL.Text),
    bannerImage: IDL.Opt(IDL.Text),
    description: IDL.Opt(IDL.Text),
    level: IDL.Opt(IDL.Text),
    learningOutcomes: IDL.Opt(IDL.Vec(IDL.Text)),
    requirements: IDL.Opt(IDL.Vec(IDL.Text)),
    whatYouGet: IDL.Opt(IDL.Vec(IDL.Text)),
    tags: IDL.Opt(IDL.Vec(IDL.Text)),
    isPublished: IDL.Opt(IDL.Bool),
    duration: IDL.Opt(IDL.Nat),
    durationText: IDL.Opt(IDL.Text),
    totalStudents: IDL.Opt(IDL.Nat),
    totalModules: IDL.Opt(IDL.Nat),
    totalLessons: IDL.Opt(IDL.Nat),
    totalDuration: IDL.Opt(IDL.Nat),
    modules: IDL.Opt(IDL.Vec(ModuleUpdate))
  });

  // Di dalam IDL.Service
  updateCourse: IDL.Func(
    [IDL.Text, CourseUpdate],
    [IDL.Variant({ ok: Course, err: Error })],
    []
  )
  const User = IDL.Record({
    user_id: IDL.Nat,
    principal: IDL.Principal,
    username: IDL.Text,
    first_name: IDL.Opt(IDL.Text),
    last_name: IDL.Opt(IDL.Text),
    email: IDL.Opt(IDL.Text),
    password_hash: IDL.Opt(IDL.Text),
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
  const ResultTransaction = IDL.Variant({ ok: Transaction, err: Error });
  const ResultTransactions = IDL.Variant({ ok: IDL.Vec(Transaction), err: Error });
  const ResultPaymentHistory = IDL.Variant({ ok: IDL.Vec(PaymentHistory), err: Error });
  const ResultPaymentHistoryItem = IDL.Variant({ ok: PaymentHistory, err: Error });
  const ResultPaymentConfirmation = IDL.Variant({
    ok: IDL.Record({
      transaction: Transaction,
      enrollment: IDL.Opt(Enrollment)
    }),
    err: Error
  });
  const ResultBool = IDL.Variant({ ok: IDL.Bool, err: Error });
  const ResultModules = IDL.Variant({ ok: IDL.Vec(Modul), err: Error });
  const ResultContents = IDL.Variant({ ok: IDL.Vec(Konten), err: Error });
  return IDL.Service({

    // USER
    loginWithPrincipal: IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
      [ResultUser],
      []
    ),
    hasAccess: IDL.Func(
      [IDL.Principal, IDL.Text],
      [ResultBool],
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

    getMe: IDL.Func([], [ResultUser], ["query"]),

    whoami: IDL.Func([], [IDL.Principal], ["query"]),
    enrollUser: IDL.Func(
      [IDL.Text, IDL.Text],
      [ResultEnrollment],
      []
    ),
    // COURSE
    getCourses: IDL.Func(
      [IDL.Nat, IDL.Nat, IDL.Opt(IDL.Variant({
        newest: IDL.Null,
        popular: IDL.Null,
        rating: IDL.Null,
        priceHighToLow: IDL.Null,
        priceLowToHigh: IDL.Null
      }))],
      [IDL.Vec(Kursus)],
      ["query"]
    ),

    getCourseById: IDL.Func([IDL.Text], [ResultCourse], ["query"]),
    deleteCourse: IDL.Func([IDL.Text], [ResultBool], []),
    searchCourses: IDL.Func(
      [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Float), IDL.Opt(IDL.Nat), IDL.Nat, IDL.Nat],
      [IDL.Vec(Kursus)],
      ["query"]
    ),
    // getModulebyCourseID: IDL.Func([IDL.Text], [IDL.Opt(IDL.Vec(Modul))], ["query"]),
    enrollUser: IDL.Func(
      [IDL.Text, IDL.Text],
      [ResultEnrollment],
      []

    ),
    // ADMIN
    addCourse: IDL.Func(
      [
        IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat,
        IDL.Opt(IDL.Nat), IDL.Text, IDL.Text, IDL.Text,
        IDL.Text, IDL.Vec(Modul), IDL.Nat, IDL.Opt(IDL.Text),
        IDL.Vec(IDL.Text), IDL.Vec(IDL.Text), IDL.Vec(IDL.Text), IDL.Vec(IDL.Text)
      ],
      [ResultCourse],
      []),

    // Set course price - Admin only
    setCoursePrice: IDL.Func([
      IDL.Text, IDL.Nat, IDL.Text
    ], [ResultCourse], []),
    updateCourseProgress: IDL.Func(
      [IDL.Text, IDL.Nat],
      [ResultBool],
      []
    ),
    toggleFavorite: IDL.Func(
      [IDL.Text],
      [ResultBool],
      []),
    // Get modules with access control
    getModulesWithAccess: IDL.Func([IDL.Text], [ResultModules], ["query"]),

    // Get course content with access control
    getCourseContent: IDL.Func([IDL.Text, IDL.Nat], [ResultContents], ["query"]),

    // TRANSACTIONS & PAYMENTS
    createTransaction: IDL.Func(
      [IDL.Text],
      [ResultTransaction],
      []
    ),
    confirmPayment: IDL.Func(
      [IDL.Nat],
      [ResultPaymentConfirmation],
      []
    ),
    getMyTransactions: IDL.Func([], [ResultTransactions], ["query"]),

    // PAYMENT HISTORY
    getMyPaymentHistory: IDL.Func([], [ResultPaymentHistory], ["query"]),
    getPaymentHistoryByCourse: IDL.Func([IDL.Text], [ResultPaymentHistory], ["query"]),
    getPaymentHistoryByUserAndCourse: IDL.Func([IDL.Text], [ResultPaymentHistory], ["query"])
  });

};

export const init = ({ IDL }) => {
  return [];
};
