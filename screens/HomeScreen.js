import React, { useLayoutEffect, useState,useEffect } from 'react';
import {Button, StyleSheet, Text, View , SafeAreaView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/core'
import Swiper from 'react-native-deck-swiper'
import { Duplex } from 'form-data';
import { getFirestore, collection, getDocs, onSnapshot, getDoc, setDoc, doc, query, where, snapshot, DocumentSnapshot, serverTimestamp } from 'firebase/firestore';
import {db, auth} from '../firebase';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";
import generateID from '../generateId';
import { truncate } from 'lodash';



const HomeScreen = ({}) => {
  const[profiles, setProfiles] = useState([])
  const auth = getAuth().currentUser
  const navigation = useNavigation();

  useEffect (() => {
    let unsub;

    const fetchCards = async () => {

        const passes = await getDocs(collection(db, 'user', auth.uid, 'passes')).then((snapshot) => snapshot.docs.map(doc => doc.id))

        const swipes = await getDocs(collection(db, 'user', auth.uid, 'swipes')).then((snapshot) => snapshot.docs.map(doc => doc.id))

        const passedUserIds = passes.length > 0 ? passes : ['test']
        const swipedUserIds = swipes.length > 0 ? swipes : ['test']

        const userDocRef = doc(db, 'user', auth.uid);

        const userDocSnapshot = await getDoc(userDocRef);

        const userType = userDocSnapshot.data().userType;

         console.log(userDocSnapshot.data().name)

      unsub = onSnapshot(query(collection(db, 'user'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])), snapshot => {
        setProfiles(
          snapshot.docs.filter(doc => doc.id !== auth.uid).filter(doc => doc.data().userType !== userType).map(doc=>({
            id: doc.id,
            ...doc.data()
           
          }))
        )
      })

    }

    fetchCards();
    return () => unsub; 


  }, [])



  const swipeLeft = (cardIndex) => {
    if(!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex]
    console.log(`Tou have passed on ${userSwiped.name}`)


    setDoc(doc(db, 'user', auth.uid, 'passes', userSwiped.id), userSwiped)

  };
  
  const swipeRight = async (cardIndex) => {
    if(!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex]
    const loggedInProfile = await (await getDoc(doc(db, 'user', auth.uid))).data()
    
      //Check if user swiped on you
        getDoc(doc(db, 'user', userSwiped.id, 'swipes', auth.uid)).then((documentSnapshot) => {

          if(documentSnapshot.exists()) {
            //user have matched with you before 

            console.log(`Yay match med ${userSwiped.name}`)

            setDoc(doc(db, 'user', auth.uid, 'swipes', userSwiped.id), userSwiped)

            //CREATE MATCH
            setDoc(doc(db, 'matches', generateID(auth.uid, userSwiped.id)), {
              users: {
                [auth.uid]: loggedInProfile,
                [userSwiped.id]: userSwiped
              },
              usersMatched: [auth.uid, userSwiped.id],
              timestamp: serverTimestamp(),
            })

            navigation.navigate('Match', {
              loggedInProfile,
              userSwiped,
            });
    

          } else {


            console.log(`swiped på ${userSwiped.name}`)

            setDoc(doc(db, 'user', auth.uid, 'swipes', userSwiped.id), userSwiped)
          }

        })
      } 
    


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Swiper
          containerStyle={{ backgroundColor: 'transparent' }}
          cards={profiles}
          stackSize={4}
          animateCardOpacity
          verticalSwipe={true}
          onSwipedLeft={(cardIndex) =>{
            console.log('swiped left')
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) =>{
            console.log('swiped right')
            swipeRight(cardIndex);
          }}
          overlayLabels = {{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "MATCH",
              style: {
                label: {
                  color: "green",
                },
              },
            },




          }}
          renderCard={(card) => card ? (
            <View key={card.id} style={styles.cardContainer}>
              <Image source={{ uri: card.profileImage }} style={styles.cardImage} />

              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{`${card.name}`}</Text>
                <Text style={styles.jobText}>{card.job}</Text>
                <Text style={styles.ageText}>{`Age: ${card.age}`}</Text>
              </View>
            </View>
          ) : (
            <View >
              <Text> Ikke flere profiler</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'flex-start', // Center content vertically
  },
  card: {
    flex: 1,

    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Align content at the bottom
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 50,
  },
  cardImage: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 15,
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    padding: 10,
    width: '100%', // Set width to '100%' to fill the bottom
    borderBottomLeftRadius: 15, // Optional: if you want rounded corners only on the bottom
    borderBottomRightRadius: 15, // Optional: if you want rounded 
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  jobText: {
    fontSize: 18,
    color: 'black',
  },
  ageText: {
    fontSize: 16,
    color: 'black',
  },
});

export default HomeScreen;