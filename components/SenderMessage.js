import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReceiverMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      {/* No profile image */}
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
    alignSelf: 'flex-end', // Align to the right
    maxWidth: '50%', // Adjust the maximum width to 50%
  },
  messageContainer: {
    backgroundColor: 'blue',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 8, // Add marginLeft to align the message container
  },
  messageText: {
    color: 'white',
  },
});

export default ReceiverMessage;
