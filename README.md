# Exam #1: "Questionario"
## Student: s282753 Scovotto Davide 

## React Client Application Routes

- Route `/`: Route di default in caso l'utente inserisca un URL errato che reindirizza alla route `/admin` se si è loggati, altrimenti alla route `/user`. 
- Route `/admin`: Pagina amministratore. Contiene la lista dei questionari pubblicati da quell'admin, con funzionalità di aggiunta questionario e visione delle risposte
- Route `/user`: Pagina user. Contiene la lista dei questionari pubblicati da tutti gli admin, con la funzionalità di fornire una risposta al questionario
- Route `/admin/addSurvey`: Contiene il form necessario per la pubblicazione di un questionario, riferito all'amministratore loggato al momento.
- Route `/admin/readAnswer`: Contiene la lista delle risposte ricevute dai vari utenti, identificati tramite il loro nome.
- Route `/user/answer`: Contiene il questionario vuoto, dando la possibilità allo user di rispondere alle varie domande del questionario selezionato.
- Route `/login`: Contiene il form di autenticazione per gli amministratori. Se avviene con successo si viene reindirizzati alla route `/admin`, 
                    altrimenti viene visualizzato un messaggio di errore di autenticazione

## API Server

  - POST `/api/sessions`
    - request parameters: None.
    - request body content: username and password.
    - response body content: 
      1. **Success**: 200 OK -> id (dalla tabella `users`), username, name. 
      2. **Fail**: 401 Unathorized -> message: `Incorrect username and/or password`, message: `Missing credentials` (se req body vuoto). 
  - GET `/api/sessions/current`
    - request parameters: None.
    - request body content: None.
    - response body content: 
      1. **Success**: 200 OK -> id (dalla tabella `users`), username, name. 
      2. **Fail**: 401 Unathorized -> error: `Not authenticated` 
 - POST `/api/logout`
    - request parameters: None.
    - request body content: None.
    - response body content: 
      1. **Success**: 200 OK . 
  - POST `/api/addSurvey`. Aggiunge un nuovo questionario al DB. L'amministratore deve essere loggato.
    - request parameters: None.
    - request body content: id, title, answers (numero di risposte ricevute), user (identifica chi vuole creare il questionario), questions (lista delle domande che contengono
                           a loro volta la lista delle opzioni)
    - response body content: 
      1. **Success**: 201 Created.
      2. **Fail**: 503 Service Unavailable ->  error: `Database error during creation of survey`.
      3. **Not logged**: 401 Unathorized -> error: `Not authorized!`
  - POST `/api/addAnswer`. Inserisce una nuova risposta nel server.
    - request parameters: None.
    - request body content: idS (id del survey che l'utente ha risposto), name, answers (contiele la lista delle risposte per ogni domanda)
    - response body content: 
      1. **Success**: 201 Created.
      2. **Fail**: 503 Service Unavailable ->  error: `Database error during creation of answer`.
  - GET `/api/surveys`. Riceve dal server i questionari relativi all'amministratore **loggato**
    - request parameters: None.
    - request body content: None.
    - response body content: 
      1. **Success**: 200 OK. ->
        ```
        [
          {
          "id": 1,
          "title": "Quiz 1",
          "answers": 4,
          "userId": 1,
          "questions": [{
                "id": 1,
                "titleQ": "Che giorno è?",
                "type": 0,
                "idS": 1,
                "min": 0,
                "max": 1,
                "options": [...]
            }]
          } ...
        ]
        ```
      2. **Fail**: 500 Internal Server Error.
      3. **Not logged**: 401 Unathorized -> error: `Not authorized!`
  - GET `/api/surveys/all`. Riceve dal server **TUTTI** i questionari.
    - request parameters: None.
    - request body content: None.
    - response body content: 
      1. **Success**: 200 OK. ->
        ```
        [
          {
          "id": 1,
          "title": "Quiz 1",
          "answers": 4,
          "userId": 1,
          "questions": [{
                "id": 1,
                "titleQ": "Che giorno è?",
                "type": 0,
                "idS": 1,
                "min": 0,
                "max": 1,
                "options": [...]
            }]
          } ...
        ]
        ```
      2. **Fail**: 503 Service Unavailable.
  - GET `/api/surveys/questions`. Riceve dal server le domande di tutti i questionari pubblicati dall'amministratore LOGGATO al momento.
    - request parameters: None.
    - request body content: None.
    - response body content: 
      1. **Success**: 200 OK. ->
        ```
        [
          "questions": [
          {
                "id": 1,
                "titleQ": "Che giorno è?",
                "type": 0,
                "idS": 1,
                "min": 0,
                "max": 1,
                "options": [...]
          } ...
        ]
        ```
      2. **Fail**: 500 Internal Server Error.
      3. **Not logged**: 401 Unathorized -> error: `Not authorized!`.
  - GET `/api/answers`. Riceve dal server le risposte dei questionari dell'amministratore in quel momento LOGGATO.
    - request parameters: None.
    - request body content: None.
    - response body content: 
      1. **Success**: 200 OK.
      2. **Fail**: 500 Internal Server Error.
      3. **Not logged**: 401 Unathorized -> error: `Not authorized!`.
- ...

## Database Tables

- Table `users` - contiene: id, email, name, hash(password).
- Table `surveys` - contiene: id, title, answers (# of answers), userId.
    Il campo **userId** serve per associare il questionario al "suo" amministratore.
- Table `questions` - contiene: idQ, titleQ, type (mutiple/open choice), idS (ref a `surveys`), min, max.
    Il campo **idS** serve per associare le domande al questionario a cui fanno riferimento.
- Table `options` - contiene: idO, titleO, idQ (ref a `questions`).
    Il campo **idQ** serve per associare le opzioni alla domanda a cui fanno riferimento.
- Table `answers` - contiene: id, idS (ref a `surveys`), name.
    Il campo **idS** serve per sapere a quale questionario l'utente **name** ha risposto.
- Table `data_answers` - contiene: id, idQ (ref a `questions`), data, idA (ref a `answers`).
    Il campo **idQ** serve per associare la risposta dell'utente (campo **data**) alla giusta domanda.
      Il campo **idA** serve per associare il contenuto della risposta alla giusta tupla della tabella `answers`.

## Main React Components

- `App` (in `App.js`): 
    Componente principale che viene usato per la gestione di:
      1. Route. 
      2. Caricamento dati dal server. 
        Per le route necessarie vengono utilizzati due stati fondamentali per la corretta gestione di esse:
        - `mounting`: garantisce che in fase di re-mounting se si è loggati, quindi nella pagina `/admin`, non si ritorni per un istante nella pagina `/user`.
                      Questo avviene perché il componente riesce a renderizzare il tutto prima che la useEffect() finisca di controllare che ci sia un cookie attivo
                      e che c'è quindi un utente loggato. Lo stato **loggedIn** viene inizialmente settato a 'false', quindi durante il passaggio 
                      'false (non loggato)' -> 'true (loggato)' si vedrà per un istante la pagina dello user. Per evitare questo comportamento ho incluso una
                      verifica nelle route interessate a questo "fenomeno". Inizialemente lo stato **mouting** viene impostato a 'true' e viene riportato a 'false'
                      solo dopo aver verificato che ci sia un cookie attivo oopure no (alla terminazione della useEffect()).
        - `loggedIn`: garantisce la divisione tra 'utente' e 'amministratore'. Solo un amministratore con credenziali valide può accedere alle funzionalità di creazione
                      di un questionario e di visione delle risposte fornite da tutti gli utenti. Lo stato viene usato per garantire accesso esclusivo alle route "privilegiate" degli amministratori e anche alle informzaioni/dati a cui un amministratore può fare accesso.
        - `loadingA/U`: stati che permettono di fornire un interazione grafica con l'utilizzatore in caso ci siano ritardi nel carimaento dei dati dal server.
        - `dirty`: permette di chiedere le informazioni al server ogni qual volta si verifichi un "cambiamento". Per esempio dopo aver fatto il login o dopo aver aggiunto
                   un nuovo questionario nel server.
      3. Funzioni di gestione per il Login - Logout.
      4. Funzione per inserimento di un nuovo questionario nel DB.
- `AdminPage` (in `AdminPage.js`): 
    Componente usato per la visualizzazione della lista dei questionari pubblicati dall'amministratore nella sua pagina principale (route `/admin`). La lista è organizzata
    in una **table** che contiene:
      1. il titolo del questionario.
      2. Il numero di risposte ricevute.
      3. Bottone che ti redirige alla visione delle risposte registrate (componente **AdminRead**).
    Inoltre contiene un tasto '+' che serve essere reindirizzati al form per la creazione del questionario (route `/admin/ddSurvey`), gestita dal componente **AddSurvey**.
- `AddSurvey` (in `AddSurvey.js`): 
    Componente che contiene il form per la creazione di un nuovo questionario. 
    Funzionalità proposte:
      1. Aggiunta dinamica delle domande,
      2. Cancellazione della domanda selezionata.
      3. Modifica dell'ordine delle domande tramite interazione con i tasti 'su' 'giù'.
      4. Aggiunta dinamica di massimo 10 opzioni per le risposte multiple con messaggio di warning in caso si provi a superare il massimo di 10.
      5. Cancellazione dinamica delle opzioni.
      6. Possibilità di indicare il numero massimo di opzioni selezionabili tramite il menù a tendina.
      7. Rendere una domanda obbligatoria tramite interazione con uno **switch**.
      8. Tasto **Cancel** per annullare la creazione del questionario e ritornare nella pagina principale dell'admin.
      9. Tasto **Publish** per pubblicare il questionario e renderlo disponibile a tutti gli utenti. Prima della pubblicazione viene fatta la validazione del form.
         In caso di errori nel form vengono visualizzati per permettere all'utilizzatore di poter compilare correttamente.
- `AdminRead` (in `Adminread.js`):
    Il componente viene utilizzato per la visualizzazione delle risposte ricevute. Tramite una seconda navbar sotto quella principale, si dà la possibilità all'amministratore
    di poter visualizzare:
      1. Il questionario originariamente caricato **NON** compilato, in modo da poter visualizzare il contenuto del questionario velocemente in caso esso fosse composto 
         da molte domande.
      2. Le risposte registrate da tutti gli utenti identificati non univocamente dal loro nome. Si può solamente scorrere il questionario senza avere la possibilità di modificarlo.
         Viene visualizzato un "questionario risposto" alla volta, e tramite l'interazione con i tasti **destra** e **sinistra** ci si può muovere nelle varie "risposte".
  - `UserPage` (in `UserPage.js`): 
      Componente usato per la visualizzazione della lista dei questionari pubblicati dagli amministratori nella pagina principale di un utente (route `/user`). La lista è organizzata
      in una **table** che contiene:
        1. il titolo del questionario.
        2. L'autore del questionario.
        3. Bottone che ti redirige alla compilazione del questionario selezionato (componente **UserAnswer**).
  - `UserAnswer` (in `UserAnswer.js`): 
      Grazie a questo componente, un utente ha la possibilità di compilare il questionario e pubblicare la sua risposta. Deve inserire il suo nome.
      Prima di pubblicare le risposte viene fatta una validazione. Gli errori vengono visualizzati se:
        1. L'utente non risponde ad una domanda obbligatoria.
        2. Utilizza più di 200 caratteri per rispondere ad una domanda aperta.
        3. Non inserisce il nome.
  - `LoginForm` (in `LoginForm.js`): 
      Componente che permente ad utilizzatore di autenticarsi. In caso di credenziali errate o uso scorretto nel riempimento del form viene visualizzato un messaggio di errore:
        1. Username cannot be blank and/or password must be at least 6 characters.
        2. Incorrect username and/or password.
  - `SurveyNavbar` (in `Navbar.js`):
      Componete che offre due funzionalità:
        1. Sulla sinistra un link (alla route di default `/`) che a sua volta redirige alla pagina principale `/admin` se si è loggati, altrimenti `/user`.    
        2. Un dropdow che contiene:
            - Un tasto di **LOGIN** per entrare come amministratore.
            - Un tasto di **LOGOUT** per uscire dalla modalità amministratore.
            - Se si è loggati le informazioni riguardanti l'utente: **Email** e **Nome**.
## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- davide@polito.it, `davide`. 
  Questionari creati:
    1. Quiz Davide
    2. Quiz calcio
    3. Sondaggio Fumatori
    4. Sondaggio Universitario.
    5. Sondaggio SerieTV
    6. Sondaggio Browser
- bob@polito.it, `password`.
  Questionari creati:
    1. Quiz 1
    2. Quiz 2
    3. Sondaggio Auto
    4. Sondaggio Sport
