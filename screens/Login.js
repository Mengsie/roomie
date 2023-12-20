import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  //til at logge ind, bruger firebase auth til at tjekke email
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Show an error popup
      Alert.alert('Error', 'Invalid email or password. Please try again.', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  button: {
    backgroundColor: '#deb887',
    padding: 10,
    width: 200,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default Login;