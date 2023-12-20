import { useState } from 'react';
import { db } from '../../firebase';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const Name = ({ navigation, route }) => {
  // Hent den aktuelle brugers ID fra Firebase Authentication
  const authId = getAuth().currentUser.uid;
  
  // State-variabel til at holde styr på navnet, som brugeren indtaster
  const [name, setName] = useState('');

  // Funktion til håndtering af navnet og opdatering af brugeroplysninger
  const handleName = () => {
    // Kontroller, om brugerens ID er tilgængeligt
    if (!authId) {
      console.error('authId not available');
      return;
    }

    // Opret en reference til brugerens dokument i Firestore
    const userRef = doc(db, 'user', authId);

    // Opdater brugerens dokument med det angivne navn
    updateDoc(userRef, {
      name: name // Antager, at brugernavnet indtastes af brugeren
    })
      .then(() => {
        console.log('Navn opdateret med succes');
        navigation.navigate('Leje', { authId: authId });
      })
      .catch((error) => {
        console.error('Fejl ved opdatering af navn:', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Tekstspørgsmål til brugeren */}
      <Text style={styles.text}>
        Lad os opsætte din profil. Hvad er dit navn?
      </Text>
      {/* Inputfelt til brugeren */}
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
      />
      {/* Knappen til at fortsætte */}
      <TouchableOpacity style={styles.button} onPress={handleName}>
        <Text style={styles.buttonText}>Fortsæt</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stilark til komponenten
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    paddingLeft: 10,
    paddingBottom: 5,
    textAlign: 'center',
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

export default Name;
