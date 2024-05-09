# Uppgift 1 i moment 4 i kursen Backend-baserad programmering, av Andreas Nygård

# Server-applikation för registrering och login

Denna fil innehåller kod till en sida där användaren ska kunna registrera ett nytt konto. samt logga in med dessa uppgifter.

Jag har använt SQLite3 som databashanterare.

## Installation

1. Ladda ner NPM-paketen med kommandot "npm install".

2. Kommandot "node install" för att skapa en ny databas

3. Kommandot "npm run start" för att starta och ansluta till servern.

## Funktionalitet

1. För att hämta alla användare:
   /api/users med metoden "GET".

2. För att hämta en unik användare:
   /api/users/id med metoden "GET".

3. Lägga till nya användare:
   /api/register med metoden "POST".

4. För att radera en användare:
   /api/users/id med metoden "DELETE".

5. För att uppdatera en användare:
   /api/users/id med metoden "PUT".
