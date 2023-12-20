import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import ChatList from '../components/ChatList';

//henter chat listen ind i viewet
const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ChatList />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
