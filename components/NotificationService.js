import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function createAndroidChannel() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("task-reminders", {
            name: "Task Reminders",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
        });
    }
}

export async function scheduleTaskNotification(task, minutesBefore = 10) {
    if (!task?.date) return null;

    const deadlineDate =
        task.date instanceof Date ? task.date : new Date(task.date);
    const triggerDate = new Date(deadlineDate.getTime() - minutesBefore * 60000);

    if (triggerDate <= new Date()) return null;

    const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
            title: "⏰ Task Reminder",
            body: `${task.title} is due at ${deadlineDate.toLocaleTimeString()}`,
            data: { taskId: task.id },
        },
        trigger: triggerDate,
    });

    console.log("Scheduled notification for:", task.title);
    return notificationId;
}

export async function handleTaskNotifications(fetchedTasks) {
    const json = await AsyncStorage.getItem("taskNotifications");
    const taskMap = json ? JSON.parse(json) : {};

    const updatedMap = { ...taskMap };

    for (const task of fetchedTasks) {
        const deadlineDate = task.date instanceof Date ? task.date : new Date(task.date);
        if (deadlineDate > Date.now()) {
            if (!taskMap[task.id]) {
                const notificationId = await scheduleTaskNotification(task, 10);
                if (notificationId) updatedMap[task.id] = notificationId;
            }
        }
        await AsyncStorage.setItem("taskNotifications", JSON.stringify(updatedMap));
    }
    
}