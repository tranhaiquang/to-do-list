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
} from 'react-native';
import {
  Quicksand_700Bold,
  Quicksand_400Regular,
  useFonts,
} from '@expo-google-fonts/quicksand';
import * as SplashScreen from 'expo-splash-screen';
import { Dropdown } from 'react-native-element-dropdown';

const TAGS = [
  { label: 'Work', value: 'work' },
  { label: 'Personal', value: 'personal' },
  { label: 'Wishlist', value: 'wishlist' },
  { label: 'Birthday', value: 'birthday' },
];

export default function TextInputModal({
  onDismiss,
  onConfirm,
  modalVisible,
  inputRef,
  inputPlaceholderText,
  setText,
  setTag,
}) {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_700Bold,
  });

  const [selectedTag, setSelectedTag] = useState('');

  // Handle splash screen logic only once
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Reset selectedTag when modal opens/closes
  useEffect(() => {
    if (!modalVisible) {
      setSelectedTag('');
    }
  }, [modalVisible]);

  // Handler for tag selection
  const handleTagChange = (item) => {
    setSelectedTag(item.value);
    if (typeof setTag === 'function') {
      setTag(item.value);
    }
  };

  // Handler for dismiss (ensures fallback to Keyboard.dismiss)
  const handleDismiss = onDismiss || Keyboard.dismiss;

  if (!fontsLoaded) return null;

  // TextInputModal component: displays a modal for entering a task and selecting a tag
  return (
    <Modal animationType="fade" visible={modalVisible} transparent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={handleDismiss}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TextInput
              ref={inputRef}
              style={styles.modalTextInput}
              onChangeText={setText}
              placeholder={inputPlaceholderText}
              placeholderTextColor="#aaa"
            />
            <Dropdown
              style={styles.dropdown}
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
              <TouchableOpacity onPress={onConfirm} style={styles.submitBtn}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

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
    gap: 20,
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
    marginBottom: 0,
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
    width: 300,
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
});