import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import { signIn } from '../components/googleSignIn';
import { auth } from '../firebase/firebaseConfig';
const webClientId = "96033539849-j3dkg03uin0h2qld7qijvesd4mrs4ddr.apps.googleusercontent.com"

GoogleSignin.configure({
  webClientId: webClientId,
});

export default function LoginWithGoogle() {
  const request = true
  return (
    <TouchableOpacity
      style={styles.googleBtn}
      onPress={signIn}
      // Fix 6: Disable button if request is not ready
      disabled={!request}
    >
      <Image
        style={styles.googleIcon}
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/281/281764.png' }}
      />
      <Text style={styles.googleBtnText}>
        {!request ? 'Loading...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  googleBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
    // Add shadow for better visual appeal
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleBtnText: {
    fontSize: 18,
    color: "rgba(255, 172, 207, 1)",
    fontFamily: "Quicksand_700Bold",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  googleIcon: {
    width: 22,
    height: 22,
  }
});
