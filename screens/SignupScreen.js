import { useState, } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Quicksand_400Regular, Quicksand_700Bold, Quicksand_500Medium } from '@expo-google-fonts/quicksand';
import { createUser } from '../firebase/firebaseAuth';
import { StatusBar } from 'expo-status-bar';

export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({})
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const [fontsLoaded] = useFonts({
        Quicksand_400Regular,
        Quicksand_700Bold,
        Quicksand_500Medium
    })


    if (!fontsLoaded) {
        return null
    }

    const handleEmailChange = (text) => {
        setEmail(text)
        if (errors.email) {
            setErrors(prev => ({ ...(prev || {}), email: null }));
        }
    }

    const handleNameChange = (text) => {
        setName(text)
        if (errors.name) {
            setErrors(prev => ({ ...(prev || {}), name: null }));
        }
    }

    const handlePasswordChange = (text) => {
        setPassword(text)
        if (errors.name) {
            setErrors(prev => ({ ...(prev || {}), password: null }));
        }
    }


    const handleConfirmPassword = (text) => {
        setConfirmPassword(text)
        if (errors.name) {
            setErrors(prev => ({ ...(prev || {}), confirmPassword: null }));
        }
    }

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors = {}

        // Name validate
        if (!name.trim()) {
            newErrors.name = 'Name is required'
        }

        // Email validate
        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!isValidEmail(email.trim())) {
            newErrors.email = 'Please enter a valid email'
        }

        // Password validate
        if (!password.trim()) {
            newErrors.password = 'Password is required'
        } else if (password.trim().length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        // Confirm password
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (confirmPassword.trim() != password.trim()) {
            newErrors.confirmPassword = 'Password are not matching'
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleCreateUser = async () => {
        if (isLoading) return

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const user = await createUser(email.trim(), password.trim(), name.trim(), navigation);
        } catch (error) {
            Alert.alert(error)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.screenContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
                    style={{ flex: 1 }}
                    
                >
                    <ScrollView contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 30,
                        paddingVertical: 20
                    }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}>
                            
                        <StatusBar style='dark' translucent></StatusBar>
                        <Text style={styles.headerText}>MY TO-DO</Text>
                        <View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <TextInput
                                    placeholder="Name" placeholderTextColor="#8a8a8aff"
                                    onChangeText={handleNameChange}
                                    style={[styles.textInput, errors.name && styles.textInputError]}
                                />
                                {errors.name && (<Text style={styles.errorText}>{errors.name}</Text>)}
                            </View>

                            <View style={styles.inputGroup}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Email" placeholderTextColor="#8a8a8aff"
                                    onChangeText={handleEmailChange}
                                    style={[styles.textInput, errors.email && styles.textInputError]}
                                />
                                {errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}
                            </View>

                            <View style={styles.inputGroup}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Password" placeholderTextColor="#8a8a8aff"
                                    secureTextEntry
                                    onChangeText={handlePasswordChange}
                                    style={[styles.textInput, errors.password && styles.textInputError]}
                                />
                                {errors.password && (<Text style={styles.errorText}>{errors.password}</Text>)}
                            </View>

                            <View style={styles.inputGroup}>
                                <TextInput
                                    autoCapitalize='none'
                                    placeholder="Confirm password" placeholderTextColor="#8a8a8aff"
                                    secureTextEntry
                                    onChangeText={handleConfirmPassword}
                                    style={[styles.textInput, errors.confirmPassword && styles.textInputError]}
                                />
                                {errors.confirmPassword && (<Text style={styles.errorText}>{errors.confirmPassword}</Text>)}
                            </View>

                            <TouchableOpacity onPress={handleCreateUser} style={styles.submitButton}>
                                <Text style={[styles.submitButtonText, isLoading ?? styles.disabledButton]}>{isLoading ? 'SIGNING UP...' : 'SIGN UP'}</Text>

                            </TouchableOpacity>

                            <View style={styles.footer} >
                                <Text style={styles.footerText}>Already have account? </Text>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate("LoginScreen")
                                }}>
                                    <Text style={styles.signUpText}>Log In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    formContainer: {
        width: '100%',
    },
    headerText: {
        fontFamily: "Quicksand_700Bold",
        fontSize: 50,
        textAlign: "center",
        color: "rgba(255, 172, 207, 1)",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 2,
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'rgba(255, 172, 207, 1)',
        borderRadius: 30,
        fontFamily: "Quicksand_400Regular",
        fontSize: 16,
        paddingVertical: 15,
        paddingHorizontal: 25,
        marginBottom: 10,
    },
    textInputError: {
        borderWidth: 2,
        borderColor: '#ff6b6b',
    },
    errorText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontFamily: "Quicksand_400Regular",
        marginLeft: 15,
        backgroundColor: '#ff6b6ba6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
    submitButton: {
        width: '100%',
        height: 60,
        padding: 10,
        backgroundColor: 'rgba(255, 172, 207, 1)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        fontFamily: "Quicksand_700Bold",
        fontSize: 20,
        color: "white",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    disabledButton: {
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    footer: {
        flexDirection: "row",
        marginTop: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    footerText: {
        fontSize: 16,
        fontFamily: "Quicksand_500Medium",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },
    signUpText: {
        color: 'rgba(255, 172, 207, 1)',
        fontFamily: "Quicksand_700Bold",
        fontSize: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2
    },


});
