import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as WebBrowser from "expo-web-browser"
import * as Google from 'expo-auth-session/providers/google'
import { useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';

const webClientId = '96033539849-7omns3ldjdj8jk8koondo0ut9jot6cc5.apps.googleusercontent.com'
const androidClientId = '96033539849-p0sseqkerre45stukjfmpa5t9jicjs1l.apps.googleusercontent.com'

WebBrowser.maybeCompleteAuthSession()


export default function LoginWithGoogle() {
  const config = {
    webClientId,
    androidClientId
  }

  const [request, response, promptAsync] = Google.useAuthRequest(config)

  const handleToken = () => {
    if (response?.type === "success") {
      const { authentication } = response
      const token = authentication?.accessToken
      console.log("access token", token)
    }
  }

  useEffect(() => {
    handleToken()
  }, [response])

  return (
    <TouchableOpacity style={styles.googleBtn} onPress={() => { promptAsync() }}>
      <Image style={styles.googleIcon} source={{ uri: 'https://cdn-icons-png.flaticon.com/128/281/281764.png' }}></Image>
      <Text style={styles.googleBtnText}>Continue with Google</Text>
    </TouchableOpacity>
  )
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
    position: 'relative'
  },
  googleBtnText: {
    fontSize: 16,
    color: "rgba(255, 172, 207, 1)",
    fontFamily: "Quicksand_700Bold",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  googleIcon: {
    width: 22,
    height: 22,
    position: 'absolute',
    left: 20
  }
});
