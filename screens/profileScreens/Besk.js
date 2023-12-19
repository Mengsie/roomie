import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import your Firestore instance
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const Besk = ({ navigation, route }) => {
    const [valg, setValg] = useState('');
    const authId = getAuth().currentUser.uid

 
      const arbejdeTing = () => {
        if (!authId) {
          console.error('authId not available');
          return;
        }
    
        const userRef = doc(db, 'user', authId);
    
        // Update the user document with the provided name
        updateDoc(userRef, {
          job: valg // Assuming userName is captured from user input
        })
          .then(() => {
            console.log('Name updated successfully');
            navigation.navigate('Info', { authId: authId });
          })
          .catch((error) => {
            console.error('Error updating name:', error);
          });
      };
    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hvad er din beskæftigelse?</Text>
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} /* Other Picker props here */ />
            </View>
            <Picker
                selectedValue={valg}
                style={styles.picker}
                onValueChange={(itemValue) => setValg(itemValue)}
            >
                <Picker.Item label="Studerende (Bachelor)" value="Studerende (Bachelor)" />
                <Picker.Item label="Studerende (Kandidat)" value="Studerende (Kandidat)" />
                <Picker.Item label="Arbejder Fuldtid" value="Arbejder Fuldtid" />
                <Picker.Item label="Ledig" value="Ledig" />

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

export default Besk;