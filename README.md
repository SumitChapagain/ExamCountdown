# NEB Class 12 Live Countdown (Web App)

A modern single-page countdown app for Nepal Class 12 board examinations.

## Features

- Live Nepal time (`Asia/Kathmandu`)
- Next-exam countdown (`days/hours/minutes/seconds`)
- Subject timeline cards with real-time status (`Upcoming`, `Running`, `Completed`)
- Stream filter (`Science`, `Management`, `Education`, `Common`)
- Subject search
- Exam season progress bar
- Dark/light theme toggle
- Browser notification reminder (1 hour before next exam)

## Run

Just open `index.html` in your browser.

For best live-reload development experience, you can run a local static server.

## Update Routine Data

Edit the `routine` array in `app.js`.

Each item uses this format:

```js
{ subject: "Compulsory English", stream: "common", date: "2026-04-27" }
```

`date` must be in `YYYY-MM-DD` format, and the app treats exam time as `8:00 AM - 11:00 AM NPT`.

## Note

Routine dates are prefilled from publicly available listings and may change after official NEB revisions. Verify final dates before sharing publicly.
