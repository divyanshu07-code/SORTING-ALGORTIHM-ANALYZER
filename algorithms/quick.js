// Quick Sort — generates every animation step

function quickSort(arr) {
  const steps = [];
  const a = [...arr];
  let comparisons = 0, swaps = 0;
  const sortedIndices = new Set();

  function snap(highlights) {
    const hl = [
      ...highlights,
      ...[...sortedIndices].map(i => ({ index: i, state: 'sorted' })),
    ];
    steps.push({ arr: [...a], highlights: hl, comparisons, swaps });
  }

  function partition(low, high) {
    const pivot = a[high];
    let i = low - 1;

    snap([{ index: high, state: 'pivot' }]);

    for (let j = low; j < high; j++) {
      snap([
        { index: high, state: 'pivot' },
        { index: j,    state: 'compare' },
      ]);
      comparisons++;

      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        swaps++;
        snap([
          { index: high, state: 'pivot' },
          { index: i,    state: 'swap' },
          { index: j,    state: 'swap' },
        ]);
      }
    }

    // Place pivot in correct position
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    swaps++;
    sortedIndices.add(i + 1);
    snap([{ index: i + 1, state: 'sorted' }]);

    return i + 1;
  }

  function sort(low, high) {
    if (low >= high) {
      if (low === high) sortedIndices.add(low);
      return;
    }
    const pi = partition(low, high);
    sort(low, pi - 1);
    sort(pi + 1, high);
  }

  sort(0, a.length - 1);

  const finalHL = a.map((_, i) => ({ index: i, state: 'sorted' }));
  steps.push({ arr: [...a], highlights: finalHL, comparisons, swaps });

  return steps;
}