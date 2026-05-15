export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CHORD_TYPES = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Diminished: [0, 3, 6],
  Augmented: [0, 4, 8],
};

// Generates a random chord prompt from allowed types
export function getRandomChord(allowedTypes = ['Major', 'Minor', 'Diminished', 'Augmented']) {
  if (!allowedTypes || allowedTypes.length === 0) {
    allowedTypes = ['Major']; // Fallback if all are unselected
  }
  
  const rootIdx = Math.floor(Math.random() * ROOT_NOTES.length);
  const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  
  const rootName = ROOT_NOTES[rootIdx];
  const intervals = CHORD_TYPES[type];
  const pitchClasses = intervals.map(interval => (rootIdx + interval) % 12);
  
  return {
    name: `${rootName} ${type}`,
    root: rootName,
    type: type,
    pitchClasses: new Set(pitchClasses),
  };
}

// Checks if the currently active notes match the required pitch classes exactly
export function checkChordMatch(activeNotes, targetPitchClasses) {
  // activeNotes is a Set of active MIDI note numbers
  const activePitchClasses = new Set([...activeNotes].map(note => note % 12));
  
  if (activePitchClasses.size !== targetPitchClasses.size) {
    return false;
  }
  
  for (let pc of targetPitchClasses) {
    if (!activePitchClasses.has(pc)) {
      return false;
    }
  }
  
  return true;
}
