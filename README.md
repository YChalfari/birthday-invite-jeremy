# Birthday Invite - Hebrew One Pager

תבנית מהירה לאתר הזמנת יום הולדת בעברית עם:
- דף הזמנה יחיד (`index.html`)
- דף סטטוס RSVP בנתיב `/admin` (`admin.html`)
- כפתורי Add to Calendar, WhatsApp, Waze, Google Maps
- RSVP עם שדות נפרדים לילדים ומבוגרים

## 1) עדכון פרטים

ערכו את האובייקט `CONFIG` בקובץ `script.js`:
- `childName`
- `dateLabel`
- `timeLabel`
- `venueName`
- `venueAddress`
- `entertainerName`
- `entertainerDetails`
- `mapQuery`
- `siteUrl`
- `rsvpEndpoint`

בקובץ `admin.js` עדכנו גם את `rsvpEndpoint`.

## 2) Add to Calendar

בקובץ `script.js` החליפו את:
`[YYYYMMDD]T[HHMMSS]/[YYYYMMDD]T[HHMMSS]`
בפורמט של Google Calendar, לדוגמה:
`20260601T163000/20260601T190000`

## 3) יצירת endpoint חינמי עם Google Apps Script

צרו Google Sheet עם גיליון בשם `RSVP` וכותרות בשורה 1:

`createdAt | familyName | phone | kidsCount | adultsCount`

פתחו Apps Script והדביקו:

```javascript
const SHEET_NAME = "RSVP";

function doPost(e) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents || "{}");
  sheet.appendRow([
    new Date().toISOString(),
    data.familyName || "",
    data.phone || "",
    Number(data.kidsCount || 0),
    Number(data.adultsCount || 0),
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (!e.parameter.admin) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).map((row) => ({
    createdAt: row[0],
    familyName: row[1],
    phone: row[2],
    kidsCount: row[3],
    adultsCount: row[4],
  }));

  return ContentService
    .createTextOutput(JSON.stringify({ entries: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy -> New deployment -> Web app:
- Execute as: `Me`
- Who has access: `Anyone`

קחו את ה-URL של ה-Web App והכניסו ל-`rsvpEndpoint`.

## 4) פריסה חינמית (הכי מהיר)

### Cloudflare Pages
1. דחפו את הקבצים ל-GitHub.
2. בחרו Pages -> Connect to Git.
3. Build command: ריק.
4. Build output directory: `/` (root).

או:

### Netlify
1. New site from Git.
2. Build command: ריק.
3. Publish directory: `/`.

## 5) נתיב `/admin`

כדי שהנתיב יעבוד יפה גם בלי סיומת `.html`, אפשר:
- להגדיר redirect פשוט בפלטפורמת האחסון, או
- לגשת ישירות ל-`/admin.html`.
