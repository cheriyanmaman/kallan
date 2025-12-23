import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Play, ChevronRight, User, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

type GamePhase = 'SETUP' | 'PASSING' | 'REVEALING' | 'END';

interface Player {
  id: string;
  name: string;
  word: string;
  isKallan: boolean;
}

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
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState("🎬 Malayalam Cinema");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const addPlayer = () => {
    if (newName.trim() && !playerNames.includes(newName.trim())) {
      setPlayerNames([...playerNames, newName.trim()]);
      setNewName('');
    }
  };

  const removePlayer = (name: string) => {
    setPlayerNames(playerNames.filter(n => n !== name));
  };

  const startGame = () => {
    const words = TOPICS_WORDS[selectedTopic];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const kallanIndex = Math.floor(Math.random() * playerNames.length);

    const gamePlayers: Player[] = playerNames.map((name, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      word: index === kallanIndex ? 'KALLAN' : randomWord,
      isKallan: index === kallanIndex
    }));

    setPlayers(gamePlayers);
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
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
    setPhase('SETUP');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
  };

  return (
    <div className="container">
      <AnimatePresence mode="wait">
        {phase === 'SETUP' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="card"
          >
            <img
              src="/logo.png"
              alt="Kallan Logo"
              className="app-logo"
            />
            <h1>KALLAN</h1>

            {(/iPhone|iPad|iPod/i.test(navigator.userAgent)) && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '20px' }}>
                Tap <span style={{ color: 'var(--primary)' }}>Share</span> then <span style={{ color: 'var(--primary)' }}>Add to Home Screen</span> for the full experience! 📱
              </div>
            )}

            <div className="input-group">
              <label className="label">Select Topic</label>
              <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                {Object.keys(TOPICS_WORDS).map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="label">Add Crew members ({playerNames.length}/10)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary glow-primary"
                  style={{ width: 'auto' }}
                  onClick={addPlayer}
                >
                  <UserPlus size={20} />
                </motion.button>
              </div>
            </div>

            <motion.div
              layout
              style={{ margin: '20px 0', minHeight: '80px', display: 'flex', flexWrap: 'wrap' }}
            >
              <AnimatePresence>
                {playerNames.map((name, i) => (
                  <motion.span
                    key={name}
                    layout
                    initial={{ opacity: 0, scale: 0.5, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className="player-tag"
                  >
                    👤 {name}
                    <button onClick={() => removePlayer(name)}>&times;</button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary glow-primary"
              disabled={playerNames.length < 3}
              onClick={startGame}
            >
              <Play size={20} fill="currentColor" /> Let's Play!
            </motion.button>
          </motion.div>
        )}

        {phase === 'PASSING' && (
          <motion.div
            key="passing"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="card pass-device"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <User size={80} color="var(--primary)" />
            </motion.div>
            <h2>Pass the phone to</h2>
            <div className="name-badge">{players[currentPlayerIndex].name}</div>
            <motion.button
              whileHover={{ x: 5 }}
              className="btn btn-primary glow-primary"
              onClick={nextAction}
            >
              I am {players[currentPlayerIndex].name} <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}

        {phase === 'REVEALING' && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="card pass-device"
          >
            <div style={{ fontSize: '32px' }}>🔒</div>
            <h2>Secret Word for {players[currentPlayerIndex].name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Ensure no one else is looking!</p>

            <motion.div
              className={`reveal-box ${isRevealed ? 'active' : ''}`}
              onClick={() => setIsRevealed(true)}
              whileTap={{ scale: 0.95 }}
            >
              {isRevealed ? (
                players[currentPlayerIndex].isKallan ? (
                  <motion.span
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="kallan-text"
                  >
                    KALLAN 🕵️‍♂️
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    {players[currentPlayerIndex].word}
                  </motion.span>
                )
              ) : (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <AlertCircle size={64} />
                  <div style={{ fontSize: '14px', marginTop: '10px' }}>Tap to Reveal</div>
                </motion.div>
              )}
            </motion.div>

            {isRevealed && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="btn btn-primary"
                onClick={nextAction}
              >
                Got it! <CheckCircle2 size={20} />
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'END' && (
          <motion.div
            key="end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card pass-device"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ fontSize: '80px' }}
            >
              🕵️‍♂️
            </motion.div>
            <h1>Who is Kallan?</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Discuss and cast your votes!
            </p>

            <div className="input-group" style={{ width: '100%' }}>
              <label className="label">The secret was:</label>
              <motion.div
                className={`reveal-box ${isRevealed ? 'active' : ''}`}
                style={{ height: '100px', fontSize: '28px', margin: '0' }}
                onClick={() => setIsRevealed(true)}
                whileTap={{ scale: 0.95 }}
              >
                {isRevealed ? (
                  <span>✨ {players.find(p => !p.isKallan)?.word}</span>
                ) : (
                  <span style={{ fontSize: '16px', opacity: 0.6 }}>Tap to reveal word & Kallan</span>
                )}
              </motion.div>
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 59, 48, 0.1)', borderRadius: '16px', border: '1px solid rgba(255, 59, 48, 0.2)' }}
                  >
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase' }}>The Impostor</div>
                    <div className="kallan-text" style={{ fontSize: '32px' }}>{players.find(p => p.isKallan)?.name}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isRevealed && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="btn btn-secondary"
                onClick={resetGame}
                style={{ marginTop: '20px' }}
              >
                <RefreshCw size={20} /> Play Again
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
