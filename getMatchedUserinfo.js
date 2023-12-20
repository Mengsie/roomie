//  tager to input-parametre: en liste af brugere (`users`) og den bruger, der er logget ind (`userLoggedIn`).
const getMatchedUserInfo = (users, userLoggedIn) => {

  // Opret en kopi af brugerlisten for at undgå at ændre originalen.
  const newUsers = { ...users };

  // Fjern den logget ind bruger fra den kopierede liste.
  delete newUsers[userLoggedIn];

  // Brug Object.entries til at få et array med nøgler og værdier, og flat() for at konvertere det til et fladt array.
  const [id, user] = Object.entries(newUsers).flat();

  // Returner et objekt med id'et og information om den matchede bruger.
  return { id, ...user };
};

// Eksporter funktionen, så den kan bruges andre steder i koden.
export default getMatchedUserInfo;
