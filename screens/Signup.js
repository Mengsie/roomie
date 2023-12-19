import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {db, auth} from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const userData = {
          email: email,
          password: password,
          id: user.uid
        };

        if (user) {
          const userId = user.uid; // Obtain the userId after successful registration

          // Use setDoc to set data in Firestore
          setDoc(doc(db, 'user', userId), userData)
            .then(() => {
              console.log('User added to database');

              // Navigate to the 'Name' screen and pass the userId as a parameter
              navigation.navigate('Name', { userId: userId });
            })
            .catch((error) => {
              console.error('Error adding user to database:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };


  return (
    <ImageBackground
      source={require('../assets/landing.jpeg')} // Replace with your image path
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
          placeholder="Select a Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Sign Up" onPress={handleSignup} />
        <Text style={styles.text}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login
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
    fontFamily: 'Roboto',
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
