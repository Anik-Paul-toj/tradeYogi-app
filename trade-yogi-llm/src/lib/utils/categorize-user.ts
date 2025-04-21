
export function categorizeUser(userVector: number[]): string {
  const assetOptionsLength = 3; // Based on the provided asset_options array length
  const goal = userVector[0];
  const risk = userVector[1];
  const freq = userVector[2];
  const horizon = userVector[assetOptionsLength + 4];
  const capital = userVector[userVector.length - 2];

  if (goal === 0 && risk <= 1 && horizon === 3) {
    return 'Long-Term Investor';
  } else if (goal === 2 && risk >= 2) {
    return 'Day Trader';
  } else if (freq === 1 && risk === 1) {
    return 'Swing Trader';
  } else if (capital === 0 && risk >= 2) {
    return 'Experimental Trader';
  } else {
    return 'Balanced Investor';
  }
}
