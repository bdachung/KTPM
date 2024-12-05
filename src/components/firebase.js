import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signInWithEmailAndPassword, signInWithCredential, FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAfS1xc7KIi2COugXdVaLlnm4ghbPsiM6k",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export { auth, signInWithPopup, signInWithEmailAndPassword, signInWithCredential, facebookProvider, githubProvider, googleProvider, twitterProvider, RecaptchaVerifier, PhoneAuthProvider, signInWithPhoneNumber };