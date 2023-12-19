import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import your Firestore instance
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const Info = ({ navigation, route }) => {
  const [description, setDescription] = useState('');
  const authId = getAuth().currentUser.uid

 

  const handleDescription = () => {
    if (!authId) {
      console.error('authId not available');
      return;
    }

    const userRef = doc(db, 'user', authId);

    // Update the user document with the provided description
    updateDoc(userRef, {
      Beskrivelse: description // Update with the description state
    })
      .then(() => {
        console.log('Info added');
        navigation.navigate('Pic', { authId: authId });
      })
      .catch((error) => {
        console.error('Error updating info:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Tilføj en beskrivelse af dig selv, så du opnår bedst mulige matches.
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setDescription(text)} 
          value={description}
          multiline={true}
          numberOfLines={4}
          placeholder="Skriv din beskrivelse her..."
          placeholderTextColor="#000000"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleDescription}>
        <Text style={styles.buttonText}>Fortsæt</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: '#deb887',
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: 'Poppins',
    minHeight: 100,
  },
  button: {
    backgroundColor: '#deb887',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 2
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Info;