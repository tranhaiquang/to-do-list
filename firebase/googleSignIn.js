import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createUserOnFirestore } from './firestoreServices';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { Platform } from 'react-native';

const webClientId = "96033539849-j3dkg03uin0h2qld7qijvesd4mrs4ddr.apps.googleusercontent.com"

GoogleSignin.configure({
  webClientId,
  offlineAccess: false,
  forceCodeForRefreshToken: false,
  iosClientId: Platform.OS === 'ios' ? webClientId : undefined,
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

    // Only try to get tokens if signInResult exists and we don't have an idToken
    if (!idToken && signInResult) {
      try {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens?.idToken;
      } catch (tokenError) {
        console.warn('Could not get tokens, user may not be signed in:', tokenError);
      }
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
    return { success: true, user: result.user };
  } catch (error) {
    // Handle specific Google Sign-In errors
    if (error.code === 'SIGN_IN_CANCELLED') {
      console.log('User cancelled Google Sign-In');
      return { success: false, reason: 'cancelled' };
    } else if (error.code === 'IN_PROGRESS') {
      console.log('Google Sign-In already in progress');
      return { success: false, reason: 'in_progress' };
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      console.error('Google Play Services not available');
      return { success: false, reason: 'play_services_unavailable' };
    } else if (error.message && error.message.includes('Missing idToken')) {
      console.log('Sign-in was cancelled or failed - no token received');
      return { success: false, reason: 'no_token' };
    }

    console.error('Google Sign-In error:', error?.code || '', error?.message || error);
    return { success: false, reason: 'unknown_error', error: error };
  }
};
