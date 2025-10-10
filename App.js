import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen"
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { createAndroidChannel } from "./components/NotificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldVibrate: true,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      // request permission (shows prompt)
      if (!Device.isDevice) {
        console.warn('Notifications require a physical device for reliable testing.');
      }
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Notifications', 'Permission not granted. Reminders will be disabled.');
        }
      }
      // create Android notification channel (important for sound/importance)
      if (Platform.OS === 'android') await createAndroidChannel();
    }

    init();

    // Optional: handle when the user taps the notification
    const sub = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      // e.g. navigation to task detail: navigate('Task', { id: data.taskId })
      console.log('User tapped notification, data:', data);
    });

    return () => sub.remove();
  }, []);


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
      </Stack.Navigator>
    </NavigationContainer>
  );
}


