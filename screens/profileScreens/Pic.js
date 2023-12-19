import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firestore instance
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";

const Pic = ({ navigation, route }) => {
  const authId = getAuth().currentUser.uid
  const [profileImage, setProfileImage] = useState(null);



  const handleImageSelect = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0,
      resize: { width: 200, height: 200 }
    });

    if (result.canceled) {
      console.log('Image selection cancelled');
      return;
    }

    const storage = getStorage();
    const imageRef = storageRef(storage, `profileImages/${authId}.png`);
    
    try {
      const imageBytes = await fetch(result.assets[0].uri);
      const imageBlob = await imageBytes.blob();

      const snapshot = await uploadBytes(imageRef, imageBlob);
      console.log('Billede er uploaded');

      const url = await getDownloadURL(imageRef);
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'user', authId);

      await setDoc(userDocRef, { profileImage: url }, { merge: true });
      setProfileImage(url);
 
    } catch (error) {
      console.error('Error handling image:', error);
    }

    console.log(result.assets[0].uri);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.image} />
      )}
      <Button title="Select Image" onPress={handleImageSelect} />
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
