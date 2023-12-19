import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import your Firestore instance
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const Leje = ({ navigation, route }) => {
    const [lejer, setLejer] = useState('');
    const authId = getAuth().currentUser.uid

   
      const lejeTing = () => {
        if (!authId) {
          console.error('authId not available');
          return;
        }
    
        const userRef = doc(db, 'user', authId);
    
        // Update the user document with the provided name
        updateDoc(userRef, {
          userType: lejer // Assuming userName is captured from user input
        })
          .then(() => {
            console.log('Gender updated successfully');
            navigation.navigate('Age', { authId: authId });
          })
          .catch((error) => {
            console.error('Error updating name:', error);
          });
      };
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ønsker du at leje eller udleje?</Text>
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} />
            </View>
            <Picker
                selectedValue={lejer}
                style={styles.picker}
                onValueChange={(itemValue) => setLejer(itemValue)}
            >
                <Picker.Item label="Søgende" value="Søgende" />
                <Picker.Item label="Udlejer" value="Udlejer" />

            </Picker>
            <TouchableOpacity style={styles.button} onPress={lejeTing}>
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

export default Leje;