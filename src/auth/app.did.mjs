export const idlFactory = ({ IDL }) => {
  const Konten = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'updated_at' : IDL.Int,
    'duration' : IDL.Opt(IDL.Nat),
    'content_url' : IDL.Opt(IDL.Text),
    'content_type' : IDL.Text,
    'created_at' : IDL.Int,
  });
  const Modul = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'updated_at' : IDL.Int,
    'contents' : IDL.Vec(Konten),
    'order' : IDL.Nat,
    'description' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Int,
  });
  const Course = IDL.Record({
    'id' : IDL.Text,
    'totalRatings' : IDL.Nat,
    'durationText' : IDL.Text,
    'title' : IDL.Text,
    'updated_at' : IDL.Int,
    'duration' : IDL.Nat,
    'totalLessons' : IDL.Nat,
    'thumbnail' : IDL.Text,
    'isPublished' : IDL.Bool,
    'instructor' : IDL.Text,
    'totalDuration' : IDL.Nat,
    'tags' : IDL.Vec(IDL.Text),
    'totalStudents' : IDL.Nat,
    'description' : IDL.Text,
    'whatYouGet' : IDL.Vec(IDL.Text),
    'isFavorite' : IDL.Bool,
    'created_at' : IDL.Int,
    'level' : IDL.Text,
    'progress' : IDL.Opt(IDL.Nat),
    'learningOutcomes' : IDL.Vec(IDL.Text),
    'currency' : IDL.Text,
    'totalModules' : IDL.Nat,
    'category' : IDL.Text,
    'bannerImage' : IDL.Opt(IDL.Text),
    'rating' : IDL.Float64,
    'priceDiscount' : IDL.Opt(IDL.Nat),
    'price' : IDL.Nat,
    'requirements' : IDL.Vec(IDL.Text),
    'modules' : IDL.Vec(Modul),
  });
  const Error = IDL.Variant({
    'IdAlreadyExists' : IDL.Null,
    'NotFound' : IDL.Null,
    'InvalidCredentials' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'InvalidState' : IDL.Null,
  });
  const ResultCourse = IDL.Variant({ 'ok' : Course, 'err' : Error });
  const Transaction = IDL.Record({
    'status' : IDL.Text,
    'tanggal_transaksi' : IDL.Int,
    'harga_transaksi' : IDL.Nat,
    'transaksi_id' : IDL.Nat,
    'user_id' : IDL.Nat,
    'payment_method' : IDL.Text,
    'course_id' : IDL.Text,
    'currency' : IDL.Text,
    'payment_proof' : IDL.Opt(IDL.Text),
  });
  const Enrollment = IDL.Record({
    'status' : IDL.Text,
    'updated_at' : IDL.Int,
    'enrollment_date' : IDL.Text,
    'created_at' : IDL.Int,
    'user_id' : IDL.Principal,
    'course_id' : IDL.Text,
  });
  const Result__1_5 = IDL.Variant({
    'ok' : IDL.Record({
      'transaction' : Transaction,
      'enrollment' : IDL.Opt(Enrollment),
    }),
    'err' : Error,
  });
  const Wallet = IDL.Record({
    'connected_at' : IDL.Int,
    'is_primary' : IDL.Bool,
    'address' : IDL.Text,
    'wallet_type' : IDL.Text,
  });
  const Result__1_4 = IDL.Variant({ 'ok' : Wallet, 'err' : Error });
  const Result__1_3 = IDL.Variant({ 'ok' : Transaction, 'err' : Error });
  const ResultBool = IDL.Variant({ 'ok' : IDL.Bool, 'err' : Error });
  const ResultEnrollment = IDL.Variant({ 'ok' : Enrollment, 'err' : Error });
  const ResultContents = IDL.Variant({ 'ok' : IDL.Vec(Konten), 'err' : Error });
  const User = IDL.Record({
    'updated_at' : IDL.Int,
    'principal' : IDL.Principal,
    'username' : IDL.Text,
    'created_at' : IDL.Int,
    'user_id' : IDL.Nat,
    'email' : IDL.Opt(IDL.Text),
    'wallets' : IDL.Vec(Wallet),
    'gender' : IDL.Opt(IDL.Text),
    'first_name' : IDL.Opt(IDL.Text),
    'last_name' : IDL.Opt(IDL.Text),
    'date_of_birth' : IDL.Opt(IDL.Text),
  });
  const ResultUser = IDL.Variant({ 'ok' : User, 'err' : Error });
  const ResultModules = IDL.Variant({ 'ok' : IDL.Vec(Modul), 'err' : Error });
  const PaymentHistory = IDL.Record({
    'id' : IDL.Nat,
    'transaction_id' : IDL.Nat,
    'status' : IDL.Text,
    'user_principal' : IDL.Principal,
    'course_title' : IDL.Text,
    'created_at' : IDL.Int,
    'user_id' : IDL.Nat,
    'payment_method' : IDL.Text,
    'course_id' : IDL.Text,
    'currency' : IDL.Text,
    'completed_at' : IDL.Opt(IDL.Int),
    'amount' : IDL.Nat,
    'enrollment_status' : IDL.Text,
  });
  const ResultPaymentHistory = IDL.Variant({
    'ok' : IDL.Vec(PaymentHistory),
    'err' : Error,
  });
  const Result__1_2 = IDL.Variant({
    'ok' : IDL.Vec(Transaction),
    'err' : Error,
  });
  const Result__1_1 = IDL.Variant({ 'ok' : IDL.Vec(Wallet), 'err' : Error });
  const ContentUpdate = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Opt(IDL.Text),
    'duration' : IDL.Opt(IDL.Nat),
    'content_url' : IDL.Opt(IDL.Text),
    'content_type' : IDL.Opt(IDL.Text),
  });
  const ModuleUpdate = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Opt(IDL.Text),
    'contents' : IDL.Opt(IDL.Vec(ContentUpdate)),
    'order' : IDL.Opt(IDL.Nat),
    'description' : IDL.Opt(IDL.Text),
  });
  const CourseUpdate = IDL.Record({
    'durationText' : IDL.Opt(IDL.Text),
    'title' : IDL.Opt(IDL.Text),
    'duration' : IDL.Opt(IDL.Nat),
    'totalLessons' : IDL.Opt(IDL.Nat),
    'thumbnail' : IDL.Opt(IDL.Text),
    'isPublished' : IDL.Opt(IDL.Bool),
    'totalDuration' : IDL.Opt(IDL.Nat),
    'tags' : IDL.Opt(IDL.Vec(IDL.Text)),
    'totalStudents' : IDL.Opt(IDL.Nat),
    'description' : IDL.Opt(IDL.Text),
    'whatYouGet' : IDL.Opt(IDL.Vec(IDL.Text)),
    'level' : IDL.Opt(IDL.Text),
    'learningOutcomes' : IDL.Opt(IDL.Vec(IDL.Text)),
    'currency' : IDL.Opt(IDL.Text),
    'totalModules' : IDL.Opt(IDL.Nat),
    'bannerImage' : IDL.Opt(IDL.Text),
    'priceDiscount' : IDL.Opt(IDL.Nat),
    'price' : IDL.Opt(IDL.Nat),
    'requirements' : IDL.Opt(IDL.Vec(IDL.Text)),
    'modules' : IDL.Opt(IDL.Vec(ModuleUpdate)),
  });
  const Result__1 = IDL.Variant({ 'ok' : Course, 'err' : Error });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const ProfileUpdate = IDL.Record({
    'username' : IDL.Opt(IDL.Text),
    'gender' : IDL.Opt(IDL.Text),
    'first_name' : IDL.Opt(IDL.Text),
    'last_name' : IDL.Opt(IDL.Text),
    'date_of_birth' : IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    'addCourse' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [ResultCourse],
        [],
      ),
    'confirmPayment' : IDL.Func([IDL.Nat], [Result__1_5], []),
    'connectWallet' : IDL.Func([IDL.Text, IDL.Text], [Result__1_4], []),
    'createTransaction' : IDL.Func([IDL.Text], [Result__1_3], []),
    'deleteCourse' : IDL.Func([IDL.Text], [ResultBool], []),
    'enableCertificateAccess' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [ResultBool],
        [],
      ),
    'enrollUser' : IDL.Func([IDL.Text, IDL.Text], [ResultEnrollment], []),
    'getCourseById' : IDL.Func([IDL.Text], [ResultCourse], ['query']),
    'getCourseContent' : IDL.Func(
        [IDL.Text, IDL.Nat],
        [ResultContents],
        ['query'],
      ),
    'getCourses' : IDL.Func(
        [
          IDL.Nat,
          IDL.Nat,
          IDL.Opt(
            IDL.Variant({
              'priceLowToHigh' : IDL.Null,
              'popular' : IDL.Null,
              'newest' : IDL.Null,
              'priceHighToLow' : IDL.Null,
              'rating' : IDL.Null,
            })
          ),
        ],
        [IDL.Vec(Course)],
        ['query'],
      ),
    'getMe' : IDL.Func([], [ResultUser], ['query']),
    'getModulesWithAccess' : IDL.Func([IDL.Text], [ResultModules], ['query']),
    'getMyCourses' : IDL.Func([], [IDL.Vec(Course)], ['query']),
    'getMyPaymentHistory' : IDL.Func([], [ResultPaymentHistory], ['query']),
    'getMyTransactions' : IDL.Func([], [Result__1_2], ['query']),
    'getMyWallets' : IDL.Func([], [Result__1_1], ['query']),
    'getPaymentHistoryByCourse' : IDL.Func(
        [IDL.Text],
        [ResultPaymentHistory],
        ['query'],
      ),
    'getPaymentHistoryByUserAndCourse' : IDL.Func(
        [IDL.Text],
        [ResultPaymentHistory],
        ['query'],
      ),
    'getProfile' : IDL.Func([], [ResultUser], ['query']),
    'getUserProgress' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Nat, IDL.Nat],
        [IDL.Opt(IDL.Nat)],
        ['query'],
      ),
    'hasAccess' : IDL.Func([IDL.Principal, IDL.Text], [ResultBool], ['query']),
    'isUserWhitelistedForCertificate' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [ResultBool],
        ['query'],
      ),
    'loginWithPrincipal' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
        ],
        [ResultUser],
        [],
      ),
    'searchCourses' : IDL.Func(
        [
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Float64),
          IDL.Opt(IDL.Nat),
          IDL.Nat,
          IDL.Nat,
        ],
        [IDL.Vec(Course)],
        ['query'],
      ),
    'setCoursePrice' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text],
        [ResultCourse],
        [],
      ),
    'setPrimaryWallet' : IDL.Func([IDL.Text], [Result__1_1], []),
    'setUserProgress' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat],
        [ResultBool],
        [],
      ),
    'toggleFavorite' : IDL.Func([IDL.Text], [ResultBool], []),
    'updateCourse' : IDL.Func([IDL.Text, CourseUpdate], [Result__1], []),
    'updateEmail' : IDL.Func([IDL.Text], [Result], []),
    'updateProfile' : IDL.Func([ProfileUpdate], [ResultUser], []),
    'whitelistUserForCertificate' : IDL.Func([IDL.Text], [ResultBool], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
