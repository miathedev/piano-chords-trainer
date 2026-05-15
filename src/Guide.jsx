import React from 'react';

export function Guide({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Chord Theory Guide</h2>
        
        <div className="guide-section">
          <h3>Major Chords</h3>
          <p><strong>Vibe:</strong> Happy, bright, resolved.</p>
          <p><strong>Formula:</strong> Root + Major 3rd + Perfect 5th.</p>
          <p><strong>How to Memorize:</strong> Start at the root key. Go up <strong>4</strong> keys, then go up <strong>3</strong> more keys.</p>
        </div>

        <div className="guide-section">
          <h3>Minor Chords</h3>
          <p><strong>Vibe:</strong> Sad, serious, emotional.</p>
          <p><strong>Formula:</strong> Root + Minor 3rd + Perfect 5th.</p>
          <p><strong>How to Memorize:</strong> Start at the root key. Go up <strong>3</strong> keys, then go up <strong>4</strong> more keys.</p>
        </div>

        <div className="guide-section">
          <h3>Diminished Chords</h3>
          <p><strong>Vibe:</strong> Tense, scary, unstable.</p>
          <p><strong>Formula:</strong> Root + Minor 3rd + Diminished 5th.</p>
          <p><strong>How to Memorize:</strong> It's a stack of minor thirds! Start at the root, go up <strong>3</strong> keys, and then up <strong>3</strong> more keys.</p>
        </div>

        <div className="guide-section">
          <h3>Augmented Chords</h3>
          <p><strong>Vibe:</strong> Dreamy, floating, unresolved.</p>
          <p><strong>Formula:</strong> Root + Major 3rd + Augmented 5th.</p>
          <p><strong>How to Memorize:</strong> It's a stack of major thirds! Start at the root, go up <strong>4</strong> keys, and then up <strong>4</strong> more keys.</p>
        </div>
        
        <p className="guide-tip"><strong>Tip:</strong> A "key" means moving to the very next adjacent key on the piano, counting both white and black keys (semitones).</p>
      </div>
    </div>
  );
}
