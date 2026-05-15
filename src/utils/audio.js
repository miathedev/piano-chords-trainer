import * as Tone from 'tone';

let synth = null;
let isAudioStarted = false;
let isSynthLoaded = false;

export function initAudio() {
  if (!synth) {
    synth = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      release: 1,
      onload: () => {
        isSynthLoaded = true;
      }
    }).toDestination();
    
    synth.volume.value = -8; // Lower base volume to prevent clipping
    
    // Add a limiter and reverb
    const limiter = new Tone.Limiter(-2).toDestination();
    synth.connect(limiter);
    
    const reverb = new Tone.Reverb(1.5).connect(limiter);
    synth.connect(reverb);
  }
  return synth;
}

export async function startAudioContext() {
  if (!isAudioStarted) {
    await Tone.start();
    initAudio();
    isAudioStarted = true;
  }
}

export function playNoteOn(midiNote, velocity = 0.8) {
  if (!isAudioStarted || !synth || !isSynthLoaded) return;
  const freq = Tone.Frequency(midiNote, "midi").toFrequency();
  synth.triggerAttack(freq, Tone.now(), velocity);
}

export function playNoteOff(midiNote) {
  if (!isAudioStarted || !synth || !isSynthLoaded) return;
  const freq = Tone.Frequency(midiNote, "midi").toFrequency();
  synth.triggerRelease(freq);
}

export function playChord(pitchClasses, rootName, withOctave = false) {
  if (!isAudioStarted || !synth || !isSynthLoaded) return;
  
  const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootPc = roots.indexOf(rootName);
  
  if (rootPc === -1) return;

  // Changed baseOctave from 4 to 5 so it sounds less bassy
  let baseOctave = 5; 
  let sortedPcs = Array.from(pitchClasses).sort((a, b) => a - b);
  
  // Shift array until root is first
  while (sortedPcs[0] !== rootPc) {
    sortedPcs.push(sortedPcs.shift());
  }
  
  let notes = [];
  let currentNote = rootPc + baseOctave * 12; 
  notes.push(currentNote);
  
  for (let i = 1; i < sortedPcs.length; i++) {
    let pc = sortedPcs[i];
    let note = (baseOctave * 12) + pc;
    // Ensure the chord is voiced upwards
    while (note <= notes[i-1]) {
      note += 12;
    }
    notes.push(note);
  }
  
  if (withOctave) {
    notes.push(currentNote + 12);
  }
  
  const freqs = notes.map(n => Tone.Frequency(n, "midi").toFrequency());
  
  synth.releaseAll();
  synth.triggerAttackRelease(freqs, "1.5s");
}
