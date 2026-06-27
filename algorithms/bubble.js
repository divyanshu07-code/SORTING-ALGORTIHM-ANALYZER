

// Bubble Sort — generates every animation step
// Returns an array of step objects the visualizer replays.

function bubbleSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  let comparisons = 0, swaps = 0;

  // Helper: push a snapshot of the current array state
  function snap(highlights) {
    steps.push({
      arr: [...a],
      highlights,
      comparisons,
      swaps,
    });
  }

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight the two elements being compared
      snap([{ index: j, state: 'compare' }, { index: j + 1, state: 'compare' }]);
      comparisons++;

      if (a[j] > a[j + 1]) {
        // Swap
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        snap([{ index: j, state: 'swap' }, { index: j + 1, state: 'swap' }]);
      }
    }
    // Mark the last element of this pass as sorted
    snap([{ index: n - 1 - i, state: 'sorted' }]);
  }

  // Mark everything as sorted at the end
  const finalHighlights = a.map((_, i) => ({ index: i, state: 'sorted' }));
  snap(finalHighlights);

  return steps;
}