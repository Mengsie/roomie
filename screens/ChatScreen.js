import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {Button, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import ChatList from '../components/ChatList';


const ChatScreen = () => {


  return (
    <SafeAreaView style={styles.container}>
      <Text>Chat list!</Text>
      <ChatList/>
    
    </SafeAreaView>
  );
}


export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
