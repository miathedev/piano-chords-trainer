# Piano Chords Trainer 🎹

**[Play Live Here!](https://miathedev.github.io/piano-chords-trainer/)**

A modern, interactive web application designed to help you learn and practice piano chords using your own MIDI keyboard. The app tests your knowledge of triads (Major, Minor, Diminished, Augmented) by prompting you with random chords and tracking how accurately and quickly you can play them.

![App Demo](public/favicon.svg) <!-- Replace with an actual screenshot path later if desired -->

## ✨ Features

- **🔌 Real-Time Web MIDI Integration:** Plug in your physical MIDI piano/keyboard. The app detects your key presses instantly and accurately normalizes them to check if you're playing the correct pitch classes, regardless of the inversion you choose.
- **🎵 High-Quality Audio Synthesis:** Hear what you play! Integrated with **Tone.js** and the Salamander Grand Piano samples, the app synthesizes a beautiful, expressive piano sound directly in your browser.
- **📚 Built-In Theory Guide:** Stuck? The app includes a handy modal that explains the music theory behind Major, Minor, Diminished, and Augmented chords, complete with easy memorization tricks.
- **💡 Visual Solution Keyboard:** If you don't know the chord, click "Show Solution" to see the exact keys you need to press light up on an on-screen, 2-octave piano keyboard.
- **🏆 Competitive High Score System:** Hold a correct chord for 1 second to score a point. Try to beat your personal best—your high score is saved locally via cookies!
- **🎨 Premium UI/UX:** A sleek, responsive dark mode design with glassmorphism effects, dynamic progress bars, and CSS micro-animations.

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A modern browser that supports the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) (Google Chrome, Microsoft Edge, Opera). *Note: Safari does not currently support Web MIDI.*
- A MIDI Keyboard connected to your computer via USB or Bluetooth.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:miathedev/piano-chords-trainer.git
   cd piano-chords-trainer
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser. Plug in your keyboard, and start playing!

## 🛠️ Built With

- **[React](https://react.dev/)** - Frontend UI library
- **[Vite](https://vitejs.dev/)** - Next Generation Frontend Tooling
- **[Tone.js](https://tonejs.github.io/)** - Web Audio Framework for interactive music
- **Vanilla CSS** - Custom styling and animations

## 📄 License

This project is open-source and available under the MIT License.
