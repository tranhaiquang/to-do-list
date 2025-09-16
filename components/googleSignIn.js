import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export const signIn = async () => {
  try {
    // 1. Trigger Google Sign-In
    const { idToken } = await GoogleSignin.signIn();
    console.log("✅ Got Google ID token:", idToken);

    // 2. Create a Firebase credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // 3. Sign-in with Firebase
    const result = await auth().signInWithCredential(googleCredential);
    console.log("🎉 Signed in as:", result.user.email);

    return result.user;
  } catch (error) {
    console.error("❌ Google Sign-In error:", error.code, error.message);
    return null;
  }
};
