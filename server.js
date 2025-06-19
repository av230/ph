// // server.js - מערכת התראות חכמה עם API אמיתי של כל רגע
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');
// const fs = require('fs');
// const axios = require('axios');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// const PORT = process.env.PORT || 3000;

// // נתוני ערים וזמני הגעה לממ"ד
// const cityData = {
//     'בני ברק': { zone: 'דן', shelterTime: 90, area: 164 },
//     'תל אביב': { zone: 'דן', shelterTime: 90, area: 102 },
//     'ירושלים': { zone: 'ירושלים', shelterTime: 90, area: 201 },
//     'חיפה': { zone: 'חיפה והכרמל', shelterTime: 60, area: 394 },
//     'אשדוד': { zone: 'אשקלון והסביבה', shelterTime: 30, area: 1031 },
//     'אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 30, area: 1035 },
//     'באר שבע': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1200 },
//     'נתניה': { zone: 'שרון', shelterTime: 45, area: 1081 },
//     'חולון': { zone: 'דן', shelterTime: 90, area: 107 },
//     'רמת גן': { zone: 'דן', shelterTime: 90, area: 106 },
//     'פתח תקווה': { zone: 'דן', shelterTime: 90, area: 109 },
//     'ראשון לציון': { zone: 'דן', shelterTime: 90, area: 104 },
//     'רעננה': { zone: 'שרון', shelterTime: 90, area: 1082 },
//     'כפר סבא': { zone: 'שרון', shelterTime: 90, area: 1084 },
//     'עפולה': { zone: 'עמק יזרעאל', shelterTime: 60, area: 77 },
//     'נצרת': { zone: 'עמק יזרעאל', shelterTime: 60, area: 78 },
//     'טבריה': { zone: 'כינרת', shelterTime: 60, area: 79 },
//     'צפת': { zone: 'גליל עליון', shelterTime: 60, area: 133 },
//     'אילת': { zone: 'אילת', shelterTime: 180, area: 88 },
//     'מודיעין': { zone: 'מודיעין', shelterTime: 90, area: 1166 },
//     'כרמיאל': { zone: 'גליל מערבי', shelterTime: 60, area: 134 },
//     'מעלות': { zone: 'גליל מערבי', shelterTime: 60, area: 135 },
//     'נהריה': { zone: 'גליל מערבי', shelterTime: 60, area: 136 },
//     'עכו': { zone: 'גליל מערבי', shelterTime: 60, area: 137 },
//     'קרית שמונה': { zone: 'גליל עליון', shelterTime: 30, area: 138 },
//     'מטולה': { zone: 'גליל עליון', shelterTime: 15, area: 139 },
//     'קצרין': { zone: 'גולן', shelterTime: 60, area: 140 },
//     'אריאל': { zone: 'שומרון', shelterTime: 90, area: 141 },
//     'מעלה אדומים': { zone: 'ירושלים', shelterTime: 90, area: 142 },
//     'בית שמש': { zone: 'ירושלים', shelterTime: 90, area: 143 }
// };

// // משתנים גלובליים
// let alertHistory = [];
// let lastAlert = null;
// let lastAlertId = null;
// let connectedUsers = new Map();
// let isLiveMode = true;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));

// // API Routes
// app.get('/api/cities', (req, res) => {
//     res.json(Object.keys(cityData).sort());
// });

// app.get('/api/city/:name', (req, res) => {
//     const cityName = decodeURIComponent(req.params.name);
//     const city = cityData[cityName];
//     if (city) {
//         res.json({ name: cityName, ...city });
//     } else {
//         res.status(404).json({ error: 'עיר לא נמצאה' });
//     }
// });

// app.get('/api/alerts/current', (req, res) => {
//     res.json({ 
//         alert: lastAlert,
//         timestamp: new Date().toISOString(),
//         mode: isLiveMode ? 'live' : 'simulation'
//     });
// });

// app.get('/api/alerts/history/:city?', (req, res) => {
//     const city = req.params.city;
//     let history = alertHistory;
    
//     if (city) {
//         const decodedCity = decodeURIComponent(city);
//         history = alertHistory.filter(alert => 
//             alert.cities && alert.cities.includes(decodedCity)
//         );
//     }
    
//     res.json(history.slice(0, 50));
// });

// app.get('/api/status', (req, res) => {
//     res.json({
//         status: 'running',
//         mode: isLiveMode ? 'live' : 'simulation',
//         connectedUsers: connectedUsers.size,
//         lastAlert: lastAlert,
//         uptime: process.uptime(),
//         alertCount: alertHistory.length
//     });
// });

// // WebSocket חיבורים
// io.on('connection', (socket) => {
//     console.log(`🔗 משתמש חדש התחבר: ${socket.id}`);
    
//     socket.emit('connection-status', {
//         connected: true,
//         mode: isLiveMode ? 'live' : 'simulation',
//         serverTime: new Date().toISOString()
//     });
    
//     socket.on('register-city', (cityName) => {
//         console.log(`📍 משתמש ${socket.id} נרשם לעיר: ${cityName}`);
//         connectedUsers.set(socket.id, { 
//             cityName, 
//             connectedAt: new Date(),
//             lastSeen: new Date()
//         });
        
//         if (lastAlert) {
//             socket.emit('alert-update', lastAlert);
//         }
        
//         const cityHistory = alertHistory.filter(alert => 
//             !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
//         ).slice(0, 20);
        
//         socket.emit('history-update', cityHistory);
//     });
    
//     socket.on('get-history', (cityName) => {
//         const cityHistory = alertHistory.filter(alert => 
//             !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
//         ).slice(0, 20);
        
//         socket.emit('history-update', cityHistory);
//     });
    
//     socket.on('disconnect', () => {
//         console.log(`❌ משתמש ${socket.id} התנתק`);
//         connectedUsers.delete(socket.id);
//     });
// });

// // פונקציות מיפוי והמרה
// function mapAlertTypeFromKore(koreAlert) {
//     if (!koreAlert || !koreAlert.title) {
//         return {
//             type: 'safe',
//             title: 'מצב רגיל',
//             icon: '✅',
//             description: 'אין התראות פעילות כרגע',
//             severity: 'low',
//             class: 'safe'
//         };
//     }
    
//     const title = koreAlert.title.toLowerCase();
    
//     if (title.includes('רקטות') || title.includes('טילים') || title.includes('ירי')) {
//         return {
//             type: 'shelter',
//             title: 'היכנסו לממ"ד מיידית!',
//             icon: '🚨',
//             description: `${koreAlert.title} - ${koreAlert.desc}`,
//             severity: 'high',
//             class: 'danger'
//         };
//     } else if (title.includes('התראה') || title.includes('חירום')) {
//         return {
//             type: 'early-warning',
//             title: 'התראה מוקדמת',
//             icon: '⚠️',
//             description: `${koreAlert.title} - ${koreAlert.desc}`,
//             severity: 'medium',
//             class: 'warning'
//         };
//     } else if (title.includes('תרגיל')) {
//         return {
//             type: 'drill',
//             title: 'תרגיל',
//             icon: '🎯',
//             description: `${koreAlert.title} - ${koreAlert.desc}`,
//             severity: 'medium',
//             class: 'warning'
//         };
//     } else {
//         return {
//             type: 'unknown',
//             title: koreAlert.title,
//             icon: '❓',
//             description: koreAlert.desc || 'פעלו לפי הנחיות הרשויות',
//             severity: 'medium',
//             class: 'warning'
//         };
//     }
// }

// function getCityMatchesFromAlert(alertCities) {
//     const matches = [];
//     const alertCitiesLower = alertCities.map(city => city.toLowerCase());
    
//     // חיפוש התאמות מדוייקות
//     Object.keys(cityData).forEach(ourCity => {
//         const ourCityLower = ourCity.toLowerCase();
        
//         // התאמה מדוייקת
//         if (alertCitiesLower.includes(ourCityLower)) {
//             matches.push(ourCity);
//             return;
//         }
        
//         // התאמה חלקית
//         for (const alertCity of alertCitiesLower) {
//             if (alertCity.includes(ourCityLower) || ourCityLower.includes(alertCity)) {
//                 matches.push(ourCity);
//                 break;
//             }
//         }
//     });
    
//     return [...new Set(matches)]; // הסר כפילויות
// }

// // פונקציות התראות
// function notifyRelevantUsers(alert) {
//     if (!alert.cities || alert.cities.length === 0) {
//         io.emit('alert-update', alert);
//         console.log(`📢 שולח התראה כללית ל-${connectedUsers.size} משתמשים`);
//         return;
//     }
    
//     connectedUsers.forEach((userData, socketId) => {
//         if (alert.cities.includes(userData.cityName)) {
//             const socket = io.sockets.sockets.get(socketId);
//             if (socket) {
//                 socket.emit('alert-update', alert);
//                 console.log(`📱 שולח התראה למשתמש ${socketId} בעיר ${userData.cityName}`);
//             }
//         }
//     });
// }

// function saveToHistory(alert) {
//     const historyEntry = {
//         ...alert,
//         id: Date.now() + Math.random(),
//         timestamp: new Date().toISOString(),
//         hebrewTime: new Date().toLocaleString('he-IL', {
//             timeZone: 'Asia/Jerusalem',
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit'
//         })
//     };
    
//     alertHistory.unshift(historyEntry);
    
//     if (alertHistory.length > 500) {
//         alertHistory = alertHistory.slice(0, 500);
//     }
    
//     try {
//         fs.writeFileSync('alert_history.json', JSON.stringify(alertHistory, null, 2));
//     } catch (error) {
//         console.warn('לא ניתן לשמור היסטוריה:', error.message);
//     }
// }

// // פונקציה לבדיקת התראות מ-API של כל רגע
// async function checkKoreAPI() {
//     try {
//         console.log('🔍 בודק התראות ב-API של כל רגע...');
        
//         const response = await axios.get('https://www.kore.co.il/redAlert.json', {
//             timeout: 10000,
//             headers: {
//                 'User-Agent': 'AlertSystem/2.0 (https://ph-7php.onrender.com)',
//                 'Accept': 'application/json'
//             }
//         });
        
//         const alertData = response.data;
        
//         if (alertData && alertData.id) {
//             console.log(`🚨 התראה פעילה מ-Kore:`, alertData);
            
//             // בדוק אם זו התראה חדשה
//             if (lastAlertId !== alertData.id) {
//                 lastAlertId = alertData.id;
                
//                 // מיפוי סוג ההתראה
//                 const categorized = mapAlertTypeFromKore(alertData);
                
//                 // מיפוי ערים
//                 const matchedCities = getCityMatchesFromAlert(alertData.data || []);
                
//                 const enrichedAlert = {
//                     ...alertData,
//                     ...categorized,
//                     cities: matchedCities.length > 0 ? matchedCities : alertData.data,
//                     originalCities: alertData.data,
//                     timestamp: new Date().toISOString(),
//                     hebrewTime: new Date().toLocaleString('he-IL', {
//                         timeZone: 'Asia/Jerusalem'
//                     }),
//                     source: 'kore-api'
//                 };
                
//                 console.log(`✅ התראה חדשה עובדה:`, {
//                     type: enrichedAlert.type,
//                     cities: enrichedAlert.cities,
//                     originalCities: enrichedAlert.originalCities
//                 });
                
//                 lastAlert = enrichedAlert;
//                 saveToHistory(enrichedAlert);
//                 notifyRelevantUsers(enrichedAlert);
                
//                 io.emit('global-status', {
//                     hasActiveAlert: true,
//                     affectedAreas: enrichedAlert.cities || [],
//                     lastUpdate: enrichedAlert.timestamp,
//                     mode: 'live'
//                 });
//             }
            
//             return true; // יש התראה פעילה
            
//         } else {
//             console.log('✅ אין התראות פעילות');
            
//             // אם הייתה התראה לפני ועכשיו אין - זה "יציאה מממ"ד"
//             if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
//                 const allClearAlert = {
//                     type: 'all-clear',
//                     title: 'יציאה מהממ"ד',
//                     icon: '🟢',
//                     description: 'הסכנה חלפה - ניתן לצאת מהחדר המוגן',
//                     severity: 'low',
//                     class: 'safe',
//                     cities: lastAlert.cities || [],
//                     timestamp: new Date().toISOString(),
//                     hebrewTime: new Date().toLocaleString('he-IL', {
//                         timeZone: 'Asia/Jerusalem'
//                     }),
//                     source: 'system'
//                 };
                
//                 console.log('🟢 יוצר התראת יציאה מממ"ד');
                
//                 lastAlert = allClearAlert;
//                 lastAlertId = null;
//                 saveToHistory(allClearAlert);
//                 notifyRelevantUsers(allClearAlert);
                
//                 io.emit('global-status', {
//                     hasActiveAlert: false,
//                     affectedAreas: [],
//                     lastUpdate: allClearAlert.timestamp,
//                     mode: 'live'
//                 });
//             }
            
//             return false; // אין התראה
//         }
        
//     } catch (error) {
//         console.error('❌ שגיאה ב-API של כל רגע:', error.message);
//         return null; // שגיאה
//     }
// }

// // מעקב אחר התראות
// function startAlertMonitoring() {
//     console.log('🚀 מתחיל מעקב אחר התראות אמיתיות...');
    
//     const monitorAlerts = async () => {
//         try {
//             const result = await checkKoreAPI();
            
//             if (result === null) {
//                 // שגיאה - נסה שוב תוך זמן קצר יותר
//                 setTimeout(monitorAlerts, 5000);
//                 return;
//             }
            
//             isLiveMode = true;
            
//         } catch (error) {
//             console.error('❌ שגיאה כללית במעקב:', error.message);
//         }
//     };
    
//     // בדיקה ראשונית
//     monitorAlerts();
    
//     // המשך מעקב כל 2 שניות (כמו בדוגמה)
//     setInterval(monitorAlerts, 2000);
    
//     console.log('⏰ מעקב כל 2 שניות באמצעות API של כל רגע');
// }

// // טעינת היסטוריה קיימת
// function loadExistingHistory() {
//     try {
//         if (fs.existsSync('alert_history.json')) {
//             const data = fs.readFileSync('alert_history.json', 'utf8');
//             alertHistory = JSON.parse(data);
//             console.log(`📚 נטענו ${alertHistory.length} רשומות היסטוריה`);
//         } else {
//             const initialAlert = {
//                 id: Date.now(),
//                 type: 'safe',
//                 title: 'מערכת התראות פעילה',
//                 icon: '✅',
//                 description: 'המערכת עלתה בהצלחה ומחוברת ל-API של כל רגע',
//                 cities: [],
//                 timestamp: new Date().toISOString(),
//                 hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//                 source: 'system'
//             };
            
//             alertHistory = [initialAlert];
//             saveToHistory(initialAlert);
//         }
//     } catch (error) {
//         console.error('❌ שגיאה בטעינת היסטוריה:', error.message);
//         alertHistory = [];
//     }
// }

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/health', (req, res) => {
//     res.json({
//         status: 'healthy',
//         uptime: process.uptime(),
//         mode: isLiveMode ? 'live' : 'offline',
//         users: connectedUsers.size,
//         alerts: alertHistory.length,
//         timestamp: new Date().toISOString(),
//         api: 'kore.co.il'
//     });
// });

// // הפעלת השרת
// function startServer() {
//     loadExistingHistory();
    
//     server.listen(PORT, () => {
//         console.log('🎉================================🎉');
//         console.log(`🚀 מערכת התראות אמיתיות פועלת!`);
//         console.log(`📡 פורט: ${PORT}`);
//         console.log(`🌐 כתובת: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
//         console.log(`🔗 API: kore.co.il (אמיתי)`);
//         console.log(`👥 משתמשים: ${connectedUsers.size}`);
//         console.log(`📚 היסטוריה: ${alertHistory.length} רשומות`);
//         console.log('🎉================================🎉');
        
//         startAlertMonitoring();
//     });
// }

// // טיפול בסגירה נקיה
// process.on('SIGINT', () => {
//     console.log('\n🛑 סוגר שרת...');
//     server.close(() => {
//         console.log('✅ שרת נסגר בהצלחה');
//         process.exit(0);
//     });
// });

// process.on('SIGTERM', () => {
//     console.log('🛑 קיבל SIGTERM, סוגר שרת...');
//     server.close(() => {
//         console.log('✅ שרת נסגר בהצלחה');
//         process.exit(0);
//     });
// });

// startServer();

// module.exports = app;
// server.js - מערכת התראות חכמה עם כל השיפורים המתקדמים
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// נתוני ערים מעודכנים
const cityData = {
    'בני ברק': { zone: 'דן', shelterTime: 90, area: 164 },
    'תל אביב': { zone: 'דן', shelterTime: 90, area: 102 },
    'ירושלים': { zone: 'ירושלים', shelterTime: 90, area: 201 },
    'חיפה': { zone: 'חיפה והכרמל', shelterTime: 60, area: 394 },
    'אשדוד': { zone: 'אשקלון והסביבה', shelterTime: 30, area: 1031 },
    'אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 30, area: 1035 },
    'באר שבע': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1200 },
    'נתניה': { zone: 'שרון', shelterTime: 45, area: 1081 },
    'חולון': { zone: 'דן', shelterTime: 90, area: 107 },
    'רמת גן': { zone: 'דן', shelterTime: 90, area: 106 },
    'פתח תקווה': { zone: 'דן', shelterTime: 90, area: 109 },
    'ראשון לציון': { zone: 'דן', shelterTime: 90, area: 104 },
    'רעננה': { zone: 'שרון', shelterTime: 90, area: 1082 },
    'כפר סבא': { zone: 'שרון', shelterTime: 90, area: 1084 },
    'עפולה': { zone: 'עמק יזרעאל', shelterTime: 60, area: 77 },
    'נצרת': { zone: 'עמק יזרעאל', shelterTime: 60, area: 78 },
    'טבריה': { zone: 'כינרת', shelterTime: 60, area: 79 },
    'צפת': { zone: 'גליל עליון', shelterTime: 60, area: 133 },
    'אילת': { zone: 'אילת', shelterTime: 180, area: 88 },
    'מודיעין': { zone: 'מודיעין', shelterTime: 90, area: 1166 },
    'כרמיאל': { zone: 'גליל מערבי', shelterTime: 60, area: 134 },
    'מעלות': { zone: 'גליל מערבי', shelterTime: 60, area: 135 },
    'נהריה': { zone: 'גליל מערבי', shelterTime: 60, area: 136 },
    'עכו': { zone: 'גליל מערבי', shelterTime: 60, area: 137 },
    'קרית שמונה': { zone: 'גליל עליון', shelterTime: 30, area: 138 },
    'מטולה': { zone: 'גליל עליון', shelterTime: 15, area: 139 },
    'קצרין': { zone: 'גולן', shelterTime: 60, area: 140 },
    'אריאל': { zone: 'שומרון', shelterTime: 90, area: 141 },
    'מעלה אדומים': { zone: 'ירושלים', shelterTime: 90, area: 142 },
    'בית שמש': { zone: 'ירושלים', shelterTime: 90, area: 143 }
};

// מילון קיצורים וכינויים לערים
const cityAliases = {
    'ת"א': 'תל אביב',
    'תא': 'תל אביב',
    'ירושלים': ['ירושלים', 'מעלה אדומים', 'בית שמש'],
    'ב"ש': 'באר שבע',
    'בש': 'באר שבע',
    'ק"ש': 'קרית שמונה',
    'קש': 'קרית שמונה',
    'פ"ת': 'פתח תקווה',
    'פת': 'פתח תקווה',
    'ר"ג': 'רמת גן',
    'רג': 'רמת גן'
};

// משתנים גלובליים
let alertHistory = [];
let lastAlert = null;
let lastAlertId = null;
let connectedUsers = new Map();
let isLiveMode = true;

// Cache ו-Health Monitoring
const alertCache = new Map();
const CACHE_DURATION = 30000; // 30 שניות
let apiHealthStatus = {
    kore: { lastSuccess: null, failures: 0 },
    oref: { lastSuccess: null, failures: 0 }
};

// Rate Limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // דקה
const MAX_REQUESTS_PER_WINDOW = 100;

// Middleware מתקדם
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'", "wss:", "https:"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:"]
        }
    }
}));

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate Limiting Middleware
app.use((req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(clientIP)) {
        requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
        const clientData = requestCounts.get(clientIP);
        
        if (now > clientData.resetTime) {
            clientData.count = 1;
            clientData.resetTime = now + RATE_LIMIT_WINDOW;
        } else {
            clientData.count++;
        }
        
        if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
            return res.status(429).json({ 
                error: 'יותר מדי בקשות, נסה שוב בעוד דקה',
                retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
            });
        }
    }
    
    next();
});

// פונקציות לוגים משופרות
function formatLogMessage(level, source, message, data = null) {
    const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        debug: '🔍'
    };
    
    let logMsg = `${icons[level] || '📝'} [${timestamp}] ${source}: ${message}`;
    if (data) {
        logMsg += ` | ${JSON.stringify(data)}`;
    }
    
    console.log(logMsg);
}

// פונקציות דמיון מחרוזות
function levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
        Array(str1.length + 1).fill(null)
    );
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }
    
    return matrix[str2.length][str1.length];
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
}

// זיהוי ערים משופר עם Fuzzy Matching
function getCityMatchesFromAlert(alertCities) {
    const matches = [];
    const alertCitiesLower = (alertCities || []).map(city => city.toLowerCase().trim());
    
    Object.keys(cityData).forEach(ourCity => {
        const ourCityLower = ourCity.toLowerCase();
        
        // בדיקה מדוייקת
        if (alertCitiesLower.includes(ourCityLower)) {
            matches.push(ourCity);
            return;
        }
        
        // בדיקה עם קיצורים
        for (const [alias, fullName] of Object.entries(cityAliases)) {
            if (typeof fullName === 'string' && fullName === ourCity) {
                if (alertCitiesLower.includes(alias.toLowerCase())) {
                    matches.push(ourCity);
                    return;
                }
            } else if (Array.isArray(fullName) && fullName.includes(ourCity)) {
                if (alertCitiesLower.includes(alias.toLowerCase())) {
                    matches.push(ourCity);
                    return;
                }
            }
        }
        
        // Fuzzy matching - דמיון חלקי
        for (const alertCity of alertCitiesLower) {
            const similarity = calculateSimilarity(alertCity, ourCityLower);
            if (similarity > 0.8) { // 80% דמיון
                matches.push(ourCity);
                formatLogMessage('debug', 'FuzzyMatch', `התאמה: ${alertCity} -> ${ourCity} (${Math.round(similarity * 100)}%)`);
                break;
            }
        }
    });
    
    return [...new Set(matches)];
}

// API Routes
app.get('/api/cities', (req, res) => {
    res.json(Object.keys(cityData).sort());
});

app.get('/api/city/:name', (req, res) => {
    const cityName = decodeURIComponent(req.params.name);
    const city = cityData[cityName];
    if (city) {
        res.json({ name: cityName, ...city });
    } else {
        res.status(404).json({ error: 'עיר לא נמצאה' });
    }
});

app.get('/api/alerts/current', (req, res) => {
    res.json({ 
        alert: lastAlert,
        timestamp: new Date().toISOString(),
        mode: isLiveMode ? 'live' : 'simulation'
    });
});

app.get('/api/alerts/history/:city?', async (req, res) => {
    const city = req.params.city ? decodeURIComponent(req.params.city) : null;
    
    if (city) {
        try {
            formatLogMessage('info', 'History', `טוען היסטוריה עבור ${city}`);
            
            const response = await axios.get(
                `https://alerts-history.oref.org.il/Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=1&city_0=${encodeURIComponent(city)}`, 
                { timeout: 10000 }
            );
            
            const history = response.data.map(alert => ({
                ...mapAlertTypeFromKore({ title: alert.message, desc: alert.message }),
                time: alert.time,
                cities: [city],
                timestamp: new Date().toISOString(),
                hebrewTime: alert.time
            }));
            
            formatLogMessage('success', 'History', `נטענו ${history.length} רשומות עבור ${city}`);
            res.json(history.slice(0, 50));
            
        } catch (error) {
            formatLogMessage('error', 'History', `שגיאה בטעינת היסטוריה עבור ${city}`, error.message);
            res.status(500).json({ error: 'שגיאה בטעינת היסטוריה' });
        }
    } else {
        res.json(alertHistory.slice(0, 50));
    }
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        mode: isLiveMode ? 'live' : 'simulation',
        connectedUsers: connectedUsers.size,
        lastAlert: lastAlert,
        uptime: process.uptime(),
        alertCount: alertHistory.length
    });
});

// Endpoint בריאות מפורט
app.get('/api/health/detailed', (req, res) => {
    const now = Date.now();
    res.json({
        server: {
            status: 'healthy',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            connectedUsers: connectedUsers.size,
            timestamp: new Date().toISOString()
        },
        apis: {
            kore: {
                status: apiHealthStatus.kore.failures < 3 ? 'healthy' : 'degraded',
                lastSuccess: apiHealthStatus.kore.lastSuccess,
                failures: apiHealthStatus.kore.failures,
                timeSinceLastSuccess: apiHealthStatus.kore.lastSuccess ? 
                    now - apiHealthStatus.kore.lastSuccess : null
            },
            oref: {
                status: apiHealthStatus.oref.failures < 3 ? 'healthy' : 'degraded',
                lastSuccess: apiHealthStatus.oref.lastSuccess,
                failures: apiHealthStatus.oref.failures,
                timeSinceLastSuccess: apiHealthStatus.oref.lastSuccess ? 
                    now - apiHealthStatus.oref.lastSuccess : null
            }
        },
        alerts: {
            total: alertHistory.length,
            lastAlert: lastAlert,
            mode: isLiveMode ? 'live' : 'simulation',
            cacheSize: alertCache.size
        }
    });
});

// WebSocket חיבורים
io.on('connection', (socket) => {
    formatLogMessage('info', 'WebSocket', `משתמש חדש התחבר: ${socket.id}`);
    
    socket.emit('connection-status', {
        connected: true,
        mode: isLiveMode ? 'live' : 'simulation',
        serverTime: new Date().toISOString()
    });
    
    socket.on('register-city', (cityName) => {
        formatLogMessage('info', 'Registration', `משתמש ${socket.id} נרשם לעיר: ${cityName}`);
        connectedUsers.set(socket.id, { 
            cityName, 
            connectedAt: new Date(),
            lastSeen: new Date()
        });
        
        if (lastAlert) {
            socket.emit('alert-update', lastAlert);
        }
        
        const cityHistory = alertHistory.filter(alert => 
            !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
        ).slice(0, 20);
        
        socket.emit('history-update', cityHistory);
    });
    
    socket.on('get-history', (cityName) => {
        const cityHistory = alertHistory.filter(alert => 
            !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
        ).slice(0, 20);
        
        socket.emit('history-update', cityHistory);
    });
    
    socket.on('disconnect', () => {
        formatLogMessage('info', 'WebSocket', `משתמש ${socket.id} התנתק`);
        connectedUsers.delete(socket.id);
    });
});

// מיפוי סוגי התראות
function mapAlertTypeFromKore(koreAlert) {
    if (!koreAlert || !koreAlert.title) {
        return {
            type: 'safe',
            title: 'מצב רגיל',
            icon: '✅',
            description: 'אין התראות פעילות כרגע',
            severity: 'low',
            class: 'safe'
        };
    }
    
    const title = koreAlert.title.toLowerCase();
    
    if (title.includes('רקטות') || title.includes('טילים') || title.includes('ירי') || title.includes('אזעקה')) {
        return {
            type: 'shelter',
            title: 'היכנסו לממ"ד מיידית!',
            icon: '🚨',
            description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן עכשיו!'}`,
            severity: 'high',
            class: 'danger'
        };
    } else if (title.includes('התראה') || title.includes('חירום')) {
        return {
            type: 'early-warning',
            title: 'התראה מוקדמת',
            icon: '⚠️',
            description: `${koreAlert.title} - ${koreAlert.desc || 'היו מוכנים'}`,
            severity: 'medium',
            class: 'warning'
        };
    } else if (title.includes('תרגיל')) {
        return {
            type: 'drill',
            title: 'תרגיל',
            icon: '🎯',
            description: `${koreAlert.title} - ${koreAlert.desc || 'תרגיל בטחוני'}`,
            severity: 'medium',
            class: 'warning'
        };
    } else {
        return {
            type: 'all-clear',
            title: 'יציאה מהממ"ד',
            icon: '🟢',
            description: 'הסכנה חלפה - ניתן לצאת מהחדר המוגן',
            severity: 'low',
            class: 'safe'
        };
    }
}

// פונקציות התראות
function notifyRelevantUsers(alert) {
    if (!alert.cities || alert.cities.length === 0) {
        io.emit('alert-update', alert);
        formatLogMessage('info', 'Notification', `שולח התראה כללית ל-${connectedUsers.size} משתמשים`);
        return;
    }
    
    let notifiedCount = 0;
    connectedUsers.forEach((userData, socketId) => {
        if (alert.cities.includes(userData.cityName)) {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('alert-update', alert);
                notifiedCount++;
            }
        }
    });
    
    formatLogMessage('info', 'Notification', `שולח התראה ל-${notifiedCount} משתמשים בערים: ${alert.cities.join(', ')}`);
}

function saveToHistory(alert) {
    const historyEntry = {
        ...alert,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        hebrewTime: new Date().toLocaleString('he-IL', {
            timeZone: 'Asia/Jerusalem',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    };
    
    alertHistory.unshift(historyEntry);
    
    if (alertHistory.length > 500) {
        alertHistory = alertHistory.slice(0, 500);
    }
    
    try {
        fs.writeFileSync('alert_history.json', JSON.stringify(alertHistory, null, 2));
    } catch (error) {
        formatLogMessage('warning', 'Storage', 'לא ניתן לשמור היסטוריה', error.message);
    }
}

// בדיקת API עם Cache
async function checkKoreAPIWithCache() {
    const now = Date.now();
    const cached = alertCache.get('kore');
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        formatLogMessage('debug', 'Cache', 'משתמש בתוצאה מ-cache');
        return cached.data;
    }
    
    try {
        const result = await checkKoreAPI();
        alertCache.set('kore', { data: result, timestamp: now });
        return result;
    } catch (error) {
        if (cached) {
            formatLogMessage('warning', 'API', 'שגיאה ב-API, משתמש בנתונים ישנים');
            return cached.data;
        }
        throw error;
    }
}

// בדיקת API של כל רגע עם Health Monitoring
async function checkKoreAPI() {
    try {
        formatLogMessage('debug', 'KoreAPI', 'בודק התראות ב-API של כל רגע');
        
        const response = await axios.get('https://www.kore.co.il/redAlert.json', {
            timeout: 10000,
            headers: {
                'User-Agent': 'AlertSystem/2.0',
                'Accept': 'application/json'
            }
        });
        
        const alertData = response.data;
        apiHealthStatus.kore.lastSuccess = Date.now();
        apiHealthStatus.kore.failures = 0;
        
        if (alertData && alertData.id) {
            if (lastAlertId !== alertData.id) {
                lastAlertId = alertData.id;
                
                const categorized = mapAlertTypeFromKore(alertData);
                const matchedCities = getCityMatchesFromAlert(alertData.data || []);
                
                const enrichedAlert = {
                    ...alertData,
                    ...categorized,
                    cities: matchedCities.length > 0 ? matchedCities : alertData.data,
                    originalCities: alertData.data,
                    timestamp: new Date().toISOString(),
                    hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
                    source: 'kore-api'
                };
                
                formatLogMessage('success', 'KoreAPI', `התראה חדשה: ${enrichedAlert.type}`, {
                    cities: enrichedAlert.cities,
                    originalCities: enrichedAlert.originalCities
                });
                
                lastAlert = enrichedAlert;
                saveToHistory(enrichedAlert);
                notifyRelevantUsers(enrichedAlert);
                
                io.emit('global-status', {
                    hasActiveAlert: true,
                    affectedAreas: enrichedAlert.cities || [],
                    lastUpdate: enrichedAlert.timestamp,
                    mode: 'live'
                });
            }
            return true;
            
        } else {
            if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
                createAllClearAlert();
            }
            return false;
        }
        
    } catch (error) {
        apiHealthStatus.kore.failures++;
        formatLogMessage('error', 'KoreAPI', `כשל ${apiHealthStatus.kore.failures}`, error.message);
        throw error;
    }
}

// בדיקת API של פיקוד העורף
async function checkPikudHaOrefAPI() {
    try {
        formatLogMessage('debug', 'OrefAPI', 'בודק API של פיקוד העורף');
        
        const response = await axios.get('https://www.oref.org.il/WarningMessages/alerts.json', {
            timeout: 10000,
            headers: {
                'User-Agent': 'AlertSystem/2.0',
                'Accept': 'application/json'
            }
        });
        
        const alertData = response.data;
        apiHealthStatus.oref.lastSuccess = Date.now();
        apiHealthStatus.oref.failures = 0;
        
        if (alertData && alertData.data && alertData.data.length > 0) {
            const alert = alertData.data[0];
            if (lastAlertId !== alert.id) {
                lastAlertId = alert.id;
                
                const categorized = mapAlertTypeFromKore({ title: alert.title, desc: alert.message });
                const matchedCities = getCityMatchesFromAlert(alert.cities || []);
                
                const enrichedAlert = {
                    ...alert,
                    ...categorized,
                    cities: matchedCities.length > 0 ? matchedCities : alert.cities,
                    originalCities: alert.cities,
                    timestamp: new Date().toISOString(),
                    hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
                    source: 'pikud-haoref'
                };
                
                formatLogMessage('success', 'OrefAPI', `התראה חדשה: ${enrichedAlert.type}`, {
                    cities: enrichedAlert.cities
                });
                
                lastAlert = enrichedAlert;
                saveToHistory(enrichedAlert);
                notifyRelevantUsers(enrichedAlert);
                
                io.emit('global-status', {
                    hasActiveAlert: true,
                    affectedAreas: enrichedAlert.cities || [],
                    lastUpdate: enrichedAlert.timestamp,
                    mode: 'live'
                });
            }
            return true;
            
        } else {
            if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
                createAllClearAlert();
            }
            return false;
        }
        
    } catch (error) {
        apiHealthStatus.oref.failures++;
        formatLogMessage('error', 'OrefAPI', `כשל ${apiHealthStatus.oref.failures}`, error.message);
        throw error;
    }
}

// יצירת התראת יציאה מממ"ד
function createAllClearAlert() {
    const allClearAlert = {
        type: 'all-clear',
        title: 'יציאה מהממ"ד',
        icon: '🟢',
        description: 'הסכנה חלפה - ניתן לצאת מהחדר המוגן',
        severity: 'low',
        class: 'safe',
        cities: lastAlert.cities || [],
        timestamp: new Date().toISOString(),
        hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
        source: 'system'
    };
    
    formatLogMessage('info', 'System', 'יוצר התראת יציאה מממ"ד');
    
    lastAlert = allClearAlert;
    lastAlertId = null;
    saveToHistory(allClearAlert);
    notifyRelevantUsers(allClearAlert);
    
    io.emit('global-status', {
        hasActiveAlert: false,
        affectedAreas: [],
        lastUpdate: allClearAlert.timestamp,
        mode: 'live'
    });
}

// מעקב אחר התראות משופר
function startAlertMonitoring() {
    formatLogMessage('info', 'Monitor', 'מתחיל מעקב אחר התראות אמיתיות');
    
    const monitorAlerts = async () => {
        try {
            let result = await checkKoreAPIWithCache();
            
            if (result === null) {
                formatLogMessage('warning', 'Monitor', 'ניסיון חוזר עם API של פיקוד העורף');
                result = await checkPikudHaOrefAPI();
            }
            
            if (result === null) {
                formatLogMessage('error', 'Monitor', 'כל ה-APIs נכשלו, מנסה שוב בעוד 5 שניות');
                setTimeout(monitorAlerts, 5000);
                return;
            }
            
            isLiveMode = true;
            
        } catch (error) {
            formatLogMessage('error', 'Monitor', 'שגיאה כללית במעקב', error.message);
        }
    };
    
    monitorAlerts();
    setInterval(monitorAlerts, 5000);
    formatLogMessage('info', 'Monitor', 'מעקב כל 5 שניות באמצעות APIs מרובים');
}

// Heartbeat למשתמשים
function setupHeartbeat() {
    setInterval(() => {
        io.emit('heartbeat', {
            timestamp: new Date().toISOString(),
            connectedUsers: connectedUsers.size,
            serverStatus: 'healthy',
            apiStatus: {
                kore: apiHealthStatus.kore.failures < 3 ? 'healthy' : 'degraded',
                oref: apiHealthStatus.oref.failures < 3 ? 'healthy' : 'degraded'
            }
        });
        
        // ניקוי cache ישן
        const now = Date.now();
        for (const [key, value] of alertCache.entries()) {
            if (now - value.timestamp > CACHE_DURATION * 2) {
                alertCache.delete(key);
            }
        }
        
        // ניקוי rate limiting ישן
        for (const [ip, data] of requestCounts.entries()) {
            if (now > data.resetTime) {
                requestCounts.delete(ip);
            }
        }
        
    }, 30000); // כל 30 שניות
    
    formatLogMessage('info', 'Heartbeat', 'Heartbeat הופעל');
}

// טעינת היסטוריה קיימת
function loadExistingHistory() {
    try {
        if (fs.existsSync('alert_history.json')) {
            const data = fs.readFileSync('alert_history.json', 'utf8');
            alertHistory = JSON.parse(data);
            formatLogMessage('success', 'Storage', `נטענו ${alertHistory.length} רשומות היסטוריה`);
        } else {
            const initialAlert = {
                id: Date.now(),
                type: 'safe',
                title: 'מערכת התראות פעילה',
                icon: '✅',
                description: 'המערכת עלתה בהצלחה ומחוברת לכל ה-APIs',
                cities: [],
                timestamp: new Date().toISOString(),
                hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
                source: 'system'
            };
            
            alertHistory = [initialAlert];
            saveToHistory(initialAlert);
            formatLogMessage('info', 'Storage', 'נוצרה היסטוריה ראשונית');
        }
    } catch (error) {
        formatLogMessage('error', 'Storage', 'שגיאה בטעינת היסטוריה', error.message);
        alertHistory = [];
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        mode: isLiveMode ? 'live' : 'offline',
        users: connectedUsers.size,
        alerts: alertHistory.length,
        timestamp: new Date().toISOString(),
        apis: 'kore.co.il, pikud-haoref',
        version: '2.0.0'
    });
});

// Route לסטטיסטיקות מפורטות
app.get('/api/stats', (req, res) => {
    const stats = {
        server: {
            uptime: process.uptime(),
            startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
            nodeVersion: process.version,
            platform: process.platform
        },
        alerts: {
            total: alertHistory.length,
            byType: {},
            last24Hours: 0,
            averagePerDay: 0
        },
        users: {
            current: connectedUsers.size,
            byCity: {}
        },
        performance: {
            cacheHits: alertCache.size,
            rateLimitedRequests: 0
        }
    };
    
    // ספירת התראות לפי סוג
    alertHistory.forEach(alert => {
        stats.alerts.byType[alert.type] = (stats.alerts.byType[alert.type] || 0) + 1;
    });
    
    // ספירת משתמשים לפי עיר
    connectedUsers.forEach(user => {
        stats.users.byCity[user.cityName] = (stats.users.byCity[user.cityName] || 0) + 1;
    });
    
    // התראות ב-24 השעות האחרונות
    const yesterday = Date.now() - (24 * 60 * 60 * 1000);
    stats.alerts.last24Hours = alertHistory.filter(alert => 
        new Date(alert.timestamp).getTime() > yesterday
    ).length;
    
    res.json(stats);
});

// Route לבדיקת חיבוריות APIs
app.get('/api/test-connections', async (req, res) => {
    const results = {
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    // בדיקת Kore API
    try {
        const koreStart = Date.now();
        await axios.get('https://www.kore.co.il/redAlert.json', { timeout: 5000 });
        results.tests.kore = {
            status: 'success',
            responseTime: Date.now() - koreStart,
            message: 'חיבור תקין'
        };
    } catch (error) {
        results.tests.kore = {
            status: 'error',
            message: error.message,
            responseTime: null
        };
    }
    
    // בדיקת Oref API
    try {
        const orefStart = Date.now();
        await axios.get('https://www.oref.org.il/WarningMessages/alerts.json', { timeout: 5000 });
        results.tests.oref = {
            status: 'success',
            responseTime: Date.now() - orefStart,
            message: 'חיבור תקין'
        };
    } catch (error) {
        results.tests.oref = {
            status: 'error',
            message: error.message,
            responseTime: null
        };
    }
    
    res.json(results);
});

// הפעלת השרת
function startServer() {
    loadExistingHistory();
    
    server.listen(PORT, () => {
        formatLogMessage('success', 'Server', '🎉 מערכת התראות אמיתיות פועלת! 🎉');
        formatLogMessage('info', 'Server', `📡 פורט: ${PORT}`);
        formatLogMessage('info', 'Server', `🌐 כתובת: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
        formatLogMessage('info', 'Server', `🔗 APIs: kore.co.il, pikud-haoref (עם cache ו-failover)`);
        formatLogMessage('info', 'Server', `👥 משתמשים מחוברים: ${connectedUsers.size}`);
        formatLogMessage('info', 'Server', `📚 היסטוריה: ${alertHistory.length} רשומות`);
        formatLogMessage('info', 'Server', `🛡️ אבטחה: Helmet, Compression, Rate Limiting`);
        formatLogMessage('info', 'Server', `⚡ תכונות: Cache, Health Monitoring, Fuzzy Matching`);
        
        startAlertMonitoring();
        setupHeartbeat();
    });
}

// טיפול בשגיאות מתקדם
process.on('uncaughtException', (error) => {
    formatLogMessage('error', 'Process', '🚨 Uncaught Exception', error.message);
    // לא נעצור את השרת - נמשיך לפעול
});

process.on('unhandledRejection', (reason, promise) => {
    formatLogMessage('error', 'Process', '🚨 Unhandled Rejection', reason);
    // לא נעצור את השרת - נמשיך לפעול
});

process.on('SIGINT', () => {
    formatLogMessage('info', 'Process', '🛑 סוגר שרת (SIGINT)');
    gracefulShutdown();
});

process.on('SIGTERM', () => {
    formatLogMessage('info', 'Process', '🛑 סוגר שרת (SIGTERM)');
    gracefulShutdown();
});

// סגירה חלקה
function gracefulShutdown() {
    formatLogMessage('info', 'Shutdown', 'מתחיל סגירה חלקה');
    
    // הודע למשתמשים
    io.emit('server-shutdown', {
        message: 'השרת עובר לתחזוקה, יחזור בקרוב',
        timestamp: new Date().toISOString()
    });
    
    // סגור חיבורים
    server.close((err) => {
        if (err) {
            formatLogMessage('error', 'Shutdown', 'שגיאה בסגירת השרת', err.message);
            process.exit(1);
        }
        
        formatLogMessage('success', 'Shutdown', '✅ שרת נסגר בהצלחה');
        process.exit(0);
    });
    
    // כפה סגירה אחרי 10 שניות
    setTimeout(() => {
        formatLogMessage('warning', 'Shutdown', '⏰ כפה סגירה אחרי timeout');
        process.exit(1);
    }, 10000);
}

// התחל את המערכת
startServer();

module.exports = app;