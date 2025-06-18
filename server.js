// server.js - מערכת התראות חכמה עם API אמיתי של כל רגע
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// נתוני ערים וזמני הגעה לממ"ד
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

// משתנים גלובליים
let alertHistory = [];
let lastAlert = null;
let lastAlertId = null;
let connectedUsers = new Map();
let isLiveMode = true;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

app.get('/api/alerts/history/:city?', (req, res) => {
    const city = req.params.city;
    let history = alertHistory;
    
    if (city) {
        const decodedCity = decodeURIComponent(city);
        history = alertHistory.filter(alert => 
            alert.cities && alert.cities.includes(decodedCity)
        );
    }
    
    res.json(history.slice(0, 50));
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

// WebSocket חיבורים
io.on('connection', (socket) => {
    console.log(`🔗 משתמש חדש התחבר: ${socket.id}`);
    
    socket.emit('connection-status', {
        connected: true,
        mode: isLiveMode ? 'live' : 'simulation',
        serverTime: new Date().toISOString()
    });
    
    socket.on('register-city', (cityName) => {
        console.log(`📍 משתמש ${socket.id} נרשם לעיר: ${cityName}`);
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
        console.log(`❌ משתמש ${socket.id} התנתק`);
        connectedUsers.delete(socket.id);
    });
});

// פונקציות מיפוי והמרה
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
    
    if (title.includes('רקטות') || title.includes('טילים') || title.includes('ירי')) {
        return {
            type: 'shelter',
            title: 'היכנסו לממ"ד מיידית!',
            icon: '🚨',
            description: `${koreAlert.title} - ${koreAlert.desc}`,
            severity: 'high',
            class: 'danger'
        };
    } else if (title.includes('התראה') || title.includes('חירום')) {
        return {
            type: 'early-warning',
            title: 'התראה מוקדמת',
            icon: '⚠️',
            description: `${koreAlert.title} - ${koreAlert.desc}`,
            severity: 'medium',
            class: 'warning'
        };
    } else if (title.includes('תרגיל')) {
        return {
            type: 'drill',
            title: 'תרגיל',
            icon: '🎯',
            description: `${koreAlert.title} - ${koreAlert.desc}`,
            severity: 'medium',
            class: 'warning'
        };
    } else {
        return {
            type: 'unknown',
            title: koreAlert.title,
            icon: '❓',
            description: koreAlert.desc || 'פעלו לפי הנחיות הרשויות',
            severity: 'medium',
            class: 'warning'
        };
    }
}

function getCityMatchesFromAlert(alertCities) {
    const matches = [];
    const alertCitiesLower = alertCities.map(city => city.toLowerCase());
    
    // חיפוש התאמות מדוייקות
    Object.keys(cityData).forEach(ourCity => {
        const ourCityLower = ourCity.toLowerCase();
        
        // התאמה מדוייקת
        if (alertCitiesLower.includes(ourCityLower)) {
            matches.push(ourCity);
            return;
        }
        
        // התאמה חלקית
        for (const alertCity of alertCitiesLower) {
            if (alertCity.includes(ourCityLower) || ourCityLower.includes(alertCity)) {
                matches.push(ourCity);
                break;
            }
        }
    });
    
    return [...new Set(matches)]; // הסר כפילויות
}

// פונקציות התראות
function notifyRelevantUsers(alert) {
    if (!alert.cities || alert.cities.length === 0) {
        io.emit('alert-update', alert);
        console.log(`📢 שולח התראה כללית ל-${connectedUsers.size} משתמשים`);
        return;
    }
    
    connectedUsers.forEach((userData, socketId) => {
        if (alert.cities.includes(userData.cityName)) {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('alert-update', alert);
                console.log(`📱 שולח התראה למשתמש ${socketId} בעיר ${userData.cityName}`);
            }
        }
    });
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
        console.warn('לא ניתן לשמור היסטוריה:', error.message);
    }
}

// פונקציה לבדיקת התראות מ-API של כל רגע
async function checkKoreAPI() {
    try {
        console.log('🔍 בודק התראות ב-API של כל רגע...');
        
        const response = await axios.get('https://www.kore.co.il/redAlert.json', {
            timeout: 10000,
            headers: {
                'User-Agent': 'AlertSystem/2.0 (https://ph-7php.onrender.com)',
                'Accept': 'application/json'
            }
        });
        
        const alertData = response.data;
        
        if (alertData && alertData.id) {
            console.log(`🚨 התראה פעילה מ-Kore:`, alertData);
            
            // בדוק אם זו התראה חדשה
            if (lastAlertId !== alertData.id) {
                lastAlertId = alertData.id;
                
                // מיפוי סוג ההתראה
                const categorized = mapAlertTypeFromKore(alertData);
                
                // מיפוי ערים
                const matchedCities = getCityMatchesFromAlert(alertData.data || []);
                
                const enrichedAlert = {
                    ...alertData,
                    ...categorized,
                    cities: matchedCities.length > 0 ? matchedCities : alertData.data,
                    originalCities: alertData.data,
                    timestamp: new Date().toISOString(),
                    hebrewTime: new Date().toLocaleString('he-IL', {
                        timeZone: 'Asia/Jerusalem'
                    }),
                    source: 'kore-api'
                };
                
                console.log(`✅ התראה חדשה עובדה:`, {
                    type: enrichedAlert.type,
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
            
            return true; // יש התראה פעילה
            
        } else {
            console.log('✅ אין התראות פעילות');
            
            // אם הייתה התראה לפני ועכשיו אין - זה "יציאה מממ"ד"
            if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
                const allClearAlert = {
                    type: 'all-clear',
                    title: 'יציאה מהממ"ד',
                    icon: '🟢',
                    description: 'הסכנה חלפה - ניתן לצאת מהחדר המוגן',
                    severity: 'low',
                    class: 'safe',
                    cities: lastAlert.cities || [],
                    timestamp: new Date().toISOString(),
                    hebrewTime: new Date().toLocaleString('he-IL', {
                        timeZone: 'Asia/Jerusalem'
                    }),
                    source: 'system'
                };
                
                console.log('🟢 יוצר התראת יציאה מממ"ד');
                
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
            
            return false; // אין התראה
        }
        
    } catch (error) {
        console.error('❌ שגיאה ב-API של כל רגע:', error.message);
        return null; // שגיאה
    }
}

// מעקב אחר התראות
function startAlertMonitoring() {
    console.log('🚀 מתחיל מעקב אחר התראות אמיתיות...');
    
    const monitorAlerts = async () => {
        try {
            const result = await checkKoreAPI();
            
            if (result === null) {
                // שגיאה - נסה שוב תוך זמן קצר יותר
                setTimeout(monitorAlerts, 5000);
                return;
            }
            
            isLiveMode = true;
            
        } catch (error) {
            console.error('❌ שגיאה כללית במעקב:', error.message);
        }
    };
    
    // בדיקה ראשונית
    monitorAlerts();
    
    // המשך מעקב כל 2 שניות (כמו בדוגמה)
    setInterval(monitorAlerts, 2000);
    
    console.log('⏰ מעקב כל 2 שניות באמצעות API של כל רגע');
}

// טעינת היסטוריה קיימת
function loadExistingHistory() {
    try {
        if (fs.existsSync('alert_history.json')) {
            const data = fs.readFileSync('alert_history.json', 'utf8');
            alertHistory = JSON.parse(data);
            console.log(`📚 נטענו ${alertHistory.length} רשומות היסטוריה`);
        } else {
            const initialAlert = {
                id: Date.now(),
                type: 'safe',
                title: 'מערכת התראות פעילה',
                icon: '✅',
                description: 'המערכת עלתה בהצלחה ומחוברת ל-API של כל רגע',
                cities: [],
                timestamp: new Date().toISOString(),
                hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
                source: 'system'
            };
            
            alertHistory = [initialAlert];
            saveToHistory(initialAlert);
        }
    } catch (error) {
        console.error('❌ שגיאה בטעינת היסטוריה:', error.message);
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
        api: 'kore.co.il'
    });
});

// הפעלת השרת
function startServer() {
    loadExistingHistory();
    
    server.listen(PORT, () => {
        console.log('🎉================================🎉');
        console.log(`🚀 מערכת התראות אמיתיות פועלת!`);
        console.log(`📡 פורט: ${PORT}`);
        console.log(`🌐 כתובת: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
        console.log(`🔗 API: kore.co.il (אמיתי)`);
        console.log(`👥 משתמשים: ${connectedUsers.size}`);
        console.log(`📚 היסטוריה: ${alertHistory.length} רשומות`);
        console.log('🎉================================🎉');
        
        startAlertMonitoring();
    });
}

// טיפול בסגירה נקיה
process.on('SIGINT', () => {
    console.log('\n🛑 סוגר שרת...');
    server.close(() => {
        console.log('✅ שרת נסגר בהצלחה');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('🛑 קיבל SIGTERM, סוגר שרת...');
    server.close(() => {
        console.log('✅ שרת נסגר בהצלחה');
        process.exit(0);
    });
});

startServer();

module.exports = app;