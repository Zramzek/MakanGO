import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await setDoc(doc(db, "User", user.uid), {
    createdAt: serverTimestamp(),
    email,
    jumlah_review: 0,
    level: 1,
    name,
    username: "",
    uid: user.uid,
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

export async function loginWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "User", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "User", user.uid), {
      createdAt: serverTimestamp(),
      email: user.email || "",
      jumlah_review: 0,
      level: 1,
      name: user.displayName || "",
      username: "",
      uid: user.uid,
    });
  }

  return user;
}
