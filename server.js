// // server.js - מערכת התראות חכמה עם רישום ו-SMS
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');
// const fs = require('fs');
// const axios = require('axios');
// const helmet = require('helmet');
// const compression = require('compression');
// const { createClient } = require('@supabase/supabase-js');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// const PORT = process.env.PORT || 3000;

// // Supabase Configuration
// const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
// const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// // ימות המשיח API Configuration
// const YEMOT_API_URL = 'https://www.call2all.co.il/ym/api/SendSMS';
// const YEMOT_USERNAME = process.env.YEMOT_USERNAME || 'YOUR_YEMOT_USERNAME';
// const YEMOT_PASSWORD = process.env.YEMOT_PASSWORD || 'YOUR_YEMOT_PASSWORD';

// // הודעות SMS מוגדרות מראש
// const SMS_MESSAGES = {
//     'early-warning': {
//         text: '⚠️ התראה מוקדמת באזור {city}! הכינו מרחב מוגן ותהיו מוכנים להיכנס אליו מיידית.',
//         priority: 'medium'
//     },
//     'shelter': {
//         text: '🚨 אזעקה ב{city}! היכנסו לחדר המוגן מיידית ותישארו שם עד הודעה נוספת!',
//         priority: 'high'
//     },
//     'all-clear': {
//         text: '🟢 הסכנה חלפה ב{city}. ניתן לצאת מהחדר המוגן ולחזור לפעילות רגילה.',
//         priority: 'low'
//     },
//     'drill': {
//         text: '🎯 תרגיל פיקוד העורף ב{city}. התנהגו כמו במצב חירום אמיתי.',
//         priority: 'medium'
//     }
// };

// // נתוני ערים
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

// // Cache ו-Health Monitoring
// const alertCache = new Map();
// const CACHE_DURATION = 30000;
// let apiHealthStatus = {
//     kore: { lastSuccess: null, failures: 0 },
//     oref: { lastSuccess: null, failures: 0 },
//     sms: { lastSuccess: null, failures: 0, sent: 0 }
// };

// // Middleware
// app.use(helmet());
// app.use(compression());
// app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));

// // Middleware לוגים
// function formatLogMessage(level, source, message, data = null) {
//     const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
//     const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌', debug: '🔍' };
    
//     let logMsg = `${icons[level] || '📝'} [${timestamp}] ${source}: ${message}`;
//     if (data) logMsg += ` | ${JSON.stringify(data)}`;
    
//     console.log(logMsg);
// }

// // פונקציות Supabase
// async function addPhoneRegistration(phone, city) {
//     try {
//         // בדיקה אם המספר כבר קיים
//         const { data: existing, error: checkError } = await supabase
//             .from('phone')
//             .select('*')
//             .eq('phone', phone)
//             .single();

//         if (existing) {
//             // עדכון עיר קיימת
//             const { data, error } = await supabase
//                 .from('phone')
//                 .update({ city: city, updated_at: new Date() })
//                 .eq('phone', phone)
//                 .select();

//             if (error) throw error;
//             formatLogMessage('success', 'Database', `עודכן מספר קיים: ${phone} -> ${city}`);
//             return { success: true, action: 'updated', data };
//         } else {
//             // הוספת מספר חדש
//             const { data, error } = await supabase
//                 .from('phone')
//                 .insert([{ phone: phone, city: city }])
//                 .select();

//             if (error) throw error;
//             formatLogMessage('success', 'Database', `נוסף מספר חדש: ${phone} -> ${city}`);
//             return { success: true, action: 'added', data };
//         }
//     } catch (error) {
//         formatLogMessage('error', 'Database', 'שגיאה ברישום מספר', error.message);
//         return { success: false, error: error.message };
//     }
// }

// async function getPhonesByCity(city) {
//     try {
//         const { data, error } = await supabase
//             .from('phone')
//             .select('phone')
//             .eq('city', city);

//         if (error) throw error;
//         return data.map(row => row.phone);
//     } catch (error) {
//         formatLogMessage('error', 'Database', `שגיאה בקריאת מספרים לעיר ${city}`, error.message);
//         return [];
//     }
// }

// async function getAllPhones() {
//     try {
//         const { data, error } = await supabase
//             .from('phone')
//             .select('*');

//         if (error) throw error;
//         return data;
//     } catch (error) {
//         formatLogMessage('error', 'Database', 'שגיאה בקריאת כל המספרים', error.message);
//         return [];
//     }
// }

// async function removePhoneRegistration(phone) {
//     try {
//         const { data, error } = await supabase
//             .from('phone')
//             .delete()
//             .eq('phone', phone)
//             .select();

//         if (error) throw error;
//         formatLogMessage('success', 'Database', `מספר הוסר: ${phone}`);
//         return { success: true, data };
//     } catch (error) {
//         formatLogMessage('error', 'Database', 'שגיאה בהסרת מספר', error.message);
//         return { success: false, error: error.message };
//     }
// }

// // פונקציות SMS
// function validatePhoneNumber(phone) {
//     // ולידציה למספר ישראלי
//     const cleanPhone = phone.replace(/[^\d]/g, '');
    
//     // מספר ישראלי: 05xxxxxxxx או 972xxxxxxxxx
//     if (cleanPhone.match(/^05\d{8}$/)) {
//         return '972' + cleanPhone.substring(1); // המרה לפורמט בינלאומי
//     } else if (cleanPhone.match(/^972\d{9}$/)) {
//         return cleanPhone;
//     } else if (cleanPhone.match(/^0\d{8,9}$/)) {
//         return '972' + cleanPhone.substring(1);
//     }
    
//     return null;
// }

// async function sendSMS(phone, message, priority = 'medium') {
//     try {
//         const validPhone = validatePhoneNumber(phone);
//         if (!validPhone) {
//             throw new Error('מספר טלפון לא תקין');
//         }

//         const smsData = {
//             username: YEMOT_USERNAME,
//             password: YEMOT_PASSWORD,
//             recipient: validPhone,
//             sender: 'AlertSys', // שם השולח (עד 11 תווים)
//             message: message,
//             priority: priority === 'high' ? '1' : priority === 'medium' ? '2' : '3'
//         };

//         const response = await axios.post(YEMOT_API_URL, smsData, {
//             timeout: 10000,
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         });

//         if (response.data && response.data.success) {
//             apiHealthStatus.sms.lastSuccess = Date.now();
//             apiHealthStatus.sms.sent++;
//             formatLogMessage('success', 'SMS', `נשלח ל-${validPhone}: ${message.substring(0, 50)}...`);
//             return { success: true, messageId: response.data.messageId };
//         } else {
//             throw new Error(response.data.message || 'שגיאה לא מוגדרת');
//         }
        
//     } catch (error) {
//         apiHealthStatus.sms.failures++;
//         formatLogMessage('error', 'SMS', `שגיאה בשליחה ל-${phone}`, error.message);
//         return { success: false, error: error.message };
//     }
// }

// async function sendAlertSMS(alertType, cities) {
//     try {
//         if (!cities || cities.length === 0) return;
        
//         const smsTemplate = SMS_MESSAGES[alertType];
//         if (!smsTemplate) {
//             formatLogMessage('warning', 'SMS', `לא נמצא תבנית SMS לסוג התראה: ${alertType}`);
//             return;
//         }

//         let totalSent = 0;
//         let totalFailed = 0;

//         for (const city of cities) {
//             const phones = await getPhonesByCity(city);
//             const message = smsTemplate.text.replace('{city}', city);
            
//             formatLogMessage('info', 'SMS', `שולח התראות ל-${phones.length} מספרים בעיר ${city}`);

//             for (const phone of phones) {
//                 const result = await sendSMS(phone, message, smsTemplate.priority);
//                 if (result.success) {
//                     totalSent++;
//                 } else {
//                     totalFailed++;
//                 }
                
//                 // המתנה קצרה בין שליחות למניעת עומס
//                 await new Promise(resolve => setTimeout(resolve, 100));
//             }
//         }

//         formatLogMessage('success', 'SMS', `סיכום שליחת התראות: ${totalSent} נשלחו, ${totalFailed} נכשלו`);
        
//         // שליחת עדכון ל-WebSocket
//         io.emit('sms-status', {
//             sent: totalSent,
//             failed: totalFailed,
//             cities: cities,
//             alertType: alertType
//         });

//     } catch (error) {
//         formatLogMessage('error', 'SMS', 'שגיאה כללית בשליחת התראות', error.message);
//     }
// }

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

// // API לרישום מספר טלפון
// app.post('/api/register-phone', async (req, res) => {
//     try {
//         const { phone, city } = req.body;
        
//         if (!phone || !city) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'חסרים פרטים: מספר טלפון ועיר' 
//             });
//         }

//         const validPhone = validatePhoneNumber(phone);
//         if (!validPhone) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'מספר טלפון לא תקין. הכנס מספר ישראלי (05xxxxxxxx)' 
//             });
//         }

//         if (!cityData[city]) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'עיר לא מוכרת במערכת' 
//             });
//         }

//         const result = await addPhoneRegistration(validPhone, city);
        
//         if (result.success) {
//             // שליחת SMS אישור
//             const confirmMessage = `ברוך הבא למערכת התראות פיקוד העורף! נרשמת בהצלחה לקבלת התראות עבור ${city}. להסרה השב STOP`;
//             await sendSMS(validPhone, confirmMessage, 'low');
            
//             res.json({
//                 success: true,
//                 message: `נרשמת בהצלחה לקבלת התראות עבור ${city}`,
//                 action: result.action,
//                 phone: validPhone
//             });
//         } else {
//             res.status(500).json(result);
//         }
        
//     } catch (error) {
//         formatLogMessage('error', 'API', 'שגיאה ברישום מספר', error.message);
//         res.status(500).json({ 
//             success: false, 
//             error: 'שגיאה פנימית בשרת' 
//         });
//     }
// });

// // API להסרת מספר טלפון
// app.post('/api/unregister-phone', async (req, res) => {
//     try {
//         const { phone } = req.body;
        
//         if (!phone) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'חסר מספר טלפון' 
//             });
//         }

//         const validPhone = validatePhoneNumber(phone);
//         if (!validPhone) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'מספר טלפון לא תקין' 
//             });
//         }

//         const result = await removePhoneRegistration(validPhone);
        
//         if (result.success) {
//             // שליחת SMS אישור הסרה
//             const confirmMessage = 'הוסרת בהצלחה ממערכת התראות פיקוד העורף. תודה שהשתמשת בשירות שלנו!';
//             await sendSMS(validPhone, confirmMessage, 'low');
            
//             res.json({
//                 success: true,
//                 message: 'המספר הוסר בהצלחה ממערכת ההתראות'
//             });
//         } else {
//             res.status(500).json(result);
//         }
        
//     } catch (error) {
//         formatLogMessage('error', 'API', 'שגיאה בהסרת מספר', error.message);
//         res.status(500).json({ 
//             success: false, 
//             error: 'שגיאה פנימית בשרת' 
//         });
//     }
// });

// // API לסטטיסטיקות
// app.get('/api/stats', async (req, res) => {
//     try {
//         const allPhones = await getAllPhones();
//         const phonesByCity = {};
        
//         allPhones.forEach(registration => {
//             phonesByCity[registration.city] = (phonesByCity[registration.city] || 0) + 1;
//         });

//         res.json({
//             total_registered: allPhones.length,
//             by_city: phonesByCity,
//             sms_stats: {
//                 total_sent: apiHealthStatus.sms.sent,
//                 total_failed: apiHealthStatus.sms.failures,
//                 last_success: apiHealthStatus.sms.lastSuccess
//             },
//             server_stats: {
//                 uptime: process.uptime(),
//                 connected_users: connectedUsers.size,
//                 alerts_count: alertHistory.length
//             }
//         });
//     } catch (error) {
//         formatLogMessage('error', 'API', 'שגיאה בקריאת סטטיסטיקות', error.message);
//         res.status(500).json({ error: 'שגיאה בקריאת נתונים' });
//     }
// });

// app.get('/api/alerts/current', (req, res) => {
//     res.json({ 
//         alert: lastAlert,
//         timestamp: new Date().toISOString(),
//         mode: isLiveMode ? 'live' : 'simulation'
//     });
// });

// app.get('/api/alerts/history/:city?', async (req, res) => {
//     const city = req.params.city ? decodeURIComponent(req.params.city) : null;
    
//     if (city) {
//         try {
//             const response = await axios.get(
//                 `https://alerts-history.oref.org.il/Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=1&city_0=${encodeURIComponent(city)}`, 
//                 { timeout: 10000 }
//             );
            
//             const history = response.data.map(alert => ({
//                 ...mapAlertTypeFromKore({ title: alert.message, desc: alert.message }),
//                 time: alert.time,
//                 cities: [city],
//                 timestamp: new Date().toISOString(),
//                 hebrewTime: alert.time
//             }));
            
//             res.json(history.slice(0, 50));
//         } catch (error) {
//             formatLogMessage('error', 'History', `שגיאה בטעינת היסטוריה עבור ${city}`, error.message);
//             res.status(500).json({ error: 'שגיאה בטעינת היסטוריה' });
//         }
//     } else {
//         res.json(alertHistory.slice(0, 50));
//     }
// });

// // WebSocket חיבורים
// io.on('connection', (socket) => {
//     formatLogMessage('info', 'WebSocket', `משתמש חדש התחבר: ${socket.id}`);
    
//     socket.emit('connection-status', {
//         connected: true,
//         mode: isLiveMode ? 'live' : 'simulation',
//         serverTime: new Date().toISOString()
//     });
    
//     socket.on('register-city', (cityName) => {
//         formatLogMessage('info', 'Registration', `משתמש ${socket.id} נרשם לעיר: ${cityName}`);
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
//         formatLogMessage('info', 'WebSocket', `משתמש ${socket.id} התנתק`);
//         connectedUsers.delete(socket.id);
//     });
// });
// // המשך server.js - חלק 2

// // מיפוי סוגי התראות (מהקוד המקורי)
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
    
//     if (title.includes('רקטות') || title.includes('טילים') || title.includes('ירי') || title.includes('אזעקה')) {
//         return {
//             type: 'shelter',
//             title: 'היכנסו לממ"ד מיידית!',
//             icon: '🚨',
//             description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן עכשיו!'}`,
//             severity: 'high',
//             class: 'danger'
//         };
//     } else if (title.includes('התראה') || title.includes('חירום')) {
//         return {
//             type: 'early-warning',
//             title: 'התראה מוקדמת',
//             icon: '⚠️',
//             description: `${koreAlert.title} - ${koreAlert.desc || 'היו מוכנים'}`,
//             severity: 'medium',
//             class: 'warning'
//         };
//     } else if (title.includes('תרגיל')) {
//         return {
//             type: 'drill',
//             title: 'תרגיל',
//             icon: '🎯',
//             description: `${koreAlert.title} - ${koreAlert.desc || 'תרגיל בטחוני'}`,
//             severity: 'medium',
//             class: 'warning'
//         };
//     } else {
//         return {
//             type: 'all-clear',
//             title: 'יציאה מהממ"ד',
//             icon: '🟢',
//             description: 'הסכנה חלפה - ניתן לצאת מהחדר המוגן',
//             severity: 'low',
//             class: 'safe'
//         };
//     }
// }

// // זיהוי ערים משופר
// function getCityMatchesFromAlert(alertCities) {
//     const matches = [];
//     const alertCitiesLower = (alertCities || []).map(city => city.toLowerCase().trim());
    
//     Object.keys(cityData).forEach(ourCity => {
//         const ourCityLower = ourCity.toLowerCase();
        
//         // בדיקה מדוייקת
//         if (alertCitiesLower.includes(ourCityLower)) {
//             matches.push(ourCity);
//             return;
//         }
        
//         // בדיקה חלקית
//         for (const alertCity of alertCitiesLower) {
//             if (alertCity.includes(ourCityLower) || ourCityLower.includes(alertCity)) {
//                 matches.push(ourCity);
//                 break;
//             }
//         }
//     });
    
//     return [...new Set(matches)];
// }

// // פונקציות התראות
// function notifyRelevantUsers(alert) {
//     if (!alert.cities || alert.cities.length === 0) {
//         io.emit('alert-update', alert);
//         formatLogMessage('info', 'Notification', `שולח התראה כללית ל-${connectedUsers.size} משתמשים`);
//         return;
//     }
    
//     let notifiedCount = 0;
//     connectedUsers.forEach((userData, socketId) => {
//         if (alert.cities.includes(userData.cityName)) {
//             const socket = io.sockets.sockets.get(socketId);
//             if (socket) {
//                 socket.emit('alert-update', alert);
//                 notifiedCount++;
//             }
//         }
//     });
    
//     formatLogMessage('info', 'Notification', `שולח התראה ל-${notifiedCount} משתמשים בערים: ${alert.cities.join(', ')}`);
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
//         formatLogMessage('warning', 'Storage', 'לא ניתן לשמור היסטוריה', error.message);
//     }
// }

// // בדיקת API עם Cache
// async function checkKoreAPIWithCache() {
//     const now = Date.now();
//     const cached = alertCache.get('kore');
    
//     if (cached && (now - cached.timestamp) < CACHE_DURATION) {
//         return cached.data;
//     }
    
//     try {
//         const result = await checkKoreAPI();
//         alertCache.set('kore', { data: result, timestamp: now });
//         return result;
//     } catch (error) {
//         if (cached) {
//             formatLogMessage('warning', 'API', 'שגיאה ב-API, משתמש בנתונים ישנים');
//             return cached.data;
//         }
//         throw error;
//     }
// }

// // בדיקת API של כל רגע
// async function checkKoreAPI() {
//     try {
//         const response = await axios.get('https://www.kore.co.il/redAlert.json', {
//             timeout: 10000,
//             headers: {
//                 'User-Agent': 'AlertSystem/2.0',
//                 'Accept': 'application/json'
//             }
//         });
        
//         const alertData = response.data;
//         apiHealthStatus.kore.lastSuccess = Date.now();
//         apiHealthStatus.kore.failures = 0;
        
//         if (alertData && alertData.id) {
//             if (lastAlertId !== alertData.id) {
//                 lastAlertId = alertData.id;
                
//                 const categorized = mapAlertTypeFromKore(alertData);
//                 const matchedCities = getCityMatchesFromAlert(alertData.data || []);
                
//                 const enrichedAlert = {
//                     ...alertData,
//                     ...categorized,
//                     cities: matchedCities.length > 0 ? matchedCities : alertData.data,
//                     originalCities: alertData.data,
//                     timestamp: new Date().toISOString(),
//                     hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//                     source: 'kore-api'
//                 };
                
//                 formatLogMessage('success', 'KoreAPI', `התראה חדשה: ${enrichedAlert.type}`, {
//                     cities: enrichedAlert.cities,
//                     originalCities: enrichedAlert.originalCities
//                 });
                
//                 lastAlert = enrichedAlert;
//                 saveToHistory(enrichedAlert);
//                 notifyRelevantUsers(enrichedAlert);
                
//                 // שליחת SMS להתראות חשובות
//                 if (enrichedAlert.type === 'shelter' || enrichedAlert.type === 'early-warning' || enrichedAlert.type === 'all-clear') {
//                     await sendAlertSMS(enrichedAlert.type, enrichedAlert.cities);
//                 }
                
//                 io.emit('global-status', {
//                     hasActiveAlert: true,
//                     affectedAreas: enrichedAlert.cities || [],
//                     lastUpdate: enrichedAlert.timestamp,
//                     mode: 'live'
//                 });
//             }
//             return true;
            
//         } else {
//             if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
//                 await createAllClearAlert();
//             }
//             return false;
//         }
        
//     } catch (error) {
//         apiHealthStatus.kore.failures++;
//         formatLogMessage('error', 'KoreAPI', `כשל ${apiHealthStatus.kore.failures}`, error.message);
//         throw error;
//     }
// }

// // בדיקת API של פיקוד העורף
// async function checkPikudHaOrefAPI() {
//     try {
//         const response = await axios.get('https://www.oref.org.il/WarningMessages/alerts.json', {
//             timeout: 10000,
//             headers: {
//                 'User-Agent': 'AlertSystem/2.0',
//                 'Accept': 'application/json'
//             }
//         });
        
//         const alertData = response.data;
//         apiHealthStatus.oref.lastSuccess = Date.now();
//         apiHealthStatus.oref.failures = 0;
        
//         if (alertData && alertData.data && alertData.data.length > 0) {
//             const alert = alertData.data[0];
//             if (lastAlertId !== alert.id) {
//                 lastAlertId = alert.id;
                
//                 const categorized = mapAlertTypeFromKore({ title: alert.title, desc: alert.message });
//                 const matchedCities = getCityMatchesFromAlert(alert.cities || []);
                
//                 const enrichedAlert = {
//                     ...alert,
//                     ...categorized,
//                     cities: matchedCities.length > 0 ? matchedCities : alert.cities,
//                     originalCities: alert.cities,
//                     timestamp: new Date().toISOString(),
//                     hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//                     source: 'pikud-haoref'
//                 };
                
//                 formatLogMessage('success', 'OrefAPI', `התראה חדשה: ${enrichedAlert.type}`, {
//                     cities: enrichedAlert.cities
//                 });
                
//                 lastAlert = enrichedAlert;
//                 saveToHistory(enrichedAlert);
//                 notifyRelevantUsers(enrichedAlert);
                
//                 // שליחת SMS
//                 if (enrichedAlert.type === 'shelter' || enrichedAlert.type === 'early-warning' || enrichedAlert.type === 'all-clear') {
//                     await sendAlertSMS(enrichedAlert.type, enrichedAlert.cities);
//                 }
                
//                 io.emit('global-status', {
//                     hasActiveAlert: true,
//                     affectedAreas: enrichedAlert.cities || [],
//                     lastUpdate: enrichedAlert.timestamp,
//                     mode: 'live'
//                 });
//             }
//             return true;
            
//         } else {
//             if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
//                 await createAllClearAlert();
//             }
//             return false;
//         }
        
//     } catch (error) {
//         apiHealthStatus.oref.failures++;
//         formatLogMessage('error', 'OrefAPI', `כשל ${apiHealthStatus.oref.failures}`, error.message);
//         throw error;
//     }
// }

// // יצירת התראת יציאה מממ"ד
// async function createAllClearAlert() {
//     const allClearAlert = {
//         type: 'all-clear',
//         title: 'יציאה מהממ"ד',
//         icon: '🟢',
//         description: 'הסכנה חלפה - ניתן לצאת מהחדר המוגן',
//         severity: 'low',
//         class: 'safe',
//         cities: lastAlert.cities || [],
//         timestamp: new Date().toISOString(),
//         hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//         source: 'system'
//     };
    
//     formatLogMessage('info', 'System', 'יוצר התראת יציאה מממ"ד');
    
//     lastAlert = allClearAlert;
//     lastAlertId = null;
//     saveToHistory(allClearAlert);
//     notifyRelevantUsers(allClearAlert);
    
//     // שליחת SMS יציאה מממ"ד
//     await sendAlertSMS('all-clear', allClearAlert.cities);
    
//     io.emit('global-status', {
//         hasActiveAlert: false,
//         affectedAreas: [],
//         lastUpdate: allClearAlert.timestamp,
//         mode: 'live'
//     });
// }

// // מעקב אחר התראות
// function startAlertMonitoring() {
//     formatLogMessage('info', 'Monitor', 'מתחיל מעקב אחר התראות אמיתיות');
    
//     const monitorAlerts = async () => {
//         try {
//             let result = await checkKoreAPIWithCache();
            
//             if (result === null) {
//                 formatLogMessage('warning', 'Monitor', 'ניסיון חוזר עם API של פיקוד העורף');
//                 result = await checkPikudHaOrefAPI();
//             }
            
//             if (result === null) {
//                 formatLogMessage('error', 'Monitor', 'כל ה-APIs נכשלו, מנסה שוב בעוד 5 שניות');
//                 setTimeout(monitorAlerts, 5000);
//                 return;
//             }
            
//             isLiveMode = true;
            
//         } catch (error) {
//             formatLogMessage('error', 'Monitor', 'שגיאה כללית במעקב', error.message);
//         }
//     };
    
//     monitorAlerts();
//     setInterval(monitorAlerts, 5000);
//     formatLogMessage('info', 'Monitor', 'מעקב כל 5 שניות באמצעות APIs מרובים + SMS');
// }

// // Heartbeat למשתמשים
// function setupHeartbeat() {
//     setInterval(() => {
//         io.emit('heartbeat', {
//             timestamp: new Date().toISOString(),
//             connectedUsers: connectedUsers.size,
//             serverStatus: 'healthy',
//             apiStatus: {
//                 kore: apiHealthStatus.kore.failures < 3 ? 'healthy' : 'degraded',
//                 oref: apiHealthStatus.oref.failures < 3 ? 'healthy' : 'degraded',
//                 sms: apiHealthStatus.sms.failures < 5 ? 'healthy' : 'degraded'
//             },
//             smsStats: {
//                 sent: apiHealthStatus.sms.sent,
//                 failures: apiHealthStatus.sms.failures
//             }
//         });
        
//         // ניקוי cache ישן
//         const now = Date.now();
//         for (const [key, value] of alertCache.entries()) {
//             if (now - value.timestamp > CACHE_DURATION * 2) {
//                 alertCache.delete(key);
//             }
//         }
        
//     }, 30000);
    
//     formatLogMessage('info', 'Heartbeat', 'Heartbeat הופעל עם סטטיסטיקות SMS');
// }

// // טעינת היסטוריה קיימת
// function loadExistingHistory() {
//     try {
//         if (fs.existsSync('alert_history.json')) {
//             const data = fs.readFileSync('alert_history.json', 'utf8');
//             alertHistory = JSON.parse(data);
//             formatLogMessage('success', 'Storage', `נטענו ${alertHistory.length} רשומות היסטוריה`);
//         } else {
//             const initialAlert = {
//                 id: Date.now(),
//                 type: 'safe',
//                 title: 'מערכת התראות + SMS פעילה',
//                 icon: '✅',
//                 description: 'המערכת עלתה בהצלחה עם תמיכה ב-SMS',
//                 cities: [],
//                 timestamp: new Date().toISOString(),
//                 hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//                 source: 'system'
//             };
            
//             alertHistory = [initialAlert];
//             saveToHistory(initialAlert);
//         }
//     } catch (error) {
//         formatLogMessage('error', 'Storage', 'שגיאה בטעינת היסטוריה', error.message);
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
//         apis: 'kore.co.il, pikud-haoref, yemot-hamashiach',
//         version: '2.1.0-SMS'
//     });
// });

// // הפעלת השרת
// function startServer() {
//     loadExistingHistory();
    
//     server.listen(PORT, () => {
//         formatLogMessage('success', 'Server', '🎉 מערכת התראות + SMS פועלת! 🎉');
//         formatLogMessage('info', 'Server', `📡 פורט: ${PORT}`);
//         formatLogMessage('info', 'Server', `🌐 כתובת: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
//         formatLogMessage('info', 'Server', `🔗 APIs: kore.co.il, pikud-haoref, yemot-hamashiach`);
//         formatLogMessage('info', 'Server', `📱 SMS: Yemot Hamashiach Integration`);
//         formatLogMessage('info', 'Server', `🗄️ Database: Supabase`);
//         formatLogMessage('info', 'Server', `👥 משתמשים: ${connectedUsers.size}`);
//         formatLogMessage('info', 'Server', `📚 היסטוריה: ${alertHistory.length} רשומות`);
        
//         startAlertMonitoring();
//         setupHeartbeat();
//     });
// }

// // טיפול בסגירה נקיה
// process.on('SIGINT', () => {
//     formatLogMessage('info', 'Process', '🛑 סוגר שרת');
//     gracefulShutdown();
// });

// process.on('SIGTERM', () => {
//     formatLogMessage('info', 'Process', '🛑 קיבל SIGTERM, סוגר שרת');
//     gracefulShutdown();
// });

// function gracefulShutdown() {
//     formatLogMessage('info', 'Shutdown', 'מתחיל סגירה חלקה');
    
//     io.emit('server-shutdown', {
//         message: 'השרת עובר לתחזוקה, יחזור בקרוב',
//         timestamp: new Date().toISOString()
//     });
    
//     server.close((err) => {
//         if (err) {
//             formatLogMessage('error', 'Shutdown', 'שגיאה בסגירת השרת', err.message);
//             process.exit(1);
//         }
        
//         formatLogMessage('success', 'Shutdown', '✅ שרת נסגר בהצלחה');
//         process.exit(0);
//     });
    
//     setTimeout(() => {
//         formatLogMessage('warning', 'Shutdown', '⏰ כפה סגירה אחרי timeout');
//         process.exit(1);
//     }, 10000);
// }

// startServer();

// // module.exports = app;
// module.exports = { app, server, formatLogMessage };

// server.js - מערכת התראות חכמה עם תיקון CSP
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

// Middleware מתקדם עם CSP מתוקן
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'", "netfree.link"],
            styleSrc: ["'self'", "'unsafe-inline'", "netfree.link"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "netfree.link"],
            connectSrc: ["'self'", "wss:", "ws:", "https:", "netfree.link"],
            imgSrc: ["'self'", "data:", "https:", "netfree.link"],
            fontSrc: ["'self'", "https:", "data:", "netfree.link"],
            mediaSrc: ["'self'", "data:", "blob:", "netfree.link"], // הוספת תמיכה באודיו
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
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
    try {
        const cities = Object.keys(cityData).sort();
        res.json(cities);
        formatLogMessage('success', 'API', `נשלחו ${cities.length} ערים`);
    } catch (error) {
        formatLogMessage('error', 'API', 'שגיאה בטעינת ערים', error.message);
        res.status(500).json({ error: 'שגיאה בטעינת ערים' });
    }
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
            
            // נסה להשתמש ב-API של פיקוד העורף לקבלת היסטוריה
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
            
            // חזור להיסטוריה מקומית
            const localHistory = alertHistory.filter(alert => 
                !alert.cities || alert.cities.length === 0 || alert.cities.includes(city)
            ).slice(0, 50);
            
            res.json(localHistory);
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
    res.sendFile(path.join(__dirname, 'index.html'));
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