import React, { useState, useEffect } from 'react';
import {
  ScrollView, Button, StyleSheet,Text, View, TouchableOpacity,TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import generateID from '../generateId';
import { db } from '../firebase';
import * as ImagePicker from 'expo-image-picker';



// Komponent til redigering af brugerprofilen
const EditProfile = () => {
    // Lokale tilstande til at håndtere input og billede for redigering af profil
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldBeskrivelse, setOldBeskrivelse] = useState('');
    const [newBeskrivelse, setNewBeskrivelse] = useState('');
    const [oldBeskæftigelse, setOldBeskæftigelse] = useState('');
    const [newBeskæftigelse, setNewBeskæftigelse] = useState('');
    const [profileImage, setProfileImage] = useState(null);
  
    // Henter den aktuelle bruger og brugerens ID fra Firebase Authentication
    const auth = getAuth().currentUser;
    const authId = auth.uid;
  
    // Funktion til at hente eksisterende brugerdata fra Firestore
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'user', auth.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData && userData.password) {
          setOldPassword(userData.password);
        }
        if (userData && userData.Beskrivelse) {
          setOldBeskrivelse(userData.Beskrivelse);
        }
        if (userData && userData.beskæftigelse) {
          setOldBeskæftigelse(userData.beskæftigelse);
        }
      }
    };
  
    // Effekthandler til at hente brugerdata ved komponentens indlæsning
    useEffect(() => {
      fetchUserData();
    }, []);
  
    // Funktion til at opdatere password i Firestore-databasen
    const updatePasswordInDatabase = async () => {
      const userDocRef = doc(db, 'user', auth.uid);
      try {
        await setDoc(userDocRef, { password: newPassword }, { merge: true });
        setOldPassword(newPassword);
        setNewPassword('');
      } catch (error) {
        console.error('Fejl ved opdatering af password:', error);
      }
    };
  
    // Funktion til at opdatere beskrivelse i Firestore-databasen
    const updateBeskrivelseInDatabase = async () => {
      const userDocRef = doc(db, 'user', auth.uid);
      try {
        await setDoc(userDocRef, { Beskrivelse: newBeskrivelse }, { merge: true });
        setOldBeskrivelse(newBeskrivelse);
        setNewBeskrivelse('');
      } catch (error) {
        console.error('Fejl ved opdatering af beskrivelse:', error);
      }
    };
  
    // Funktion til at opdatere beskæftigelse i Firestore-databasen
    const updateBeskæftigelseInDatabase = async () => {
      const userDocRef = doc(db, 'user', auth.uid);
      try {
        await setDoc(userDocRef, { beskæftigelse: newBeskæftigelse }, { merge: true });
        setOldBeskæftigelse(newBeskæftigelse);
        setNewBeskæftigelse('');
      } catch (error) {
        console.error('Fejl ved opdatering af beskæftigelse:', error);
      }
    };
  
    // Funktion til at håndtere valg af profilbillede
    const handleImageSelect = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0,
        resize: { width: 200, height: 200 },
      });
  
      if (result.canceled) {
        console.log('Valg af billede annulleret');
        return;
      }
  
      const storage = getStorage();
  
      try {
        const imageBytes = await fetch(result.assets[0].uri);
        const imageBlob = await imageBytes.blob();
  
        const imageRef = storageRef(storage, `images/${generateID()}`);
        await uploadBytes(imageRef, imageBlob);
  
        const url = await getDownloadURL(imageRef);
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'user', authId);
  
        await setDoc(userDocRef, { profileImage: url }, { merge: true });
        setProfileImage(url);
      } catch (error) {
        console.error('Fejl ved håndtering af billede:', error);
      }
    };
  

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Knapper og funktionalitet til håndtering af profilbillede */}
        <View style={styles.buttonContainer}>
          <Button title="Vælg billede" onPress={handleImageSelect} color="white" />
        </View>
  
        {/* Seksion for beskæftigelse med Picker og opdateringsknap */}
        <View style={styles.section}>
          {/* Picker til valg af beskæftigelse */}
          <Picker
            selectedValue={newBeskæftigelse}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setNewBeskæftigelse(itemValue)}
          >
            <Picker.Item label="Studerende (Bachelor)" value="Studerende (Bachelor)" />
            <Picker.Item label="Studerende (Kandidat)" value="Studerende (Kandidat)" />
            <Picker.Item label="Arbejder Fuldtid" value="Arbejder Fuldtid" />
            <Picker.Item label="Ledig" value="Ledig" />
          </Picker>
          {/* Opdateringsknap til beskæftigelse */}
          <TouchableOpacity onPress={updateBeskæftigelseInDatabase} style={styles.button}>
            <Text style={styles.buttonText}>Opdater Beskæftigelse</Text>
          </TouchableOpacity>
        </View>
  
        {/* Seksion for beskrivelse med TextInput og opdateringsknap */}
        <View style={styles.container}>
          <View style={styles.section}></View>
          <View style={styles.section}>
            {/* TextInput til indtastning af ny beskrivelse */}
            <TextInput
              style={[styles.input, styles.largeInput]}
              placeholder="Ny beskrivelse"
              multiline={true}
              numberOfLines={4}
              value={newBeskrivelse}
              onChangeText={(text) => setNewBeskrivelse(text)}
            />
            {/* Opdateringsknap til beskrivelse */}
            <TouchableOpacity onPress={updateBeskrivelseInDatabase} style={styles.button}>
              <Text style={styles.buttonText}>Opdater Beskrivelse</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}></View>
  
          {/* TextInput til indtastning af nyt password og opdateringsknap */}
          <TextInput
            style={[styles.input, styles.largeInput]}
            placeholder="Nyt password"
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={true}
          />
          {/* Opdateringsknap til password */}
          <TouchableOpacity onPress={updatePasswordInDatabase} style={styles.button}>
            <Text style={styles.buttonText}>Opdater Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };
  

  const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: '#deb887',
      padding: 10,
      borderRadius: 8,
      marginVertical: 5,
      width: '100%',
      height: 60,
      alignItems: 'center',
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 20,
      width: '100%',
    },
    picker: {
      width: '100%',
      marginBottom: 10,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
    },
    largeInput: {
      height: 120,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 1,
      marginTop: 5,
      borderRadius: 5,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    button: {
      backgroundColor: '#deb887',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
    password: {
      marginBottom: 30,
      marginTop: 10,
    },
  });
  

  export default EditProfile;
  
