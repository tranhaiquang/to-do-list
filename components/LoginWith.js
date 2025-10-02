import { TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../firebase/googleSignIn';
import { useState } from 'react';

export default function LoginWith({ btnText, iconURL, style }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (isLoading) return; // Prevent multiple calls

    setIsLoading(true);
    try {
      const result = await signIn(navigation);

      // Handle different response scenarios
      if (result && result.success) {
        // Success - user is signed in and navigated to HomeScreen
        console.log('Sign-in successful');
      } else if (result && !result.success) {
        // Handle different failure reasons
        switch (result.reason) {
          case 'cancelled':
            // User cancelled - no need to show error, just log
            console.log('User cancelled sign-in');
            break;
          case 'in_progress':
            console.log('Sign-in already in progress');
            break;
          case 'play_services_unavailable':
            Alert.alert(
              'Google Play Services Unavailable',
              'Please install or update Google Play Services to continue.',
              [{ text: 'OK' }]
            );
            break;
          case 'no_token':
            console.log('Sign-in cancelled or failed - no token received');
            break;
          case 'unknown_error':
            Alert.alert(
              'Sign-In Error',
              'An unexpected error occurred. Please try again.',
              [{ text: 'OK' }]
            );
            break;
          default:
            console.log('Sign-in failed:', result.reason);
        }
      }
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={btnText}
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
      style={[styles.btn, style, isLoading && styles.btnDisabled]}
      onPress={handleSignIn}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="rgba(255, 172, 207, 1)" />
      ) : (
        <Image
          style={styles.icon}
          source={{ uri: iconURL }}
          accessibilityIgnoresInvertColors
        />
      )}
      <Text style={styles.btnText}>
        {isLoading ? 'Signing in...' : btnText}
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
    gap: 10,
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
  },
  btnDisabled: {
    opacity: 0.6,
  }
});
