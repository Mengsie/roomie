import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';

const MatchScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;

  const handleSendMessage = () => {
    
    navigation.navigate('Chat', { otherUserProfile: userSwiped });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.matchText}>
        🎉 TILLYKKE! Dig og {userSwiped.name} har matchet .
        Er det din kommende roomie?
      </Text>
      <TouchableOpacity style={styles.sendMessageButton} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  matchText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sendMessageButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});


export default MatchScreen;