// Insertion Sort — generates every animation step

function insertionSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;
  let comparisons = 0, swaps = 0;

  function snap(highlights) {
    steps.push({ arr: [...a], highlights, comparisons, swaps });
  }

  snap([{ index: 0, state: 'sorted' }]);

  for (let i = 1; i < n; i++) {
    let j = i;

    snap([{ index: j, state: 'compare' }]);

    while (j > 0 && a[j - 1] > a[j]) {
      comparisons++;
      snap([{ index: j, state: 'compare' }, { index: j - 1, state: 'compare' }]);

      [a[j], a[j - 1]] = [a[j - 1], a[j]];
      swaps++;
      snap([{ index: j, state: 'swap' }, { index: j - 1, state: 'swap' }]);

      j--;
    }
    comparisons++;

    // Everything up to i is now sorted
    const sortedHL = Array.from({ length: i + 1 }, (_, k) => ({ index: k, state: 'sorted' }));
    snap(sortedHL);
  }

  const finalHL = a.map((_, i) => ({ index: i, state: 'sorted' }));
  snap(finalHL);

  return steps;
}