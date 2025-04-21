// Elementi del DOM
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');
const narrationText = document.getElementById('narration-text');
const questionBox = document.getElementById('question-box');
const questionText = document.getElementById('question-text');
const answerButtonsContainer = document.getElementById('answer-buttons');
const feedbackText = document.getElementById('feedback-text');
const nextButton = document.getElementById('next-button');
const speakButton = document.getElementById('speak-button');

// Elementi animazione
const skyElement = document.getElementById('sky');
const sunElement = document.getElementById('sun');
const rainDropElement = document.getElementById('rain-drop');
const seedElement = document.getElementById('seed');
const sproutElement = document.getElementById('sprout');
const smallTreeElement = document.getElementById('small-tree');
const mediumTreeElement = document.getElementById('medium-tree');
const bigTreeElement = document.getElementById('big-tree');
const rootsElement = document.getElementById('roots');

// Stato del gioco
let currentStep = 0;
let score = 0;
let sunIsWarm = false;
let seedIsPlanted = false;
let sproutIsGrowing = false;
let treeIsGrowing = false;
let speechSynthesis = window.speechSynthesis;
let speechEnabled = false;

// Inizializza SpeechSynthesis
let speechUtterance = null;

// Start button event listener
startButton.addEventListener('click', function() {
    // Nascondi la schermata iniziale
    startScreen.classList.add('hidden');
    
    // Mostra l'area di gioco
    gameArea.classList.remove('hidden');
    
    // Inizializza la sintesi vocale dopo l'interazione dell'utente
    initializeSpeech();
    
    // Avvia il gioco
    showStep(currentStep);
});

// Inizializza la sintesi vocale dopo l'interazione dell'utente
function initializeSpeech() {
    if ('speechSynthesis' in window) {
        speechEnabled = true;
        setupVoice();
        
        // Leggi il primo messaggio di benvenuto
        setTimeout(() => {
            speakText(gameSteps[currentStep].narration);
        }, 500);
    } else {
        console.warn("Il browser non supporta la Web Speech API");
    }
}

// Configura voce italiana se disponibile
function setupVoice() {
    if (speechEnabled && 'speechSynthesis' in window) {
        speechUtterance = new SpeechSynthesisUtterance();
        // Ottieni la lista delle voci disponibili
        let voices = speechSynthesis.getVoices();
        
        // Riprova ad ottenere le voci se l'array è vuoto
        if (voices.length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                voices = speechSynthesis.getVoices();
                // Cerca una voce italiana
                const italianVoice = voices.find(voice => 
                    voice.lang.includes('it-IT') || voice.lang.includes('it')
                );
                if (italianVoice) {
                    speechUtterance.voice = italianVoice;
                }
                speechUtterance.rate = 0.9; // Leggermente più lento per i bambini
                speechUtterance.pitch = 1.1; // Tono leggermente più alto
            };
        } else {
            // Cerca una voce italiana
            const italianVoice = voices.find(voice => 
                voice.lang.includes('it-IT') || voice.lang.includes('it')
            );
            if (italianVoice) {
                speechUtterance.voice = italianVoice;
            }
            speechUtterance.rate = 0.9; // Leggermente più lento per i bambini
            speechUtterance.pitch = 1.1; // Tono leggermente più alto
        }
    }
}

// Funzione per leggere il testo
function speakText(text) {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    
    // Ferma qualsiasi narrazione in corso
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    speechUtterance.text = text;
    speechSynthesis.speak(speechUtterance);
}

// Definiamo i passi del gioco (narrazione, animazione, domanda)
const gameSteps = [
    { // Step 0: Introduzione
        narration: "Ciao! Oggi scopriremo come un piccolo seme diventa un grande albero! Premi 'Avanti' per iniziare l'avventura!",
        animation: () => {
            // Reset degli elementi
            seedElement.classList.add('hidden');
            sproutElement.classList.add('hidden');
            smallTreeElement.classList.add('hidden');
            mediumTreeElement.classList.add('hidden');
            bigTreeElement.classList.add('hidden');
            rootsElement.classList.add('hidden');
            rainDropElement.classList.add('hidden');
            
            // Reset degli stati
            sunIsWarm = false;
            seedIsPlanted = false;
            sproutIsGrowing = false;
            treeIsGrowing = false;
        },
        question: null // Nessuna domanda all'inizio
    },
    { // Step 1: Il Seme
        narration: "Ecco il nostro protagonista: un piccolo seme! Prima di piantarlo, ha bisogno che il terreno sia caldo. Clicca sul sole per riscaldare il terreno!",
        animation: () => {
            // Mostra il seme e rimuovi eventuali classi
            seedElement.classList.remove('hidden', 'seed-planted');
            sunElement.classList.remove('sun-warm');
            sunIsWarm = false;
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché il sole non è caldo
        },
        question: {
            text: "Cosa serve al seme per iniziare a crescere?",
            answers: [
                { text: "Solo luce solare", correct: false },
                { text: "Calore e acqua", correct: true },
                { text: "Solo aria", correct: false }
            ],
            correctFeedback: "Esatto! Un seme ha bisogno sia di calore che di acqua per germogliare.",
            incorrectFeedback: "Non proprio. Il seme ha bisogno sia di calore che di acqua per poter germogliare."
        },
        requiresInteraction: 'sun'
    },
    { // Step 2: Piantare il Seme
        narration: "Ora che il terreno è caldo, possiamo piantare il nostro seme. Clicca sul seme per metterlo nel terreno!",
        animation: () => {
            // Terreno già caldo dallo step precedente
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden'); // Nascondiamo il bottone finché il seme non è piantato
        },
        question: {
            text: "Perché piantiamo i semi nel terreno?",
            answers: [
                { text: "Per nasconderli dagli uccelli", correct: false },
                { text: "Per decorare il giardino", correct: false },
                { text: "Per proteggerli e dare loro nutrimento", correct: true }
            ],
            correctFeedback: "Esatto! Il terreno protegge il seme e gli fornisce i nutrienti necessari per crescere.",
            incorrectFeedback: "Non proprio. Il terreno protegge il seme e gli fornisce i nutrienti necessari per crescere."
        },
        requiresInteraction: 'seed'
    },
    { // Step 3: Acqua per il Seme
        narration: "Il nostro seme è piantato! Ma ha bisogno di acqua per germogliare. Guarda, sta iniziando a piovere! Clicca sulla goccia di pioggia per innaffiare il seme.",
        animation: () => {
            // Mostriamo la pioggia
            rainDropElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Perché l'acqua è importante per la crescita delle piante?",
            answers: [
                { text: "Per farle brillare al sole", correct: false },
                { text: "Per trasportare nutrienti e permettere la crescita", correct: true },
                { text: "Solo per renderle più belle", correct: false }
            ],
            correctFeedback: "Esatto! L'acqua scioglie i nutrienti nel terreno e li trasporta all'interno della pianta.",
            incorrectFeedback: "Non proprio. L'acqua è fondamentale perché scioglie i nutrienti nel terreno e li trasporta all'interno della pianta."
        },
        requiresInteraction: 'rain-drop'
    },
    { // Step 4: Germogliazione
        narration: "Il seme ha ricevuto calore e acqua, ed ecco che inizia a germogliare! Dal seme spunta un piccolo germoglio verde. Clicca sul germoglio per aiutarlo a crescere!",
        animation: () => {
            // Nascondiamo il seme e mostriamo il germoglio
            seedElement.classList.add('hidden');
            sproutElement.classList.remove('hidden');
            rainDropElement.classList.add('hidden'); // Fermiamo la pioggia
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Come si chiama il processo in cui il seme inizia a svilupparsi?",
            answers: [
                { text: "Fioritura", correct: false },
                { text: "Germogliazione", correct: true },
                { text: "Fotosintesi", correct: false }
            ],
            correctFeedback: "Corretto! La germogliazione è il processo in cui il seme si sviluppa in una nuova pianta.",
            incorrectFeedback: "Non è corretto. Il processo in cui il seme inizia a svilupparsi in una nuova pianta si chiama germogliazione."
        },
        requiresInteraction: 'sprout'
    },
    { // Step 5: Sviluppo delle Radici
        narration: "Mentre il germoglio cresce verso l'alto cercando la luce del sole, sotto terra si sviluppano le radici che ancorano la pianta e assorbono acqua e nutrienti.",
        animation: () => {
            // Mostriamo le radici
            rootsElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Cosa succede dopo?";
        },
        question: {
            text: "A cosa servono le radici di una pianta?",
            answers: [
                { text: "Solo a tenere la pianta ferma nel terreno", correct: false },
                { text: "A raccogliere la luce del sole", correct: false },
                { text: "Ad assorbire acqua e nutrienti e ancorare la pianta", correct: true }
            ],
            correctFeedback: "Perfetto! Le radici hanno il doppio compito di assorbire acqua e nutrienti dal terreno e di ancorare saldamente la pianta.",
            incorrectFeedback: "Non proprio. Le radici hanno un ruolo fondamentale: assorbono acqua e nutrienti dal terreno e ancorano saldamente la pianta."
        }
    },
    { // Step 6: Piccolo Albero
        narration: "Con il tempo, il germoglio diventa sempre più grande. Spuntano nuove foglie che, grazie alla luce del sole, producono il nutrimento per la pianta attraverso la fotosintesi. Clicca sul germoglio per farlo crescere ancora!",
        animation: () => {
            // Nascondiamo il germoglio e mostriamo il piccolo albero
            sproutElement.classList.add('hidden');
            smallTreeElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.classList.add('hidden');
        },
        question: {
            text: "Come si chiama il processo con cui le piante producono il proprio nutrimento usando la luce solare?",
            answers: [
                { text: "Traspirazione", correct: false },
                { text: "Fotosintesi", correct: true },
                { text: "Germinazione", correct: false }
            ],
            correctFeedback: "Esatto! La fotosintesi è il processo con cui le piante utilizzano la luce del sole per trasformare acqua e anidride carbonica in zuccheri (nutrimento) e ossigeno.",
            incorrectFeedback: "Non è corretto. Il processo è la fotosintesi, con cui le piante usano la luce solare per produrre nutrimento e rilasciare ossigeno."
        },
        requiresInteraction: 'small-tree'
    },
    { // Step 7: Albero in crescita
        narration: "La nostra pianta continua a crescere e diventa un albero giovane! Il tronco diventa più forte e compaiono nuovi rami con tante foglie.",
        animation: () => {
            // Nascondiamo il piccolo albero e mostriamo l'albero medio
            smallTreeElement.classList.add('hidden');
            mediumTreeElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "E poi?";
        },
        question: {
            text: "Quale parte dell'albero sostiene rami e foglie?",
            answers: [
                { text: "Le radici", correct: false },
                { text: "Il tronco", correct: true },
                { text: "I fiori", correct: false }
            ],
            correctFeedback: "Corretto! Il tronco è la struttura portante dell'albero che sostiene i rami e le foglie.",
            incorrectFeedback: "Non è così. Il tronco è la parte dell'albero che sostiene i rami e le foglie."
        }
    },
    { // Step 8: Albero adulto
        narration: "Passano gli anni e il nostro albero diventa grande e forte! Adesso può ospitare uccelli, produrre frutti e semi, e contribuire a rendere l'aria pulita producendo ossigeno.",
        animation: () => {
            // Nascondiamo l'albero medio e mostriamo l'albero grande
            mediumTreeElement.classList.add('hidden');
            bigTreeElement.classList.remove('hidden');
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Perché gli alberi sono importanti?";
        },
        question: {
            text: "Quale di questi è un beneficio che gli alberi offrono all'ambiente?",
            answers: [
                { text: "Consumano ossigeno", correct: false },
                { text: "Producono ossigeno e puliscono l'aria", correct: true },
                { text: "Riscaldano l'atmosfera", correct: false }
            ],
            correctFeedback: "Esatto! Gli alberi producono l'ossigeno che respiriamo e aiutano a pulire l'aria dai gas inquinanti.",
            incorrectFeedback: "Non è corretto. Gli alberi sono fondamentali perché producono ossigeno e aiutano a pulire l'aria."
        }
    },
    { // Step 9: Il Ciclo della Vita
        narration: "L'albero adulto produce frutti che contengono nuovi semi. Quando questi semi cadono a terra, il ciclo ricomincia e possono nascere nuovi alberi!",
        animation: () => {
            // Mostriamo di nuovo un seme accanto all'albero
            seedElement.classList.remove('hidden');
            seedElement.classList.remove('seed-planted');
            seedElement.style.left = '30%'; // Spostiamo il seme in una nuova posizione
            
            narrationText.textContent = gameSteps[currentStep].narration;
            nextButton.textContent = "Ricomincia";
            currentStep = -1; // Per ricominciare dal passo 0
        },
        question: {
            text: "Come si chiama il ciclo continuo della vita delle piante?",
            answers: [
                { text: "Ciclo dell'acqua", correct: false },
                { text: "Ciclo vitale", correct: true },
                { text: "Ciclo delle stagioni", correct: false }
            ],
            correctFeedback: "Perfetto! Il ciclo vitale delle piante descrive le fasi di vita dalla nascita alla riproduzione, creando nuove generazioni.",
            incorrectFeedback: "Non proprio. Si chiama ciclo vitale, il processo continuo che permette alle piante di riprodursi e creare nuove generazioni."
        }
    }
];

// Funzione per mostrare la narrazione e gestire le animazioni
function showStep(stepIndex) {
    if (stepIndex >= gameSteps.length) {
        console.error("Step non valido:", stepIndex);
        return;
    }
    const step = gameSteps[stepIndex];

    // Nascondi domande precedenti
    questionBox.classList.add('hidden');
    feedbackText.textContent = '';
    answerButtonsContainer.innerHTML = ''; // Pulisci bottoni vecchi

    // Mostra narrazione
    narrationText.textContent = step.narration;
    
    // Leggi la narrazione ad alta voce
    speakText(step.narration);

    // Esegui animazione (se presente)
    if (step.animation) {
        step.animation();
    }

    // Gestisci la visibilità del pulsante Avanti in base alle interazioni richieste
    if (step.requiresInteraction) {
        nextButton.classList.add('hidden');
    } else if (!step.question) {
        nextButton.classList.remove('hidden');
        // Aggiorna testo bottone se necessario
        if (stepIndex === 0) nextButton.textContent = "Iniziamo!";
        else if (stepIndex === gameSteps.length - 1) nextButton.textContent = "Ricomincia";
        else nextButton.textContent = "Avanti";
    }

    // Mostra domanda (se presente)
    if (step.question) {
        // In presenza di domanda, verifichiamo se deve essere mostrata subito o dopo l'interazione
        if (!step.requiresInteraction) {
            nextButton.classList.add('hidden');
            displayQuestion(step.question);
        }
    }
}

// Funzione per mostrare la domanda e i bottoni
function displayQuestion(questionData) {
    questionText.textContent = questionData.text;
    answerButtonsContainer.innerHTML = ''; // Pulisci bottoni precedenti

    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.onclick = () => handleAnswer(answer.correct, questionData.correctFeedback, questionData.incorrectFeedback);
        answerButtonsContainer.appendChild(button);
    });

    questionBox.classList.remove('hidden');
    
    // Leggi la domanda ad alta voce
    speakText(questionData.text);
}

// Funzione per gestire la risposta data
function handleAnswer(isCorrect, correctFeedback, incorrectFeedback) {
    // Disabilita i bottoni dopo la risposta
    const buttons = answerButtonsContainer.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);

    if (isCorrect) {
        feedbackText.textContent = "🥳 " + correctFeedback;
        feedbackText.style.color = 'green';
        speakText(correctFeedback); // Leggi feedback positivo
        score++; // Incrementa punteggio se lo usiamo
    } else {
        feedbackText.textContent = "🤔 " + incorrectFeedback;
        feedbackText.style.color = 'red';
        speakText(incorrectFeedback); // Leggi feedback negativo
    }

    // Mostra il pulsante "Avanti" per procedere al passo successivo
    nextButton.classList.remove('hidden');
    nextButton.textContent = "Continua";
}

// Event Listener per il pulsante parlante
speakButton.addEventListener('click', () => {
    const textToRead = narrationText.textContent;
    speakText(textToRead);
});

// Event Listener per il pulsante Avanti/Inizia/Continua
nextButton.addEventListener('click', () => {
    currentStep++;
    if (currentStep >= gameSteps.length) {
        currentStep = 0; // Ricomincia il ciclo
    }
    showStep(currentStep);
});

// Gestori di eventi per elementi interattivi
sunElement.addEventListener('click', function() {
    // Se siamo al passo del sole (1)
    if (currentStep === 1) {
        sunIsWarm = true;
        this.classList.add('sun-warm');
        narrationText.textContent = "Molto bene! Il sole ha riscaldato il terreno ed è pronto per accogliere il nostro seme.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

seedElement.addEventListener('click', function() {
    // Se siamo allo step del seme (2)
    if (currentStep === 2) {
        seedIsPlanted = true;
        this.classList.add('seed-planted');
        narrationText.textContent = "Ottimo lavoro! Hai piantato il seme nel terreno dove sarà al sicuro e potrà crescere.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

rainDropElement.addEventListener('click', function() {
    // Se siamo allo step della pioggia (3)
    if (currentStep === 3) {
        narrationText.textContent = "Perfetto! L'acqua sta nutrendo il nostro seme che presto inizierà a germogliare.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

sproutElement.addEventListener('click', function() {
    // Se siamo allo step del germoglio (4)
    if (currentStep === 4) {
        sproutIsGrowing = true;
        this.classList.add('sprout-growing');
        narrationText.textContent = "Guarda come cresce il nostro germoglio! Le foglioline verdi catturano la luce del sole.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});

smallTreeElement.addEventListener('click', function() {
    // Se siamo allo step del piccolo albero (6)
    if (currentStep === 6) {
        treeIsGrowing = true;
        this.classList.add('tree-growing');
        narrationText.textContent = "L'albero sta crescendo e diventa sempre più forte! Presto sarà un bell'albero adulto.";
        speakText(narrationText.textContent);
        nextButton.classList.remove('hidden');
        
        // Se c'è una domanda associata a questo step, mostrala ora
        if (gameSteps[currentStep].question) {
            setTimeout(() => {
                displayQuestion(gameSteps[currentStep].question);
            }, 5000);
        }
    }
});