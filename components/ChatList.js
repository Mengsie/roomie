import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { getAuth } from 'firebase/auth';
import ChatRow from './ChatRow';

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const authUser = getAuth().currentUser;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'matches'), where('usersMatched', 'array-contains', authUser.uid)),
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
  }, [authUser.uid]);

  return (
    
    <View style={styles.container}>
      {matches.length > 0 ? (
        <FlatList
          style={styles.list}
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatRow matchDetails={item} />}
        />
      ) : (
        <SafeAreaView style={styles.noMatchesContainer}>
          <Text>No matches found</Text>
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatList;
