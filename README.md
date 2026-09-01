# 🏋️ Lift Log — Exercise & Set Tracker

A clean, tactile, private-by-design workout and exercise set tracker built with **React 18, TypeScript, Tailwind CSS, and Vite**.

---

## 📱 Features
- **100% Client-side Persistence**: Works completely offline. Every workout, exercise, set, and rep is saved permanently in your browser's `localStorage`.
- **Installable PWA**: Works like a native mobile app on iPhone, iPad, and Android with full home-screen support.
- **Dynamic Set Logger**: Quick-add sets, track weights, reps, and RPE notes.
- **Gym Utilities**: Circular Rest Timer with audio chimes & Olympic Barbell Plate Calculator.
- **Exercise Library & PRs**: Automatic Personal Record (PR) tracking & 1RM calculator.
- **Backup & Restore**: Instant JSON data export & restore.

---

## 🚀 How to Run Locally

1. Install dependencies:
```bash
npm install
```

2. Start the dev server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

1. Initialize git and commit your files:
```bash
git init
git add .
git commit -m "Initial commit of Lift Log App"
```

2. Create a new repository on GitHub (e.g. `exercise-tracker`).
3. Link and push your repository:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
git branch -M main
git push -u origin main
```

4. In your GitHub repository:
   - Go to **Settings** ➔ **Pages**.
   - Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
   - The included workflow in `.github/workflows/deploy.yml` will automatically build and publish your website!

---

## 📲 Convert into a Native Android / iOS App (APK / IPA)

You can wrap this project into a native mobile app using **Capacitor**:

1. Install Capacitor:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init "Lift Log" "com.liftlog.app" --web-dir dist
```

2. Build the web app:
```bash
npm run build
```

3. Add Android and/or iOS platforms:
```bash
npx cap add android
npx cap add ios
```

4. Open in Android Studio / Xcode:
```bash
npx cap open android
```
From Android Studio, click **Build ➔ Generate Signed Bundle / APK** to get your installable Android app!