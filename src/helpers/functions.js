import { firebase } from './firebase';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut
} from 'firebase/auth';

const auth = getAuth(firebase);

export function sendLoginLink(email) {
  const actionCodeSettings = {
    // URL you want to redirect back to
    url: "http://localhost:3000/login-url",
    handleCodeInApp: true,
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then((response) => {
      console.log("Success", response);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

export function catchLoginLink(url) {
  if (isSignInWithEmailLink(auth, url)) {
    const email = window.localStorage.getItem('email');

    signInWithEmailLink(auth, email, url)
      .then((response) => {
        console.log("Success", response);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log("Error", error);
      })
  } else {
    console.log("Not a login link");
  }
}

export function logOut() {
  signOut(auth);
}