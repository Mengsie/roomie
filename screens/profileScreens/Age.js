import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {db, auth} from '../../firebase';



const Age = ({ navigation, route }) => {
    const authId = getAuth().currentUser.uid

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Month is zero-based, so adding 1
    const currentDay = new Date().getDate();

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [age, setAge] = useState(0);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const generateYears = () => {
        const years = [];
        for (let i = currentYear; i >= 1920; i--) {
            years.push(i.toString());
        }
        return years;
    };

    const generateMonths = () => {
        return monthNames;
    };

    const generateDays = () => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i.toString());
        }
        return days;
    };

    const calculateAge = () => {
        const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        setAge(age);
    };

    useEffect(() => {
        calculateAge();
    }, [selectedYear, selectedMonth, selectedDay]);



    const handleAge = () => {
        // Display confirmation popup when the button is pressed
        Alert.alert(
          'Godkendelse',
          'Har du angivet din korrekte alder?',
          [
            {
              text: 'Nej',
              style: 'cancel',
            },
            {
              text: 'Ja',
              onPress: () => {
                
                if (!authId) {
                    console.error('authId not available');
                    return;
                  }
              
                  const userRef = doc(db, 'user', authId);
              
                  // Update the user document with the provided name
                  updateDoc(userRef, {
                    age: age // Assuming userName is captured from user input
                  })
                    .then(() => {
                      console.log('Name updated successfully');
                      navigation.navigate('Gender', { authId: authId });
                    })
                    .catch((error) => {
                      console.error('Error updating name:', error);
                    });
                }
                
            },
          ],
        );
      };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Angiv din fødselsdato:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedYear(itemValue)}
                >
                    {generateYears().map((year) => (
                        <Picker.Item key={year} label={year} value={year} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                >
                    {generateMonths().map((month, index) => (
                        <Picker.Item key={month} label={month} value={index + 1} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={selectedDay}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedDay(itemValue)}
                >
                    {generateDays().map((day) => (
                        <Picker.Item key={day} label={day} value={day} />
                    ))}
                </Picker>
            </View>
            <Text style={styles.ageText}>Du er {age} år gammel</Text>
            <TouchableOpacity style={styles.button} onPress={handleAge}>
                <Text style={styles.buttonText}>Fortsæt</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({

    ageText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 300,
        color: 'black', // Example color
        fontWeight: 'bold', // Example font weight
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    
    },
    text: {
        fontFamily: 'Poppins',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 100,
    },
    picker: {
        flex: 1,
        height: 50,
        marginLeft: 5,
        marginRight: 5,

    },
    button: {
        backgroundColor: '#deb887',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 52,
        marginTop: 100
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Age;
