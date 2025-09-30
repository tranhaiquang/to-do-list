import { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Dimensions, ImageBackground, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Quicksand_400Regular, Quicksand_700Bold, Quicksand_500Medium, useFonts } from '@expo-google-fonts/quicksand';
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import LoginWithGoogle from '../components/LoginWithGoogle';
import { signIn as signInWithEmail } from '../firebase/firebaseAuth';
// REMOVE THIS LINE - Don't import AuthSession here
// import * as AuthSession from "expo-auth-session";

const { width, height } = Dimensions.get('window');

const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
        return 44;
    } else {
        return StatusBar.currentHeight || 42;
    }
};

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Use email/password sign-in from Firebase auth module

    const [fontsLoaded] = useFonts({
        Quicksand_400Regular,
        Quicksand_700Bold,
        Quicksand_500Medium
    })

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Form validation function
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.trim().length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Clear error when user starts typing
    const handleEmailChange = (text) => {
        setEmail(text);
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: null }));
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: null }));
        }
    };


    const handleSignIn = async () => {
        if (isLoading) return;

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const user = await signInWithEmail(email.trim(), password.trim(), navigation);
        } catch (error) {
            Alert.alert('Login Error', error.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="light" translucent />
            <ImageBackground
                onLayout={onLayoutRootView}
                source={require('../assets/background.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <SafeAreaView style={styles.screenContainer}>
                    <KeyboardAvoidingView
                        style={styles.keyboardAvoidingView}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={0}
                    >
                        <View style={styles.contentContainer}>
                            <ScrollView
                                contentContainerStyle={styles.scrollContent}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                            >
                                <Text style={styles.headerText}>MY TO-DO</Text>

                                <BlurView intensity={40} tint='dark' style={styles.formContainer}>
                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            autoCapitalize='none'
                                            placeholder="Email"
                                            placeholderTextColor='rgba(255,255,255,0.7)'
                                            onChangeText={handleEmailChange}
                                            value={email}
                                            style={[
                                                styles.textInput,
                                                errors.email && styles.textInputError
                                            ]}
                                            keyboardType="email-address"
                                            autoComplete="email"
                                        />
                                        {errors.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            autoCapitalize='none'
                                            placeholder="Password"
                                            placeholderTextColor='rgba(255,255,255,0.7)'
                                            secureTextEntry
                                            onChangeText={handlePasswordChange}
                                            value={password}
                                            style={[
                                                styles.textInput,
                                                errors.password && styles.textInputError
                                            ]}
                                            autoComplete="password"
                                        />
                                        {errors.password && (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSignIn}
                                        style={[
                                            styles.submitButton,
                                            isLoading && styles.disabledButton
                                        ]}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.submitButtonText}>
                                            {isLoading ? 'LOGGING IN...' : 'LOG IN'}
                                        </Text>
                                    </TouchableOpacity>

                                    <LoginWithGoogle></LoginWithGoogle>

                                    <View style={styles.footer}>
                                        <Text style={styles.footerText}>Don't have account? </Text>
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate("SignupScreen")
                                        }}>
                                            <Text style={styles.signUpText}>Sign Up</Text>
                                        </TouchableOpacity>

                                    </View>
                                </BlurView>
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    screenContainer: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    headerContainer: {
        flex: 0.4,
        justifyContent: 'flex-end',
        alignItems: 'center',
        minHeight: 40,
    },
    headerText: {
        fontSize: 50,
        textAlign: "center",
        fontFamily: "Quicksand_700Bold",
        color: "white",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 2,
        marginBottom: 60
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20,
    },
    formContainer: {
        width: '100%',
        borderRadius: 16,
        paddingHorizontal: 25,
        paddingVertical: 30,
        overflow: 'hidden'
    },
    inputGroup: {
        marginBottom: 15,
    },
    textInput: {
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 30,
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 16,
        fontWeight: "bold",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        fontFamily: "Quicksand_400Regular",
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginBottom: 5
    },
    textInputError: {
        borderColor: '#ff6b6b',
        borderWidth: 2,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 14,
        fontFamily: "Quicksand_400Regular",
        marginLeft: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    submitButton: {
        width: '100%',
        height: 60,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 30,
        justifyContent: "center",
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    submitButtonText: {
        fontSize: 24,
        color: "rgba(255, 172, 207, 1)",
        fontFamily: "Quicksand_700Bold",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    footer: {
        width: "100%",
        flexDirection: "row",
        marginTop: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    footerText: {
        fontSize: 18,
        color: 'white',
        fontFamily: "Quicksand_500Medium",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    signUpText: {
        color: 'white',
        fontFamily: "Quicksand_700Bold",
        fontSize: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});