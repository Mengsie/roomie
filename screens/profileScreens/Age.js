import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';

// Komponent til at indsamle og godkende brugerens alder
const Age = ({ navigation }) => {
  // Hent den aktuelle brugers ID fra Firebase Authentication
  const authId = getAuth().currentUser.uid;

  // Hent aktuelle dato-værdier
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Måneder er nulbaserede, så der lægges 1 til
  const currentDay = new Date().getDate();

  // Tilstande til at holde styr på valgte datoværdier og beregnet alder
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [age, setAge] = useState(0);

  // Liste over månedsnavne
  const monthNames = [
    'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'December'
  ];

  // Hjælpefunktion til at generere en liste over år fra 1920 til det aktuelle år
  const generateYears = () => {
    const years = [];
    for (let i = currentYear; i >= 1920; i--) {
      years.push(i.toString());
    }
    return years;
  };

  // Hjælpefunktion til at generere en liste over månedsnavne
  const generateMonths = () => monthNames;

  // Hjælpefunktion til at generere en liste over dage baseret på det valgte år og måned
  const generateDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i.toString());
    }
    return days;
  };

  // Hjælpefunktion til at beregne alder baseret på den valgte dato
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

  // Brug useEffect til at genberegne alder, når de valgte datoværdier ændres
  useEffect(() => {
    calculateAge();
  }, [selectedYear, selectedMonth, selectedDay]);

  // Håndter knaptryk for at bekræfte alder og navigere til næste skærm
  const handleAge = () => {
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

            // Opdater brugerens dokument med den angivne alder
            const userRef = doc(db, 'user', authId);
            updateDoc(userRef, {
              age: age
            })
              .then(() => {
                console.log('Alder opdateret med succes');
                navigation.navigate('Gender', { authId: authId });
              })
              .catch((error) => {
                console.error('Fejl ved opdatering af alder:', error);
              });
          },
        },
      ],
    );
  };

  // JSX-struktur for Age-komponenten
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Angiv din fødselsdato:</Text>
      <View style={styles.pickerContainer}>
        {/* År Picker */}
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {generateYears().map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
        {/* Måned Picker */}
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          {generateMonths().map((month, index) => (
            <Picker.Item key={month} label={month} value={index + 1} />
          ))}
        </Picker>
        {/* Dag Picker */}
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
      {/* Fortsæt-knap */}
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
    color: 'black',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
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
