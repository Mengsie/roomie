import { useState, useEffect } from 'react';
import {db, auth} from '../../firebase';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const Name = ({ navigation, route }) => {
  const authId = getAuth().currentUser.uid
  const [name, setName] = useState('');

 

  const handleName = () => {
    if (!authId) {
      console.error('authId not available');
      return;
    }

    const userRef = doc(db, 'user', authId);

    // Update the user document with the provided name
    updateDoc(userRef, {
      name: name // Assuming userName is captured from user input
    })
      .then(() => {
        console.log('Name updated successfully');
        navigation.navigate('Leje', { authId: authId });
      })
      .catch((error) => {
        console.error('Error updating name:', error);
      });
  };

  
    return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Lad os opsætte din profil.                                  Hvad er dit navn?</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TouchableOpacity style={styles.button} onPress={handleName}>
          <Text style={styles.buttonText}>Fortsæt</Text>
        </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'top',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1, // Use borderBottomWidth instead of borderWidth
    borderColor: 'gray',
    marginBottom: 20,
    paddingLeft: 10,
    paddingBottom: 5,
    textAlign: 'center',
    fontFamily: 'Poppins'
  },
  button: {
    backgroundColor: '#deb887',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 400
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
;

export default Name;