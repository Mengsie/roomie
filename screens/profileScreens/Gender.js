import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import your Firestore instance
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";

const Gender = ({ navigation, route }) => {
    const [gender, setGender] = useState('');
    const authId = getAuth().currentUser.uid


      const arbejdeTing = () => {
        if (!authId) {
          console.error('authId not available');
          return;
        }
    
        const userRef = doc(db, 'user', authId);
    
        // Update the user document with the provided name
        updateDoc(userRef, {
          køn: gender // Assuming userName is captured from user input
        })
          .then(() => {
            console.log('Gender updated successfully');
            navigation.navigate('Besk', { authId: authId });
          })
          .catch((error) => {
            console.error('Error updating name:', error);
          });
      };
    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hvad identificerer du dig som?</Text>
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} /* Other Picker props here */ />
            </View>
            <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
            >
                <Picker.Item label="Mand" value="Mand" />
                <Picker.Item label="Kvinde" value="Kvinde" />
                <Picker.Item label="Andet" value="Andet" />

            </Picker>
            <TouchableOpacity style={styles.button} onPress={arbejdeTing}>
                <Text style={styles.buttonText}>Fortsæt</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Poppins',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom:20,

    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 100,
        backgroundColor: 'transparent', // Set the background color to transparent
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: 50,
    },
    button: {
        backgroundColor: '#deb887',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 52,
        marginTop: 380
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Gender;