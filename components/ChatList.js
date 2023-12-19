import React, { useLayoutEffect, useState,useEffect } from 'react';
import {Button, StyleSheet, Text, View , SafeAreaView, Image, FlatList, FlatListComponent} from 'react-native';
import {useNavigation} from '@react-navigation/core'
import Swiper from 'react-native-deck-swiper'
import { Duplex } from 'form-data';
import { getFirestore, collection, getDocs, onSnapshot, getDoc, setDoc, doc, query, where, snapshot, DocumentSnapshot, serverTimestamp } from 'firebase/firestore';
import {db, auth} from '../firebase';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";
import generateID from '../generateId';

import ChatRow from './ChatRow';


const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const auth = getAuth().currentUser;
  
    useEffect(() => {
      const unsubscribe = onSnapshot(
        query(collection(db, 'matches'), where('usersMatched', 'array-contains', auth.uid)),
        (snapshot) => {
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      );
  
      return () => {
        // Unsubscribe when the component unmounts
        unsubscribe();
      };
    }, [auth.uid]); // Make sure to include auth.uid in the dependency array if it's used inside the useEffect

  
    return matches.length > 0 ? (
        <FlatList
        style={{ flex: 1 }}
        data={matches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatRow matchDetails={item} />}
      />      
    ) : (
      <SafeAreaView >
        <Text>Chatdf scrfsdfsdfdgen</Text>
      </SafeAreaView>
    );
  };
  


export default ChatList;

