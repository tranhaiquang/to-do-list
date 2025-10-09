import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

export const createAndroidChannel = async () => {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("task-reminder", {
            name: "Task Reminder",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        })
    }
}