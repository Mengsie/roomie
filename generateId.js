// Funktionen `generateId` tager to id'er som input og kombinerer dem for at generere en unik id, som bruges til match i databasen
const generateId = (id1, id2) => {
    // Hvis id1 er større end id2, returneres summen af de to id'er.
    if (id1 > id2) {
        return id1 + id2;
    } else {
        // Hvis id2 er større end eller lig med id1, returneres summen af de to id'er.
        return id2 + id1;
    }
};

export default generateId;
