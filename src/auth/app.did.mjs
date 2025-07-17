export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    "Register": IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    "Login": IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    "updateUserProgress": IDL.Func([IDL.Record({
      userId: IDL.Text,
      courseId: IDL.Nat,
      moduleId: IDL.Nat,
      contentId: IDL.Nat,
      isCompleted: IDL.Bool
    })
    ], [IDL.Text], []),
    "getUserProgress": IDL.Func([IDL.Text, IDL.Nat], [
      IDL.Opt(IDL.Record({
        userId: IDL.Text,
        courseId: IDL.Nat,
        completedModules: IDL.Vec(IDL.Nat),
        completedContents: IDL.Vec(IDL.Nat),
        totalModules: IDL.Nat,
        totalContents: IDL.Nat,
        completionPercentage: IDL.Float64,
        lastAccessed: IDL.Text
      }))
    ], []),
    "getCourses": IDL.Func([], [IDL.Vec(
      IDL.Record({
        id: IDL.Nat,
        title: IDL.Text,
        provider: IDL.Text,
        price: IDL.Nat,
        currency: IDL.Text,
        detailUrl: IDL.Text,
        modules: IDL.Vec(IDL.Record({
          id: IDL.Nat,
          title: IDL.Text,
          contents: IDL.Vec(IDL.Record({
            id: IDL.Nat,
            title: IDL.Text,
            body: IDL.Text
          }))
        }))
      })
    )], ["query"]),
    "getCourseById": IDL.Func([IDL.Nat], [IDL.Opt(
  IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    provider: IDL.Text,
    price: IDL.Nat,
    currency: IDL.Text,
    detailUrl: IDL.Text,
    modules: IDL.Vec(IDL.Record({
      id: IDL.Nat,
      title: IDL.Text,
      contents: IDL.Vec(IDL.Record({
        id: IDL.Nat,
        title: IDL.Text,
        body: IDL.Text
      }))
    }))
  })
)], ["query"]),
  });
};
export const init = ({ IDL }) => { return []; };