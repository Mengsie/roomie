import React from "react";
import { View, Text, StyleSheet } from "react-native";



const SenderMessage = ({ message }) => {
 return (
    <View style={styles.message}>
      <Text style={styles.messageText}>{message.message}</Text>
    </View>
 );
};

const styles = StyleSheet.create({
    message: {
       backgroundColor: "blue",
       borderRadius: 20,
       paddingHorizontal: 10,
       paddingVertical: 10,
       marginRight: "auto",
       marginLeft: 8,
       alignSelf: "flex-start",
    },
    messageText: {
       color: "#fff",
    },
   });
export default SenderMessage;