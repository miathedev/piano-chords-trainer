export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CHORD_TYPES = {
  Major: [0, 4, 7],
  Minor: [0, 3, 7],
  Diminished: [0, 3, 6],
  Augmented: [0, 4, 8],
  Power: [0, 7],
};

// Generates a random chord prompt from allowed types
export function getRandomChord(allowedTypes = ['Major', 'Minor', 'Diminished', 'Augmented', 'Power'], includePowerOctave = false) {
  if (!allowedTypes || allowedTypes.length === 0) {
    allowedTypes = ['Major']; // Fallback if all are unselected
  }
  
  const rootIdx = Math.floor(Math.random() * ROOT_NOTES.length);
  const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  
  const rootName = ROOT_NOTES[rootIdx];
  const intervals = CHORD_TYPES[type];
  const pitchClasses = intervals.map(interval => (rootIdx + interval) % 12);
  
  return {
    name: `${rootName} ${type}${type === 'Power' && includePowerOctave ? ' (Octave)' : ''}`,
    root: rootName,
    type: type,
    pitchClasses: new Set(pitchClasses),
    withOctave: type === 'Power' && includePowerOctave,
  };
}

// Checks if the currently active notes match the target chord
export function checkChordMatch(activeNotes, targetChord) {
  const activePitchClasses = new Set([...activeNotes].map(note => note % 12));
  
  if (activePitchClasses.size !== targetChord.pitchClasses.size) {
    return false;
  }
  
  for (let pc of targetChord.pitchClasses) {
    if (!activePitchClasses.has(pc)) {
      return false;
    }
  }

  // Handle specific requirements for Power Chords with Octaves
  if (targetChord.withOctave) {
    if (activeNotes.size !== 3) return false;
    const rootPc = ROOT_NOTES.indexOf(targetChord.root);
    let rootCount = 0;
    for (let note of activeNotes) {
      if (note % 12 === rootPc) rootCount++;
    }
    if (rootCount < 2) return false;
  } else if (targetChord.type === 'Power') {
    // If standard power chord, accept 2 notes (root + 5th).
    // We can also let them optionally play 3 notes if they want.
    // So we just check if activeNotes >= 2.
    if (activeNotes.size < 2) return false;
  } else {
    if (activeNotes.size < targetChord.pitchClasses.size) return false;
  }
  
  return true;
}
