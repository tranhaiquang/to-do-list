import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen"
import SignupScreen from "./screens/SignupScreen"
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth";


const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  if (loading)
    return null

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "HomeScreen" : "LoginScreen"}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} {...(user ? { initialParams: { userId: user.uid } } : {})}></Stack.Screen>
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


