import { Modal, View, Text, TouchableOpacity, StyleSheet, } from "react-native";
import { Quicksand_700Bold, Quicksand_500Medium, useFonts, Quicksand_400Regular } from "@expo-google-fonts/quicksand";
import { deleteTaskOnFirestore } from "../firebase/firestoreServices";
import * as SplashScreen from 'expo-splash-screen'

export default function TaskDeleteModal({ visible, userId, taskId, onDismiss }) {
    const [fontsLoaded] = useFonts({ Quicksand_500Medium, Quicksand_700Bold, Quicksand_400Regular })

    SplashScreen.preventAutoHideAsync()

    if (fontsLoaded)
        SplashScreen.hide()
    return (
        <Modal animationType="fade" visible={visible} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    <Text style={styles.messageText}>Are you want to delete this task?</Text>
                    <View style={{ justifyContent: "center", alignItems: "center", gap: 20, flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => { onDismiss() }} style={styles.cancelBtn}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { 
                            deleteTaskOnFirestore(userId, taskId)
                            onDismiss()
                         }} style={styles.submitBtn}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalView: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 10,
    },

    submitBtn: {
        padding: 10,
        backgroundColor: "rgba(255, 172, 207, 1)",
        borderRadius: 16,
    },
    cancelBtn: {
        padding: 10,
        borderRadius: 16,
        backgroundColor: "rgba(240, 240, 240, 1)",
    },
    cancelBtnText: {
        fontFamily: "Quicksand_500Medium",
    },
    submitBtnText: {
        color: "white",
        fontFamily: "Quicksand_700Bold",
    },
    messageText: {
        fontSize: 16,
        fontFamily: "Quicksand_500Medium",
        padding: 16
    }
})
