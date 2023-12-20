
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import 'firebase/firestore';
import { db } from '../../firebase';
import {
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const InterestsComponent = ({ navigation, route }) => {
  // Tilstand til at gemme brugerens valgte interesser
  const [selectedInterests, setSelectedInterests] = useState([]);
  const authId = getAuth().currentUser.uid; // Hent den aktuelle brugers fra Firebase Authentication

  // En liste af mulige interesser
  const interests = [
    { id: 1, title: 'Sport' },
    { id: 2, title: 'Musik' },
    { id: 3, title: 'Kunst' },
    { id: 4, title: 'Madlavning' },
    { id: 5, title: 'Læsning' },
    { id: 6, title: 'Mode' },
    { id: 7, title: 'Spejder' },
    { id: 8, title: 'Dans' },
    { id: 9, title: 'Film' },
    { id: 10, title: 'Teater' },
  ];

  // Funktion til at skifte tilstanden for et valgt interesse
  const toggleInterest = (interest) => {
    const isSelected = selectedInterests.includes(interest.title);
    if (isSelected) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest.title));
    } else {
      setSelectedInterests([...selectedInterests, interest.title]);
    }
  };

  // Funktion til at sende brugerens interesser til Firestore-databasen
  const sendInterestsToFirestore = async () => {
    if (!authId || authId === '') {
      console.error('Ugyldig authId:', authId);
      return;
    }

    const userDocRef = doc(db, 'user', authId); // Antager at 'users' er navnet på din Firestore-samling
    try {
      // Brug de passende Firestore-metoder til at opdatere data
      await updateDoc(userDocRef, { selectedInterests });
      console.log('Interesser opdateret med succes!');
      navigation.navigate('Home', { authId: authId });
    } catch (error) {
      console.error('Fejl ved opdatering af interesser:', error);
    }
  };

  // JSX-struktur for InterestsComponent
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vælg dine interesser</Text>
      <View style={styles.interestsContainer}>
        {/* Map gennem interesselisten og vis hver interesse som en trykbar TouchableOpacity */}
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.title}
            style={[
              styles.interest,
              // Anvendt stil, hvis interessen er valgt
              selectedInterests.some((item) => item === interest.title) && styles.selectedInterest,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={styles.interestText}>{interest.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Knap til at sende interesser til Firestore */}
      <TouchableOpacity onPress={sendInterestsToFirestore}>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Fortsæt</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  interest: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  selectedInterest: {
    backgroundColor: '#deb887',
  },
  interestText: {
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#deb887',
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 40,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
  },
});


export default InterestsComponent;
