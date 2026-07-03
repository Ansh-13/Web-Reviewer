import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
} from "firebase/auth";
import { googleAuthProvider } from "./providers";
import { auth } from "./config";

export const signInWithGoogle = () => signInWithPopup(auth, googleAuthProvider);
export const loginWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signupWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const signOutOfAccount = () => signOut(auth);
export const subscribeToAuthState = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);
