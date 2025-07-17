export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    "Register": IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    "Login": IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
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
    )], ["query"])
  });
};
export const init = ({ IDL }) => { return []; };