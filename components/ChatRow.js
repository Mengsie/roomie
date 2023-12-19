import React, { useLayoutEffect, useState,useEffect } from 'react';
import {Button, StyleSheet, Text, View , SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core'
import Swiper from 'react-native-deck-swiper'
import { Duplex } from 'form-data';
import { getFirestore, collection, getDocs, onSnapshot, getDoc, setDoc, doc, query, where, snapshot, DocumentSnapshot, serverTimestamp } from 'firebase/firestore';
import {db, auth} from '../firebase';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";
import generateID from '../generateId';
import getMatchedUserInfo from '../getMatchedUserinfo';


const ChatRow = ({matchDetails}) => {

    const navigation = useNavigation();
    const auth = getAuth().currentUser
    const [matchedUserInfo, setMatchedUserInfo] = useState(null)

    useEffect (() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, auth.uid))
    }, [matchDetails, auth])



  return (

        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Message", {
                matchDetails,
        })}>
          <Image
            source={{ uri: matchedUserInfo?.profileImage }}
            style={styles.image}
          />
          <View>
      <Text style={styles.textLarge}>
        {matchedUserInfo?.name}
      </Text>

      <Text style={styles.textSmall}>
        {"Say Hi!"}
      </Text>
    </View>
        </TouchableOpacity>
      );
    
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#ffffff',
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 20,
    },
    image: {
      width: 16,
      height: 16,
      borderRadius: 8,
      margin: 4,
    },

     textLarge: {
        fontSize: 24,
        fontWeight: '600',
     },
     textSmall: {
        fontSize: 18,
        fontWeight: '400',
     },

  });

export default ChatRow;



