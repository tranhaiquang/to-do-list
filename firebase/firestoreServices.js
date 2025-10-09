// Firestore data-access utilities for tasks and user profile
import { Alert } from "react-native";
import { db } from "./firebaseConfig";
import { doc, collection, addDoc, setDoc, getDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// Add a new task document under the user's collection
// Returns: void (throws on failure)
const addTaskToFirestore = async (userId, title, date, tag, isDone) => {
  try {
    const collectionRef = await addDoc(collection(db, userId), {
      title: title,
      isDone: isDone,
      date: date,
      tag: tag
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Subscribe to real-time task updates for a user
// Invokes onData with an array of task objects (excluding the 'info' doc)
const listenToFirestoreData = (uid, onData) => {
  try {
    const collectionRef = collection(db, uid);

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const taskArrays = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== "info") {
          taskArrays.push({ id: doc.id, ...doc.data() });
        }
      });
      onData(taskArrays);
    });

    return unsubscribe;

  } catch (error) {
    console.error(error);
  }
};

// Update only the isDone field for a task if it exists
const setIsDone = async (userId, taskId, isDone) => {
  try {
    const taskRef = doc(db, userId, taskId);
    const snapshot = await getDoc(taskRef)

    if (snapshot.exists()) {
      await setDoc(taskRef, {
        isDone: isDone
      }, { merge: true })
    }
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

// Edit task title/tag if the task exists; ignores empty title
const editTask = async (userId, taskId, taskTitle, taskTag, taskDate) => {
  try {
    const taskRef = doc(db, userId, taskId)
    const snapshot = await getDoc(taskRef)
    if (snapshot.exists()) {
      const updateData = {}

      if (taskTitle && taskTitle.trim() != "") {
        updateData.title = taskTitle.trim()
      }

      if (taskTag) {
        updateData.tag = taskTag
      }

      if (taskDate) {
        updateData.date = taskDate
      }

      await setDoc(taskRef, {
        title: updateData.title,
        tag: updateData.tag,
        date: updateData.date
      }, { merge: true })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// Ensure a user profile document exists at {userId}/info
// Returns: true if created, false if already exists
const createUserOnFirestore = async (userId, name, photoURL) => {
  try {
    const documentRef = doc(db, userId, "info")
    const snapshot = await getDoc(documentRef)

    if (snapshot.exists()) {
      console.log("User already exists")
      return false
    }

    await setDoc(documentRef, { username: name, photoURL: photoURL });
    return true
  }
  catch (error) {
    console.log(error)
    Alert.alert(error.message)
    throw error
  }
}

// Fetch the user's profile document (username, photoURL); returns undefined if missing
const getUserInfo = async (userId) => {
  try {
    const docRef = doc(db, userId, "info")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { username: docSnap.data().username, photoURL: docSnap.data().photoURL }
    }
    else {
      console.log("No such document!")
    }
  }
  catch (error) {
    console.log(error)
    Alert.alert(error.message)
  }
}

// Delete a task if it exists; returns true if deleted, false if not found
const deleteTaskOnFirestore = async (userId, taskId) => {
  try {
    const taskRef = doc(db, userId, taskId)
    const snapshot = await getDoc(taskRef)

    if (!snapshot.exists()) {
      return false
    }

    await deleteDoc(taskRef)
    return true
  }
  catch (error) {
    console.log(error)
    Alert.alert(error.message)
    throw error
  }
}

export { addTaskToFirestore, listenToFirestoreData, setIsDone, createUserOnFirestore, editTask, deleteTaskOnFirestore, getUserInfo };
