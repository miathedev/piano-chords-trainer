import React from 'react';

const OCTAVE = [
  { pc: 0, hasBlack: true },  // C, C#
  { pc: 2, hasBlack: true },  // D, D#
  { pc: 4, hasBlack: false }, // E
  { pc: 5, hasBlack: true },  // F, F#
  { pc: 7, hasBlack: true },  // G, G#
  { pc: 9, hasBlack: true },  // A, A#
  { pc: 11, hasBlack: false } // B
];

const getRootPositionIndices = (pitchClasses, rootName) => {
  const roots = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const rootPc = roots.indexOf(rootName);
  
  let sortedPcs = Array.from(pitchClasses).sort((a, b) => a - b);
  while (sortedPcs[0] !== rootPc) {
    sortedPcs.push(sortedPcs.shift());
  }
  
  let indices = new Set();
  let currentOffset = rootPc;
  indices.add(currentOffset);
  
  for (let i = 1; i < sortedPcs.length; i++) {
    let pc = sortedPcs[i];
    let offset = pc;
    // ensure voiced upwards
    while (offset <= currentOffset) {
      offset += 12;
    }
    currentOffset = offset;
    indices.add(offset);
  }
  return indices;
};

export function Keyboard({ targetChord }) {
  const activeIndices = getRootPositionIndices(targetChord.pitchClasses, targetChord.root);

  const renderKeys = () => {
    let currentNoteIndex = 0;
    const keys = [];
    
    for (let o = 0; o < 2; o++) {
      for (let noteConfig of OCTAVE) {
        const whiteIndex = currentNoteIndex;
        const isWhiteActive = activeIndices.has(whiteIndex);
        
        let blackChild = null;
        if (noteConfig.hasBlack) {
          const blackIndex = currentNoteIndex + 1;
          const isBlackActive = activeIndices.has(blackIndex);
          blackChild = (
            <div className={`key black ${isBlackActive ? 'active' : ''}`}></div>
          );
          currentNoteIndex += 2;
        } else {
          currentNoteIndex += 1;
        }
        
        keys.push(
          <div key={whiteIndex} className={`key white ${isWhiteActive ? 'active' : ''}`}>
            {blackChild}
          </div>
        );
      }
    }
    return keys;
  };

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {renderKeys()}
      </div>
    </div>
  );
}
