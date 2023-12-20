import React, { useLayoutEffect, useState,useEffect } from 'react';
import {Button, StyleSheet, Text, View , SafeAreaView, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core'
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";
import getMatchedUserInfo from '../getMatchedUserinfo';


const ChatRow = ({ matchDetails }) => {
  const navigation = useNavigation();
  const currentUser = getAuth().currentUser;
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, currentUser.uid));
  }, [matchDetails, currentUser]);

  const handlePress = () => {
    navigation.navigate('Message', {
      matchDetails,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: matchedUserInfo?.profileImage }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.textLarge}>{matchedUserInfo?.name}</Text>
        <Text style={styles.textSmall}>Say Hi!</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#deb887',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  image: {
    width: 60, // Adjust as needed
    height: 60, // Adjust as needed
    borderRadius: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  textLarge: {
    fontSize: 30,
    fontWeight: '600',
    color: '#fff',
  },
  textSmall: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
});

export default ChatRow;
