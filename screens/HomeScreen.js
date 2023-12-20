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

// Definerer HomeScreen-komponenten
const HomeScreen = ({}) => {
  // State til at opbevare brugerprofiler
  const [profiles, setProfiles] = useState([]);
  
  // Hent aktuel autentificeret bruger
  const auth = getAuth().currentUser;
  
  // Navigation fra React Navigation
  const navigation = useNavigation();

  // useEffect til at håndtere livscyklus og hente brugerprofiler
  useEffect(() => {
    let unsub;

    // Funktion til at hente kort (brugerprofiler)
    const fetchCards = async () => {
      // Hent brugerens "passes" fra Firebase Firestore
      const passes = await getDocs(collection(db, 'user', auth.uid, 'passes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      // Hent brugerens "swipes" fra Firebase Firestore
      const swipes = await getDocs(collection(db, 'user', auth.uid, 'swipes')).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      // Lav lister over brugere, der er blevet "passed" og "swiped"
      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      // Hent brugerens dokumentreference
      const userDocRef = doc(db, 'user', auth.uid);

      // Hent brugerens snapshot fra Firebase Firestore
      const userDocSnapshot = await getDoc(userDocRef);

      // Find brugertypen (userType) fra snapshot
      const userType = userDocSnapshot.data().userType;

      // Opret en "onSnapshot" observer for at lytte efter ændringer i brugerprofiler
      unsub = onSnapshot(
        query(collection(db, 'user'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])),
        (snapshot) => {
          // Opdater profiler med brugerdata, filtreret efter "passed" og "swiped" brugere
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

    // Kald fetchCards-funktionen ved første render
    fetchCards();

    // Returner en clean-up funktion, der stopper observeren ved unmounting
    return () => unsub;
  }, []);

  // Funktion til håndtering af swipe til venstre på et kort
  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`Du har passeret ${userSwiped.name}`);

    // Opdater Firestore med information om "passed" bruger
    setDoc(doc(db, 'user', auth.uid, 'passes', userSwiped.id), userSwiped);
  };

  // Funktion til håndtering af swipe til højre på et kort
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (await getDoc(doc(db, 'user', auth.uid))).data();

    // Tjek om der er et match
    getDoc(doc(db, 'user', userSwiped.id, 'swipes', auth.uid)).then((documentSnapshot) => {
      if (documentSnapshot.exists()) {
        console.log(`Yay, match med ${userSwiped.name}`);

        // Opdater Firestore med information om "swiped" bruger
        setDoc(doc(db, 'user', auth.uid, 'swipes', userSwiped.id), userSwiped);

        // Opret dokument i "matches" med information om matchet
        setDoc(doc(db, 'matches', generateID(auth.uid, userSwiped.id)), {
          users: {
            [auth.uid]: loggedInProfile,
            [userSwiped.id]: userSwiped,
          },
          usersMatched: [auth.uid, userSwiped.id],
          timestamp: serverTimestamp(),
        });

        // Naviger til MatchScreen med information om matchet
        navigation.navigate('MatchScreen', {
          loggedInProfile,
          userSwiped,
        });
      } else {
        console.log(`Swiped right på ${userSwiped.name}`);

        // Opdater Firestore med information om "swiped" bruger
        setDoc(doc(db, 'user', auth.uid, 'swipes', userSwiped.id), userSwiped);
      }
    });
  };

  // JSX for at vise brugerprofiler i et Swiper-komponent
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
                  <Text style={styles.ageText}>{`Alder: ${card.age}`}</Text>
                  <Text style={styles.ageText}>{`Beskrivelse: ${card.Beskrivelse}`}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.noMoreProfilesContainer}>
                <Text style={styles.noMoreProfilesText}>Ingen flere profiler</Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

// Styles til komponenten
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'flex-start',
    backgroundColor: 'white'
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
    borderWidth: 2, // Tilføj grænsebredde
    borderColor: 'black', // Sæt grænsefarve
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

// Eksportér HomeScreen-komponenten som standard
export default HomeScreen;
