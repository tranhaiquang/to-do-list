import { Alert } from "react-native";
import { db } from "./firebaseConfig";
import { doc, collection, addDoc, setDoc, getDoc, deleteDoc, onSnapshot, Timestamp } from "firebase/firestore";

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

const setTaskTitle = async (userId, taskId, taskTitle) => {
  try {
    const taskRef = doc(db, userId, taskId)
    const snapshot = await getDoc(taskRef)
    if (snapshot.exists()) {
      await setDoc(taskRef, {
        title: taskTitle
      }, { merge: true })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createUserOnFirestore = async (userId, name) => {
  try {

    const documentRef = doc(db, userId, "info")
    await setDoc(documentRef, { username: name });

  }
  catch (error) {
    console.log(error)
    Alert.alert(error.message)
  }
}

const getUsernameOnFirestore = async (userId) => {
  try {
    const docRef = doc(db, userId, "info")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {

      return docSnap.data().username
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

const deleteTaskOnFirestore = async (userId, taskId) => {
  try {
    await deleteDoc(doc(db, userId, taskId))
  }
  catch (error) {
    console.log(error)
    Alert.alert(error.message)
  }
}

export { addTaskToFirestore, listenToFirestoreData, setIsDone, createUserOnFirestore, setTaskTitle, deleteTaskOnFirestore, getUsernameOnFirestore };
