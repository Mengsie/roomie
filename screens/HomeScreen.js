import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Swiper from 'react-native-deck-swiper';
import {
  collection,
  getDocs,
  onSnapshot,
  getDoc,
  setDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { getAuth} from 'firebase/auth';
import generateID from '../generateId';



const HomeScreen = ({}) => {
  const [profiles, setProfiles] = useState([]);
  const auth = getAuth().currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(collection(db, 'user', auth.uid, 'passes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      const swipes = await getDocs(collection(db, 'user', auth.uid, 'swipes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      const userDocRef = doc(db, 'user', auth.uid);

      const userDocSnapshot = await getDoc(userDocRef);

      const userType = userDocSnapshot.data().userType;

      unsub = onSnapshot(
        query(collection(db, 'user'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== auth.uid)
              .filter((doc) => doc.data().userType !== userType)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return () => unsub;
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You have passed on ${userSwiped.name}`);

    setDoc(doc(db, 'user', auth.uid, 'passes', userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (await getDoc(doc(db, 'user', auth.uid))).data();

    getDoc(doc(db, 'user', userSwiped.id, 'swipes', auth.uid)).then((documentSnapshot) => {
      if (documentSnapshot.exists()) {
        console.log(`Yay match with ${userSwiped.name}`);

        setDoc(doc(db, 'user', auth.uid, 'swipes', userSwiped.id), userSwiped);

        setDoc(doc(db, 'matches', generateID(auth.uid, userSwiped.id)), {
          users: {
            [auth.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          usersMatched: [auth.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        });

        navigation.navigate('Match', {
          loggedInProfile,
          userSwiped,
        });
      } else {
        console.log(`Swiped right on ${userSwiped.name}`);
        setDoc(doc(db, 'user', auth.uid, 'swipes', userSwiped.id), userSwiped);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Swiper
          containerStyle={styles.swiperContainer}
          cards={profiles}
          stackSize={4}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            console.log('Swiped left');
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            console.log('Swiped right');
            swipeRight(cardIndex);
          }}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: styles.overlayLabelLeft,
            },
            right: {
              title: 'MATCH',
              style: styles.overlayLabelRight,
            },
          }}
          renderCard={(card) =>
            card ? (
              <View key={card.id} style={styles.cardContainer}>
                <Image source={{ uri: card.profileImage }} style={styles.cardImage} />

                <View style={styles.textContainer}>
                  <Text style={styles.nameText}>{`${card.name}`}</Text>
                  <Text style={styles.jobText}>{card.job}</Text>
                  <Text style={styles.ageText}>{`Age: ${card.age}`}</Text>
                  <Text style={styles.ageText}>{`Beskrivelse: ${card.Beskrivelse}`}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.noMoreProfilesContainer}>
                <Text style={styles.noMoreProfilesText}>No more profiles</Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'flex-start',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
  },
  swiperContainer: {
    backgroundColor: 'transparent',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 150,
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
    width: '100%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
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
  overlayLabelLeft: {
    label: {
      textAlign: 'right',
      color: 'red',
    },
  },
  overlayLabelRight: {
    label: {
      color: 'green',
    },
  },
  noMoreProfilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreProfilesText: {
    fontSize: 18,
    color: 'black',
  },
});

export default HomeScreen;
