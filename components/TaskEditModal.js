// Edit modal for updating a task's title and tag
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    TextInput,
    Keyboard,
    Text,
    Platform,
} from 'react-native';
import {
    Quicksand_700Bold,
    Quicksand_400Regular,
    useFonts,
} from '@expo-google-fonts/quicksand';
import * as SplashScreen from 'expo-splash-screen';
import { Dropdown } from 'react-native-element-dropdown';
import { editTask } from '../firebase/firestoreServices';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

// Available tag options for the dropdown
const TAGS = [
    { label: 'Work', value: 'work' },
    { label: 'Personal', value: 'personal' },
    { label: 'Wishlist', value: 'wishlist' },
    { label: 'Birthday', value: 'birthday' },
];

export default function TaskEditModal({
    // Props
    onDismiss,
    modalVisible,
    inputRef,
    userId,
    taskId,
    currentTaskTitle,
    currentTaskTag,
    currentTaskDate,
}) {
    // Load fonts
    const [fontsLoaded] = useFonts({
        Quicksand_400Regular,
        Quicksand_700Bold,
    });

    // Local state
    const [selectedTag, setSelectedTag] = useState('');
    const [taskText, setTaskText] = useState('');
    const [errors, setErrors] = useState({})
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const handleDateChange = (event, selectedDate) => {
        if (selectedDate instanceof Date) {
            setDate(selectedDate);
        }
        setShowDatePicker(false);
    };
    // Splash screen: prevent auto-hide on mount
    useEffect(() => {
        SplashScreen.preventAutoHideAsync();
    }, []);

    // Splash screen: hide when fonts are ready
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    const handleDismiss = onDismiss || Keyboard.dismiss;

    // Reset inputs and errors when modal closes
    useEffect(() => {
        if (!modalVisible) {
            setSelectedTag('');
            setTaskText('');
            setErrors({});
            setShowDatePicker(false);
        }
    }, [modalVisible]);

    // Prefill inputs when modal opens with current task values
    useEffect(() => {
        if (modalVisible) {
            setTaskText(currentTaskTitle || '');
            setSelectedTag(currentTaskTag || '');
            if (currentTaskDate) {
                const parsed = moment(currentTaskDate, 'DD-MM-YYYY');
                setDate(parsed.isValid() ? parsed.toDate() : new Date());
            } else {
                setDate(new Date());
            }
        }
    }, [modalVisible, currentTaskTitle, currentTaskTag, currentTaskDate]);

    // Handlers: input changes and validation clearing
    const handleTaskTitleChange = (text) => {
        setTaskText(text);
        if (errors.taskText) {
            setErrors((prev) => ({ ...prev, taskText: null }));
        }
    };

    const handleTagChange = (item) => {
        setSelectedTag(item.value);

        if (errors.selectedTag) {
            setErrors((prev) => ({ ...prev, selectedTag: null }));
        }
    };

    // Submit: validate then persist changes
    const handleSubmit = () => {
        const newErrors = {};

        if (!taskText.trim()) {
            newErrors.taskText = "Task title is required";
        }
        if (!selectedTag) {
            newErrors.selectedTag = "Tag is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const formattedDate = moment(date).format('DD-MM-YYYY');
            editTask(userId, taskId, taskText, selectedTag, formattedDate);
            onDismiss();
        }
    };


    if (!fontsLoaded) return null;

    // Render
    return (
        <Modal animationType="fade" visible={modalVisible} transparent>
            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback onPress={handleDismiss}>
                    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
                </TouchableWithoutFeedback>
                <View style={styles.modalView}>
                    <TextInput
                        ref={inputRef}
                        style={[styles.modalTextInput, errors.taskText && styles.modalTextInputError]}
                        onChangeText={handleTaskTitleChange}
                        value={taskText}
                        placeholder={"Enter task title"}
                        placeholderTextColor="#aaa"
                    />
                    {errors.taskText && <Text style={styles.errorText}>{errors.taskText}</Text>}
                    <Dropdown
                        style={[styles.dropdown, errors.selectedTag && styles.dropdownError]}
                        containerStyle={styles.dropdownContainer}
                        itemContainerStyle={styles.itemContainer}
                        itemTextStyle={styles.itemText}
                        selectedTextStyle={styles.selectedText}
                        data={TAGS}
                        labelField="label"
                        valueField="value"
                        placeholder="Select tag"
                        placeholderStyle={{ fontFamily: 'Quicksand_400Regular' }}
                        value={selectedTag}
                        onChange={handleTagChange}
                    />
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowDatePicker(true)}
                        accessibilityRole="button"
                        style={[styles.modalTextInput, errors.taskText && styles.modalTextInputError, { justifyContent: 'center' }]}
                    >
                        <Text style={{ color: '#000', fontFamily: 'Quicksand_400Regular', fontSize: 16 }}>
                            {date ? moment(date).format('DD-MM-YYYY') : 'Select date'}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}
                    {errors.selectedTag && <Text style={styles.errorText}>{errors.selectedTag}</Text>}
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 20,
                            flexDirection: 'row',
                        }}
                    >


                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={handleDismiss}
                        >
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// Styles
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalView: {
        width: '90%',
        minHeight: '30%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 15,
    },
    modalTextInput: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#aaa',
        color: '#000',
        borderRadius: 14,
        paddingHorizontal: 12,
        fontFamily: 'Quicksand_400Regular',
        fontSize: 16,
    },
    modalTextInputError: {
        borderWidth: 2,
        borderColor: '#ff6b6ba6'
    },

    submitBtn: {
        width: '30%',
        padding: 10,
        backgroundColor: 'rgba(255, 172, 207, 1)',
        borderRadius: 16,
        alignItems: 'center',
    },
    submitBtnText: {
        color: 'white',
        fontFamily: 'Quicksand_700Bold',
        fontSize: 18,
    },
    cancelBtn: {
        width: '30%',
        padding: 10,
        borderRadius: 16,
        backgroundColor: 'rgba(240, 240, 240, 1)',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontFamily: 'Quicksand_700Bold',
        fontSize: 18,
        color: '#333',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 12,
        padding: 12,
        width: "100%",
    },
    dropdownError: {
        borderWidth: 2,
        borderColor: '#ff6b6ba6',
    },
    dropdownContainer: {
        borderRadius: 12,
    },
    itemContainer: {
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'Quicksand_400Regular',
    },
    selectedText: {
        fontFamily: 'Quicksand_400Regular',
    },
    errorText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontFamily: "Quicksand_400Regular",
        marginLeft: 10,
        backgroundColor: '#ff6b6ba6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: 'flex-start',
    },
});
