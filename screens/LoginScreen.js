import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Quicksand_400Regular, Quicksand_700Bold, Quicksand_500Medium, useFonts } from '@expo-google-fonts/quicksand';
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import LoginWith from '../components/LoginWith';

export default function LoginScreen({ navigation }) {

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
                                    <LoginWith btnText="Continue with Google" iconURL="https://cdn-icons-png.flaticon.com/128/281/281764.png" />
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
    headerText: {
        fontSize: 50,
        textAlign: "center",
        fontFamily: "Quicksand_700Bold",
        color: "white",
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 2,
        marginBottom: 20
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
        overflow: 'hidden',
        minHeight: 120,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },

});