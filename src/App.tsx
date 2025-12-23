import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  RefreshCw,
  ChevronRight,
  Fingerprint,
  X,
  Settings,
  Users,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

type GamePhase = 'SETUP_PLAYERS' | 'SETUP_CATEGORY' | 'PASSING' | 'REVEALING' | 'END';

interface Player {
  id: string;
  name: string;
  word: string;
  isKallan: boolean;
  color: string;
}

interface TopicData {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

const TOPICS_DATA: TopicData[] = [
  { id: "🎬 Malayalam Cinema", title: "Malayalam Cinema", emoji: "🎬", description: "Classic movies and current hits from Mollywood." },
  { id: "🎭 Movie Characters (Mal)", title: "Malayalam Characters", emoji: "🎭", description: "Iconic and legendary characters from Malayalam films." },
  { id: "🚗 Cars", title: "Cars", emoji: "🏎️", description: "Supercars, luxury SUVs, and legendary auto brands from around the world." },
  { id: "🏥 Medical", title: "Medical", emoji: "🏥", description: "Common medical terms, departments, and equipment." },
  { id: "🇬🇧 Life in UK", title: "Life in UK", emoji: "💂", description: "Culture, landmarks, and daily life in the United Kingdom." },
  { id: "☕ Java Programming", title: "Java Dev", emoji: "☕", description: "JVM concepts, frameworks, and backend engineering terms." },
  { id: "🏃 Agile Methodology", title: "Agile/Scrum", emoji: "🏃", description: "Common terminology used in agile workflows and sprint cycles." },
  { id: "🎭 Movie Characters (Tam)", title: "Tamil Characters", emoji: "🦁", description: "Memorable characters and stars from the Kollywood film industry." },
  { id: "📍 Places in Kerala", title: "God's Own Country", emoji: "🌴", description: "Explore vibrant locations across the districts of Kerala." },
  { id: "🏏 Indian Cricket", title: "Cricket Mania", emoji: "🏏", description: "Legendary Indian cricketers and iconic cricket venues." },
  { id: "📚 Kerala PSC", title: "PSC Quest", emoji: "📚", description: "Essential terms for competitive exams in Kerala." }
];

const ANIME_COLORS = [
  '#FF416C', '#FF4B2B', '#4568DC', '#B06AB3', '#11998e', '#38ef7d', '#FC466B', '#3F5EFB', '#00F260', '#0575E6', '#f12711', '#f5af19'
];

const TOPICS_WORDS: Record<string, string[]> = {
  "🎬 Malayalam Cinema": [
    "Manichitrathazhu", "Drishyam", "Premam", "Lucifer", "Kireedam", "Kumbalangi Nights", "Bangalore Days", "Sandesham", "Spirit", "Ayyappanum Koshiyum", "Kilukkam", "Chithram", "Pulimurugan", "Minnal Murali", "Guru", "Spadikam", "Devasuram", "Ustad Hotel", "Bharatham", "Thoovanathumbikal", "Namukku Parkkan Munthirithoppukal", "Oru Vadakkan Veeragatha", "Mathilukal", "Vidheyan", "Yavanika", "Perumthachan", "Sadayam", "Sukrutham", "Vaishali", "Njan Gandharvan", "Moonnam Pakkam", "Kakkothikkavile Appooppan Thaadakal", "Mookilla Rajyathu", "Boeing Boeing", "In Harihar Nagar", "Ramji Rao Speaking", "Mannar Mathai Speaking", "Godfather", "Vietnam Colony", "Meleparambil Aanveedu", "Aniyan Bava Chetan Bava", "C.I.D. Moosa", "Kalyanaraman", "Meesa Madhavan", "Classmates", "Big B", "Chotta Mumbai", "Anwar", "Urumi", "Celluloid", "Left Right Left", "Iyyobinte Pusthakam", "Ennu Ninte Moideen", "Action Hero Biju", "Jacobinte Swargarajyam", "Kammatipaadam", "Mayanadi", "Thanneer Mathan Dinangal", "Ayyappanum Koshiyum", "The Great Indian Kitchen", "Malik", "Joji", "Minnal Murali", "Hridayam", "Bheeshma Parvam", "Jaya Jaya Jaya Jaya Hey", "Romancham", "2018 Movie", "RDX", "Kannur Squad", "Bramayugam", "Manjummel Boys", "Premalu", "Aadujeevitham", "Aavesham", "Guruvayoor Ambalanadayil", "Turbo", "Thalavan", "Ullozhukku", "Adios Amigo", "Vaazha", "Nunakkuzhi", "Bharathanatyam", "Footage", "Kondal", "Ajayante Randam Moshanam", "Kishkindha Kaandam", "Vazhai", "Lubber Pandhu"
  ],
  "🎭 Movie Characters (Mal)": [
    "Dasan", "Vijayan", "Sethurama Iyer", "Aadu Thoma", "Mangalassery Neelakantan", "Kanjirappally Pappachil", "George kutty", "Minnal Murali", "Major Ravi", "Shibu", "Pavithran", "Balan K Nair", "Kuttyedathi", "Hypocrisy Dasan", "Appu", "Joji", "Bilal John Kurisingal", "Sagar Alias Jacky", "Vincent Gomas", "Induchoodan", "Jagannadhan", "Kanimangalam Jagannathan", "Michael", "Kurup", "Kuttan", "Faizal", "Shaji Pappan", "Lolan", "Girirajan Kozhi", "P.C. George", "S.I. Biju Paulose", "Dr. Sunny Joseph", "Unnimaya", "Clara", "Nagavalli", "Thomman", "Kochunni", "Odiyan", "Lucifer", "Stephen Nedumpally", "Khureshi-Ab'raam", "Koshy Kurien", "Ayyappan Nair", "Kuttanpillai", "Kumbalangi Saji", "Bobby", "Bonny", "Franky", "Shammi", "Panicker", "P.V. Mani", "Dr. Pashupathi", "Keerikadan Jose", "Haider Ali", "Ravi Mamman", "Ananthan Nambiar", "Pisharadi", "Dhamu", "Gafoor Ka Dost", "Ramanan", "Raghavan", "Shambu", "Khader", "Kunjikka", "Moideen", "Kanchanamala", "Subi", "Ammachi", "Peethambaran", "Kavalayil Chacko", "Chemban Vinod", "Pamban Saikumar", "Sura", "Solomon", "Shoshanna", "Mary", "Celine", "Malar Miss", "Kanchana", "Tessa", "Charlie", "Zooni", "Diya", "Nazeer", "Jayan", "Madhu", "Sheela", "Sharada", "Mammootty", "Mohanlal", "Dulquer Salmaan", "Fahadh Faasil", "Prithviraj", "Nivin Pauly", "Tovino Thomas"
  ],
  "🚗 Cars": [
    "Tesla Model S", "BMW M3", "Audi RS6", "Ferrari F8", "Porsche 911", "Lamborghini Urus", "Ford Mustang", "Land Rover Defender", "Range Rover Sport", "Toyota Land Cruiser", "Honda Civic Type R", "Toyota Supra", "Mercedes G-Wagon", "Mini Cooper S", "Chevrolet Corvette", "Chevrolet Camaro", "Dodge Challenger", "Dodge Charger", "Jeep Wrangler", "Jeep Grand Cherokee", "Chevrolet Suburban", "Chevrolet Tahoe", "Cadillac Escalade", "Lincoln Navigator", "Rolls-Royce Ghost", "Rolls-Royce Phantom", "Rolls-Royce Cullinan", "Bentley Flying Spur", "Bentley Continental GT", "Bentley Bentayga", "Lamborghini Huracan", "Lamborghini Aventador", "Lamborghini Revuelto", "Porsche Taycan", "Porsche Macan", "Porsche Cayenne", "Porsche Panamera", "Ferrari SF90", "Ferrari 296 GTB", "Ferrari Roma", "Ferrari Purosangue", "Aston Martin DB11", "Aston Martin DBS", "Aston Martin Vantage", "Aston Martin DBX", "McLaren 750S", "McLaren GTS", "McLaren GT", "McLaren P1", "McLaren Senna", "Bugatti Chiron", "Bugatti Veyron", "Bugatti Divo", "Bugatti Bolide", "Pagani Huayra", "Pagani Utopia", "Pagani Zonda", "Koenigsegg Jesko", "Koenigsegg Regera", "Koenigsegg Gemera", "Pininfarina Battista", "Rimac Nevera", "Lotus Evija", "Lotus Emira"
  ],
  "🏥 Medical": [
    "Stethoscope", "X-Ray", "Surgery", "Vaccine", "Prescription", "Antibiotic", "Cardiology", "Neurology", "MRI Scan", "Ventilator", "Dialysis", "Anesthesia", "Ultrasound", "CT Scan", "Endoscopy", "Biopsy", "Chemotherapy", "Radiotherapy", "Insulin", "Glucose", "Hemoglobin", "Cholesterol", "Blood Pressure", "Heart Rate", "Pulse Oximeter", "Thermometer", "Sphygmomanometer", "Glucometer", "Defibrillator", "Pacemaker", "Catheter", "IV Drip", "Syringe", "Scalpel", "Forceps", "Clamp", "Retractor", "Sutures", "Bandage", "Cast", "Crutches", "Wheelchair", "Stretcher", "Ambulance", "ER", "ICU", "NICU", "OT", "OPD", "Triage", "Diagnosis", "Prognosis", "Chronic", "Acute", "Benign", "Malignant", "Infectious", "Contagious", "Immunity", "Antibody", "Antigen", "Virus", "Bacteria", "Fungus", "Parasite", "Hormone", "Enzyme", "Vitamin", "Mineral", "Electrolyte", "Dehydration", "Inflammation", "Infection", "Allergy", "Asthma", "Diabetes", "Hypertension", "Obesity"
  ],
  "🇬🇧 Life in UK": [
    "Big Ben", "Double Decker Bus", "Fish and Chips", "London Eye", "Tube", "Afternoon Tea", "Buckingham Palace", "Stonehenge", "Heathrow", "Red Phone Box", "Premier League", "Oxford Street", "Wembley Stadium", "Royal Mail", "Tower Bridge", "Westminster Abbey", "Houses of Parliament", "Trafalgar Square", "Piccadilly Circus", "Covent Garden", "Camden Market", "Notting Hill", "Hyde Park", "Regent's Park", "Greenwich Meantime", "Cutty Sark", "O2 Arena", "The Shard", "The Gherkin", "St Paul's Cathedral", "Natural History Museum", "British Museum", "V&A Museum", "Science Museum", "Tate Modern", "Tate Britain", "National Gallery", "Southbank", "Canary Wharf", "City of London", "Square Mile", "West End", "East End", "Cockney Accent", "British Pub", "Pint of Lager", "English Breakfast", "Sunday Roast", "Shepherd's Pie", "Cottage Pie", "Bangers and Mash", "Scones", "Clotted Cream", "Earl Grey Tea", "Yorkshire Tea", "Waitrose", "Marks & Spencer", "Tesco", "Sainsbury's", "ASDA", "Morrisons", "Black Cab", "Boris Bike", "National Rail", "Eurostar", "Windermere", "Lake District", "The Cotswolds", "Peak District"
  ],
  "☕ Java Programming": [
    "JVM", "Spring Boot", "Garbage Collection", "Hibernate", "Multithreading", "Interface", "Inheritance", "Maven", "Gradle", "Reflection", "Stream API", "Lambda Expression", "Polymorphism", "Encapsulation", "Abstraction", "Class", "Object", "Method", "Constructor", "Overloading", "Overriding", "Static Keyword", "Final Keyword", "Finally Block", "Abstract Class", "Java Package", "Access Modifier", "Private Modifier", "Protected Modifier", "Thread Class", "Runnable Interface", "Callable Interface", "Future Task", "Executor Service", "Reentrant Lock", "Synchronized Block", "Volatile Keyword", "Atomic Integer", "Concurrent HashMap", "ArrayList", "LinkedList", "HashSet", "TreeSet", "HashMap", "TreeMap", "LinkedHashMap", "Java Exception", "RuntimeException", "Try-Catch Block", "JDBC", "JPA Entity", "Spring Repository", "REST Controller", "Spring Bean", "Dependency Injection"
  ],
  "🏃 Agile Methodology": [
    "Scrum Framework", "Kanban Board", "Sprint Cycle", "Product Backlog", "Daily Standup", "Sprint Retrospective", "User Story", "Product Owner", "Scrum Master", "Team Velocity", "Burndown Chart", "Sprint Planning", "Story Points", "Planning Poker", "Definition of Done", "Acceptance Criteria", "Epic Story", "Agile Task", "Sub-task", "Impediment", "Blocker", "Burnup Chart", "Cumulative Flow", "Lead Time", "Cycle Time", "WIP Limit", "Lean Startup", "XP Programming", "Pair Programming", "Test Driven Development", "Behavior Driven Development", "Continuous Integration", "Continuous Deployment", "DevOps Culture", "Agile Spike", "Refactoring", "Technical Debt", "Agile Manifesto", "Self-Organizing Team", "Cross-Functional Team"
  ],
  "🎭 Movie Characters (Tam)": [
    "Baashha", "Chitti", "Anniyan", "Velu Nayakan", "Kattappa", "Vikram", "Leo Das", "Rolex", "Amar", "Jailer Muthuvel Pandian", "Pushpa Raj", "Virumandi", "Kokki Kumar", "Assault Sethu", "Vedha", "Vinayak Mahadev", "Varun Doctor", "Beast Raghavan", "Abdul Khaliq", "Maara", "Chandru", "Vikram Aditya", "Arunmozhi Varman", "Aditya Karikalan", "Vandiyathevan", "Nandini", "Kundavai", "Periya Pazhuvettarayar", "Alwarkadiyan Nambi", "Dilli", "Durai Singam", "Aaru", "Ghajini", "Velu", "Samy", "Ambi", "Remo", "Kasi", "Thirumalai", "Ghilli", "Pokkiri", "Mankatha", "Billa", "Thuppakki", "Kaththi", "Sarkar", "Master JD"
  ],
  "📍 Places in Kerala": [
    "Munnar", "Alleppey", "Wayanad", "Kochi", "Varkala", "Thekkady", "Kumarakom", "Wayanad Churam", "Athirappilly", "Bekal Fort", "Kovalam", "Sabarimala", "Idukki Dam", "Silent Valley", "Ponmudi", "Gavi", "Nelliyampathy", "Vagamon", "Marari Beach", "Cherai Beach", "Fort Kochi", "Mattancherry", "Jew Town", "Bolgatty Palace", "Willingdon Island", "Marine Drive", "Lulu Mall", "Hill Palace", "Chottanikkara Temple", "Guruvayur Temple", "Padmanabhaswamy Temple", "Napier Museum", "Thiruvananthapuram Zoo", "Kanakakkunnu Palace", "Veli Tourist Village", "Shangumugham Beach", "Neyyar Dam", "Agasthyakoodam", "Peppara Dam", "Thenmala", "Palaruvi Falls", "Jatayu Earth Center", "Ashtamudi Lake", "Munroe Island", "Kollam Beach", "Thangassery Lighthouse", "Amritapuri", "Alumkadavu", "Pathanamthitta", "Gavi Tiger Reserve", "Perunthenaruvi Falls", "Aranmula", "Konni Elephant Cage", "Sabari Hills", "Pandalam Palace", "Alappuzha Backwaters", "Punnamada Lake", "Vembanad Lake", "Kuttanad", "Pathiramanal Island", "Krishnapuram Palace", "Mannarshala Temple", "Ambalappuzha Temple", "Arthunkal Church", "Kumarakom Sanctuary", "Illikkal Kallu", "Marmala Waterfall", "Wagamon Meadows"
  ],
  "🏏 Indian Cricket": [
    "Sachin Tendulkar", "MS Dhoni", "Virat Kohli", "Kapil Dev", "Lord's Cricket Ground", "IPL T20", "World Cup 2011", "Border Gavaskar Trophy", "Wankhede Stadium", "Eden Gardens", "Rohit Sharma", "Jasprit Bumrah", "Chepauk Stadium", "T20 World Cup", "Hardik Pandya", "Sunil Gavaskar", "Rahul Dravid", "Sourav Ganguly", "Anil Kumble", "VVS Laxman", "Virender Sehwag", "Yuvraj Singh", "Zaheer Khan", "Harbhajan Singh", "Gautam Gambhir", "Suresh Raina", "Shikhar Dhawan", "Ravichandran Ashwin", "Ravindra Jadeja", "Mohammed Shami", "Bhuvneshwar Kumar", "KL Rahul", "Rishabh Pant", "Shreyas Iyer", "Shubman Gill"
  ],
  "📚 Kerala PSC": [
    "Secretariat", "PSC Chairman", "LDC Exam", "VEO", "KAS", "Thiruvananthapuram", "Indian Constitution", "General Knowledge", "Malayalam Grammar", "Quantitative Aptitude", "PSC Syllabus", "Hall Ticket", "OMR Sheet", "Rank List", "PSC Verification", "Village Office", "Panchayat Office", "Block Office", "Taluk Office", "Collectorate", "Revenue Department", "Police Force", "Health Department", "Education Board", "Forest Department", "Excise Force", "Registration Office", "State Treasury", "PWD Department", "Irrigation Department", "Agriculture Office", "Animal Husbandry", "Fisheries Department", "Labour Department", "Social Justice", "SC Development", "ST Development", "BC Development", "Minority Welfare", "Medical Education", "Technical Education", "Higher Education", "PSC Profile", "One Time Registration", "PSC Confirmation", "Admission Ticket", "Answer Key", "Short List", "Main List", "Supplementary List", "Probability List", "Advice Memo", "Appointment Order", "Joining Duty", "Probation Period", "Annual Increment", "Commuted Leave", "Statutory Pension", "Service Book", "KSR Rules"
  ]
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('SETUP_PLAYERS');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(TOPICS_DATA[0].id);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === 'SETUP_PLAYERS') {
      inputRef.current?.focus();
    }
  }, [phase]);

  // Update background color based on current player
  useEffect(() => {
    if (players.length > 0 && (phase === 'PASSING' || phase === 'REVEALING')) {
      const activePlayer = players[currentPlayerIndex];
      document.body.style.setProperty('--bg-gradient', `linear-gradient(180deg, ${activePlayer.color} 0%, #1C1B21 100%)`);
      document.body.style.setProperty('--grid-color', 'rgba(255, 255, 255, 0.2)');
    } else {
      document.body.style.setProperty('--bg-gradient', 'linear-gradient(180deg, #FF456A 0%, #FF1F4B 100%)');
      document.body.style.setProperty('--grid-color', 'rgba(255, 255, 255, 0.1)');
    }
  }, [phase, currentPlayerIndex, players]);

  const addPlayer = () => {
    if (newName.trim() && playerNames.length < 10 && !playerNames.includes(newName.trim())) {
      setPlayerNames([...playerNames, newName.trim()]);
      setNewName('');
      // Use setTimeout to ensure focus stays after state update
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const removePlayer = (name: string) => {
    setPlayerNames(playerNames.filter(n => n !== name));
  };

  const startGame = () => {
    const topicWords = TOPICS_WORDS[selectedTopic];
    const randomWord = topicWords[Math.floor(Math.random() * topicWords.length)];
    const kallanIndex = Math.floor(Math.random() * playerNames.length);

    const gamePlayers: Player[] = playerNames.map((name, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      word: index === kallanIndex ? 'KALLAN' : randomWord,
      isKallan: index === kallanIndex,
      color: ANIME_COLORS[Math.floor(Math.random() * ANIME_COLORS.length)]
    }));

    setPlayers(gamePlayers);
    setCurrentPlayerIndex(0);
    setPhase('PASSING');
  };

  const nextAction = () => {
    if (phase === 'PASSING') {
      setPhase('REVEALING');
      setIsRevealed(false);
    } else if (phase === 'REVEALING') {
      if (currentPlayerIndex < players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
        setPhase('PASSING');
      } else {
        setIsRevealed(false);
        setPhase('END');
      }
    }
  };

  const resetGame = () => {
    setPhase('SETUP_PLAYERS');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
  };

  return (
    <div id="root">
      <AnimatePresence mode="wait">
        {phase === 'SETUP_PLAYERS' && (
          <motion.div
            key="setup_players"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <img
              src="/logo.png"
              alt="Kallan Logo"
              className="app-logo"
            />
            <div className="header">
              <button className="icon-btn"><Users size={24} /></button>
              <h1>Players</h1>
              <button className="icon-btn"><Settings size={24} /></button>
            </div>

            <div className="player-list">
              {playerNames.map((name) => (
                <motion.div
                  layout
                  key={name}
                  className="player-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span>{name}</span>
                  <X
                    size={24}
                    onClick={() => removePlayer(name)}
                    style={{ cursor: 'pointer', opacity: 0.6 }}
                  />
                </motion.div>
              ))}
            </div>

            <div className="input-container">
              <input
                ref={inputRef}
                className="player-input"
                placeholder="Enter player name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <button className="add-btn" onClick={addPlayer}>
                <UserPlus size={24} />
              </button>
            </div>

            <div className="bottom-action">
              <button
                className="action-main"
                disabled={playerNames.length < 3}
                onClick={() => setPhase('SETUP_CATEGORY')}
              >
                Continue
              </button>
              <div className="action-divider"></div>
              <div className="action-info">
                {playerNames.length} Players
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'SETUP_CATEGORY' && (
          <motion.div
            key="setup_category"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="header">
              <button className="icon-btn" onClick={() => setPhase('SETUP_PLAYERS')}><ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} /></button>
              <h1>Categories</h1>
              <button className="icon-btn"><Info size={24} /></button>
            </div>

            <div className="category-list">
              {TOPICS_DATA.map((topic) => (
                <div
                  key={topic.id}
                  className={`category-card ${selectedTopic === topic.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <div className="category-info">
                    <h2>{topic.title}</h2>
                    <p>{topic.description}</p>
                  </div>
                  <div style={{ fontSize: '48px' }} className="category-image">
                    {topic.emoji}
                  </div>
                </div>
              ))}
            </div>

            <div className="bottom-action">
              <button className="action-main" onClick={startGame}>
                Play
              </button>
              <div className="action-divider"></div>
              <div className="action-info">
                1 Category
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'PASSING' && (
          <motion.div
            key="passing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="game-card"
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📱</div>
            <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Pass Device</h2>
            <p style={{ opacity: 0.6, marginBottom: '30px' }}>Give it to...</p>
            <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary)', marginBottom: '40px' }}>
              {players[currentPlayerIndex].name}
            </div>
            <button className="btn btn-primary" onClick={nextAction} style={{ width: '100%' }}>
              I am {players[currentPlayerIndex].name}
            </button>
          </motion.div>
        )}

        {phase === 'REVEALING' && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="game-card"
          >
            <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>
              SECRET FOR {players[currentPlayerIndex].name.toUpperCase()}
            </div>
            <p style={{ opacity: 0.6, marginBottom: '20px' }}>Tap below to see your role</p>

            <div
              className="reveal-box"
              onClick={() => setIsRevealed(true)}
            >
              {isRevealed ? (
                players[currentPlayerIndex].isKallan ? (
                  <span className="kallan-text">KALLAN 🕵️‍♂️</span>
                ) : (
                  <span style={{ fontSize: '32px', fontWeight: 800 }}>{players[currentPlayerIndex].word}</span>
                )
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.5 }}>
                  <Fingerprint size={48} />
                  <span style={{ marginTop: '10px' }}>TAP TO REVEAL</span>
                </div>
              )}
            </div>

            {isRevealed && (
              <button className="btn btn-primary" onClick={nextAction} style={{ width: '100%', marginTop: '20px' }}>
                Got it!
              </button>
            )}
          </motion.div>
        )}

        {phase === 'END' && (
          <motion.div
            key="end"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="game-card"
          >
            <h1 style={{ marginBottom: '10px' }}>Who is Kallan?</h1>
            <p style={{ opacity: 0.6, marginBottom: '30px' }}>Discuss and vote!</p>

            <div
              className="reveal-box"
              style={{ height: '120px' }}
              onClick={() => {
                setIsRevealed(true);
                confetti({
                  particleCount: 150,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }}
            >
              {isRevealed ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', opacity: 0.6 }}>KALLAN WAS</div>
                  <div className="kallan-text" style={{ fontSize: '32px' }}>{players.find(p => p.isKallan)?.name}</div>
                  <div style={{ fontSize: '18px', marginTop: '10px' }}>Word: {players.find(p => !p.isKallan)?.word}</div>
                </div>
              ) : (
                <span>TAP TO REVEAL IDENTITY</span>
              )}
            </div>

            {isRevealed && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="btn btn-primary"
                onClick={resetGame}
                style={{ width: '100%' }}
              >
                <RefreshCw size={20} style={{ marginRight: '10px' }} /> Play Again
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
