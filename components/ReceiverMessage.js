import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ReceiverMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.profileImage} source={{ uri: message.profileImage }} />
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message.message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%', // Custom maxWidth style
  },
  messageContainer: {
    backgroundColor: 'red',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 8, // Add marginLeft to align the message container with the image
  },
  profileImage: {
    height: 25,
    width: 25,
    borderRadius: 25,
    marginRight: 8,
  },
  messageText: {
    color: 'white',
  },
});

export default ReceiverMessage;
