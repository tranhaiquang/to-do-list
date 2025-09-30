// HomeScreen component - main screen for displaying and managing tasks
// Observed for UI and state changes related to tasks, modals, and user actions

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Keyboard,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import {
  RadioButton,
  Menu,
  Divider,
  PaperProvider,
} from "react-native-paper";
import {
  listenToFirestoreData,
  setIsDone,
  deleteTaskOnFirestore,
  getUserInfo,
  editTask,
} from "../firebase/firestoreServices";
import { signOutFromFirebase } from "../firebase/firebaseAuth";
import ConfirmModal from "./ConfirmModal";
import TaskInputModal from "./TaskInputModal";
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_700Bold,
  useFonts,
} from "@expo-google-fonts/quicksand";
import { Feather } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import TaskEditModal from "./TaskEditModal";

// HomeScreen: Main component for the home/tasks screen
export default function HomeScreen({ navigation, route }) {
  // State variables for user, modals, tasks, and UI
  const [userInfo, setUserInfo] = useState({
    username: "User",
    photoURL: "https://cdn-icons-png.flaticon.com/128/281/281764.png",
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [enterTaskModalVisible, setEnterTaskModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [checked, setChecked] = useState("second");
  const [tasks, setTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([])
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const filterTag = ["All", "Work", "Personal", "Wishlist", "Birthday"];
  const [selectedFilterTag, setSelectedFilterTag] = useState("all")
  const [editingTask, setEditingTask] = useState(null);
  const allDone = displayTasks.length > 0 && displayTasks.every(task => task.isDone === true)
  const inputRef = useRef(null);
  const { userId } = route.params;

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_700Bold,
  });

  // Track if any modal is visible
  const anyModalVisible =
    enterTaskModalVisible || confirmModalVisible || editModalVisible;

  // Prevent splash screen auto-hide until ready
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  // Fetch tasks and username from Firestore
  useEffect(() => {
    if (!userId || !fontsLoaded) return;

    const unsubscribe = listenToFirestoreData(userId, (tasksFromFirestore) => {
      // Sort tasks by month, then by date (ascending)
      const sortedTasks = [...tasksFromFirestore].sort((a, b) => {
        const [dateA, monthA] = a.date.split("-").map(Number);
        const [dateB, monthB] = b.date.split("-").map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dateA - dateB;
      });
      setTasks(sortedTasks);
      setIsDataLoaded(true);
    });

    getUserInfo(userId).then(fetchedUserInfo => {
      if (fetchedUserInfo) {
        const normalized = {
          photoURL:
            fetchedUserInfo.photoURL === undefined || fetchedUserInfo.photoURL === null
              ? "https://cdn-icons-png.flaticon.com/128/281/281764.png"
              : fetchedUserInfo.photoURL,
          username:
            fetchedUserInfo.username === undefined || fetchedUserInfo.username === null
              ? "User"
              : fetchedUserInfo.username,
        };
        setUserInfo(normalized);
      } else {
        console.log("No user info found");
      }
    });
    return () => unsubscribe();
  }, [userId, fontsLoaded]);

  const filterByTag = (tagName) => {
    if (tagName === "all") {
      setDisplayTasks(tasks)
    } else {
      const filterTask = tasks.filter(task => task.tag === tagName)
      setDisplayTasks(filterTask)
    }
  }

  useEffect(() => {
    filterByTag(selectedFilterTag)
  }, [tasks, selectedFilterTag])

  // Hide splash screen when ready
  useEffect(() => {
    if (fontsLoaded && userId && isDataLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, userId, isDataLoaded]);

  // UI helpers for menu and modals
  const openMenu = useCallback((id) => setMenuVisibleId(id), []);
  const closeMenu = useCallback(() => setMenuVisibleId(null), []);
  const openModal = useCallback(() => {
    setEnterTaskModalVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);
  const dismissUIOverlays = useCallback(() => {
    Keyboard.dismiss();
    setEditModalVisible(false);
    setEnterTaskModalVisible(false);
    setConfirmModalVisible(false);
    setEditingTask(null);
    closeMenu();
  }, [closeMenu]);

  // Early return if not ready
  if (!fontsLoaded || !userId || !isDataLoaded) return null;

  // Render a single task item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPressIn={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setTouchPosition({ x: pageX, y: pageY });
      }}
      onLongPress={() => openMenu(item.id)}
    >
      <View style={styles.taskView}>
        {/* ConfirmModal for deleting a task */}
        <ConfirmModal
          onDismiss={dismissUIOverlays}
          onConfirm={() => {
            deleteTaskOnFirestore(userId, item.id);
            setConfirmModalVisible(false);
          }}
          visible={confirmModalVisible}
          message="Are you want to delete this task?"
        />

        {/* Removed per-item TaskEditModal; using a single, screen-level modal */}

        {/* RadioButton for marking task as done */}
        <RadioButton
          color="rgba(255, 172, 207, 1)"
          value={item.id}
          status={item.isDone ? "checked" : "unchecked"}
          onPress={() => {
            setChecked(checked === "first" ? "second" : "first");
            setIsDone(userId, item.id, !item.isDone);
          }}
        />
        <View style={styles.taskItemContainer}>
          <Text style={item.isDone ? styles.taskTextChecked : styles.taskText}>
            {item.title}
          </Text>
          <Text style={styles.taskDateText}>{item.date}</Text>
        </View>
        {/* Menu for edit/delete actions */}
        <Menu
          visible={menuVisibleId === item.id}
          onDismiss={closeMenu}
          anchor={{ x: touchPosition.x, y: touchPosition.y - 50 }}
        >
          <Menu.Item
            onPress={() => {
              setEditingTask(item);
              setEditModalVisible(true);
              closeMenu();
            }}
            title="Edit"
            titleStyle={{ fontFamily: "Quicksand_500Medium" }}
          />
          <Divider />
          <Menu.Item
            style={styles.menuItem}
            onPress={() => {
              setConfirmModalVisible(true);
              closeMenu();
            }}
            title="Delete"
            titleStyle={{ fontFamily: "Quicksand_500Medium" }}
          />
        </Menu>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <StatusBar
          style="dark"
          translucent
        />

        {/* Modal for entering a new task */}
        <TaskInputModal
          modalVisible={enterTaskModalVisible}
          inputRef={inputRef}
          onDismiss={dismissUIOverlays}
          userId={userId}
        />

        {/* Single screen-level TaskEditModal for editing a task */}
        <TaskEditModal
          modalVisible={editModalVisible}
          inputRef={inputRef}
          taskId={editingTask?.id}
          userId={userId}
          currentTaskTitle={editingTask?.title}
          currentTaskTag={editingTask?.tag}
          onDismiss={dismissUIOverlays}
        />

        {/* Header with greeting and logout */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "flex-start", gap: 8 }}>
            <Image style={styles.headerImage} source={{ uri: userInfo.photoURL }} />
            <Text style={styles.headerText}>{userInfo.username}</Text>
          </View>
          <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => signOutFromFirebase(navigation)}>
            <Feather name="log-out" size={20} />
          </TouchableOpacity>
        </View>

        {/* Tags row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 16,
            alignContent: "flex-start",
          }}
          style={{ maxHeight: "9%", width: "90%" }}
        >
          {filterTag.map((tag, idx) => {
            const tagLower = tag.toLowerCase()
            return (
              <TouchableOpacity onPress={() => {
                setSelectedFilterTag(tagLower)
                filterByTag(tagLower)
              }} key={tag} style={selectedFilterTag === tagLower ? styles.tag : styles.selectedTag}>
                <Text style={selectedFilterTag === tagLower ? styles.tagText : styles.selectedTagText}>{tag}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Task List */}
        <View style={styles.listContainer}>
          <PaperProvider>
            <FlatList
              data={displayTasks}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              ListEmptyComponent={<View style={styles.emptyContainer}>
                <Image style={styles.img} source={require('../assets/empty-task-img.jpg')}></Image>
                <Text style={styles.emptyText}>No tasks in this category for now.</Text>
                <Text style={styles.emptyText}>Click + to add your task.</Text>
              </View>}
              ListHeaderComponent={
                allDone ? (
                  <View style={styles.emptyContainer}>
                    <Image style={styles.img} source={require('../assets/all-tasks-done-img.jpg')} />
                    <Text style={styles.emptyText}>You nailed it!</Text>
                    <Text style={styles.emptyText}>Time to relax or add new goals.</Text>
                  </View>
                ) : null
              }
            />
          </PaperProvider>
        </View>

        {/* Add Button for new task */}
        <TouchableOpacity style={styles.addBtn} onPress={openModal}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Styles for HomeScreen and its subcomponents
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  scrollView: {
    flex: 1,
  },
  header: {
    width: "94%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerText: {
    fontFamily: "Quicksand_700Bold",
  },
  headerImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  listContainer: {
    flex: 1,
    width: "100%",
    height: "40%",
  },
  taskView: {
    width: "90%",
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
  },
  taskText: {
    fontFamily: "Quicksand_500Medium",
  },
  taskTextChecked: {
    fontFamily: "Quicksand_500Medium",
    textDecorationLine: "line-through",
    color: "rgba(0,0,0,0.4)",
  },
  addBtn: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 172, 207, 1)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
    zIndex: 10,
  },
  addBtnText: {
    color: "white",
    fontSize: 50,
  },
  taskItemContainer: {
    flexDirection: "column",
    gap: 4,
  },
  taskDateText: {
    color: "rgba(255, 172, 207, 1)",
    fontSize: 12,
    fontFamily: "Quicksand_500Medium",
  },
  menuItem: {
    fontFamily: "Quicksand_400Regular",
  },
  tag: {
    backgroundColor: "rgba(255, 172, 207, 1)",
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 172, 207, 0.3)",
    justifyContent: "center",
  },
  selectedTag: {
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 172, 207, 1)",
    justifyContent: "center",
  },
  tagText: {
    fontSize: 14,
    fontFamily: "Quicksand_500Bold",
    color: "white",
  },
  selectedTagText: {
    fontSize: 14,
    fontFamily: "Quicksand_500Bold",
    color: "black",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Quicksand_700Bold",
    color: "#999",
    textAlign: "center",
    alignSelf: "center",
  },
  img: {
    resizeMode: "contain",
    height: 300,
  }
});
