import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';

const MatchScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;

  const handleSendMessage = () => {
    // Navigate to the Chat screen or perform any other action
    navigation.navigate('Chat', { otherUserProfile: userSwiped });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.matchText}>
        You and {userSwiped.name} have liked each other
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
  },
  matchText: {
    fontSize: 18,
    marginBottom: 20,
  },
  sendMessageButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MatchScreen;
