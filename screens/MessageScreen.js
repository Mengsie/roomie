import React, { useLayoutEffect, useState,useEffect } from 'react';
import {Button, TextInput, StyleSheet, Text, View , SafeAreaView, Image, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Swiper from 'react-native-deck-swiper'
import { Duplex } from 'form-data';
import { getFirestore, collection, getDocs, addDoc, onSnapshot, getDoc, setDoc, doc, query, orderBy, snapshot, DocumentSnapshot, serverTimestamp } from 'firebase/firestore';
import {db, auth} from '../firebase';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";
import generateID from '../generateId';
import { useNavigation, useRoute } from '@react-navigation/core';
import getMatchedUserInfo from '../getMatchedUserinfo';
import { StatusBar } from 'expo-status-bar';
import ReceiverMessage from "../components/ReceiverMessage"
import SenderMessage from '../components/SenderMessage';


 
const MessageScreen = () => {
    const auth = getAuth().currentUser;
    const { params } = useRoute();
  
    const [input, setInput] = useState('');

    const[messages, setMessages] = useState([])



    const { matchDetails } = params;



    useEffect(() => {


        onSnapshot(query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')), 
        snapshot => setMessages(snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })
            
            ))); 
    }, [matchDetails, db])
  
    const sendMessage = () => {
      // Implement your logic to send the message
      addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
        timestamp: serverTimestamp(),
        userId: auth.uid,
        displayName: matchDetails.users[auth.uid].name,
        profileImage: matchDetails.users[auth.uid].profileImage,
        message: input,

      })
      console.log('Message sent:', input);
      setInput(''); // Clear the input after sending the message
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text>Message screen</Text>
  
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={10}
        >

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <FlatList
    data={messages}
    inverted={true}
    keyExtractor={item => item.id}
    renderItem={({item: message}) =>
        message.userId === auth.uid ? (
            <SenderMessage key={message.id} message = {message}/>
        ) : (
            <ReceiverMessage key={message.id} message = {message} />
        )
}

    />
    
    
    
    
    </TouchableWithoutFeedback>  



    <View style={styles.messageContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color="#FF5864" />
        </View>

        </KeyboardAvoidingView>  


       
      </SafeAreaView>
    );
  };
  
  export default MessageScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageContainer: {
      flexDirection: 'row', // Make it a row to align text input and button horizontally
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: '#EBEBEB',
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    textInput: {
      height: 40,
      fontSize: 18,
      flex: 1,
    },
  });



  