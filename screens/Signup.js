import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

// Definerer komponenten 'Signup' med en funktion, der modtager navigation som en parameter
const Signup = ({ navigation }) => {
  // Initialiserer lokale tilstande for email og password ved hjælp af React Hooks
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Funktion, der håndterer oprettelse af en ny bruger
  const handleSignup = () => {
    // Henter authentication instansen
    const auth = getAuth();

    // Opretter en ny bruger med email og password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Henter brugeroplysninger fra brugerCredentials
        const user = userCredential.user;

        // Opretter et brugerdataobjekt
        const userData = {
          email: email,
          password: password,
          id: user.uid
        };

        // Hvis brugeren er oprettet med succes
        if (user) {
          // Henter brugerens ID
          const userId = user.uid;

          // Bruger setDoc til at tilføje brugerdata til Firestore-databasen
          setDoc(doc(db, 'user', userId), userData)
            .then(() => {
              console.log('Bruger tilføjet til databasen');

              // Navigerer til 'Name'-skærmen og sender brugerens ID som parameter
              navigation.navigate('Name', { userId: userId });
            })
            .catch((error) => {
              console.error('Fejl ved tilføjelse af bruger til databasen:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Fejl ved oprettelse af bruger:', error);
      });
  };


  return (
    <ImageBackground
      source={require('../assets/landing.jpeg')} 
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Vælg et kodeord"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Sign Up" onPress={handleSignup} />
        <Text style={styles.text}>
          Har allerede en konto?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Log ind
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  text: {
    marginTop: 20,
    color: 'white',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});


export default Signup;
