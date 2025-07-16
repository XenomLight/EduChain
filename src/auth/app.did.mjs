export const idlFactory = ({ IDL }) => {
    return IDL.Service({
      "Register": IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
      "Login": IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    });
  };
  export const init = ({ IDL }) => { return []; };