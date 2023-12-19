import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {Button, StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native';
import {useNavigation} from '@react-navigation/core'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = () => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log(auth.email)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>


    <Text h3 style={{marginBottom: 100}}>Register</Text>


    <View style={styles.InputContainer}>
      <TextInput placeholder="Email" autofocus={true} type="email" value={email}
      onChangeText={(text) => setEmail(text)} />
      <TextInput placeholder="Password"  type="password" value={password}
      onChangeText={(text) => setPassword(text)} />
    </View>
    <Button raised title="Register" onPress={register} />

    </KeyboardAvoidingView>



  );
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',

    },
  });
  
  