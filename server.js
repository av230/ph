// server.js - שרת Node.js למערכת התראות פיקוד העורף
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

// ייבוא ה-API של פיקוד העורף
const pikudHaoref = require('pikud-haoref-api');

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
    'נצרת': { zone: 'עמק יזרעאל', shelterTime: 60, area: 78 }
};

// משתנים גלובליים
let alertHistory = [];
let lastAlert = null;
let connectedUsers = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/cities', (req, res) => {
    res.json(Object.keys(cityData));
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
        timestamp: new Date().toISOString()
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
    
    res.json(history.slice(0, 50)); // 50 התראות אחרונות
});

// WebSocket חיבורים
io.on('connection', (socket) => {
    console.log(`משתמש חדש התחבר: ${socket.id}`);
    
    socket.on('register-city', (cityName) => {
        console.log(`משתמש ${socket.id} נרשם לעיר: ${cityName}`);
        connectedUsers.set(socket.id, { 
            cityName, 
            connectedAt: new Date() 
        });
        
        // שלח את המצב הנוכחי
        if (lastAlert) {
            socket.emit('alert-update', lastAlert);
        }
    });
    
    socket.on('get-history', (cityName) => {
        const cityHistory = alertHistory.filter(alert => 
            alert.cities && alert.cities.includes(cityName)
        ).slice(0, 20);
        
        socket.emit('history-update', cityHistory);
    });
    
    socket.on('disconnect', () => {
        console.log(`משתמש ${socket.id} התנתק`);
        connectedUsers.delete(socket.id);
    });
});

// פונקציה לקטגוריזציה של התראות
function categorizeAlert(alert) {
    if (!alert || !alert.type) {
        return {
            type: 'safe',
            title: 'מצב רגיל',
            icon: '✅',
            description: 'אין התראות פעילות',
            severity: 'low'
        };
    }
    
    switch (alert.type) {
        case 'newsFlash':
        case 'earlyWarning':
            return {
                type: 'early-warning',
                title: 'התראה מוקדמת',
                icon: '⚠️',
                description: 'זוהה שיגור לכיוון האזור - הכינו מרחב מוגן',
                severity: 'medium'
            };
            
        case 'missiles':
            return {
                type: 'shelter',
                title: 'היכנסו לממ"ד מיידית!',
                icon: '🚨',
                description: 'אזעקה באזור - היכנסו לחדר המוגן עכשיו!',
                severity: 'high'
            };
            
        case 'radiologicalEvent':
            return {
                type: 'radiological',
                title: 'אירוע רדיולוגי',
                icon: '☢️',
                description: 'אירוע רדיולוגי באזור - פעלו לפי הנחיות',
                severity: 'high'
            };
            
        case 'earthQuake':
            return {
                type: 'earthquake',
                title: 'רעידת אדמה',
                icon: '🌍',
                description: 'זוהתה רעידת אדמה - התרחקו מחפצים שעלולים ליפול',
                severity: 'medium'
            };
            
        default:
            return {
                type: 'unknown',
                title: 'התראה לא מוכרת',
                icon: '❓',
                description: alert.instructions || 'פעלו לפי הנחיות הרשויות',
                severity: 'medium'
            };
    }
}

// פונקציה לשליחת התראות למשתמשים רלוונטיים
function notifyRelevantUsers(alert) {
    if (!alert.cities || alert.cities.length === 0) return;
    
    connectedUsers.forEach((userData, socketId) => {
        if (alert.cities.includes(userData.cityName)) {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.emit('alert-update', alert);
                console.log(`שולח התראה למשתמש ${socketId} בעיר ${userData.cityName}`);
            }
        }
    });
}

// פונקציה לשמירת התראה בהיסטוריה
function saveToHistory(alert) {
    const historyEntry = {
        ...alert,
        id: Date.now(),
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
    
    // שמור רק 1000 רשומות אחרונות
    if (alertHistory.length > 1000) {
        alertHistory = alertHistory.slice(0, 1000);
    }
    
    // שמור לקובץ (אופציונלי)
    fs.writeFileSync('alert_history.json', JSON.stringify(alertHistory, null, 2));
}

// מעקב אחר התראות
function startAlertMonitoring() {
    console.log('מתחיל מעקב אחר התראות פיקוד העורף...');
    
    const pollAlerts = () => {
        try {
            pikudHaoref.getActiveAlert((err, alert) => {
                if (err) {
                    console.error('שגיאה בקריאת התראות:', err);
                    return;
                }
                
                // בדיקה אם יש התראה חדשה
                const alertId = alert ? JSON.stringify(alert) : 'no-alert';
                const lastAlertId = lastAlert ? JSON.stringify(lastAlert) : 'no-last-alert';
                
                if (alertId !== lastAlertId) {
                    console.log('התראה חדשה:', alert);
                    
                    const categorized = categorizeAlert(alert);
                    const enrichedAlert = {
                        ...alert,
                        ...categorized,
                        timestamp: new Date().toISOString(),
                        hebrewTime: new Date().toLocaleString('he-IL', {
                            timeZone: 'Asia/Jerusalem'
                        })
                    };
                    
                    lastAlert = enrichedAlert;
                    saveToHistory(enrichedAlert);
                    notifyRelevantUsers(enrichedAlert);
                    
                    // שלח לכל המחוברים עדכון כללי
                    io.emit('global-status', {
                        hasActiveAlert: alert.type !== 'none',
                        affectedAreas: alert.cities || [],
                        lastUpdate: enrichedAlert.timestamp
                    });
                }
            });
        } catch (error) {
            console.error('שגיאה כללית במעקב התראות:', error);
        }
    };
    
    // התחל מעקב מיידי
    pollAlerts();
    
    // המשך מעקב כל 3 שניות
    setInterval(pollAlerts, 3000);
}

// טעינת היסטוריה קיימת
function loadExistingHistory() {
    try {
        if (fs.existsSync('alert_history.json')) {
            const data = fs.readFileSync('alert_history.json', 'utf8');
            alertHistory = JSON.parse(data);
            console.log(`נטענו ${alertHistory.length} רשומות היסטוריה`);
        }
    } catch (error) {
        console.error('שגיאה בטעינת היסטוריה:', error);
        alertHistory = [];
    }
}

// Route לדף הבית
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// הפעלת השרת
function startServer() {
    loadExistingHistory();
    
    server.listen(PORT, () => {
        console.log(`🚀 שרת מערכת התראות פועל על פורט ${PORT}`);
        console.log(`📡 ממשק ווב זמין בכתובת: http://localhost:${PORT}`);
        console.log(`👥 ${connectedUsers.size} משתמשים מחוברים`);
        
        // התחל מעקב אחר התראות
        startAlertMonitoring();
    });
}

// הפעלה
startServer();

// טיפול בסגירה נקיה
process.on('SIGINT', () => {
    console.log('\n🛑 סוגר שרת...');
    server.close(() => {
        console.log('✅ שרת נסגר בהצלחה');
        process.exit(0);
    });
});

module.exports = app;