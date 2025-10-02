import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createUserOnFirestore } from './firestoreServices';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';

const webClientId = "96033539849-j3dkg03uin0h2qld7qijvesd4mrs4ddr.apps.googleusercontent.com"

GoogleSignin.configure({
  webClientId: webClientId,
});

export const signIn = async (navigation) => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Ensure the account chooser is shown by clearing any existing Google session
    try {
      const currentUser = GoogleSignin.getCurrentUser();
      if (currentUser) {
        try {
          await GoogleSignin.signOut();
        } catch (signOutError) {
          console.warn('Warning: Failed to sign out before sign-in. Proceeding anyway.', signOutError);
        }
      }
    } catch (sessionCheckError) {
      console.warn('Warning: Could not check current Google session. Proceeding anyway.', sessionCheckError);
    }

    const signInResult = await GoogleSignin.signIn();
    let idToken = signInResult?.idToken;
    if (!idToken) {
      const tokens = await GoogleSignin.getTokens();
      idToken = tokens?.idToken;
    }
    if (!idToken) {
      throw new Error('Missing idToken from Google Sign-In');
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, googleCredential);

    console.log(result.user);

    // Create user doc if not exists; ignore if already exists
    try {
      await createUserOnFirestore(result.user.uid, result.user.displayName, result.user.photoURL)
    } catch (createErr) {
      console.warn('Warning: createUserOnFirestore failed, proceeding to app', createErr)
    }

    navigation.navigate("HomeScreen", { userId: result.user.uid })
    return result.user;
  } catch (error) {
    console.error('❌ Google Sign-In error:', error?.code || '', error?.message || error);
    return null;
  }
};
