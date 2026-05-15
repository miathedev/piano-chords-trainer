export function getHighScore() {
  const match = document.cookie.match(/(^| )highscore=([^;]+)/);
  if (match) {
    return parseInt(match[2], 10);
  }
  return 0;
}

export function setHighScore(score) {
  // Save for 10 years
  document.cookie = `highscore=${score}; max-age=315360000; path=/`;
}
