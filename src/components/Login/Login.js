export function Login({ signInWithGoogle }) {
  console.log(signInWithGoogle)
  return <button onClick={() => signInWithGoogle()}>Login</button>
}
