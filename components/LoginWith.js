import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../firebase/googleSignIn';

export default function LoginWith({ btnText, iconURL }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => {
        signIn(navigation)
      }}
    >
      <Image
        style={styles.icon}
        source={{ uri: iconURL }}
      />
      <Text style={styles.btnText}>
        {btnText}
      </Text>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  btn: {
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
  btnText: {
    fontSize: 18,
    color: "rgba(255, 172, 207, 1)",
    fontFamily: "Quicksand_700Bold",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  icon: {
    width: 22,
    height: 22,
  }
});
