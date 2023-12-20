// Import af nødvendige React og React Native komponenter og Firebase moduler
import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";

// Komponent til håndtering af profilbilleder
const Pic = ({ navigation, route }) => {
  // Hent den aktuelle brugers UID fra Firebase Authentication
  const authId = getAuth().currentUser.uid;

  // Lokal tilstand til opbevaring af brugerens profilbillede
  const [profileImage, setProfileImage] = useState(null);

  // Funktion til at håndtere valg af billede fra galleriet
  const handleImageSelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
      resize: { width: 200, height: 200 }
    });

    if (result.canceled) {
      console.log('Billedevalg annulleret');
      return;
    }

    // Firebase Storage reference for at gemme brugerens profilbillede
    const storage = getStorage();
    const imageRef = storageRef(storage, `profileImages/${authId}.png`);

    try {
      // Hent billeddata og konverter det til en blob
      const imageBytes = await fetch(result.assets[0].uri);
      const imageBlob = await imageBytes.blob();

      // Upload billeddata til Firebase Storage
      await uploadBytes(imageRef, imageBlob);
      console.log('Billede er uploaded');

      // Hent URL'en for det uploadede billede
      const url = await getDownloadURL(imageRef);

      // Firebase Firestore reference for brugerens dokument
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'user', authId);

      // Opdater Firestore-dokumentet med den nye profilbillede URL
      await setDoc(userDocRef, { profileImage: url }, { merge: true });
      setProfileImage(url);

    } catch (error) {
      console.error('Fejl ved håndtering af billede:', error);
    }

    console.log(result.assets[0].uri);
  };

  // JSX-struktur for Pic-komponenten
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* Vis brugerens profilbillede, hvis det eksisterer */}
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.image} />
      )}

      {/* Knapper til at vælge billede og gå videre til næste skærm */}
      <Button title="Vælg billede" onPress={handleImageSelect} />
      <Button title="Gå videre" onPress={() => navigation.navigate('Inter')}></Button>
    </View>
  );
};


const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});


export default Pic;
