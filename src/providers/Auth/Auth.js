import React, { createContext, useState, useMemo, useContext } from "react";

export const AuthContext = createContext();

export function Auth({children}) {
  const [user, setUser] = useState(null);
  const providerValue = useMemo(() => ({ user, setUser }), [user]);
  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  )
}

// import { createContext } from 'react'
// import { Loading, Error, Login } from 'components'
// import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
// import { getAuth, signOut } from 'firebase/auth'
// import { firebase } from 'helpers'

// const auth = getAuth(firebase)

// export const AuthContext = createContext()

// export function Auth({ children }) {
//   const [signInWithGoogle, auth_record, loading, error] =
//     useSignInWithGoogle(auth)

//   if (loading) return <Loading text="Signing in..." />
//   if (error)
//     return (
//       <Error message="Unable to sign in with Google Firebase Authenication." />
//     )
//   if (auth_record) {
//     const user = auth_record.user
//     return (
//       <AuthContext.Provider
//         value={{
//           user: {
//             name: user.displayName,
//             email: user.email,
//             image: user.photoURL,
//           },
//           signOut,
//         }}
//       >
//         {children}
//       </AuthContext.Provider>
//     )
//   }

//   return <Login signInWithGoogle={signInWithGoogle} />
// }
