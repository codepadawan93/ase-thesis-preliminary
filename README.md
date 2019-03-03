# ase-thesis-preliminary
Thesis practical project

## Recomandări Turistice Personalizate Adaptate la Context
- Pornind de la notele date de utilizatori in trecut unor atracții turistice putem determina similarități intre preferințele lor, putând astfel sa prezicem ce alte atracții turistice (filme / actori / cărți) ar putea fi interesante. Site-uri care utilizeaza algoritmi de recomandare: youtube, netflix, amazon, eMag, etc.
- (opt) construirea itinerarului format din atracțiile turistice sugerate
- (opt) adaptare la context: aplicația tine cont de datele despre vreme (ploaie/soare/temperatura) la generarea listei de atracții turistice recomandate

### Aspecte interesante: utilizarea de algoritmi de inteligenta artificiala, aplicație mobila + aplicație server

## Implementare
### Tema Licenta: 
1. Chatbot care recomanda atractii turistice

2. Concept general: 
    - Un `consultant` turistic online care tine cont de o serie de date contextuale, precum si de feedback direct din partea userului exprimat in limbaj natural pentru a face recomadari in ceea ce priveste diverse obiective turistice. La cerere, poate propune itinerarii (vezi punctul 4); eventual recomandari direct de pe booking.com. Nume propus: Ionut.

3. Back-end: Node.js expus prin REST api (webhook pentru integrare cu fb) + pentru chat posibil un websocket endpoint
 
4. Front-end:
    Consumator #1: Facebook messenger (integrare prin api) 
    Consumator #2: React + Bootstrap sau poate ceva custom ca sa fie mai simplu (interfata va fi una extrem de simpla, html prezentare + chatbox similar cu ce ofera facebook messenger)

5. Tehnologii majore: 
    - Sistem recomandare bazat pe context, cu un nomenclator de atractii turistice in spate (posibil tras dintr-un api, sau obtinut prin web scraping, aici urmeaza sa mai discutam) <-- focus major
    - Optimizare itinerariu (comis-voiajor clasic), insa cel mai probabil se va folosi api-ul Google Maps din ratiuni de focus. Eventual se va compensa prin cateva paragrafe in care se explica cum optimizeaza Google traseele (presupuneri mai mult, datele nefiind publice)
    - Procesarea limbajului natural - chatbot-ul in sine, producerea de text, parsarea intrebarilor puse in limbaj natural, etc. <-- focus minor, implementarea va fi una determinista intrucat focusul va fi asupra sistemului de recomandare
    - Infrastructura: Modelul client server, arhitectura REST, conexiunea prin websocket etc.
