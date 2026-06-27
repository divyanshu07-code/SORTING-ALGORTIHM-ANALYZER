// Selection Sort — generates every animation step

function selectionSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  let comparisons = 0, swaps = 0;
  const sorted = new Set();

  function snap(highlights) {
    const hl = [...highlights, ...[...sorted].map(i => ({ index: i, state: 'sorted' }))];
    steps.push({ arr: [...a], highlights: hl, comparisons, swaps });
  }

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      snap([{ index: minIdx, state: 'pivot' }, { index: j, state: 'compare' }]);
      comparisons++;
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
      snap([{ index: i, state: 'swap' }, { index: minIdx, state: 'swap' }]);
    }

    sorted.add(i);
    snap([]);
  }

  sorted.add(n - 1);
  snap([]);

  return steps;
}