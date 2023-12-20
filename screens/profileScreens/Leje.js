import { useState} from 'react';
import { db } from '../../firebase'; // Importer din Firestore-instanse
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const Leje = ({ navigation, route }) => {
    const [lejer, setLejer] = useState('');
    const authId = getAuth().currentUser.uid;

    // Funktion til håndtering af lejevalg
    const lejeTing = () => {
        // Tjekker om authId er tilgængelig
        if (!authId) {
            console.error('authId er ikke tilgængelig');
            return;
        }

        // Henter en reference til brugerdokumentet i Firestore
        const userRef = doc(db, 'user', authId);

        // Opdaterer brugerdokumentet med den valgte lejetype
        updateDoc(userRef, {
            userType: lejer // Antager, at lejer er indtastet fra brugeren
        })
            .then(() => {
                console.log('Lejetype opdateret med succes');
                // Navigerer til næste skærm ('Age' i dette tilfælde)
                navigation.navigate('Age', { authId: authId });
            })
            .catch((error) => {
                console.error('Fejl ved opdatering af lejetype:', error);
            });
    };

    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ønsker du at leje eller udleje?</Text>
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} />
            </View>
            <Picker
                selectedValue={lejer}
                style={styles.picker}
                onValueChange={(itemValue) => setLejer(itemValue)}
            >
                <Picker.Item label="Søgende" value="Søgende" />
                <Picker.Item label="Udlejer" value="Udlejer" />

            </Picker>
            <TouchableOpacity style={styles.button} onPress={lejeTing}>
                <Text style={styles.buttonText}>Fortsæt</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom:20,

    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 100,
        backgroundColor: 'transparent', // Set the background color to transparent
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: 50,
    },
    button: {
        backgroundColor: '#deb887',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 52,
        marginTop: 380
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Leje;