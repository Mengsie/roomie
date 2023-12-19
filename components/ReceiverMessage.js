import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ReceiverMessage = ({ message }) => {
 return (
    <View style={styles.messageContainer}>
      <Image
        style={styles.profileImage}
        source={{
          uri: message.profileImage,
        }}
      />
      <Text style={styles.messageText}>{message.message}</Text>
    </View>
 );
};

const styles = StyleSheet.create({
 messageContainer: {
    backgroundColor: "red",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 8,
    alignSelf: "flex-start",
    maxWidth: "80%", // Custom maxWidth style
 },
 profileImage: {
    height: 25,
    width: 25,
    borderRadius: 25,
    position: "absolute",
    top: 0,
    left: -20, // Adjust the left position based on the image size and desired position
 },
 messageText: {
    color: "white",
 },
});

export default ReceiverMessage;