import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';


const LandingPage = ({ navigation }) => {
  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground source={require('../assets/landing.jpeg')} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Swipe4Roomies</Text>
        <Text style={styles.subtitle}>Building Bonds, Swipe by Swipe </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
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
    position: 'absolute',
    top: 0,
    bottom: -100,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 100, // Adjust the margin for spacing
  },
  title: {
    fontFamily: 'Helvetica',
    fontSize: 45,
    marginBottom: 15,
    color: '#deb887',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#deb887',
    marginBottom: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20, // Adjust the bottom margin for button position
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

export default LandingPage;
