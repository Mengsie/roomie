
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


const RegisterScreen = () => {
  // Initialiserer lokale tilstande for email og password ved hjælp af React Hooks
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Funktion, der udføres ved tryk på "Register"-knappen
  const register = () => {
    // Henter authentication-instansen fra Firebase
    const auth = getAuth();

    // Opretter en ny bruger med email og password
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Henter brugeroplysninger fra brugerCredentials
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    // Wrappes i KeyboardAvoidingView for at undgå tastaturet, der dækker inputfelterne
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <Text h3 style={{ marginBottom: 100 }}>Register</Text>

      {/* View til inputfelterne for email og password */}
      <View style={styles.InputContainer}>
        <TextInput
          placeholder="Email"
          autoFocus={true}
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      {/* Knappen til at udføre registrering */}
      <Button raised title="Register" onPress={register} />

      {/* StatusBar for at styre statusbjælke på mobiltelefonen */}
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}


export default RegisterScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});
