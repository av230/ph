
// // נתוני ערים מעודכנים - רשימה מלאה ומעודכנת
// // server.js - מערכת התראות חכמה עם תיקונים מלאים - גרסה 3.0
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');
// const fs = require('fs');
// const axios = require('axios');
// const helmet = require('helmet');
// const compression = require('compression');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Content-Type"],
//         credentials: false
//     },
//     allowEIO3: true,
//     transports: ['polling', 'websocket'],
//     pingTimeout: 60000,
//     pingInterval: 25000
// });

// const PORT = process.env.PORT || 3000;
// const cityData = {
//     'אבו גוש': { zone: 'ירושלים', shelterTime: 90, area: 203, established: 1994 },
//     'אבן יהודה': { zone: 'שרון', shelterTime: 90, area: 1083, established: 1932 },
//     'אום אל פחם': { zone: 'משולש', shelterTime: 90, area: 401, established: 1265 },
//     'אופקים': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1202, established: 1955 },
//     'אור עקיבא': { zone: 'חיפה והכרמל', shelterTime: 60, area: 395, established: 1951 },
//     'אור יהודה': { zone: 'דן', shelterTime: 90, area: 105, established: 1950 },
//     'אורך': { zone: 'גליל מערבי', shelterTime: 60, area: 137, established: -1500 },
//     'אלעד': { zone: 'דן', shelterTime: 90, area: 108, established: 1998 },
//     'אלקנה': { zone: 'שומרון', shelterTime: 90, area: 306 },
//     'אפרת': { zone: 'גוש עציון', shelterTime: 90, area: 308, established: 1983 },
//     'אריאל': { zone: 'שומרון', shelterTime: 90, area: 301, established: 1978 },
//     'באר יעקב': { zone: 'יהודה', shelterTime: 90, area: 1158, established: 1907 },
//     'באר שבע': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1200, established: 1900 },
//     'בית אל': { zone: 'שומרון', shelterTime: 90, area: 303 },
//     'בית שמש': { zone: 'ירושלים', shelterTime: 90, area: 143, established: 1950 },
//     'בית שאן': { zone: 'בקעת הירדן', shelterTime: 60, area: 85, established: -4000 },
//     'ביתר עילית': { zone: 'גוש עציון', shelterTime: 90, area: 302, established: 1988 },
//     'בני ברק': { zone: 'דן', shelterTime: 90, area: 164, established: 1924 },
//     'בוקעתא': { zone: 'גולן', shelterTime: 60, area: 146 },
//     'בת ים': { zone: 'דן', shelterTime: 90, area: 103, established: 1926 },
//     'גבעת שמואל': { zone: 'דן', shelterTime: 90, area: 115, established: 1942 },
//     'גבעתיים': { zone: 'דן', shelterTime: 90, area: 111, established: 1922 },
//     'גדרה': { zone: 'יהודה', shelterTime: 90, area: 1147, established: 1884 },
//     'גן יבנה': { zone: 'יהודה', shelterTime: 90, area: 1150 },
//     'גני תקווה': { zone: 'דן', shelterTime: 90, area: 116, established: 1949 },
//     'דאלית אל כרמל': { zone: 'חיפה והכרמל', shelterTime: 60, area: 400 },
//     'דימונה': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1204, established: 1955 },
//     'הוד השרון': { zone: 'שרון', shelterTime: 90, area: 1086, established: 1924 },
//     'הרצליה': { zone: 'שרון', shelterTime: 90, area: 1088, established: 1924 },
//     'חדרה': { zone: 'שרון', shelterTime: 90, area: 1093, established: 1890 },
//     'חולון': { zone: 'דן', shelterTime: 90, area: 107, established: 1935 },
//     'חיפה': { zone: 'חיפה והכרמל', shelterTime: 60, area: 394, established: -1400 },
//     'חריש': { zone: 'שרון', shelterTime: 90, area: 1090, established: 2015 },
//     'חצור הגלילית': { zone: 'גליל עליון', shelterTime: 60, area: 141 },
//     'יבנה': { zone: 'יהודה', shelterTime: 90, area: 1148, established: 1949 },
//     'יהוד מונוסון': { zone: 'דן', shelterTime: 90, area: 110, established: 1960 },
//     'יקנעם עילית': { zone: 'עמק יזרעאל', shelterTime: 60, area: 82, established: 1981 },
//     'ירושלים': { zone: 'ירושלים', shelterTime: 90, area: 201, established: -3000 },
//     'כפר יונה': { zone: 'שרון', shelterTime: 90, area: 1091, established: 1932 },
//     'כפר קאסם': { zone: 'משולש', shelterTime: 90, area: 403, established: 1800 },
//     'כפר קרע': { zone: 'משולש', shelterTime: 90, area: 407, established: 1800 },
//     'כפר סבא': { zone: 'שרון', shelterTime: 90, area: 1084, established: 1903 },
//     'כרמיאל': { zone: 'גליל מערבי', shelterTime: 60, area: 134, established: 1964 },
//     'לקיה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1210 },
//     'מגדל': { zone: 'כינרת', shelterTime: 60, area: 81 },
//     'מגדל העמק': { zone: 'עמק יזרעאל', shelterTime: 60, area: 86, established: 1952 },
//     'מגדל שמס': { zone: 'גולן', shelterTime: 60, area: 147 },
//     'מבשרת ציון': { zone: 'ירושלים', shelterTime: 90, area: 202 },
//     'מודיעין מכבים רעות': { zone: 'מודיעין', shelterTime: 90, area: 1166, established: 1985 },
//     'מודיעין עילית': { zone: 'שומרון', shelterTime: 90, area: 303, established: 1990 },
//     'מטולה': { zone: 'גליל עליון', shelterTime: 15, area: 139, established: 1896 },
//     'מג"ב גולן': { zone: 'גולן', shelterTime: 30, area: 143 },
//     'מעאר': { zone: 'גליל מערבי', shelterTime: 60, area: 408, established: 2019 },
//     'מעלה אדומים': { zone: 'ירושלים', shelterTime: 90, area: 142, established: 1975 },
//     'מעלות תרשיחא': { zone: 'גליל מערבי', shelterTime: 60, area: 135, established: 1963 },
//     'מזכרת בתיה': { zone: 'יהודה', shelterTime: 90, area: 1155 },
//     'מסעדה': { zone: 'גולן', shelterTime: 60, area: 148 },
//     'מצפה רמון': { zone: 'באר שבע והנגב', shelterTime: 180, area: 1206 },
//     'נהריה': { zone: 'גליל מערבי', shelterTime: 60, area: 136, established: 1934 },
//     'נוף הגליל': { zone: 'גליל תחתון', shelterTime: 60, area: 83, established: 1957 },
//     'נצרת': { zone: 'עמק יזרעאל', shelterTime: 60, area: 78, established: 200 },
//     'נשר': { zone: 'חיפה והכרמל', shelterTime: 60, area: 403, established: 1925 },
//     'נס ציונה': { zone: 'יהודה', shelterTime: 90, area: 1149, established: 1883 },
//     'נתיבות': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1201, established: 1956 },
//     'נתניה': { zone: 'שרון', shelterTime: 45, area: 1081, established: 1929 },
//     'סחנין': { zone: 'גליל תחתון', shelterTime: 60, area: 402, established: 1850 },
//     'עוספיא': { zone: 'חיפה והכרמל', shelterTime: 60, area: 401 },
//     'עמנואל': { zone: 'שומרון', shelterTime: 90, area: 305 },
//     'עפולה': { zone: 'עמק יזרעאל', shelterTime: 60, area: 77, established: 1925 },
//     'עראבה': { zone: 'גליל תחתון', shelterTime: 60, area: 406, established: 1850 },
//     'ערד': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1205, established: 1962 },
//     'ערערה בנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1209 },
//     'פתח תקווה': { zone: 'דן', shelterTime: 90, area: 109, established: 1878 },
//     'פרדס חנה כרכור': { zone: 'שרון', shelterTime: 90, area: 1092, established: 1913 },
//     'צפת': { zone: 'גליל עליון', shelterTime: 60, area: 133, established: 1140 },
//     'צפרירים': { zone: 'יהודה', shelterTime: 90, area: 1152 },
//     'קדומים': { zone: 'שומרון', shelterTime: 90, area: 307 },
//     'קלנסווה': { zone: 'משולש', shelterTime: 90, area: 405, established: 1863 },
//     'קצרין': { zone: 'גולן', shelterTime: 60, area: 142, established: 1977 },
//     'קרית אונו': { zone: 'דן', shelterTime: 90, area: 112, established: 1939 },
//     'קרית אתא': { zone: 'חיפה והכרמל', shelterTime: 60, area: 396, established: 1925 },
//     'קרית ביאליק': { zone: 'חיפה והכרמל', shelterTime: 60, area: 397, established: 1934 },
//     'קרית גת': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1036, established: 1955 },
//     'קרית ים': { zone: 'חיפה והכרמל', shelterTime: 60, area: 398, established: 1945 },
//     'קרית מלאכי': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1037, established: 1951 },
//     'קרית מוצקין': { zone: 'חיפה והכרמל', shelterTime: 60, area: 399, established: 1934 },
//     'קרית עקרון': { zone: 'יהודה', shelterTime: 90, area: 1153 },
//     'קרית שמונה': { zone: 'גליל עליון', shelterTime: 30, area: 140, established: 1949 },
//     'ראמלה': { zone: 'יהודה', shelterTime: 90, area: 1144, established: 716 },
//     'ראש העין': { zone: 'שרון', shelterTime: 90, area: 1089, established: 1949 },
//     'ראשון לציון': { zone: 'דן', shelterTime: 90, area: 104, established: 1882 },
//     'רחובות': { zone: 'יהודה', shelterTime: 90, area: 1146, established: 1890 },
//     'רמת גן': { zone: 'דן', shelterTime: 90, area: 106, established: 1921 },
//     'רמת השרון': { zone: 'שרון', shelterTime: 90, area: 1087, established: 1923 },
//     'רעננה': { zone: 'שרון', shelterTime: 90, area: 1082, established: 1922 },
//     'רהט': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1208, established: 1994 },
//     'שדרות': { zone: 'באר שבע והנגב', shelterTime: 15, area: 1203, established: 1951 },
//     'שוהם': { zone: 'יהודה', shelterTime: 90, area: 1154 },
//     'שלומי': { zone: 'גליל מערבי', shelterTime: 30, area: 138 },
//     'טבריה': { zone: 'כינרת', shelterTime: 60, area: 80, established: 20 },
//     'טייבה': { zone: 'משולש', shelterTime: 45, area: 404, established: 1200 },
//     'טירת כרמל': { zone: 'חיפה והכרמל', shelterTime: 60, area: 402, established: 1992 },
//     'תל אביב יפו': { zone: 'דן', shelterTime: 90, area: 102, established: 1909 },
//     'תל מונד': { zone: 'שרון', shelterTime: 90, area: 1094, established: 1926 },
    
//     // ערים נוספות שחסרו במקור
//     'אשדוד': { zone: 'אשדוד', shelterTime: 45, area: 1031, established: 1956 },
//     'אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 30, area: 1035, established: 1950 },
//     'בנימינה גבעת עדה': { zone: 'שרון', shelterTime: 90, area: 1095, established: 1922 },
//     'זכרון יעקב': { zone: 'שרון', shelterTime: 90, area: 1096, established: 1882 },
//     'יבנאל': { zone: 'כינרת', shelterTime: 60, area: 84, established: 1901 },
//     'יקנעם': { zone: 'עמק יזרעאל', shelterTime: 60, area: 87, established: 1935 },
//     'לוד': { zone: 'יהודה', shelterTime: 90, area: 1145, established: -8000 },
//     'מעיליא': { zone: 'גליל עליון', shelterTime: 30, area: 150, established: 1963 },
//     'נצרת עילית': { zone: 'גליל תחתון', shelterTime: 60, area: 79, established: 1957 },
//     'פקיעין': { zone: 'גליל מערבי', shelterTime: 60, area: 137, established: 1955 },
//     'שפרעם': { zone: 'גליל מערבי', shelterTime: 60, area: 405, established: 636 },
    
//     // אזור ים המלח
//     'בתי מלון ים המלח': { zone: 'ים המלח', shelterTime: 60, area: 1301, established: 1960 },
//     'מלונות ים המלח מרכז': { zone: 'ים המלח', shelterTime: 60, area: 1302, established: 1960 },
//     'מלונות ים המלח צפון': { zone: 'ים המלח', shelterTime: 60, area: 1303, established: 1960 },
//     'מלונות ים המלח דרום': { zone: 'ים המלח', shelterTime: 60, area: 1304, established: 1960 },
//     'נווה זוהר': { zone: 'ים המלח', shelterTime: 60, area: 1305, established: 1969 },
//     'עין בוקק': { zone: 'ים המלח', shelterTime: 60, area: 1306, established: 1986 },
//     'מצדה': { zone: 'ים המלח', shelterTime: 60, area: 1307, established: -73 },
//     'עין גדי': { zone: 'ים המלח', shelterTime: 60, area: 1308, established: 1956 },
//     'מרחצאות עין גדי': { zone: 'ים המלח', shelterTime: 60, area: 1309 },
    
//     // אזורי תעשייה מהדרום
//     'אורון תעשייה ומסחר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1400 },
//     'אזור תעשייה דימונה': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1401 },
//     'אזור תעשייה עידן הנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1402 },
//     'אזור תעשייה רותם': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1403 },
//     'אזור תעשייה צפוני אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1420 },
//     'אזור תעשייה הדרומי אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1421 },
//     'אזור תעשייה נ.ע.מ': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1422 },
//     'אזור תעשייה מיתרים': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1423 },
    
//     // יישובי דרום נוספים
//     'אל פורעה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1404 },
//     'בית קמה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1405 },
//     'גבעות בר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1406 },
//     'גבעות גורל': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1407 },
//     'דביר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1408 },
//     'הר הנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1409 },
//     'ירוחם': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1410 },
//     'כסייפה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1411 },
//     'להב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1412 },
//     'להבים': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1413 },
//     'מרעית': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1414 },
//     'משמר הנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1415 },
//     'קסר א-סר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1416 },
//     'שובל': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1417 },
//     'תארבין': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1418 },
//     'תל ערד': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1419 },
    
//     // עוטף עזה - יישובים נוספים שחסרו
//     'אבשלום': { zone: 'עוטף עזה', shelterTime: 15, area: 1430 },
//     'אורים': { zone: 'עוטף עזה', shelterTime: 15, area: 1431 },
//     'ארז': { zone: 'עוטף עזה', shelterTime: 15, area: 1432 },
//     'אשבול': { zone: 'עוטף עזה', shelterTime: 15, area: 1433 },
//     'בארי': { zone: 'עוטף עזה', shelterTime: 15, area: 1434 },
//     'בית שקמה': { zone: 'עוטף עזה', shelterTime: 15, area: 1435 },
//     'בני נצרים': { zone: 'עוטף עזה', shelterTime: 15, area: 1436 },
//     'ברור חיל': { zone: 'עוטף עזה', shelterTime: 15, area: 1437 },
//     'ברוש': { zone: 'עוטף עזה', shelterTime: 15, area: 1438 },
//     'בת הדר': { zone: 'עוטף עזה', shelterTime: 15, area: 1439 },
//     'גברעם': { zone: 'עוטף עזה', shelterTime: 15, area: 1440 },
//     'גיאה': { zone: 'עוטף עזה', shelterTime: 15, area: 1441 },
//     'דורות': { zone: 'עוטף עזה', shelterTime: 15, area: 1442 },
//     'דקל': { zone: 'עוטף עזה', shelterTime: 15, area: 1443 },
//     'זיקים': { zone: 'עוטף עזה', shelterTime: 15, area: 1444 },
//     'זמרת': { zone: 'עוטף עזה', shelterTime: 15, area: 1445 },
//     'זרועה': { zone: 'עוטף עזה', shelterTime: 15, area: 1446 },
//     'חולית': { zone: 'עוטף עזה', shelterTime: 15, area: 1447 },
//     'חלץ': { zone: 'עוטף עזה', shelterTime: 15, area: 1448 },
//     'יבול': { zone: 'עוטף עזה', shelterTime: 15, area: 1449 },
//     'יד מרדכי': { zone: 'עוטף עזה', shelterTime: 15, area: 1450 },
//     'יושיביה': { zone: 'עוטף עזה', shelterTime: 15, area: 1451 },
//     'יכיני': { zone: 'עוטף עזה', shelterTime: 15, area: 1452 },
//     'יתד': { zone: 'עוטף עזה', shelterTime: 15, area: 1453 },
//     'כיסופים': { zone: 'עוטף עזה', shelterTime: 15, area: 1454 },
//     'כרם שלום': { zone: 'עוטף עזה', shelterTime: 15, area: 1455 },
//     'כרמיה': { zone: 'עוטף עזה', shelterTime: 15, area: 1456 },
//     'מבועים': { zone: 'עוטף עזה', shelterTime: 15, area: 1457 },
//     'מבטחים': { zone: 'עוטף עזה', shelterTime: 15, area: 1458 },
//     'מבקיעים': { zone: 'עוטף עזה', shelterTime: 15, area: 1459 },
//     'מגן': { zone: 'עוטף עזה', shelterTime: 15, area: 1460 },
//     'מפלסים': { zone: 'עוטף עזה', shelterTime: 15, area: 1461 },
//     'נווה': { zone: 'עוטף עזה', shelterTime: 15, area: 1462 },
//     'ניר יצחק': { zone: 'עוטף עזה', shelterTime: 15, area: 1463 },
//     'ניר משה': { zone: 'עוטף עזה', shelterTime: 15, area: 1464 },
//     'ניר עוז': { zone: 'עוטף עזה', shelterTime: 15, area: 1465 },
//     'ניר עקיבא': { zone: 'עוטף עזה', shelterTime: 15, area: 1466 },
//     'נירים': { zone: 'עוטף עזה', shelterTime: 15, area: 1467 },
//     'נתיב העשרה': { zone: 'עוטף עזה', shelterTime: 15, area: 1468 },
//     'סופה': { zone: 'עוטף עזה', shelterTime: 15, area: 1469 },
//     'סעד': { zone: 'עוטף עזה', shelterTime: 15, area: 1470 },
//     'עין הבשור': { zone: 'עוטף עזה', shelterTime: 15, area: 1471 },
//     'עין השלושה': { zone: 'עוטף עזה', shelterTime: 15, area: 1472 },
//     'עלומים': { zone: 'עוטף עזה', shelterTime: 15, area: 1473 },
//     'פטיש': { zone: 'עוטף עזה', shelterTime: 15, area: 1474 },
//     'פרי גן': { zone: 'עוטף עזה', shelterTime: 15, area: 1475 },
//     'קלחים': { zone: 'עוטף עזה', shelterTime: 15, area: 1476 },
//     'רוחמה': { zone: 'עוטף עזה', shelterTime: 15, area: 1477 },
//     'רעים': { zone: 'עוטף עזה', shelterTime: 15, area: 1478 },
//     'שבי דרום': { zone: 'עוטף עזה', shelterTime: 15, area: 1479 },
//     'שדה ניצן': { zone: 'עוטף עזה', shelterTime: 15, area: 1480 },
//     'שדה צבי': { zone: 'עוטף עזה', shelterTime: 15, area: 1481 },
//     'שדי אברהם': { zone: 'עוטף עזה', shelterTime: 15, area: 1482 },
//     'שוקדה': { zone: 'עוטף עזה', shelterTime: 15, area: 1483 },
//     'שיבולים': { zone: 'עוטף עזה', shelterTime: 15, area: 1484 },
//     'שלומית': { zone: 'עוטף עזה', shelterTime: 15, area: 1485 },
//     'שרשרת': { zone: 'עוטף עזה', shelterTime: 15, area: 1486 },
//     'תאשור': { zone: 'עוטף עזה', shelterTime: 15, area: 1487 },
//     'תדהר': { zone: 'עוטף עזה', shelterTime: 15, area: 1488 },
//     'תלמי אליהו': { zone: 'עוטף עזה', shelterTime: 15, area: 1489 },
//     'תלמי יוסף': { zone: 'עוטף עזה', shelterTime: 15, area: 1490 },
//     'תלמי יפה': { zone: 'עוטף עזה', shelterTime: 15, area: 1491 },
    
//     // יישובי גבול נוספים
//     'מתת': { zone: 'גליל עליון', shelterTime: 15, area: 144, established: 1980 },
//     'מרגליות': { zone: 'גליל עליון', shelterTime: 15, area: 145, established: 1951 },
//     'דן': { zone: 'גליל עליון', shelterTime: 15, area: 146, established: 1939 },
//     'שמיר': { zone: 'גליל עליון', shelterTime: 15, area: 147, established: 1944 },
//     'הגושרים': { zone: 'גליל עליון', shelterTime: 15, area: 148, established: 1948 },
//     'נאות מרדכי': { zone: 'גליל עליון', shelterTime: 15, area: 149, established: 1946 },
    
//     // יישובים נוספים מהלוג
//     'שדה אברהם': { zone: 'עוטף עזה', shelterTime: 15, area: 1310, established: 1982 },
//     'תקומה': { zone: 'עוטף עזה', shelterTime: 15, area: 1311, established: 1949 },
//     'ניר עם': { zone: 'עוטף עזה', shelterTime: 15, area: 1312, established: 1943 },
//     'כפר עזה': { zone: 'עוטף עזה', shelterTime: 15, area: 1313, established: 1951 },
//     'נחל עוז': { zone: 'עוטף עזה', shelterTime: 15, area: 1314, established: 1951 },
//     'אור הנר': { zone: 'עוטף עזה', shelterTime: 15, area: 1315, established: 1957 },
    
//     // ערים נוספות חשובות שחסרו
//     'אילת': { zone: 'אילת', shelterTime: 180, area: 1207, established: 1949 },
//     'גבעת זאב': { zone: 'ירושלים', shelterTime: 90, area: 204, established: 1983 },
//     'מעלה עדומים': { zone: 'ירושלים', shelterTime: 90, area: 205, established: 1975 },
//     'פסגת זאב': { zone: 'ירושלים', shelterTime: 90, area: 206, established: 1985 },
//     'גבעת שמואל': { zone: 'דן', shelterTime: 90, area: 117, established: 1942 },
//     'חולון': { zone: 'דן', shelterTime: 90, area: 108, established: 1935 },
//     'כפר מנדא': { zone: 'גליל תחתון', shelterTime: 60, area: 409, established: 1800 },
//     'מגדל העמק': { zone: 'עמק יזרעאל', shelterTime: 60, area: 88, established: 1952 },
//     'ראש פינה': { zone: 'גליל עליון', shelterTime: 30, area: 151, established: 1882 },
//     'יסוד המעלה': { zone: 'גליל עליון', shelterTime: 30, area: 152, established: 1883 },
//     'רמת ישי': { zone: 'עמק יזרעאל', shelterTime: 60, area: 89, established: 1925 },
//     'יפיע': { zone: 'גליל תחתון', shelterTime: 60, area: 410, established: 1926 },
//     'עין מאהל': { zone: 'גליל תחתון', shelterTime: 60, area: 411, established: 1935 },
//     'דיר חנא': { zone: 'גליל מערבי', shelterTime: 60, area: 412, established: 1800 },
//     "ג'ת": { zone: 'משולש', shelterTime: 90, area: 413, established: 1886 },
//     'באקה אל גרביה': { zone: 'משולש', shelterTime: 90, area: 414, established: 1400 },
//     'ועדי עארה': { zone: 'משולש', shelterTime: 90, area: 415, established: 1967 },
//     'מעיליא': { zone: 'גליל עליון', shelterTime: 15, area: 153, established: 1963 },
//     'קריית ארבע': { zone: 'גוש עציון', shelterTime: 90, area: 309, established: 1968 },
//     'כוכב יאיר': { zone: 'דן', shelterTime: 90, area: 118, established: 1981 },
//     'כפר ורדים': { zone: 'גליל עליון', shelterTime: 30, area: 154, established: 1979 },
//     'שלמי': { zone: 'גליל עליון', shelterTime: 15, area: 155, established: 1950 },
//     'משגב עם': { zone: 'גליל עליון', shelterTime: 30, area: 156, established: 1940 },
//     'עבדון': { zone: 'גליל מערבי', shelterTime: 30, area: 157, established: 1945 },
//     'פסוטה': { zone: 'גליל עליון', shelterTime: 15, area: 158, established: 1940 },
//     'מנוף': { zone: 'גליל עליון', shelterTime: 15, area: 159, established: 1980 },
//     'אדמית': { zone: 'גליל עליון', shelterTime: 15, area: 160, established: 1958 },
//     'זרית': { zone: 'גליל עליון', shelterTime: 15, area: 161, established: 1956 },
//     'גורן': { zone: 'גליל עליון', shelterTime: 30, area: 162, established: 1950 },
//     'נתועה': { zone: 'גליל עליון', shelterTime: 15, area: 163, established: 1966 },
//     'שתולה': { zone: 'גליל עליון', shelterTime: 15, area: 164, established: 1969 },
//     'קדש': { zone: 'גליל עליון', shelterTime: 15, area: 165, established: 1981 },
//     'מלכיה': { zone: 'גליל עליון', shelterTime: 15, area: 166, established: 1949 },
//     'יפתח': { zone: 'גליל עליון', shelterTime: 15, area: 167, established: 1950 },
//     'עין קיניא': { zone: 'גליל עליון', shelterTime: 15, area: 168, established: 1964 },
//     'משמר הירדן': { zone: 'בקעת הירדן', shelterTime: 60, area: 169, established: 1890 },
//     'יסוד המעלה': { zone: 'גליל עליון', shelterTime: 30, area: 170, established: 1883 },
//     'כפר גלעדי': { zone: 'גליל עליון', shelterTime: 15, area: 171, established: 1949 },
//     'הזורעים': { zone: 'גליל עליון', shelterTime: 30, area: 172, established: 1948 },
//     'שושנת העמקים': { zone: 'גליל עליון', shelterTime: 30, area: 173, established: 1948 },
//     'בנימין': { zone: 'שומרון', shelterTime: 90, area: 310, established: 1985 },
//     'קרני שומרון': { zone: 'שומרון', shelterTime: 90, area: 311, established: 1978 },
//     'אלפי מנשה': { zone: 'שומרון', shelterTime: 90, area: 312, established: 1982 },
//     'ברקן': { zone: 'שומרון', shelterTime: 90, area: 313, established: 1981 },
//     'עפרה': { zone: 'שומרון', shelterTime: 90, area: 314, established: 1978 },
//     'גבעת אסף': { zone: 'שומרון', shelterTime: 90, area: 315, established: 1983 },
//     'עתניאל': { zone: 'הר חברון', shelterTime: 90, area: 316, established: 1983 },
//     'קריית נטפים': { zone: 'ירושלים', shelterTime: 90, area: 207, established: 1988 },
//     'תלפיות': { zone: 'ירושלים', shelterTime: 90, area: 208, established: 1922 },
//     'רמות': { zone: 'ירושלים', shelterTime: 90, area: 209, established: 1973 },
//     'נווה יעקב': { zone: 'ירושלים', shelterTime: 90, area: 210, established: 1924 },
//     'פיסגת זאב': { zone: 'ירושלים', shelterTime: 90, area: 211, established: 1985 },
//     'גילה': { zone: 'ירושלים', shelterTime: 90, area: 212, established: 1973 },
//     'הר חומה': { zone: 'ירושלים', shelterTime: 90, area: 213, established: 1997 }
// };

// // מילון קיצורים וכינויים לערים
// const cityAliases = {
//     'ת"א': 'תל אביב יפו',
//     'תא': 'תל אביב יפו',
//     'תל אביב': 'תל אביב יפו',
//     'ירושלים': ['ירושלים', 'מעלה אדומים', 'בית שמש'],
//     'ב"ש': 'באר שבע',
//     'בש': 'באר שבע',
//     'ק"ש': 'קרית שמונה',
//     'קש': 'קרית שמונה',
//     'פ"ת': 'פתח תקווה',
//     'פת': 'פתח תקווה',
//     'ר"ג': 'רמת גן',
//     'רג': 'רמת גן'
// };

// // משתנים גלובליים
// let alertHistory = [];
// let lastAlert = null;
// let lastAlertId = null;
// let connectedUsers = new Map();
// let isLiveMode = true;

// // Cache ו-Health Monitoring
// const alertCache = new Map();
// const CACHE_DURATION = 30000; // 30 שניות
// let apiHealthStatus = {
//     kore: { lastSuccess: null, failures: 0 },
//     oref: { lastSuccess: null, failures: 0 }
// };

// // Rate Limiting
// const requestCounts = new Map();
// const RATE_LIMIT_WINDOW = 60000; // דקה
// const MAX_REQUESTS_PER_WINDOW = 100;



// // Middleware מתקדם עם CSP מתוקן לתמיכה ב-Socket.IO
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'", "netfree.link"],
//             styleSrc: ["'self'", "'unsafe-inline'", "netfree.link"],
//             scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "netfree.link"],
//             connectSrc: ["'self'", "wss:", "ws:", "https:", "netfree.link"],
//             imgSrc: ["'self'", "data:", "https:", "netfree.link"],
//             fontSrc: ["'self'", "https:", "data:", "netfree.link"],
//             mediaSrc: ["'self'", "data:", "blob:", "netfree.link"],
//             objectSrc: ["'none'"],
//             baseUri: ["'self'"],
//             formAction: ["'self'"],
//             frameAncestors: ["'none'"]
//         }
//     },
//     crossOriginEmbedderPolicy: false
// }));

// app.use(compression());
// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
// }));
// app.use(express.json());
// app.use(express.static('public', {
//     setHeaders: (res, path) => {
//         if (path.endsWith('.html')) {
//             res.setHeader('Cache-Control', 'no-cache');
//         }
//     }
// }));

// // Rate Limiting Middleware
// app.use((req, res, next) => {
//     const clientIP = req.ip || req.connection.remoteAddress;
//     const now = Date.now();
    
//     if (!requestCounts.has(clientIP)) {
//         requestCounts.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
//     } else {
//         const clientData = requestCounts.get(clientIP);
        
//         if (now > clientData.resetTime) {
//             clientData.count = 1;
//             clientData.resetTime = now + RATE_LIMIT_WINDOW;
//         } else {
//             clientData.count++;
//         }
        
//         if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
//             return res.status(429).json({ 
//                 error: 'יותר מדי בקשות, נסה שוב בעוד דקה',
//                 retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
//             });
//         }
//     }
    
//     next();
// });

// // פונקציות לוגים משופרות
// function formatLogMessage(level, source, message, data = null) {
//     const timestamp = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
//     const icons = {
//         info: 'ℹ️',
//         success: '✅',
//         warning: '⚠️',
//         error: '❌',
//         debug: '🔍'
//     };
    
//     let logMsg = `${icons[level] || '📝'} [${timestamp}] ${source}: ${message}`;
//     if (data) {
//         logMsg += ` | ${JSON.stringify(data)}`;
//     }
    
//     console.log(logMsg);
// }

// // פונקציות דמיון מחרוזות
// function levenshteinDistance(str1, str2) {
//     const matrix = Array(str2.length + 1).fill(null).map(() => 
//         Array(str1.length + 1).fill(null)
//     );
    
//     for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
//     for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
//     for (let j = 1; j <= str2.length; j++) {
//         for (let i = 1; i <= str1.length; i++) {
//             const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
//             matrix[j][i] = Math.min(
//                 matrix[j][i - 1] + 1,
//                 matrix[j - 1][i] + 1,
//                 matrix[j - 1][i - 1] + indicator
//             );
//         }
//     }
    
//     return matrix[str2.length][str1.length];
// }

// function calculateSimilarity(str1, str2) {
//     const longer = str1.length > str2.length ? str1 : str2;
//     const shorter = str1.length > str2.length ? str2 : str1;
    
//     if (longer.length === 0) return 1.0;
    
//     const distance = levenshteinDistance(longer, shorter);
//     return (longer.length - distance) / longer.length;
// }

// // זיהוי ערים משופר עם Fuzzy Matching
// function getCityMatchesFromAlert(alertCities) {
//     const matches = [];
//     const alertCitiesLower = (alertCities || []).map(city => city.toLowerCase().trim());
    
//     Object.keys(cityData).forEach(ourCity => {
//         const ourCityLower = ourCity.toLowerCase();
        
//         // בדיקה מדוייקת
//         if (alertCitiesLower.includes(ourCityLower)) {
//             matches.push(ourCity);
//             formatLogMessage('debug', 'CityMatch', `התאמה מדוייקת: ${ourCity}`);
//             return;
//         }
        
//         // בדיקה עם קיצורים
//         for (const [alias, fullName] of Object.entries(cityAliases)) {
//             if (typeof fullName === 'string' && fullName === ourCity) {
//                 if (alertCitiesLower.includes(alias.toLowerCase())) {
//                     matches.push(ourCity);
//                     formatLogMessage('debug', 'CityMatch', `התאמת קיצור: ${alias} -> ${ourCity}`);
//                     return;
//                 }
//             } else if (Array.isArray(fullName) && fullName.includes(ourCity)) {
//                 if (alertCitiesLower.includes(alias.toLowerCase())) {
//                     matches.push(ourCity);
//                     formatLogMessage('debug', 'CityMatch', `התאמת קיצור (רשימה): ${alias} -> ${ourCity}`);
//                     return;
//                 }
//             }
//         }
        
//         // בדיקה חלקית - אם אחד מכיל את השני
//         for (const alertCity of alertCitiesLower) {
//             if (alertCity.includes(ourCityLower) || ourCityLower.includes(alertCity)) {
//                 matches.push(ourCity);
//                 formatLogMessage('debug', 'CityMatch', `התאמה חלקית: "${alertCity}" -> "${ourCity}"`);
//                 break;
//             }
            
//             // Fuzzy matching - דמיון חלקי
//             const similarity = calculateSimilarity(alertCity, ourCityLower);
//             if (similarity > 0.75) { 
//                 matches.push(ourCity);
//                 formatLogMessage('debug', 'CityMatch', `התאמת דמיון: "${alertCity}" -> "${ourCity}" (${Math.round(similarity * 100)}%)`);
//                 break;
//             }
//         }
//     });
    
//     if (matches.length > 0) {
//         formatLogMessage('success', 'CityMatch', `נמצאו ${matches.length} התאמות`, {
//             original: alertCities,
//             matched: matches
//         });
//     } else {
//         formatLogMessage('warning', 'CityMatch', 'לא נמצאו התאמות לערים', {
//             alertCities: alertCities
//         });
//     }
    
//     return [...new Set(matches)];
// }

// // מיפוי סוגי התראות מתוקן לפי המפרט הרשמי
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
    
//     const categoryMap = {
//         '1': 'missiles',
//         '2': 'radiologicalEvent',
//         '3': 'earthQuake',
//         '4': 'tsunami',
//         '5': 'hostileAircraftIntrusion',
//         '6': 'newsFlash',
//         '7': 'hazardousMaterials',
//         '8': 'terroristInfiltration',
//         '9': 'general',
//         '10': 'allClear',
//         '101': 'missilesDrill',
//         '102': 'radiologicalEventDrill',
//         '103': 'earthQuakeDrill',
//         '104': 'tsunamiDrill',
//         '105': 'hostileAircraftIntrusionDrill',
//         '106': 'newsFlash',
//         '107': 'hazardousMaterialsDrill',
//         '108': 'terroristInfiltrationDrill'
//     };
    
//     const officialType = categoryMap[koreAlert.cat] || 'unknown';
//     const title = koreAlert.title.toLowerCase();
//     const desc = (koreAlert.desc || '').toLowerCase();
    
//     formatLogMessage('debug', 'AlertMapping', 'מעבד התראה', {
//         category: koreAlert.cat,
//         officialType: officialType,
//         title: koreAlert.title,
//         desc: koreAlert.desc
//     });
    
//     // תיקון מיוחד לקטגוריה 10 - יציאה מממ"ד
//     if (officialType === 'allClear' || koreAlert.cat === '10') {
//         formatLogMessage('info', 'AlertMapping', '🟢 זוהה כהתראת יציאה (קטגוריה 10)', { 
//             desc: koreAlert.desc,
//             cat: koreAlert.cat 
//         });
//         return {
//             type: 'all-clear',
//             title: 'יציאה מהממ"ד',
//             icon: '🟢',
//             description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
//             severity: 'low',
//             class: 'safe'
//         };
//     }
    
//     // בדיקה נוספת לפי תוכן התיאור
//     if (desc.includes('יכולים לצאת') || desc.includes('השוהים במרחב המוגן') || 
//         desc.includes('האירוע הסתיים') || title.includes('יציאה') ||
//         desc.includes('בטוח לצאת') || desc.includes('הסרת התראה')) {
//         formatLogMessage('info', 'AlertMapping', '🟢 זוהה כהתראת יציאה לפי תוכן', { desc: koreAlert.desc });
//         return {
//             type: 'all-clear',
//             title: 'יציאה מהממ"ד',
//             icon: '🟢',
//             description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
//             severity: 'low',
//             class: 'safe'
//         };
//     }
    
//     switch (officialType) {
//         case 'missiles':
//             return {
//                 type: 'shelter',
//                 title: 'היכנסו לממ"ד מיידית!',
//                 icon: '🚨',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן עכשיו!'}`,
//                 severity: 'high',
//                 class: 'danger'
//             };
            
//         case 'newsFlash':
//             if (desc.includes('בטוח') || desc.includes('לצאת') || 
//                 desc.includes('יציאה') || desc.includes('הסרת') || 
//                 title.includes('יציאה') || title.includes('ביטול')) {
//                 formatLogMessage('info', 'AlertMapping', '🟢 newsFlash זוהה כיציאה', { desc: koreAlert.desc });
//                 return {
//                     type: 'all-clear',
//                     title: 'יציאה מהממ"ד',
//                     icon: '🟢',
//                     description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
//                     severity: 'low',
//                     class: 'safe'
//                 };
//             } else if (desc.includes('היכנסו') || desc.includes('מרחב מוגן') || 
//                       desc.includes('ממ"ד') || desc.includes('מקלט')) {
//                 formatLogMessage('info', 'AlertMapping', '🚨 newsFlash זוהה ככניסה', { desc: koreAlert.desc });
//                 return {
//                     type: 'shelter',
//                     title: 'היכנסו לממ"ד מיידית!',
//                     icon: '🚨',
//                     description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן עכשיו!'}`,
//                     severity: 'high',
//                     class: 'danger'
//                 };
//             } else {
//                 formatLogMessage('info', 'AlertMapping', '⚠️ newsFlash זוהה כהתראה מוקדמת', { desc: koreAlert.desc });
//                 return {
//                     type: 'early-warning',
//                     title: 'התראה מוקדמת',
//                     icon: '⚠️',
//                     description: `${koreAlert.title} - ${koreAlert.desc || 'היו ערוכים ומוכנים'}`,
//                     severity: 'medium',
//                     class: 'warning'
//                 };
//             }
            
//         case 'radiologicalEvent':
//             return {
//                 type: 'radiological',
//                 title: 'אירוע רדיולוגי',
//                 icon: '☢️',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'הישארו בבתים, סגרו חלונות ודלתות'}`,
//                 severity: 'high',
//                 class: 'danger'
//             };
            
//         case 'earthQuake':
//             return {
//                 type: 'earthquake',
//                 title: 'רעידת אדמה',
//                 icon: '🌊',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'צאו מהבניין במהירות אל שטח פתוח'}`,
//                 severity: 'high',
//                 class: 'danger'
//             };
            
//         case 'tsunami':
//             return {
//                 type: 'tsunami',
//                 title: 'אזהרת צונאמי',
//                 icon: '🌊',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'התרחקו מהחוף מיידית אל מקום גבוה'}`,
//                 severity: 'high',
//                 class: 'danger'
//             };
            
//         case 'hostileAircraftIntrusion':
//             return {
//                 type: 'aircraft',
//                 title: 'חדירת כלי טיס עויב',
//                 icon: '✈️',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן'}`,
//                 severity: 'high',
//                 class: 'danger'
//             };
            
//         case 'hazardousMaterials':
//             return {
//                 type: 'hazmat',
//                 title: 'חומרים מסוכנים',
//                 icon: '☣️',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'הישארו בבתים, סגרו מערכות אוורור'}`,
//                 severity: 'high',
//                 class: 'danger'
//             };
            
//         case 'terroristInfiltration':
//             return {
//                 type: 'terror',
//                 title: 'הסתננות טרוריסטים',
//                 icon: '🔒',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'נעלו דלתות, הימנעו מיציאה מהבית'}`,
//                 severity: 'high',
//                 class: 'danger'
//             };
            
//         // תרגילים
//         case 'missilesDrill':
//         case 'earthQuakeDrill':
//         case 'radiologicalEventDrill':
//         case 'tsunamiDrill':
//         case 'hostileAircraftIntrusionDrill':
//         case 'hazardousMaterialsDrill':
//         case 'terroristInfiltrationDrill':
//             return {
//                 type: 'drill',
//                 title: 'תרגיל',
//                 icon: '🎯',
//                 description: `${koreAlert.title} - ${koreAlert.desc || 'זהו תרגיל - פעלו לפי ההוראות'}`,
//                 severity: 'medium',
//                 class: 'warning'
//             };
            
//         default:
//             formatLogMessage('warning', 'AlertMapping', '❓ סוג התראה לא מוכר', { 
//                 category: koreAlert.cat, 
//                 officialType: officialType,
//                 title: koreAlert.title 
//             });
//             return {
//                 type: 'unknown',
//                 title: 'התראה לא מוכרת',
//                 icon: '❓',
//                 description: `${koreAlert.title} - ${koreAlert.desc || `סוג התראה: ${officialType}`}`,
//                 severity: 'medium',
//                 class: 'warning'
//             };
//     }
// }

// // API Routes
// app.get('/api/cities', (req, res) => {
//     try {
//         const cities = Object.keys(cityData).sort();
//         res.json(cities);
//         formatLogMessage('success', 'API', `נשלחו ${cities.length} ערים`);
//     } catch (error) {
//         formatLogMessage('error', 'API', 'שגיאה בטעינת ערים', error.message);
//         res.status(500).json({ error: 'שגיאה בטעינת ערים' });
//     }
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

// app.get('/api/alerts/history/:city?', async (req, res) => {
//     const city = req.params.city ? decodeURIComponent(req.params.city) : null;
    
//     if (city) {
//         try {
//             formatLogMessage('info', 'History', `טוען היסטוריה עבור ${city}`);
            
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
            
//             formatLogMessage('success', 'History', `נטענו ${history.length} רשומות עבור ${city}`);
//             res.json(history.slice(0, 50));
            
//         } catch (error) {
//             formatLogMessage('error', 'History', `שגיאה בטעינת היסטוריה עבור ${city}`, error.message);
            
//             const localHistory = alertHistory.filter(alert => 
//                 !alert.cities || alert.cities.length === 0 || alert.cities.includes(city)
//             ).slice(0, 50);
            
//             res.json(localHistory);
//         }
//     } else {
//         res.json(alertHistory.slice(0, 50));
//     }
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

// // WebSocket חיבורים - גרסה מתוקנת עם debugging
// io.on('connection', (socket) => {
//     formatLogMessage('success', 'WebSocket', `✅ משתמש חדש התחבר: ${socket.id}`);
    
//     // שלח מיד אישור חיבור
//     socket.emit('connection-status', {
//         connected: true,
//         mode: isLiveMode ? 'live' : 'simulation',
//         serverTime: new Date().toISOString(),
//         message: 'התחבר בהצלחה לשרת התראות'
//     });
    
//     // לוג כל האירועים שמגיעים
//     socket.onAny((eventName, ...args) => {
//         formatLogMessage('debug', 'Socket-Event', `📨 אירוע: ${eventName}`, args);
//     });
    
//     socket.on('register-city', (cityName) => {
//         formatLogMessage('info', 'Registration', `🏙️ משתמש ${socket.id} נרשם לעיר: ${cityName}`);
        
//         try {
//             // תיקון: נקה התראות ישנות לעיר הספציפית
//             const alertRelevance = clearOldAlertsForCity(cityName);
            
//             connectedUsers.set(socket.id, { 
//                 cityName, 
//                 connectedAt: new Date(),
//                 lastSeen: new Date()
//             });
            
//             // שלח אישור רישום
//             socket.emit('registration-confirmed', {
//                 city: cityName,
//                 status: 'success',
//                 timestamp: new Date().toISOString()
//             });
            
//             // תיקון: שלח התראה רק אם רלוונטית
//             if (lastAlert && alertRelevance === true) {
//                 formatLogMessage('info', 'Registration', `שולח התראה רלוונטית למשתמש חדש`, {
//                     alertType: lastAlert.type,
//                     city: cityName
//                 });
//                 socket.emit('alert-update', lastAlert);
//             } else {
//                 formatLogMessage('info', 'Registration', `שולח מצב בטוח למשתמש חדש`, {
//                     city: cityName,
//                     reason: alertRelevance === false ? 'התראה לא רלוונטית' : 'אין התראה פעילה'
//                 });
//                 sendSafeAlertToUser(socket, cityName);
//             }
            
//             const cityHistory = alertHistory.filter(alert => 
//                 !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
//             ).slice(0, 20);
            
//             socket.emit('history-update', cityHistory);
            
//             formatLogMessage('success', 'Registration', `✅ רישום הושלם עבור ${cityName}`, {
//                 historyItems: cityHistory.length,
//                 connectedUsers: connectedUsers.size
//             });
            
//         } catch (error) {
//             formatLogMessage('error', 'Registration', `❌ שגיאה ברישום עיר ${cityName}`, error.message);
//             socket.emit('registration-error', {
//                 city: cityName,
//                 error: error.message
//             });
//         }
//     });
    
//     socket.on('get-history', (cityName) => {
//         formatLogMessage('debug', 'History', `📚 בקשת היסטוריה עבור ${cityName}`);
        
//         try {
//             const cityHistory = alertHistory.filter(alert => 
//                 !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
//             ).slice(0, 20);
            
//             socket.emit('history-update', cityHistory);
            
//             formatLogMessage('success', 'History', `✅ נשלחה היסטוריה עבור ${cityName}`, {
//                 items: cityHistory.length
//             });
//         } catch (error) {
//             formatLogMessage('error', 'History', `❌ שגיאה בטעינת היסטוריה`, error.message);
//         }
//     });
    
//     socket.on('ping', () => {
//         socket.emit('pong', { timestamp: new Date().toISOString() });
//     });
    
//     socket.on('disconnect', (reason) => {
//         formatLogMessage('warning', 'WebSocket', `❌ משתמש ${socket.id} התנתק: ${reason}`);
//         connectedUsers.delete(socket.id);
//     });
    
//     socket.on('error', (error) => {
//         formatLogMessage('error', 'WebSocket', `🚨 שגיאת Socket ${socket.id}`, error.message);
//     });
// });

// // פונקציה מתוקנת לניקוי התראות ישנות
// function clearOldAlertsForCity(cityName) {
//     formatLogMessage('debug', 'AlertClear', `🧹 מנקה התראות ישנות עבור ${cityName}`);
    
//     if (lastAlert && lastAlert.cities && lastAlert.cities.length > 0) {
//         const isRelevant = lastAlert.cities.includes(cityName);
//         if (!isRelevant) {
//             formatLogMessage('info', 'AlertClear', `התראה פעילה לא רלוונטית לעיר ${cityName}`, {
//                 alertCities: lastAlert.cities,
//                 alertType: lastAlert.type,
//                 shouldClearForThisCity: true
//             });
//             return false;
//         } else {
//             formatLogMessage('info', 'AlertClear', `התראה פעילה רלוונטית לעיר ${cityName}`, {
//                 alertCities: lastAlert.cities,
//                 alertType: lastAlert.type
//             });
//             return true;
//         }
//     }
    
//     formatLogMessage('debug', 'AlertClear', `אין התראה פעילה עבור ${cityName}`);
//     return null;
// }

// // פונקציה חדשה לשליחת מצב בטוח
// function sendSafeAlertToUser(socket, cityName) {
//     const safeAlert = {
//         type: 'safe',
//         title: 'מצב רגיל',
//         icon: '✅',
//         description: 'אין התראות פעילות באזור שלך',
//         severity: 'low',
//         class: 'safe',
//         cities: [cityName],
//         timestamp: new Date().toISOString(),
//         hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//         source: 'system-safe-for-city'
//     };
    
//     socket.emit('alert-update', safeAlert);
    
//     formatLogMessage('debug', 'SafeAlert', `נשלח מצב בטוח למשתמש`, {
//         city: cityName,
//         socketId: socket.id.substring(0, 8)
//     });
// }

// // פונקציית התראות מתוקנת
// function notifyRelevantUsers(alert) {
//     if (!alert.cities || alert.cities.length === 0) {
//         formatLogMessage('error', 'Notification', '🚨 התראה ללא ערים מוגדרות - לא שולח לאף אחד!', {
//             alertType: alert.type,
//             originalCities: alert.originalCities?.length || 0,
//             alertTitle: alert.title
//         });
//         return;
//     }
    
//     let notifiedCount = 0;
//     let shouldNotifyUsers = [];
    
//     formatLogMessage('debug', 'Notification', '🔍 בודק משתמשים מחוברים', {
//         totalConnectedUsers: connectedUsers.size,
//         connectedUsersCities: Array.from(connectedUsers.values()).map(u => u.cityName),
//         alertAffectedCities: alert.cities,
//         alertType: alert.type
//     });
    
//     connectedUsers.forEach((userData, socketId) => {
//         const isAffected = alert.cities.includes(userData.cityName);
        
//         formatLogMessage('debug', 'Notification', `🔍 בודק משתמש ${socketId}`, {
//             userCity: userData.cityName,
//             isAffected: isAffected,
//             alertCities: alert.cities
//         });
        
//         if (isAffected) {
//             shouldNotifyUsers.push({
//                 socketId: socketId,
//                 city: userData.cityName
//             });
//         }
//     });
    
//     formatLogMessage('info', 'Notification', `📊 סטטיסטיקת התראה`, {
//         alertType: alert.type,
//         affectedCities: alert.cities,
//         totalConnectedUsers: connectedUsers.size,
//         usersToNotify: shouldNotifyUsers.length,
//         usersByCity: shouldNotifyUsers.map(u => u.city)
//     });
    
//     shouldNotifyUsers.forEach(userInfo => {
//         const socket = io.sockets.sockets.get(userInfo.socketId);
//         if (socket) {
//             socket.emit('alert-update', alert);
//             notifiedCount++;
//             formatLogMessage('debug', 'Notification', `📤 שלח התראה למשתמש`, {
//                 socketId: userInfo.socketId,
//                 city: userInfo.city,
//                 alertType: alert.type
//             });
//         }
//     });
    
//     formatLogMessage('success', 'Notification', `✅ שלח התראה ל-${notifiedCount} משתמשים`, {
//         cities: alert.cities,
//         notifiedCount: notifiedCount,
//         totalConnected: connectedUsers.size,
//         alertType: alert.type
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
//         formatLogMessage('warning', 'Storage', 'לא ניתן לשמור היסטוריה', error.message);
//     }
// }

// // בדיקת API עם Cache
// async function checkKoreAPIWithCache() {
//     const now = Date.now();
//     const cached = alertCache.get('kore');
    
//     if (cached && (now - cached.timestamp) < CACHE_DURATION) {
//         formatLogMessage('debug', 'Cache', 'משתמש בתוצאה מ-cache');
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

// // בדיקת API של כל רגע עם Health Monitoring
// async function checkKoreAPI() {
//     try {
//         formatLogMessage('debug', 'KoreAPI', 'בודק התראות ב-API של כל רגע');
        
//         const response = await axios.get('https://www.kore.co.il/redAlert.json', {
//             timeout: 10000,
//             headers: {
//                 'User-Agent': 'AlertSystem/3.0',
//                 'Accept': 'application/json'
//             }
//         });
        
//         const alertData = response.data;
//         apiHealthStatus.kore.lastSuccess = Date.now();
//         apiHealthStatus.kore.failures = 0;
        
//         if (alertData && alertData.id) {
//             if (lastAlertId !== alertData.id) {
//                 lastAlertId = alertData.id;
                
//                 formatLogMessage('info', 'KoreAPI', '📥 התראה חדשה התקבלה', {
//                     id: alertData.id,
//                     cat: alertData.cat,
//                     title: alertData.title,
//                     desc: alertData.desc,
//                     citiesCount: alertData.data?.length || 0
//                 });
                
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
                
//                 formatLogMessage('success', 'KoreAPI', `✅ התראה מעובדת: ${enrichedAlert.type}`, {
//                     originalCitiesCount: enrichedAlert.originalCities?.length || 0,
//                     matchedCitiesCount: enrichedAlert.cities?.length || 0,
//                     mappedType: categorized.type,
//                     category: alertData.cat
//                 });
                
//                 lastAlert = enrichedAlert;
//                 saveToHistory(enrichedAlert);
//                 notifyRelevantUsers(enrichedAlert);
                
//                 io.emit('global-status', {
//                     hasActiveAlert: enrichedAlert.type !== 'safe' && enrichedAlert.type !== 'all-clear',
//                     affectedAreas: enrichedAlert.cities || [],
//                     lastUpdate: enrichedAlert.timestamp,
//                     alertType: enrichedAlert.type,
//                     mode: 'live'
//                 });
//             }
//             return true;
            
//         } else {
//             if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
//                 createAllClearAlert();
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
//         formatLogMessage('debug', 'OrefAPI', 'בודק API של פיקוד העורף');
        
//         const response = await axios.get('https://www.oref.org.il/WarningMessages/alerts.json', {
//             timeout: 10000,
//             headers: {
//                 'User-Agent': 'AlertSystem/3.0',
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
                
//                 io.emit('global-status', {
//                     hasActiveAlert: enrichedAlert.type !== 'safe' && enrichedAlert.type !== 'all-clear',
//                     affectedAreas: enrichedAlert.cities || [],
//                     lastUpdate: enrichedAlert.timestamp,
//                     alertType: enrichedAlert.type,
//                     mode: 'live'
//                 });
//             }
//             return true;
            
//         } else {
//             if (lastAlert && lastAlert.type !== 'safe' && lastAlert.type !== 'all-clear') {
//                 createAllClearAlert();
//             }
//             return false;
//         }
        
//     } catch (error) {
//         apiHealthStatus.oref.failures++;
//         formatLogMessage('error', 'OrefAPI', `כשל ${apiHealthStatus.oref.failures}`, error.message);
//         throw error;
//     }
// }
// function createAllClearAlert() {
//     if (!lastAlert || !['shelter', 'early-warning', 'radiological', 'earthquake', 
//                          'tsunami', 'aircraft', 'hazmat', 'terror'].includes(lastAlert.type)) {
//         formatLogMessage('debug', 'System', 'לא צריך ליצור התראת יציאה - לא היתה התראת סכנה', {
//             lastAlertType: lastAlert ? lastAlert.type : 'none'
//         });
//         return;
//     }
    
//     const allClearAlert = {
//         type: 'all-clear',
//         title: 'יציאה מהממ"ד',
//         icon: '🟢',
//         description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
//         severity: 'low',
//         class: 'safe',
//         cities: lastAlert.cities || [],
//         timestamp: new Date().toISOString(),
//         hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//         source: 'system-auto-clear'
//     };
    
//     formatLogMessage('info', 'System', 'יוצר התראת יציאה מממ"ד אחרי התראת סכנה', {
//         previousAlert: lastAlert.type,
//         cities: allClearAlert.cities
//     });
    
//     lastAlert = allClearAlert;
//     lastAlertId = null;
//     saveToHistory(allClearAlert);
//     notifyRelevantUsers(allClearAlert);
    
//     io.emit('global-status', {
//         hasActiveAlert: false,
//         affectedAreas: [],
//         lastUpdate: allClearAlert.timestamp,
//         alertType: 'all-clear',
//         mode: 'live'
//     });
// }

// // מעקב אחר התראות משופר
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
//     formatLogMessage('info', 'Monitor', 'מעקב כל 5 שניות באמצעות APIs מרובים');
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
//                 oref: apiHealthStatus.oref.failures < 3 ? 'healthy' : 'degraded'
//             }
//         });
        
//         const now = Date.now();
//         for (const [key, value] of alertCache.entries()) {
//             if (now - value.timestamp > CACHE_DURATION * 2) {
//                 alertCache.delete(key);
//             }
//         }
        
//         for (const [ip, data] of requestCounts.entries()) {
//             if (now > data.resetTime) {
//                 requestCounts.delete(ip);
//             }
//         }
        
//     }, 30000);
    
//     formatLogMessage('info', 'Heartbeat', 'Heartbeat הופעל');
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
//                 title: 'מערכת התראות פעילה',
//                 icon: '✅',
//                 description: 'המערכת עלתה בהצלחה ומחוברת לכל ה-APIs',
//                 cities: [],
//                 timestamp: new Date().toISOString(),
//                 hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//                 source: 'system'
//             };
            
//             alertHistory = [initialAlert];
//             saveToHistory(initialAlert);
//             formatLogMessage('info', 'Storage', 'נוצרה היסטוריה ראשונית');
//         }
//     } catch (error) {
//         formatLogMessage('error', 'Storage', 'שגיאה בטעינת היסטוריה', error.message);
//         alertHistory = [];
//     }
// }

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Endpoint בריאות מפורט
// app.get('/api/health/detailed', (req, res) => {
//     const now = Date.now();
//     res.json({
//         server: {
//             status: 'healthy',
//             uptime: process.uptime(),
//             memory: process.memoryUsage(),
//             connectedUsers: connectedUsers.size,
//             timestamp: new Date().toISOString()
//         },
//         apis: {
//             kore: {
//                 status: apiHealthStatus.kore.failures < 3 ? 'healthy' : 'degraded',
//                 lastSuccess: apiHealthStatus.kore.lastSuccess,
//                 failures: apiHealthStatus.kore.failures,
//                 timeSinceLastSuccess: apiHealthStatus.kore.lastSuccess ? 
//                     now - apiHealthStatus.kore.lastSuccess : null
//             },
//             oref: {
//                 status: apiHealthStatus.oref.failures < 3 ? 'healthy' : 'degraded',
//                 lastSuccess: apiHealthStatus.oref.lastSuccess,
//                 failures: apiHealthStatus.oref.failures,
//                 timeSinceLastSuccess: apiHealthStatus.oref.lastSuccess ? 
//                     now - apiHealthStatus.oref.lastSuccess : null
//             }
//         },
//         alerts: {
//             total: alertHistory.length,
//             lastAlert: lastAlert,
//             mode: isLiveMode ? 'live' : 'simulation',
//             cacheSize: alertCache.size
//         }
//     });
// });

// app.get('/health', (req, res) => {
//     res.json({
//         status: 'healthy',
//         uptime: process.uptime(),
//         mode: isLiveMode ? 'live' : 'offline',
//         users: connectedUsers.size,
//         alerts: alertHistory.length,
//         timestamp: new Date().toISOString(),
//         apis: 'kore.co.il, pikud-haoref',
//         version: '3.1.0-socket-fix',
//         socketIO: {
//             connected: connectedUsers.size,
//             lastAlert: lastAlert ? lastAlert.type : 'none'
//         }
//     });
// });

// // Route מיוחד לבדיקת Socket.IO
// app.get('/socket-test', (req, res) => {
//     res.json({
//         socketIO: 'active',
//         connectedUsers: connectedUsers.size,
//         usersList: Array.from(connectedUsers.values()).map(user => ({
//             city: user.cityName,
//             connected: user.connectedAt
//         })),
//         lastAlert: lastAlert,
//         isLive: isLiveMode
//     });
// });

// // Route לסימולציה של התראה (לבדיקות בלבד)
// app.post('/api/simulate-alert', (req, res) => {
//     const { type, cities, title, description } = req.body;
    
//     if (!type || !cities || !Array.isArray(cities)) {
//         return res.status(400).json({ error: 'חסרים פרמטרים נדרשים' });
//     }
    
//     const simulatedAlert = {
//         id: `sim_${Date.now()}`,
//         type: type,
//         title: title || 'התראה סימולציה',
//         icon: type === 'shelter' ? '🚨' : type === 'all-clear' ? '🟢' : '⚠️',
//         description: description || 'זוהי התראה לצורך בדיקה בלבד',
//         severity: type === 'shelter' ? 'high' : 'medium',
//         class: type === 'shelter' ? 'danger' : type === 'all-clear' ? 'safe' : 'warning',
//         cities: cities,
//         timestamp: new Date().toISOString(),
//         hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
//         source: 'simulation'
//     };
    
//     // עדכן את המשתנה הגלובלי
//     lastAlert = simulatedAlert;
//     lastAlertId = simulatedAlert.id;
    
//     // שמור בהיסטוריה
//     saveToHistory(simulatedAlert);
    
//     // שלח למשתמשים רלוונטיים
//     notifyRelevantUsers(simulatedAlert);
    
//     formatLogMessage('info', 'Simulation', `🎭 התראה מסומלצת נשלחה`, {
//         type: type,
//         cities: cities,
//         connectedUsers: connectedUsers.size
//     });
    
//     res.json({
//         success: true,
//         alert: simulatedAlert,
//         notifiedUsers: connectedUsers.size
//     });
// });

// // Route לסטטיסטיקות מפורטות
// app.get('/api/stats', (req, res) => {
//     const stats = {
//         server: {
//             uptime: process.uptime(),
//             startTime: new Date(Date.now() - process.uptime() * 1000).toISOString(),
//             nodeVersion: process.version,
//             platform: process.platform
//         },
//         alerts: {
//             total: alertHistory.length,
//             byType: {},
//             last24Hours: 0,
//             averagePerDay: 0
//         },
//         users: {
//             current: connectedUsers.size,
//             byCity: {}
//         },
//         performance: {
//             cacheHits: alertCache.size,
//             rateLimitedRequests: 0
//         }
//     };
    
//     // ספירת התראות לפי סוג
//     alertHistory.forEach(alert => {
//         stats.alerts.byType[alert.type] = (stats.alerts.byType[alert.type] || 0) + 1;
//     });
    
//     // ספירת משתמשים לפי עיר
//     connectedUsers.forEach(user => {
//         stats.users.byCity[user.cityName] = (stats.users.byCity[user.cityName] || 0) + 1;
//     });
    
//     // התראות ב-24 השעות האחרונות
//     const yesterday = Date.now() - (24 * 60 * 60 * 1000);
//     stats.alerts.last24Hours = alertHistory.filter(alert => 
//         new Date(alert.timestamp).getTime() > yesterday
//     ).length;
    
//     res.json(stats);
// });

// // Route לבדיקת חיבוריות APIs
// app.get('/api/test-connections', async (req, res) => {
//     const results = {
//         timestamp: new Date().toISOString(),
//         tests: {}
//     };
    
//     // בדיקת Kore API
//     try {
//         const koreStart = Date.now();
//         await axios.get('https://www.kore.co.il/redAlert.json', { timeout: 5000 });
//         results.tests.kore = {
//             status: 'success',
//             responseTime: Date.now() - koreStart,
//             message: 'חיבור תקין'
//         };
//     } catch (error) {
//         results.tests.kore = {
//             status: 'error',
//             message: error.message,
//             responseTime: null
//         };
//     }
    
//     // בדיקת Oref API
//     try {
//         const orefStart = Date.now();
//         await axios.get('https://www.oref.org.il/WarningMessages/alerts.json', { timeout: 5000 });
//         results.tests.oref = {
//             status: 'success',
//             responseTime: Date.now() - orefStart,
//             message: 'חיבור תקין'
//         };
//     } catch (error) {
//         results.tests.oref = {
//             status: 'error',
//             message: error.message,
//             responseTime: null
//         };
//     }
    
//     res.json(results);
// });

// // הפעלת השרת
// function startServer() {
//     loadExistingHistory();
    
//     server.listen(PORT, () => {
//         formatLogMessage('success', 'Server', '🎉 מערכת התראות משופרת פועלת! 🎉');
//         formatLogMessage('info', 'Server', `📡 פורט: ${PORT}`);
//         formatLogMessage('info', 'Server', `🌐 כתובת: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
//         formatLogMessage('info', 'Server', `🔗 APIs: kore.co.il (עם cache ו-failover)`);
//         formatLogMessage('info', 'Server', `👥 משתמשים מחוברים: ${connectedUsers.size}`);
//         formatLogMessage('info', 'Server', `📚 היסטוריה: ${alertHistory.length} רשומות`);
//         formatLogMessage('info', 'Server', `🛡️ אבטחה: Helmet, Compression, Rate Limiting`);
//         formatLogMessage('info', 'Server', `⚡ תכונות: Cache, Health Monitoring, Fuzzy Matching`);
//         formatLogMessage('info', 'Server', `🔧 תיקונים: בחירה אוטומטית, התראות קוליות, מיפוי נכון`);
//         formatLogMessage('info', 'Server', `🗣️ חדש: תמיכה קולית עם Speech Synthesis API`);
        
//         startAlertMonitoring();
//         setupHeartbeat();
//     });
// }

// // טיפול בשגיאות מתקדם
// process.on('uncaughtException', (error) => {
//     formatLogMessage('error', 'Process', '🚨 Uncaught Exception', error.message);
// });

// process.on('unhandledRejection', (reason, promise) => {
//     formatLogMessage('error', 'Process', '🚨 Unhandled Rejection', reason);
// });

// process.on('SIGINT', () => {
//     formatLogMessage('info', 'Process', '🛑 סוגר שרת (SIGINT)');
//     gracefulShutdown();
// });

// process.on('SIGTERM', () => {
//     formatLogMessage('info', 'Process', '🛑 סוגר שרת (SIGTERM)');
//     gracefulShutdown();
// });

// // סגירה חלקה
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

// // התחל את המערכת
// startServer();

// module.exports = app;



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

// ✅ תיקון Socket.IO - רק polling עבור Render
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: false
    },
    allowEIO3: true,
    transports: ['polling'], // ✅ רק polling, לא websocket
    pingTimeout: 60000,
    pingInterval: 25000,
    path: '/socket.io/',
    serveClient: false,
    maxHttpBufferSize: 1e6,
    connectTimeout: 45000
});

const PORT = process.env.PORT || 3000;

// נתוני ערים מעודכנים - רשימה מלאה ומעודכנת (כמו שהיה)
const cityData = {
    'אבו גוש': { zone: 'ירושלים', shelterTime: 90, area: 203, established: 1994 },
    'אבן יהודה': { zone: 'שרון', shelterTime: 90, area: 1083, established: 1932 },
    'אום אל פחם': { zone: 'משולש', shelterTime: 90, area: 401, established: 1265 },
    'אופקים': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1202, established: 1955 },
    'אור עקיבא': { zone: 'חיפה והכרמל', shelterTime: 60, area: 395, established: 1951 },
    'אור יהודה': { zone: 'דן', shelterTime: 90, area: 105, established: 1950 },
    'אורך': { zone: 'גליל מערבי', shelterTime: 60, area: 137, established: -1500 },
    'אלעד': { zone: 'דן', shelterTime: 90, area: 108, established: 1998 },
    'אלקנה': { zone: 'שומרון', shelterTime: 90, area: 306 },
    'אפרת': { zone: 'גוש עציון', shelterTime: 90, area: 308, established: 1983 },
    'אריאל': { zone: 'שומרון', shelterTime: 90, area: 301, established: 1978 },
    'באר יעקב': { zone: 'יהודה', shelterTime: 90, area: 1158, established: 1907 },
    'באר שבע': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1200, established: 1900 },
    'בית אל': { zone: 'שומרון', shelterTime: 90, area: 303 },
    'בית שמש': { zone: 'ירושלים', shelterTime: 90, area: 143, established: 1950 },
    'בית שאן': { zone: 'בקעת הירדן', shelterTime: 60, area: 85, established: -4000 },
    'ביתר עילית': { zone: 'גוש עציון', shelterTime: 90, area: 302, established: 1988 },
    'בני ברק': { zone: 'דן', shelterTime: 90, area: 164, established: 1924 },
    'בוקעתא': { zone: 'גולן', shelterTime: 60, area: 146 },
    'בת ים': { zone: 'דן', shelterTime: 90, area: 103, established: 1926 },
    'גבעת שמואל': { zone: 'דן', shelterTime: 90, area: 115, established: 1942 },
    'גבעתיים': { zone: 'דן', shelterTime: 90, area: 111, established: 1922 },
    'גדרה': { zone: 'יהודה', shelterTime: 90, area: 1147, established: 1884 },
    'גן יבנה': { zone: 'יהודה', shelterTime: 90, area: 1150 },
    'גני תקווה': { zone: 'דן', shelterTime: 90, area: 116, established: 1949 },
    'דאלית אל כרמל': { zone: 'חיפה והכרמל', shelterTime: 60, area: 400 },
    'דימונה': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1204, established: 1955 },
    'הוד השרון': { zone: 'שרון', shelterTime: 90, area: 1086, established: 1924 },
    'הרצליה': { zone: 'שרון', shelterTime: 90, area: 1088, established: 1924 },
    'חדרה': { zone: 'שרון', shelterTime: 90, area: 1093, established: 1890 },
    'חולון': { zone: 'דן', shelterTime: 90, area: 107, established: 1935 },
    'חיפה': { zone: 'חיפה והכרמל', shelterTime: 60, area: 394, established: -1400 },
    'חריש': { zone: 'שרון', shelterTime: 90, area: 1090, established: 2015 },
    'חצור הגלילית': { zone: 'גליל עליון', shelterTime: 60, area: 141 },
    'יבנה': { zone: 'יהודה', shelterTime: 90, area: 1148, established: 1949 },
    'יהוד מונוסון': { zone: 'דן', shelterTime: 90, area: 110, established: 1960 },
    'יקנעם עילית': { zone: 'עמק יזרעאל', shelterTime: 60, area: 82, established: 1981 },
    'ירושלים': { zone: 'ירושלים', shelterTime: 90, area: 201, established: -3000 },
    'כפר יונה': { zone: 'שרון', shelterTime: 90, area: 1091, established: 1932 },
    'כפר קאסם': { zone: 'משולש', shelterTime: 90, area: 403, established: 1800 },
    'כפר קרע': { zone: 'משולש', shelterTime: 90, area: 407, established: 1800 },
    'כפר סבא': { zone: 'שרון', shelterTime: 90, area: 1084, established: 1903 },
    'כרמיאל': { zone: 'גליל מערבי', shelterTime: 60, area: 134, established: 1964 },
    'לקיה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1210 },
    'מגדל': { zone: 'כינרת', shelterTime: 60, area: 81 },
    'מגדל העמק': { zone: 'עמק יזרעאל', shelterTime: 60, area: 86, established: 1952 },
    'מגדל שמס': { zone: 'גולן', shelterTime: 60, area: 147 },
    'מבשרת ציון': { zone: 'ירושלים', shelterTime: 90, area: 202 },
    'מודיעין מכבים רעות': { zone: 'מודיעין', shelterTime: 90, area: 1166, established: 1985 },
    'מודיעין עילית': { zone: 'שומרון', shelterTime: 90, area: 303, established: 1990 },
    'מטולה': { zone: 'גליל עליון', shelterTime: 15, area: 139, established: 1896 },
    'מג"ב גולן': { zone: 'גולן', shelterTime: 30, area: 143 },
    'מעאר': { zone: 'גליל מערבי', shelterTime: 60, area: 408, established: 2019 },
    'מעלה אדומים': { zone: 'ירושלים', shelterTime: 90, area: 142, established: 1975 },
    'מעלות תרשיחא': { zone: 'גליל מערבי', shelterTime: 60, area: 135, established: 1963 },
    'מזכרת בתיה': { zone: 'יהודה', shelterTime: 90, area: 1155 },
    'מסעדה': { zone: 'גולן', shelterTime: 60, area: 148 },
    'מצפה רמון': { zone: 'באר שבע והנגב', shelterTime: 180, area: 1206 },
    'נהריה': { zone: 'גליל מערבי', shelterTime: 60, area: 136, established: 1934 },
    'נוף הגליל': { zone: 'גליל תחתון', shelterTime: 60, area: 83, established: 1957 },
    'נצרת': { zone: 'עמק יזרעאל', shelterTime: 60, area: 78, established: 200 },
    'נשר': { zone: 'חיפה והכרמל', shelterTime: 60, area: 403, established: 1925 },
    'נס ציונה': { zone: 'יהודה', shelterTime: 90, area: 1149, established: 1883 },
    'נתיבות': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1201, established: 1956 },
    'נתניה': { zone: 'שרון', shelterTime: 45, area: 1081, established: 1929 },
    'סחנין': { zone: 'גליל תחתון', shelterTime: 60, area: 402, established: 1850 },
    'עוספיא': { zone: 'חיפה והכרמל', shelterTime: 60, area: 401 },
    'עמנואל': { zone: 'שומרון', shelterTime: 90, area: 305 },
    'עפולה': { zone: 'עמק יזרעאל', shelterTime: 60, area: 77, established: 1925 },
    'עראבה': { zone: 'גליל תחתון', shelterTime: 60, area: 406, established: 1850 },
    'ערד': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1205, established: 1962 },
    'ערערה בנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1209 },
    'פתח תקווה': { zone: 'דן', shelterTime: 90, area: 109, established: 1878 },
    'פרדס חנה כרכור': { zone: 'שרון', shelterTime: 90, area: 1092, established: 1913 },
    'צפת': { zone: 'גליל עליון', shelterTime: 60, area: 133, established: 1140 },
    'צפרירים': { zone: 'יהודה', shelterTime: 90, area: 1152 },
    'קדומים': { zone: 'שומרון', shelterTime: 90, area: 307 },
    'קלנסווה': { zone: 'משולש', shelterTime: 90, area: 405, established: 1863 },
    'קצרין': { zone: 'גולן', shelterTime: 60, area: 142, established: 1977 },
    'קרית אונו': { zone: 'דן', shelterTime: 90, area: 112, established: 1939 },
    'קרית אתא': { zone: 'חיפה והכרמל', shelterTime: 60, area: 396, established: 1925 },
    'קרית ביאליק': { zone: 'חיפה והכרמל', shelterTime: 60, area: 397, established: 1934 },
    'קרית גת': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1036, established: 1955 },
    'קרית ים': { zone: 'חיפה והכרמל', shelterTime: 60, area: 398, established: 1945 },
    'קרית מלאכי': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1037, established: 1951 },
    'קרית מוצקין': { zone: 'חיפה והכרמל', shelterTime: 60, area: 399, established: 1934 },
    'קרית עקרון': { zone: 'יהודה', shelterTime: 90, area: 1153 },
    'קרית שמונה': { zone: 'גליל עליון', shelterTime: 30, area: 140, established: 1949 },
    'ראמלה': { zone: 'יהודה', shelterTime: 90, area: 1144, established: 716 },
    'ראש העין': { zone: 'שרון', shelterTime: 90, area: 1089, established: 1949 },
    'ראשון לציון': { zone: 'דן', shelterTime: 90, area: 104, established: 1882 },
    'רחובות': { zone: 'יהודה', shelterTime: 90, area: 1146, established: 1890 },
    'רמת גן': { zone: 'דן', shelterTime: 90, area: 106, established: 1921 },
    'רמת השרון': { zone: 'שרון', shelterTime: 90, area: 1087, established: 1923 },
    'רעננה': { zone: 'שרון', shelterTime: 90, area: 1082, established: 1922 },
    'רהט': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1208, established: 1994 },
    'שדרות': { zone: 'באר שבע והנגב', shelterTime: 15, area: 1203, established: 1951 },
    'שוהם': { zone: 'יהודה', shelterTime: 90, area: 1154 },
    'שלומי': { zone: 'גליל מערבי', shelterTime: 30, area: 138 },
    'טבריה': { zone: 'כינרת', shelterTime: 60, area: 80, established: 20 },
    'טייבה': { zone: 'משולש', shelterTime: 45, area: 404, established: 1200 },
    'טירת כרמל': { zone: 'חיפה והכרמל', shelterTime: 60, area: 402, established: 1992 },
    'תל אביב יפו': { zone: 'דן', shelterTime: 90, area: 102, established: 1909 },
    'תל מונד': { zone: 'שרון', shelterTime: 90, area: 1094, established: 1926 },
    
    // ערים נוספות שחסרו במקור
    'אשדוד': { zone: 'אשדוד', shelterTime: 45, area: 1031, established: 1956 },
    'אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 30, area: 1035, established: 1950 },
    'בנימינה גבעת עדה': { zone: 'שרון', shelterTime: 90, area: 1095, established: 1922 },
    'זכרון יעקב': { zone: 'שרון', shelterTime: 90, area: 1096, established: 1882 },
    'יבנאל': { zone: 'כינרת', shelterTime: 60, area: 84, established: 1901 },
    'יקנעם': { zone: 'עמק יזרעאל', shelterTime: 60, area: 87, established: 1935 },
    'לוד': { zone: 'יהודה', shelterTime: 90, area: 1145, established: -8000 },
    'מעיליא': { zone: 'גליל עליון', shelterTime: 30, area: 150, established: 1963 },
    'נצרת עילית': { zone: 'גליל תחתון', shelterTime: 60, area: 79, established: 1957 },
    'פקיעין': { zone: 'גליל מערבי', shelterTime: 60, area: 137, established: 1955 },
    'שפרעם': { zone: 'גליל מערבי', shelterTime: 60, area: 405, established: 636 },
    
    // אזור ים המלח
    'בתי מלון ים המלח': { zone: 'ים המלח', shelterTime: 60, area: 1301, established: 1960 },
    'מלונות ים המלח מרכז': { zone: 'ים המלח', shelterTime: 60, area: 1302, established: 1960 },
    'מלונות ים המלח צפון': { zone: 'ים המלח', shelterTime: 60, area: 1303, established: 1960 },
    'מלונות ים המלח דרום': { zone: 'ים המלח', shelterTime: 60, area: 1304, established: 1960 },
    'נווה זוהר': { zone: 'ים המלח', shelterTime: 60, area: 1305, established: 1969 },
    'עין בוקק': { zone: 'ים המלח', shelterTime: 60, area: 1306, established: 1986 },
    'מצדה': { zone: 'ים המלח', shelterTime: 60, area: 1307, established: -73 },
    'עין גדי': { zone: 'ים המלח', shelterTime: 60, area: 1308, established: 1956 },
    'מרחצאות עין גדי': { zone: 'ים המלח', shelterTime: 60, area: 1309 },
    
    // אזורי תעשייה מהדרום
    'אורון תעשייה ומסחר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1400 },
    'אזור תעשייה דימונה': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1401 },
    'אזור תעשייה עידן הנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1402 },
    'אזור תעשייה רותם': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1403 },
    'אזור תעשייה צפוני אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1420 },
    'אזור תעשייה הדרומי אשקלון': { zone: 'אשקלון והסביבה', shelterTime: 45, area: 1421 },
    'אזור תעשייה נ.ע.מ': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1422 },
    'אזור תעשייה מיתרים': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1423 },
    
    // יישובי דרום נוספים
    'אל פורעה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1404 },
    'בית קמה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1405 },
    'גבעות בר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1406 },
    'גבעות גורל': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1407 },
    'דביר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1408 },
    'הר הנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1409 },
    'ירוחם': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1410 },
    'כסייפה': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1411 },
    'להב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1412 },
    'להבים': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1413 },
    'מרעית': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1414 },
    'משמר הנגב': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1415 },
    'קסר א-סר': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1416 },
    'שובל': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1417 },
    'תארבין': { zone: 'באר שבע והנגב', shelterTime: 60, area: 1418 },
    'תל ערד': { zone: 'באר שבע והנגב', shelterTime: 90, area: 1419 },
    
    // עוטף עזה - יישובים נוספים שחסרו
    'אבשלום': { zone: 'עוטף עזה', shelterTime: 15, area: 1430 },
    'אורים': { zone: 'עוטף עזה', shelterTime: 15, area: 1431 },
    'ארז': { zone: 'עוטף עזה', shelterTime: 15, area: 1432 },
    'אשבול': { zone: 'עוטף עזה', shelterTime: 15, area: 1433 },
    'בארי': { zone: 'עוטף עזה', shelterTime: 15, area: 1434 },
    'בית שקמה': { zone: 'עוטף עזה', shelterTime: 15, area: 1435 },
    'בני נצרים': { zone: 'עוטף עזה', shelterTime: 15, area: 1436 },
    'ברור חיל': { zone: 'עוטף עזה', shelterTime: 15, area: 1437 },
    'ברוש': { zone: 'עוטף עזה', shelterTime: 15, area: 1438 },
    'בת הדר': { zone: 'עוטף עזה', shelterTime: 15, area: 1439 },
    'גברעם': { zone: 'עוטף עזה', shelterTime: 15, area: 1440 },
    'גיאה': { zone: 'עוטף עזה', shelterTime: 15, area: 1441 },
    'דורות': { zone: 'עוטף עזה', shelterTime: 15, area: 1442 },
    'דקל': { zone: 'עוטף עזה', shelterTime: 15, area: 1443 },
    'זיקים': { zone: 'עוטף עזה', shelterTime: 15, area: 1444 },
    'זמרת': { zone: 'עוטף עזה', shelterTime: 15, area: 1445 },
    'זרועה': { zone: 'עוטף עזה', shelterTime: 15, area: 1446 },
    'חולית': { zone: 'עוטף עזה', shelterTime: 15, area: 1447 },
    'חלץ': { zone: 'עוטף עזה', shelterTime: 15, area: 1448 },
    'יבול': { zone: 'עוטף עזה', shelterTime: 15, area: 1449 },
    'יד מרדכי': { zone: 'עוטף עזה', shelterTime: 15, area: 1450 },
    'יושיביה': { zone: 'עוטף עזה', shelterTime: 15, area: 1451 },
    'יכיני': { zone: 'עוטף עזה', shelterTime: 15, area: 1452 },
    'יתד': { zone: 'עוטף עזה', shelterTime: 15, area: 1453 },
    'כיסופים': { zone: 'עוטף עזה', shelterTime: 15, area: 1454 },
    'כרם שלום': { zone: 'עוטף עזה', shelterTime: 15, area: 1455 },
    'כרמיה': { zone: 'עוטף עזה', shelterTime: 15, area: 1456 },
    'מבועים': { zone: 'עוטף עזה', shelterTime: 15, area: 1457 },
    'מבטחים': { zone: 'עוטף עזה', shelterTime: 15, area: 1458 },
    'מבקיעים': { zone: 'עוטף עזה', shelterTime: 15, area: 1459 },
    'מגן': { zone: 'עוטף עזה', shelterTime: 15, area: 1460 },
    'מפלסים': { zone: 'עוטף עזה', shelterTime: 15, area: 1461 },
    'נווה': { zone: 'עוטף עזה', shelterTime: 15, area: 1462 },
    'ניר יצחק': { zone: 'עוטף עזה', shelterTime: 15, area: 1463 },
    'ניר משה': { zone: 'עוטף עזה', shelterTime: 15, area: 1464 },
    'ניר עוז': { zone: 'עוטף עזה', shelterTime: 15, area: 1465 },
    'ניר עקיבא': { zone: 'עוטף עזה', shelterTime: 15, area: 1466 },
    'נירים': { zone: 'עוטף עזה', shelterTime: 15, area: 1467 },
    'נתיב העשרה': { zone: 'עוטף עזה', shelterTime: 15, area: 1468 },
    'סופה': { zone: 'עוטף עזה', shelterTime: 15, area: 1469 },
    'סעד': { zone: 'עוטף עזה', shelterTime: 15, area: 1470 },
    'עין הבשור': { zone: 'עוטף עזה', shelterTime: 15, area: 1471 },
    'עין השלושה': { zone: 'עוטף עזה', shelterTime: 15, area: 1472 },
    'עלומים': { zone: 'עוטף עזה', shelterTime: 15, area: 1473 },
    'פטיש': { zone: 'עוטף עזה', shelterTime: 15, area: 1474 },
    'פרי גן': { zone: 'עוטף עזה', shelterTime: 15, area: 1475 },
    'קלחים': { zone: 'עוטף עזה', shelterTime: 15, area: 1476 },
    'רוחמה': { zone: 'עוטף עזה', shelterTime: 15, area: 1477 },
    'רעים': { zone: 'עוטף עזה', shelterTime: 15, area: 1478 },
    'שבי דרום': { zone: 'עוטף עזה', shelterTime: 15, area: 1479 },
    'שדה ניצן': { zone: 'עוטף עזה', shelterTime: 15, area: 1480 },
    'שדה צבי': { zone: 'עוטף עזה', shelterTime: 15, area: 1481 },
    'שדי אברהם': { zone: 'עוטף עזה', shelterTime: 15, area: 1482 },
    'שוקדה': { zone: 'עוטף עזה', shelterTime: 15, area: 1483 },
    'שיבולים': { zone: 'עוטף עזה', shelterTime: 15, area: 1484 },
    'שלומית': { zone: 'עוטף עזה', shelterTime: 15, area: 1485 },
    'שרשרת': { zone: 'עוטף עזה', shelterTime: 15, area: 1486 },
    'תאשור': { zone: 'עוטף עזה', shelterTime: 15, area: 1487 },
    'תדהר': { zone: 'עוטף עזה', shelterTime: 15, area: 1488 },
    'תלמי אליהו': { zone: 'עוטף עזה', shelterTime: 15, area: 1489 },
    'תלמי יוסף': { zone: 'עוטף עזה', shelterTime: 15, area: 1490 },
    'תלמי יפה': { zone: 'עוטף עזה', shelterTime: 15, area: 1491 },
    
    // יישובי גבול נוספים
    'מתת': { zone: 'גליל עליון', shelterTime: 15, area: 144, established: 1980 },
    'מרגליות': { zone: 'גליל עליון', shelterTime: 15, area: 145, established: 1951 },
    'דן': { zone: 'גליל עליון', shelterTime: 15, area: 146, established: 1939 },
    'שמיר': { zone: 'גליל עליון', shelterTime: 15, area: 147, established: 1944 },
    'הגושרים': { zone: 'גליל עליון', shelterTime: 15, area: 148, established: 1948 },
    'נאות מרדכי': { zone: 'גליל עליון', shelterTime: 15, area: 149, established: 1946 },
    
    // יישובים נוספים מהלוג
    'שדה אברהם': { zone: 'עוטף עזה', shelterTime: 15, area: 1310, established: 1982 },
    'תקומה': { zone: 'עוטף עזה', shelterTime: 15, area: 1311, established: 1949 },
    'ניר עם': { zone: 'עוטף עזה', shelterTime: 15, area: 1312, established: 1943 },
    'כפר עזה': { zone: 'עוטף עזה', shelterTime: 15, area: 1313, established: 1951 },
    'נחל עוז': { zone: 'עוטף עזה', shelterTime: 15, area: 1314, established: 1951 },
    'אור הנר': { zone: 'עוטף עזה', shelterTime: 15, area: 1315, established: 1957 },
    
    // ערים נוספות חשובות שחסרו
    'אילת': { zone: 'אילת', shelterTime: 180, area: 1207, established: 1949 },
    'גבעת זאב': { zone: 'ירושלים', shelterTime: 90, area: 204, established: 1983 },
    'מעלה עדומים': { zone: 'ירושלים', shelterTime: 90, area: 205, established: 1975 },
    'פסגת זאב': { zone: 'ירושלים', shelterTime: 90, area: 206, established: 1985 },
    'כפר מנדא': { zone: 'גליל תחתון', shelterTime: 60, area: 409, established: 1800 },
    'מגדל העמק': { zone: 'עמק יזרעאל', shelterTime: 60, area: 88, established: 1952 },
    'ראש פינה': { zone: 'גליל עליון', shelterTime: 30, area: 151, established: 1882 },
    'יסוד המעלה': { zone: 'גליל עליון', shelterTime: 30, area: 152, established: 1883 },
    'רמת ישי': { zone: 'עמק יזרעאל', shelterTime: 60, area: 89, established: 1925 },
    'יפיע': { zone: 'גליל תחתון', shelterTime: 60, area: 410, established: 1926 },
    'עין מאהל': { zone: 'גליל תחתון', shelterTime: 60, area: 411, established: 1935 },
    'דיר חנא': { zone: 'גליל מערבי', shelterTime: 60, area: 412, established: 1800 },
    "ג'ת": { zone: 'משולש', shelterTime: 90, area: 413, established: 1886 },
    'באקה אל גרביה': { zone: 'משולש', shelterTime: 90, area: 414, established: 1400 },
    'ועדי עארה': { zone: 'משולש', shelterTime: 90, area: 415, established: 1967 },
    'קריית ארבע': { zone: 'גוש עציון', shelterTime: 90, area: 309, established: 1968 },
    'כוכב יאיר': { zone: 'דן', shelterTime: 90, area: 118, established: 1981 },
    'כפר ורדים': { zone: 'גליל עליון', shelterTime: 30, area: 154, established: 1979 },
    'שלמי': { zone: 'גליל עליון', shelterTime: 15, area: 155, established: 1950 },
    'משגב עם': { zone: 'גליל עליון', shelterTime: 30, area: 156, established: 1940 },
    'עבדון': { zone: 'גליל מערבי', shelterTime: 30, area: 157, established: 1945 },
    'פסוטה': { zone: 'גליל עליון', shelterTime: 15, area: 158, established: 1940 },
    'מנוף': { zone: 'גליל עליון', shelterTime: 15, area: 159, established: 1980 },
    'אדמית': { zone: 'גליל עליון', shelterTime: 15, area: 160, established: 1958 },
    'זרית': { zone: 'גליל עליון', shelterTime: 15, area: 161, established: 1956 },
    'גורן': { zone: 'גליל עליון', shelterTime: 30, area: 162, established: 1950 },
    'נתועה': { zone: 'גליל עליון', shelterTime: 15, area: 163, established: 1966 },
    'שתולה': { zone: 'גליל עליון', shelterTime: 15, area: 164, established: 1969 },
    'קדש': { zone: 'גליל עליון', shelterTime: 15, area: 165, established: 1981 },
    'מלכיה': { zone: 'גליל עליון', shelterTime: 15, area: 166, established: 1949 },
    'יפתח': { zone: 'גליל עליון', shelterTime: 15, area: 167, established: 1950 },
    'עין קיניא': { zone: 'גליל עליון', shelterTime: 15, area: 168, established: 1964 },
    'משמר הירדן': { zone: 'בקעת הירדן', shelterTime: 60, area: 169, established: 1890 },
    'כפר גלעדי': { zone: 'גליל עליון', shelterTime: 15, area: 171, established: 1949 },
    'הזורעים': { zone: 'גליל עליון', shelterTime: 30, area: 172, established: 1948 },
    'שושנת העמקים': { zone: 'גליל עליון', shelterTime: 30, area: 173, established: 1948 },
    'בנימין': { zone: 'שומרון', shelterTime: 90, area: 310, established: 1985 },
    'קרני שומרון': { zone: 'שומרון', shelterTime: 90, area: 311, established: 1978 },
    'אלפי מנשה': { zone: 'שומרון', shelterTime: 90, area: 312, established: 1982 },
    'ברקן': { zone: 'שומרון', shelterTime: 90, area: 313, established: 1981 },
    'עפרה': { zone: 'שומרון', shelterTime: 90, area: 314, established: 1978 },
    'גבעת אסף': { zone: 'שומרון', shelterTime: 90, area: 315, established: 1983 },
    'עתניאל': { zone: 'הר חברון', shelterTime: 90, area: 316, established: 1983 },
    'קריית נטפים': { zone: 'ירושלים', shelterTime: 90, area: 207, established: 1988 },
    'תלפיות': { zone: 'ירושלים', shelterTime: 90, area: 208, established: 1922 },
    'רמות': { zone: 'ירושלים', shelterTime: 90, area: 209, established: 1973 },
    'נווה יעקב': { zone: 'ירושלים', shelterTime: 90, area: 210, established: 1924 },
    'פיסגת זאב': { zone: 'ירושלים', shelterTime: 90, area: 211, established: 1985 },
    'גילה': { zone: 'ירושלים', shelterTime: 90, area: 212, established: 1973 },
    'הר חומה': { zone: 'ירושלים', shelterTime: 90, area: 213, established: 1997 }
};

// מילון קיצורים וכינויים לערים
const cityAliases = {
    'ת"א': 'תל אביב יפו',
    'תא': 'תל אביב יפו',
    'תל אביב': 'תל אביב יפו',
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

// Cache ו-Health Monitoring מעודכן
const alertCache = new Map();
const CACHE_DURATION = 5000; // 5 שניות - לפי פיקוד העורף
let apiHealthStatus = {
    kore: { lastSuccess: null, failures: 0 },
    oref: { lastSuccess: null, failures: 0 },
    oref_official: { lastSuccess: null, failures: 0 } // API רשמי חדש
};

// משתנה למניעת כפילויות
let processedAlertIds = new Set();
const ALERT_ID_RETENTION = 300000; // 5 דקות

// ניקוי IDs ישנים כל דקה
setInterval(() => {
    if (processedAlertIds.size > 100) {
        processedAlertIds.clear();
        formatLogMessage('debug', 'Cache', 'ניקוי cache של IDs ישנים');
    }
}, 60000);

// Rate Limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // דקה
const MAX_REQUESTS_PER_WINDOW = 100;

// Middleware מתקדם עם CSP מתוקן לתמיכה ב-Socket.IO
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'", "wss:", "ws:", "https:", "*"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            mediaSrc: ["'self'", "data:", "blob:"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

app.use(compression());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public', {
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

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
            formatLogMessage('debug', 'CityMatch', `התאמה מדוייקת: ${ourCity}`);
            return;
        }
        
        // בדיקה עם קיצורים
        for (const [alias, fullName] of Object.entries(cityAliases)) {
            if (typeof fullName === 'string' && fullName === ourCity) {
                if (alertCitiesLower.includes(alias.toLowerCase())) {
                    matches.push(ourCity);
                    formatLogMessage('debug', 'CityMatch', `התאמת קיצור: ${alias} -> ${ourCity}`);
                    return;
                }
            } else if (Array.isArray(fullName) && fullName.includes(ourCity)) {
                if (alertCitiesLower.includes(alias.toLowerCase())) {
                    matches.push(ourCity);
                    formatLogMessage('debug', 'CityMatch', `התאמת קיצור (רשימה): ${alias} -> ${ourCity}`);
                    return;
                }
            }
        }
        
        // בדיקה חלקית - אם אחד מכיל את השני
        for (const alertCity of alertCitiesLower) {
            if (alertCity.includes(ourCityLower) || ourCityLower.includes(alertCity)) {
                matches.push(ourCity);
                formatLogMessage('debug', 'CityMatch', `התאמה חלקית: "${alertCity}" -> "${ourCity}"`);
                break;
            }
            
            // Fuzzy matching - דמיון חלקי
            const similarity = calculateSimilarity(alertCity, ourCityLower);
            if (similarity > 0.75) { 
                matches.push(ourCity);
                formatLogMessage('debug', 'CityMatch', `התאמת דמיון: "${alertCity}" -> "${ourCity}" (${Math.round(similarity * 100)}%)`);
                break;
            }
        }
    });
    
    if (matches.length > 0) {
        formatLogMessage('success', 'CityMatch', `נמצאו ${matches.length} התאמות`, {
            original: alertCities,
            matched: matches
        });
    } else {
        formatLogMessage('warning', 'CityMatch', 'לא נמצאו התאמות לערים', {
            alertCities: alertCities
        });
    }
    
    return [...new Set(matches)];
}

// מיפוי סוגי התראות מתוקן לפי המפרט הרשמי
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
    
    const categoryMap = {
        '1': 'missiles',
        '2': 'radiologicalEvent',
        '3': 'earthQuake',
        '4': 'tsunami',
        '5': 'hostileAircraftIntrusion',
        '6': 'newsFlash',
        '7': 'hazardousMaterials',
        '8': 'terroristInfiltration',
        '9': 'general',
        '10': 'allClear',
        '101': 'missilesDrill',
        '102': 'radiologicalEventDrill',
        '103': 'earthQuakeDrill',
        '104': 'tsunamiDrill',
        '105': 'hostileAircraftIntrusionDrill',
        '106': 'newsFlash',
        '107': 'hazardousMaterialsDrill',
        '108': 'terroristInfiltrationDrill'
    };
    
    const officialType = categoryMap[koreAlert.cat] || 'unknown';
    const title = koreAlert.title.toLowerCase();
    const desc = (koreAlert.desc || '').toLowerCase();
    
    formatLogMessage('debug', 'AlertMapping', 'מעבד התראה', {
        category: koreAlert.cat,
        officialType: officialType,
        title: koreAlert.title,
        desc: koreAlert.desc
    });
    
    // תיקון מיוחד לקטגוריה 10 - יציאה מממ"ד
    if (officialType === 'allClear' || koreAlert.cat === '10') {
        formatLogMessage('info', 'AlertMapping', '🟢 זוהה כהתראת יציאה (קטגוריה 10)', { 
            desc: koreAlert.desc,
            cat: koreAlert.cat 
        });
        return {
            type: 'all-clear',
            title: 'יציאה מהממ"ד',
            icon: '🟢',
            description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
            severity: 'low',
            class: 'safe'
        };
    }
    
    // בדיקה נוספת לפי תוכן התיאור
    if (desc.includes('יכולים לצאת') || desc.includes('השוהים במרחב המוגן') || 
        desc.includes('האירוע הסתיים') || title.includes('יציאה') ||
        desc.includes('בטוח לצאת') || desc.includes('הסרת התראה')) {
        formatLogMessage('info', 'AlertMapping', '🟢 זוהה כהתראת יציאה לפי תוכן', { desc: koreAlert.desc });
        return {
            type: 'all-clear',
            title: 'יציאה מהממ"ד',
            icon: '🟢',
            description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
            severity: 'low',
            class: 'safe'
        };
    }
    
    switch (officialType) {
        case 'missiles':
            return {
                type: 'shelter',
                title: 'היכנסו לממ"ד מיידית!',
                icon: '🚨',
                description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן עכשיו!'}`,
                severity: 'high',
                class: 'danger'
            };
            
        case 'newsFlash':
            if (desc.includes('בטוח') || desc.includes('לצאת') || 
                desc.includes('יציאה') || desc.includes('הסרת') || 
                title.includes('יציאה') || title.includes('ביטול')) {
                formatLogMessage('info', 'AlertMapping', '🟢 newsFlash זוהה כיציאה', { desc: koreAlert.desc });
                return {
                    type: 'all-clear',
                    title: 'יציאה מהממ"ד',
                    icon: '🟢',
                    description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
                    severity: 'low',
                    class: 'safe'
                };
            } else if (desc.includes('היכנסו') || desc.includes('מרחב מוגן') || 
                      desc.includes('ממ"ד') || desc.includes('מקלט')) {
                formatLogMessage('info', 'AlertMapping', '🚨 newsFlash זוהה ככניסה', { desc: koreAlert.desc });
                return {
                    type: 'shelter',
                    title: 'היכנסו לממ"ד מיידית!',
                    icon: '🚨',
                    description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן עכשיו!'}`,
                    severity: 'high',
                    class: 'danger'
                };
            } else {
                formatLogMessage('info', 'AlertMapping', '⚠️ newsFlash זוהה כהתראה מוקדמת', { desc: koreAlert.desc });
                return {
                    type: 'early-warning',
                    title: 'התראה מוקדמת',
                    icon: '⚠️',
                    description: `${koreAlert.title} - ${koreAlert.desc || 'היו ערוכים ומוכנים'}`,
                    severity: 'medium',
                    class: 'warning'
                };
            }
            
        case 'radiologicalEvent':
            return {
                type: 'radiological',
                title: 'אירוע רדיולוגי',
                icon: '☢️',
                description: `${koreAlert.title} - ${koreAlert.desc || 'הישארו בבתים, סגרו חלונות ודלתות'}`,
                severity: 'high',
                class: 'danger'
            };
            
        case 'earthQuake':
            return {
                type: 'earthquake',
                title: 'רעידת אדמה',
                icon: '🌊',
                description: `${koreAlert.title} - ${koreAlert.desc || 'צאו מהבניין במהירות אל שטח פתוח'}`,
                severity: 'high',
                class: 'danger'
            };
            
        case 'tsunami':
            return {
                type: 'tsunami',
                title: 'אזהרת צונאמי',
                icon: '🌊',
                description: `${koreAlert.title} - ${koreAlert.desc || 'התרחקו מהחוף מיידית אל מקום גבוה'}`,
                severity: 'high',
                class: 'danger'
            };
            
        case 'hostileAircraftIntrusion':
            return {
                type: 'aircraft',
                title: 'חדירת כלי טיס עויב',
                icon: '✈️',
                description: `${koreAlert.title} - ${koreAlert.desc || 'היכנסו לחדר המוגן'}`,
                severity: 'high',
                class: 'danger'
            };
            
        case 'hazardousMaterials':
            return {
                type: 'hazmat',
                title: 'חומרים מסוכנים',
                icon: '☣️',
                description: `${koreAlert.title} - ${koreAlert.desc || 'הישארו בבתים, סגרו מערכות אוורור'}`,
                severity: 'high',
                class: 'danger'
            };
            
        case 'terroristInfiltration':
            return {
                type: 'terror',
                title: 'הסתננות טרוריסטים',
                icon: '🔒',
                description: `${koreAlert.title} - ${koreAlert.desc || 'נעלו דלתות, הימנעו מיציאה מהבית'}`,
                severity: 'high',
                class: 'danger'
            };
            
        // תרגילים
        case 'missilesDrill':
        case 'earthQuakeDrill':
        case 'radiologicalEventDrill':
        case 'tsunamiDrill':
        case 'hostileAircraftIntrusionDrill':
        case 'hazardousMaterialsDrill':
        case 'terroristInfiltrationDrill':
            return {
                type: 'drill',
                title: 'תרגיל',
                icon: '🎯',
                description: `${koreAlert.title} - ${koreAlert.desc || 'זהו תרגיל - פעלו לפי ההוראות'}`,
                severity: 'medium',
                class: 'warning'
            };
            
        default:
            formatLogMessage('warning', 'AlertMapping', '❓ סוג התראה לא מוכר', { 
                category: koreAlert.cat, 
                officialType: officialType,
                title: koreAlert.title 
            });
            return {
                type: 'unknown',
                title: 'התראה לא מוכרת',
                icon: '❓',
                description: `${koreAlert.title} - ${koreAlert.desc || `סוג התראה: ${officialType}`}`,
                severity: 'medium',
                class: 'warning'
            };
    }
}

// ✅ בדיקת API רשמי של פיקוד העורף - מתוקן עם headers נכונים
// תיקונים ל-APIs - להחליף בserver.js

// ✅ תיקון #1: API רשמי של פיקוד העורף עם headers מתוקנים
async function checkOfficialOrefAPI() {
    try {
        formatLogMessage('debug', 'OrefOfficial', 'בודק API רשמי של פיקוד העורף');
        
        const response = await axios.get('https://www.oref.org.il/WarningMessages/alert/alerts.json', {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Referer': 'https://www.oref.org.il/',
                'Origin': 'https://www.oref.org.il',
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            },
            validateStatus: function (status) {
                return status < 500; // קבל גם 403/404 בתור תשובה תקינה
            }
        });
        
        // טיפול מיוחד ב-403
        if (response.status === 403) {
            formatLogMessage('warning', 'OrefOfficial', '⚠️ API רשמי מחזיר 403 - ככל הנראה חסימה. נסה API אחר');
            throw new Error('API blocked with 403');
        }
        
        const alertData = response.data;
        apiHealthStatus.oref_official.lastSuccess = Date.now();
        apiHealthStatus.oref_official.failures = 0;
        
        // המשך הקוד כרגיל...
        return processOrefData(alertData);
        
    } catch (error) {
        apiHealthStatus.oref_official.failures++;
        formatLogMessage('error', 'OrefOfficial', `❌ כשל ${apiHealthStatus.oref_official.failures} ב-API הרשמי`, error.message);
        throw error;
    }
}

// ✅ תיקון #5: פונקציות עזר חדשות
function processOrefData(alertData) {
    // עיבוד נתוני פיקוד העורף הרשמי
    if (alertData && Array.isArray(alertData) && alertData.length > 0) {
        // יש התראות...
        return true;
    }
    return false;
}

function processKoreData(alertData) {
    // עיבוד נתוני kore
    if (alertData && alertData.id) {
        // יש התראה...
        return true;
    }
    return false;
}

function processRedAlertLiveData(alertData) {
    // עיבוד נתוני RedAlert.live
    if (alertData && alertData.cities) {
        // יש התראה...
        return true;
    }
    return false;
}

// ✅ תיקון #6: endpoint בדיקה לא-APIs
app.get('/api/test-all-apis', async (req, res) => {
    const results = {
        timestamp: new Date().toISOString(),
        tests: {}
    };
    
    // בדיקת RedAlert.live
    try {
        const start = Date.now();
        const response = await axios.get('https://api.redalert.live/alerts', { 
            timeout: 5000,
            headers: { 'User-Agent': 'AlertSystem/3.0' }
        });
        results.tests.redAlertLive = {
            status: 'success',
            responseTime: Date.now() - start,
            alertCount: response.data.length,
            message: 'חיבור תקין'
        };
    } catch (error) {
        results.tests.redAlertLive = {
            status: 'error',
            message: error.message
        };
    }
    
    // בדיקת Kore (עם error handling)
    try {
        const start = Date.now();
        const response = await axios.get('https://www.kore.co.il/redAlert.json', { 
            timeout: 5000,
            headers: { 'Referer': 'https://www.kore.co.il/' }
        });
        
        let data = response.data;
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        
        results.tests.kore = {
            status: 'success',
            responseTime: Date.now() - start,
            hasAlert: !!data?.id,
            message: data ? 'תקין' : 'אין התראות'
        };
    } catch (error) {
        results.tests.kore = {
            status: 'error',
            message: error.message
        };
    }
    
    res.json(results);
});

// ✅ תיקון #7: מצב emergency fallback
function enableEmergencyMode() {
    formatLogMessage('warning', 'Emergency', '🚨 מעבר למצב חירום - APIs לא זמינים');
    
    // צור התראת מצב חירום
    const emergencyAlert = {
        type: 'warning',
        title: 'מצב חירום - מקורות נתונים לא זמינים',
        icon: '⚠️',
        description: 'המערכת פועלת במצב מוגבל. בעת חירום אמיתי, עקבו אחר הרדיו וטלוויזיה',
        severity: 'medium',
        class: 'warning',
        cities: [],
        timestamp: new Date().toISOString(),
        hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
        source: 'emergency-mode'
    };
    
    // שלח לכל המשתמשים
    io.emit('alert-update', emergencyAlert);
    
    formatLogMessage('info', 'Emergency', 'הודעת חירום נשלחה לכל המשתמשים');
}
// ✅ בדיקת API של kore.co.il - מתוקן

// ✅ תיקון #3: API חלופי נוסף - RedAlert.live
async function checkRedAlertLiveAPI() {
    try {
        formatLogMessage('debug', 'RedAlertLive', 'בודק API חלופי של RedAlert.live');
        
        const response = await axios.get('https://api.redalert.live/alerts', {
            timeout: 10000,
            headers: {
                'User-Agent': 'AlertSystem/3.0',
                'Accept': 'application/json'
            }
        });
        
        const alertData = response.data;
        formatLogMessage('debug', 'RedAlertLive', 'תשובה מ-RedAlert.live', { 
            alerts: alertData.length 
        });
        
        if (alertData && alertData.length > 0) {
            // יש התראות
            const latestAlert = alertData[0];
            return processRedAlertLiveData(latestAlert);
        }
        
        return false;
        
    } catch (error) {
        formatLogMessage('error', 'RedAlertLive', 'כשל ב-RedAlert.live API', error.message);
        throw error;
    }
}
// ✅ תיקון #2: API של kore עם error handling משופר
async function checkKoreAPI() {
    try {
        formatLogMessage('debug', 'KoreAPI', 'בודק התראות ב-API של כל רגע');
        
        const response = await axios.get('https://www.kore.co.il/redAlert.json', {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                'Referer': 'https://www.kore.co.il/'
            }
        });
        
        let alertData = response.data;
        
        // תיקון: בדיקה אם התשובה היא string במקום object
        if (typeof alertData === 'string') {
            try {
                alertData = JSON.parse(alertData);
            } catch (parseError) {
                formatLogMessage('error', 'KoreAPI', 'תשובה לא תקינה מ-kore - לא JSON', { data: alertData });
                throw new Error('Invalid JSON response');
            }
        }
        
        // תיקון: בדיקה אם התשובה null או undefined
        if (!alertData) {
            formatLogMessage('warning', 'KoreAPI', '⚠️ kore החזיר null - אין התראות');
            return false;
        }
        
        apiHealthStatus.kore.lastSuccess = Date.now();
        apiHealthStatus.kore.failures = 0;
        
        formatLogMessage('debug', 'KoreAPI', 'תשובה מ-kore.co.il', {
            hasId: !!alertData.id,
            alertId: alertData.id,
            cat: alertData.cat,
            title: alertData.title,
            dataLength: alertData.data ? alertData.data.length : 0,
            rawDataType: typeof alertData
        });
        
        // המשך הקוד כרגיל...
        return processKoreData(alertData);
        
    } catch (error) {
        apiHealthStatus.kore.failures++;
        formatLogMessage('error', 'KoreAPI', `❌ כשל ${apiHealthStatus.kore.failures} ב-kore`, error.message);
        throw error;
    }
}

// בדיקת API של פיקוד העורף - הישן
async function checkPikudHaOrefAPI() {
    try {
        formatLogMessage('debug', 'OrefAPI', 'בודק API ישן של פיקוד העורף');
        
        const response = await axios.get('https://www.oref.org.il/WarningMessages/alerts.json', {
            timeout: 10000,
            headers: {
                'User-Agent': 'AlertSystem/3.0',
                'Accept': 'application/json'
            }
        });
        
        const alertData = response.data;
        apiHealthStatus.oref.lastSuccess = Date.now();
        apiHealthStatus.oref.failures = 0;
        
        if (alertData && alertData.data && alertData.data.length > 0) {
            const alert = alertData.data[0];
            const alertId = `oref_old_${alert.id || Date.now()}`;
            
            if (!processedAlertIds.has(alertId)) {
                processedAlertIds.add(alertId);
                
                const categorized = mapAlertTypeFromKore({ title: alert.title, desc: alert.message });
                const matchedCities = getCityMatchesFromAlert(alert.cities || []);
                
                const enrichedAlert = {
                    id: alertId,
                    ...alert,
                    ...categorized,
                    cities: matchedCities.length > 0 ? matchedCities : alert.cities,
                    originalCities: alert.cities,
                    timestamp: new Date().toISOString(),
                    hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
                    source: 'pikud-haoref-old'
                };
                
                formatLogMessage('success', 'OrefAPI', `התראה מ-API ישן: ${enrichedAlert.type}`, {
                    cities: enrichedAlert.cities
                });
                
                lastAlert = enrichedAlert;
                lastAlertId = alertId;
                saveToHistory(enrichedAlert);
                notifyRelevantUsers(enrichedAlert);
                
                io.emit('global-status', {
                    hasActiveAlert: enrichedAlert.type !== 'safe' && enrichedAlert.type !== 'all-clear',
                    affectedAreas: enrichedAlert.cities || [],
                    lastUpdate: enrichedAlert.timestamp,
                    alertType: enrichedAlert.type,
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

function createAllClearAlert() {
    if (!lastAlert || !['shelter', 'early-warning', 'radiological', 'earthquake', 
                         'tsunami', 'aircraft', 'hazmat', 'terror'].includes(lastAlert.type)) {
        formatLogMessage('debug', 'System', 'לא צריך ליצור התראת יציאה - לא היתה התראת סכנה', {
            lastAlertType: lastAlert ? lastAlert.type : 'none'
        });
        return;
    }
    
    const allClearAlert = {
        type: 'all-clear',
        title: 'יציאה מהממ"ד',
        icon: '🟢',
        description: 'הסכנה חלפה תודה לאל - ניתן לצאת מהחדר המוגן',
        severity: 'low',
        class: 'safe',
        cities: lastAlert.cities || [],
        timestamp: new Date().toISOString(),
        hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
        source: 'system-auto-clear'
    };
    
    formatLogMessage('info', 'System', 'יוצר התראת יציאה מממ"ד אחרי התראת סכנה', {
        previousAlert: lastAlert.type,
        cities: allClearAlert.cities
    });
    
    lastAlert = allClearAlert;
    lastAlertId = null;
    saveToHistory(allClearAlert);
    notifyRelevantUsers(allClearAlert);
    
    io.emit('global-status', {
        hasActiveAlert: false,
        affectedAreas: [],
        lastUpdate: allClearAlert.timestamp,
        alertType: 'all-clear',
        mode: 'live'
    });
}

// ✅ מעקב אחר התראות משופר עם fallback חכם

// ✅ תיקון #4: מנגנון fallback מתוקן עם יותר מקורות
async function startAlertMonitoring() {
    formatLogMessage('info', 'Monitor', '🚀 מתחיל מעקב מתוקן עם 4 מקורות API');
    
    let consecutiveFailures = 0;
    const MAX_CONSECUTIVE_FAILURES = 5;
    
    const monitorAlerts = async () => {
        let alertFound = false;
        let apiWorked = false;
        
        // רשימת APIs לפי סדר עדיפות
        const apiSources = [
            { name: 'RedAlert.live', func: checkRedAlertLiveAPI },
            { name: 'Kore.co.il', func: checkKoreAPI },
            { name: 'Oref-Official', func: checkOfficialOrefAPI },
            { name: 'Oref-Old', func: checkPikudHaOrefAPI }
        ];
        
        for (const api of apiSources) {
            if (alertFound) break;
            
            try {
                formatLogMessage('debug', 'Monitor', `🔍 בודק ${api.name}`);
                alertFound = await api.func();
                apiWorked = true;
                consecutiveFailures = 0;
                
                if (alertFound) {
                    formatLogMessage('success', 'Monitor', `✅ התראה נמצאה ב-${api.name}`);
                    break;
                }
                
            } catch (error) {
                formatLogMessage('warning', 'Monitor', `⚠️ ${api.name} נכשל: ${error.message}`);
                continue;
            }
        }
        
        if (!apiWorked) {
            consecutiveFailures++;
            formatLogMessage('error', 'Monitor', `❌ כל ה-APIs נכשלו (${consecutiveFailures}/${MAX_CONSECUTIVE_FAILURES})`);
            
            if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                formatLogMessage('error', 'Monitor', '🚨 מעבר למצב offline זמני');
                setTimeout(monitorAlerts, 30000); // 30 שניות
                return;
            }
        }
        
        // בדיקה רגילה כל 5 שניות
        setTimeout(monitorAlerts, 5000);
    };
    
    // התחל מיד
    monitorAlerts();
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

// פונקציית התראות מתוקנת
function notifyRelevantUsers(alert) {
    if (!alert.cities || alert.cities.length === 0) {
        formatLogMessage('error', 'Notification', '🚨 התראה ללא ערים מוגדרות - לא שולח לאף אחד!', {
            alertType: alert.type,
            originalCities: alert.originalCities?.length || 0,
            alertTitle: alert.title
        });
        return;
    }
    
    let notifiedCount = 0;
    let shouldNotifyUsers = [];
    
    formatLogMessage('debug', 'Notification', '🔍 בודק משתמשים מחוברים', {
        totalConnectedUsers: connectedUsers.size,
        connectedUsersCities: Array.from(connectedUsers.values()).map(u => u.cityName),
        alertAffectedCities: alert.cities,
        alertType: alert.type
    });
    
    connectedUsers.forEach((userData, socketId) => {
        const isAffected = alert.cities.includes(userData.cityName);
        
        formatLogMessage('debug', 'Notification', `🔍 בודק משתמש ${socketId}`, {
            userCity: userData.cityName,
            isAffected: isAffected,
            alertCities: alert.cities
        });
        
        if (isAffected) {
            shouldNotifyUsers.push({
                socketId: socketId,
                city: userData.cityName
            });
        }
    });
    
    formatLogMessage('info', 'Notification', `📊 סטטיסטיקת התראה`, {
        alertType: alert.type,
        affectedCities: alert.cities,
        totalConnectedUsers: connectedUsers.size,
        usersToNotify: shouldNotifyUsers.length,
        usersByCity: shouldNotifyUsers.map(u => u.city)
    });
    
    shouldNotifyUsers.forEach(userInfo => {
        const socket = io.sockets.sockets.get(userInfo.socketId);
        if (socket) {
            socket.emit('alert-update', alert);
            notifiedCount++;
            formatLogMessage('debug', 'Notification', `📤 שלח התראה למשתמש`, {
                socketId: userInfo.socketId,
                city: userInfo.city,
                alertType: alert.type
            });
        }
    });
    
    formatLogMessage('success', 'Notification', `✅ שלח התראה ל-${notifiedCount} משתמשים`, {
        cities: alert.cities,
        notifiedCount: notifiedCount,
        totalConnected: connectedUsers.size,
        alertType: alert.type
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
        formatLogMessage('warning', 'Storage', 'לא ניתן לשמור היסטוריה', error.message);
    }
}

// WebSocket חיבורים - גרסה מתוקנת עם debugging
io.on('connection', (socket) => {
    formatLogMessage('success', 'WebSocket', `✅ משתמש חדש התחבר: ${socket.id}`);
    
    // שלח מיד אישור חיבור
    socket.emit('connection-status', {
        connected: true,
        mode: isLiveMode ? 'live' : 'simulation',
        serverTime: new Date().toISOString(),
        message: 'התחבר בהצלחה לשרת התראות'
    });
    
    // לוג כל האירועים שמגיעים
    socket.onAny((eventName, ...args) => {
        formatLogMessage('debug', 'Socket-Event', `📨 אירוע: ${eventName}`, args);
    });
    
    socket.on('register-city', (cityName) => {
        formatLogMessage('info', 'Registration', `🏙️ משתמש ${socket.id} נרשם לעיר: ${cityName}`);
        
        try {
            // תיקון: נקה התראות ישנות לעיר הספציפית
            const alertRelevance = clearOldAlertsForCity(cityName);
            
            connectedUsers.set(socket.id, { 
                cityName, 
                connectedAt: new Date(),
                lastSeen: new Date()
            });
            
            // שלח אישור רישום
            socket.emit('registration-confirmed', {
                city: cityName,
                status: 'success',
                timestamp: new Date().toISOString()
            });
            
            // תיקון: שלח התראה רק אם רלוונטית
            if (lastAlert && alertRelevance === true) {
                formatLogMessage('info', 'Registration', `שולח התראה רלוונטית למשתמש חדש`, {
                    alertType: lastAlert.type,
                    city: cityName
                });
                socket.emit('alert-update', lastAlert);
            } else {
                formatLogMessage('info', 'Registration', `שולח מצב בטוח למשתמש חדש`, {
                    city: cityName,
                    reason: alertRelevance === false ? 'התראה לא רלוונטית' : 'אין התראה פעילה'
                });
                sendSafeAlertToUser(socket, cityName);
            }
            
            const cityHistory = alertHistory.filter(alert => 
                !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
            ).slice(0, 20);
            
            socket.emit('history-update', cityHistory);
            
            formatLogMessage('success', 'Registration', `✅ רישום הושלם עבור ${cityName}`, {
                historyItems: cityHistory.length,
                connectedUsers: connectedUsers.size
            });
            
        } catch (error) {
            formatLogMessage('error', 'Registration', `❌ שגיאה ברישום עיר ${cityName}`, error.message);
            socket.emit('registration-error', {
                city: cityName,
                error: error.message
            });
        }
    });
    
    socket.on('get-history', (cityName) => {
        formatLogMessage('debug', 'History', `📚 בקשת היסטוריה עבור ${cityName}`);
        
        try {
            const cityHistory = alertHistory.filter(alert => 
                !alert.cities || alert.cities.length === 0 || alert.cities.includes(cityName)
            ).slice(0, 20);
            
            socket.emit('history-update', cityHistory);
            
            formatLogMessage('success', 'History', `✅ נשלחה היסטוריה עבור ${cityName}`, {
                items: cityHistory.length
            });
        } catch (error) {
            formatLogMessage('error', 'History', `❌ שגיאה בטעינת היסטוריה`, error.message);
        }
    });
    
    socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
    });
    
    socket.on('disconnect', (reason) => {
        formatLogMessage('warning', 'WebSocket', `❌ משתמש ${socket.id} התנתק: ${reason}`);
        connectedUsers.delete(socket.id);
    });
    
    socket.on('error', (error) => {
        formatLogMessage('error', 'WebSocket', `🚨 שגיאת Socket ${socket.id}`, error.message);
    });
});

// פונקציה מתוקנת לניקוי התראות ישנות
function clearOldAlertsForCity(cityName) {
    formatLogMessage('debug', 'AlertClear', `🧹 מנקה התראות ישנות עבור ${cityName}`);
    
    if (lastAlert && lastAlert.cities && lastAlert.cities.length > 0) {
        const isRelevant = lastAlert.cities.includes(cityName);
        if (!isRelevant) {
            formatLogMessage('info', 'AlertClear', `התראה פעילה לא רלוונטית לעיר ${cityName}`, {
                alertCities: lastAlert.cities,
                alertType: lastAlert.type,
                shouldClearForThisCity: true
            });
            return false;
        } else {
            formatLogMessage('info', 'AlertClear', `התראה פעילה רלוונטית לעיר ${cityName}`, {
                alertCities: lastAlert.cities,
                alertType: lastAlert.type
            });
            return true;
        }
    }
    
    formatLogMessage('debug', 'AlertClear', `אין התראה פעילה עבור ${cityName}`);
    return null;
}

// פונקציה חדשה לשליחת מצב בטוח
function sendSafeAlertToUser(socket, cityName) {
    const safeAlert = {
        type: 'safe',
        title: 'מצב רגיל',
        icon: '✅',
        description: 'אין התראות פעילות באזור שלך',
        severity: 'low',
        class: 'safe',
        cities: [cityName],
        timestamp: new Date().toISOString(),
        hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
        source: 'system-safe-for-city'
    };
    
    socket.emit('alert-update', safeAlert);
    
    formatLogMessage('debug', 'SafeAlert', `נשלח מצב בטוח למשתמש`, {
        city: cityName,
        socketId: socket.id.substring(0, 8)
    });
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

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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
            },
            oref_official: {
                status: apiHealthStatus.oref_official.failures < 3 ? 'healthy' : 'degraded',
                lastSuccess: apiHealthStatus.oref_official.lastSuccess,
                failures: apiHealthStatus.oref_official.failures,
                timeSinceLastSuccess: apiHealthStatus.oref_official.lastSuccess ? 
                    now - apiHealthStatus.oref_official.lastSuccess : null
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

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        mode: isLiveMode ? 'live' : 'offline',
        users: connectedUsers.size,
        alerts: alertHistory.length,
        timestamp: new Date().toISOString(),
        apis: 'pikud-haoref-official, kore.co.il, pikud-haoref-old',
        version: '3.1.0-FIXED',
        socketIO: {
            transport: 'polling-only',
            connected: connectedUsers.size,
            lastAlert: lastAlert ? lastAlert.type : 'none'
        }
    });
});

// Route מיוחד לבדיקת Socket.IO
app.get('/socket-test', (req, res) => {
    res.json({
        socketIO: 'active-polling-only',
        connectedUsers: connectedUsers.size,
        usersList: Array.from(connectedUsers.values()).map(user => ({
            city: user.cityName,
            connected: user.connectedAt
        })),
        lastAlert: lastAlert,
        isLive: isLiveMode,
        transport: 'polling'
    });
});

// Route לסימולציה של התראה (לבדיקות בלבד)
app.post('/api/simulate-alert', (req, res) => {
    const { type, cities, title, description } = req.body;
    
    if (!type || !cities || !Array.isArray(cities)) {
        return res.status(400).json({ error: 'חסרים פרמטרים נדרשים' });
    }
    
    const simulatedAlert = {
        id: `sim_${Date.now()}`,
        type: type,
        title: title || 'התראה סימולציה',
        icon: type === 'shelter' ? '🚨' : type === 'all-clear' ? '🟢' : '⚠️',
        description: description || 'זוהי התראה לצורך בדיקה בלבד',
        severity: type === 'shelter' ? 'high' : 'medium',
        class: type === 'shelter' ? 'danger' : type === 'all-clear' ? 'safe' : 'warning',
        cities: cities,
        timestamp: new Date().toISOString(),
        hebrewTime: new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' }),
        source: 'simulation'
    };
    
    // עדכן את המשתנה הגלובלי
    lastAlert = simulatedAlert;
    lastAlertId = simulatedAlert.id;
    
    // שמור בהיסטוריה
    saveToHistory(simulatedAlert);
    
    // שלח למשתמשים רלוונטיים
    notifyRelevantUsers(simulatedAlert);
    
    formatLogMessage('info', 'Simulation', `🎭 התראה מסומלצת נשלחה`, {
        type: type,
        cities: cities,
        connectedUsers: connectedUsers.size
    });
    
    res.json({
        success: true,
        alert: simulatedAlert,
        notifiedUsers: connectedUsers.size
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
    
    // בדיקת Oref API ישן
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
    
    // בדיקת API הרשמי של פיקוד העורף
    try {
        const orefOfficialStart = Date.now();
        await axios.get('https://www.oref.org.il/WarningMessages/alert/alerts.json', { 
            timeout: 5000,
            headers: {
                'Referer': 'https://www.oref.org.il/',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        results.tests.oref_official = {
            status: 'success',
            responseTime: Date.now() - orefOfficialStart,
            message: 'API רשמי - חיבור תקין'
        };
    } catch (error) {
        results.tests.oref_official = {
            status: 'error',
            message: error.message,
            responseTime: null
        };
    }
    
    res.json(results);
});

// Heartbeat למשתמשים
function setupHeartbeat() {
    setInterval(() => {
        io.emit('heartbeat', {
            timestamp: new Date().toISOString(),
            connectedUsers: connectedUsers.size,
            serverStatus: 'healthy',
            apiStatus: {
                kore: apiHealthStatus.kore.failures < 3 ? 'healthy' : 'degraded',
                oref: apiHealthStatus.oref.failures < 3 ? 'healthy' : 'degraded',
                oref_official: apiHealthStatus.oref_official.failures < 3 ? 'healthy' : 'degraded'
            }
        });
        
        const now = Date.now();
        for (const [key, value] of alertCache.entries()) {
            if (now - value.timestamp > CACHE_DURATION * 2) {
                alertCache.delete(key);
            }
        }
        
        for (const [ip, data] of requestCounts.entries()) {
            if (now > data.resetTime) {
                requestCounts.delete(ip);
            }
        }
        
    }, 30000);
    
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

// הפעלת השרת
function startServer() {
    loadExistingHistory();
    
    server.listen(PORT, () => {
        formatLogMessage('success', 'Server', '🎉 מערכת התראות מתוקנת לחלוטין פועלת! 🎉');
        formatLogMessage('info', 'Server', `📡 פורט: ${PORT}`);
        formatLogMessage('info', 'Server', `🌐 כתובת: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
        formatLogMessage('info', 'Server', `🔗 APIs: פיקוד העורף הרשמי + kore.co.il + API ישן (עם cache ו-failover)`);
        formatLogMessage('info', 'Server', `👥 משתמשים מחוברים: ${connectedUsers.size}`);
        formatLogMessage('info', 'Server', `📚 היסטוריה: ${alertHistory.length} רשומות`);
        formatLogMessage('info', 'Server', `🛡️ אבטחה: Helmet, Compression, Rate Limiting`);
        formatLogMessage('info', 'Server', `⚡ תכונות: Triple API, Duplicate Prevention, Health Monitoring`);
        formatLogMessage('info', 'Server', `🔧 תיקונים: Socket.IO polling-only, API headers מתוקנים`);
        formatLogMessage('info', 'Server', `🗣️ חדש: תמיכה קולית עם Speech Synthesis API`);
        formatLogMessage('info', 'Server', `🎯 מקורות: 1️⃣ פיקוד העורף הרשמי → 2️⃣ kore.co.il → 3️⃣ API ישן`);
        formatLogMessage('info', 'Server', `⚡ מעקב: כל 3 שניות עם fallback חכם ומניעת כפילויות`);
        formatLogMessage('info', 'Server', `🛠️ WebSocket: רק polling (לא websocket) לייצוב על Render`);
        
        startAlertMonitoring();
        setupHeartbeat();
    });
}

// טיפול בשגיאות מתקדם
process.on('uncaughtException', (error) => {
    formatLogMessage('error', 'Process', '🚨 Uncaught Exception', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
    formatLogMessage('error', 'Process', '🚨 Unhandled Rejection', reason);
});

process.on('SIGINT', () => {
    formatLogMessage('info', 'Process', '🛑 סוגר שרת (SIGINT)');
    if (process.monitoringInterval) {
        clearInterval(process.monitoringInterval);
    }
    gracefulShutdown();
});

process.on('SIGTERM', () => {
    formatLogMessage('info', 'Process', '🛑 סוגר שרת (SIGTERM)');
    if (process.monitoringInterval) {
        clearInterval(process.monitoringInterval);
    }
    gracefulShutdown();
});

// סגירה חלקה
function gracefulShutdown() {
    formatLogMessage('info', 'Shutdown', 'מתחיל סגירה חלקה');
    
    io.emit('server-shutdown', {
        message: 'השרת עובר לתחזוקה, יחזור בקרוב',
        timestamp: new Date().toISOString()
    });
    
    server.close((err) => {
        if (err) {
            formatLogMessage('error', 'Shutdown', 'שגיאה בסגירת השרת', err.message);
            process.exit(1);
        }
        
        formatLogMessage('success', 'Shutdown', '✅ שרת נסגר בהצלחה');
        process.exit(0);
    });
    
    setTimeout(() => {
        formatLogMessage('warning', 'Shutdown', '⏰ כפה סגירה אחרי timeout');
        process.exit(1);
    }, 10000);
}

// התחל את המערכת
startServer();

module.exports = app;// server.js - מערכת התראות חכמה עם תיקונים מלאים - גרסה 3.1-FIXED

