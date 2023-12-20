import React, { useState, useEffect } from 'react';
import { Button, TextInput, StyleSheet, Text, View, SafeAreaView, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useRoute } from '@react-navigation/core';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';


const MessageScreen = () => {
  // Henter den aktuelle bruger fra Firebase Authentication
  const auth = getAuth().currentUser;

  // Bruger useRoute-hook til at hente ruteoplysninger
  const { params } = useRoute();

  // Initialiserer lokale tilstande for input og beskeder ved hjælp af React Hooks
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Henter matchDetails fra ruteoplysninger
  const { matchDetails } = params;

  // Effekthandler, der abonnerer på Firestore-dokumentændringer for beskeder i en given kamp
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'matches', matchDetails.id, 'messages'), orderBy('timestamp', 'desc')),
      (snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );

    return () => {
      // Afmelder abonnementet ved komponentens afmontering
      unsubscribe();
    };
  }, [matchDetails, db]);

  // Funktion til at sende en besked
  const sendMessage = () => {
    // Tilføjer en ny besked til Firestore-databasen
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
      timestamp: serverTimestamp(),
      userId: auth.uid,
      displayName: matchDetails.users[auth.uid].name,
      profileImage: matchDetails.users[auth.uid].profileImage,
      message: input,
    });

    console.log('Besked sendt:', input);
    setInput(''); // Rydder inputfeltet efter afsendelse af beskeden
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container} keyboardVerticalOffset={10}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* FlatList til at vise beskeder med afsender- og modtagerkomponenter */}
          <FlatList
            data={messages}
            inverted={true}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) =>
              message.userId === auth.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage key={message.id} message={message} />
              )
            }
            contentContainerStyle={styles.flatListContent}
          />
        </TouchableWithoutFeedback>

        {/* Container til at skrive og sende beskeder */}
        <View style={styles.messageContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Send besked..."
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            value={input}
          />
          <Button onPress={sendMessage} title="Send" color="black" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export default MessageScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingBottom: 10, 
    paddingLeft: 15,
    paddingRight: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#deb887',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textInput: {
    height: 40,
    fontSize: 18,
    flex: 1, 
    backgroundColor: '#deb887',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
