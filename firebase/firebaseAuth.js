import { auth } from "./firebaseConfig"
import { createUserOnFirestore } from './firestoreServices';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { Alert } from "react-native";


const signIn = async (email, password, navigation) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        await user.reload() // refresh user to get the latest emailVerified status

        if (!user.emailVerified) {
            Alert.alert("Email is not verified")
            await auth.signOut();
            return
        }

        navigation.navigate("HomeScreen", { userId: user.uid })
        return user;
    } catch (error) {
        console.log(error)
        Alert.alert(error.message)
    }
}

const signOutFromFirebase = async (navigation) => {
    try {
        await signOut(auth)
        navigation.navigate("LoginScreen")
    }
    catch (error) {
        console.log(error)
    }
}

const createUser = async (email, password, name, navigation) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid;

        if (!user.emailVerified) {
            await validateEmail(user);
            Alert.alert("A verification email has been sent. ");
        }

        await createUserOnFirestore(uid, name);

        navigation.navigate("LoginScreen");

        return user;

    } catch (error) {
        console.log("Create user error:", error);
        Alert.alert(error.message);
    }
};

const validateEmail = async (user) => {
    try {
        await sendEmailVerification(user)
    }
    catch (error) {
        Alert.alert(error.message)
    }
}

export { signIn, signOutFromFirebase, createUser }
