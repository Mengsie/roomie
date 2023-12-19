import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/core'
import Swiper from 'react-native-deck-swiper'
import { Duplex } from 'form-data';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, getDocs, onSnapshot, getDoc, setDoc, doc, query, where, snapshot, DocumentSnapshot, serverTimestamp } from 'firebase/firestore';

import { getAuth, signInWithEmailAndPassword, signOut, Auth } from "firebase/auth";
import generateID from '../generateId';
import { db } from "../firebase"

const EditProfile = () => {
    const [oldEmail, setOldEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldBeskrivelse, setOldBeskrivelse] = useState('');
    const [newBeskrivelse, setNewBeskrivelse] = useState('');
    const [oldBeskæftigelse, setOldBeskæftigelse] = useState('');
    const [newBeskæftigelse, setNewBeskæftigelse] = useState('');

    const auth = getAuth().currentUser;

    const fetchUserData = async () => {
        const userDocRef = doc(db, 'user', auth.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData && userData.email) {
                setOldEmail(userData.email);
            }
            if (userData && userData.password) {
                setOldPassword(userData.password);
            }
            if (userData && userData.beskrivelse) {
                setOldBeskrivelse(userData.beskrivelse);
            }
            if (userData && userData.beskæftigelse) {
                setOldBeskæftigelse(userData.beskæftigelse);
            }
        }
    };

    useEffect(() => {
        fetchUserData(); // Fetch and set old email, password, beskrivelse, and beskæftigelse on component mount
    }, []);


    const updateEmailInDatabase = async () => {
        const userDocRef = doc(db, 'user', auth.uid);
        try {
            await setDoc(userDocRef, { email: newEmail }, { merge: true });
            setOldEmail(newEmail); // Update the old email with the new email
            setNewEmail(''); // Clear the input field after updating
        } catch (error) {
            console.error('Error updating email:', error);
        }
    };

    const updatePasswordInDatabase = async () => {
        const userDocRef = doc(db, 'user', auth.uid);
        try {
            await setDoc(userDocRef, { password: newPassword }, { merge: true });
            setOldPassword(newPassword); // Update the old password with the new password
            setNewPassword(''); // Clear the input field after updating
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    const updateBeskrivelseInDatabase = async () => {
        const userDocRef = doc(db, 'user', auth.uid);
        try {
            await setDoc(userDocRef, { beskrivelse: newBeskrivelse }, { merge: true });
            setOldBeskrivelse(newBeskrivelse); // Update the old beskrivelse with the new beskrivelse
            setNewBeskrivelse(''); // Clear the input field after updating
        } catch (error) {
            console.error('Error updating beskrivelse:', error);
        }
    };


    const updateBeskæftigelseInDatabase = async () => {
        const userDocRef = doc(db, 'user', auth.uid);
        try {
            await setDoc(userDocRef, { beskæftigelse: newBeskæftigelse }, { merge: true });
            setOldBeskæftigelse(newBeskæftigelse); // Update the old beskæftigelse with the new beskæftigelse
            setNewBeskæftigelse(''); // Clear the picker after updating
        } catch (error) {
            console.error('Error updating beskæftigelse:', error);
        }
    };











    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Old Email:</Text>
                <Text style={styles.value}>{oldEmail}</Text>
            </View>
            <View style={styles.section}>
                <TextInput
                    style={styles.input}
                    placeholder="New Email"
                    value={newEmail}
                    onChangeText={text => setNewEmail(text)}
                />
                <TouchableOpacity onPress={updateEmailInDatabase} style={styles.button}>
                    <Text style={styles.buttonText}>Update Email</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Old Password:</Text>
                <Text style={styles.value}>{oldPassword}</Text>
            </View>
            <View style={styles.section}>
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    value={newPassword}
                    onChangeText={text => setNewPassword(text)}
                    secureTextEntry={true}
                />
                <TouchableOpacity onPress={updatePasswordInDatabase} style={styles.button}>
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Old Beskrivelse:</Text>
                <Text style={styles.value}>{oldBeskrivelse}</Text>
            </View>
            <View style={styles.section}>
                <TextInput
                    style={[styles.input, styles.largeInput]}
                    placeholder="New Beskrivelse"
                    multiline={true}
                    numberOfLines={4}
                    value={newBeskrivelse}
                    onChangeText={text => setNewBeskrivelse(text)}
                />
                <TouchableOpacity onPress={updateBeskrivelseInDatabase} style={styles.button}>
                    <Text style={styles.buttonText}>Update Beskrivelse</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Old Beskæftigelse:</Text>
                <Text style={styles.value}>{oldBeskæftigelse}</Text>
            </View>
            <View style={styles.section}>
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
                <TouchableOpacity onPress={updateBeskæftigelseInDatabase} style={styles.button}>
                    <Text style={styles.buttonText}>Update Beskæftigelse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};





const styles = StyleSheet.create({
    largeInput: {
        height: 120,
        width: 400, // Adjust the height as needed for a larger input
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImageContainer: {
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'gray',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default EditProfile;