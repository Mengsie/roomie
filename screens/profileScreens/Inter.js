import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '../../firebase';
import {
  doc,
  updateDoc,
  add as firestoreAdd,
  collection,
  ref,
  addDoc,
  setDoc,
} from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const InterestsComponent = ({ navigation, route }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const authId = getAuth().currentUser.uid



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

  const toggleInterest = (interest) => {
    const isSelected = selectedInterests.includes(interest.title);
    if (isSelected) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest.title));
    } else {
      setSelectedInterests([...selectedInterests, interest.title]);
    }
  };

  const sendInterestsToFirestore = async () => {
    if (!authId || authId === '') {
      console.error('Invalid authId:', authId);
      return;
    }

    const userDocRef = doc(db, 'user', authId); // Assuming 'users' is your collection name
    try {
      // Use appropriate Firestore methods to update data
      await updateDoc(userDocRef, { selectedInterests });
      console.log('Interests updated successfully!');
      navigation.navigate('Home', { authId: authId });
    } catch (error) {
      console.error('Error updating interests:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vælg dine interesser</Text>
      <View style={styles.interestsContainer}>
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.title}
            style={[
              styles.interest,
              selectedInterests.some((item) => item === interest.title) && styles.selectedInterest,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text style={styles.interestText}>{interest.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Button to send interests to Firestore */}
      <TouchableOpacity onPress={sendInterestsToFirestore}>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Fortsæt</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Replace styles with your own defined styles
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
  selectedText: {
    marginTop: 20,
    fontStyle: 'italic',
  },
  sendButton: {
    backgroundColor: '#deb887',
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 40
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default InterestsComponent;
