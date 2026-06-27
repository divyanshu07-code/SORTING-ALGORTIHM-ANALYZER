// Merge Sort — generates every animation step

function mergeSort(arr) {
  const steps = [];
  const a = [...arr];
  let comparisons = 0, swaps = 0;

  function snap(highlights) {
    steps.push({ arr: [...a], highlights, comparisons, swaps });
  }

  function merge(left, mid, right) {
    const leftArr  = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      snap([
        { index: left + i, state: 'compare' },
        { index: mid + 1 + j, state: 'compare' },
      ]);
      comparisons++;

      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        i++;
      } else {
        a[k] = rightArr[j];
        j++;
        swaps++;
      }
      snap([{ index: k, state: 'swap' }]);
      k++;
    }

    while (i < leftArr.length) {
      a[k] = leftArr[i];
      snap([{ index: k, state: 'swap' }]);
      i++; k++;
    }

    while (j < rightArr.length) {
      a[k] = rightArr[j];
      snap([{ index: k, state: 'swap' }]);
      j++; k++;
    }

    // Mark merged region as sorted (temporarily, for visual feedback)
    const sortedHL = [];
    for (let x = left; x <= right; x++) sortedHL.push({ index: x, state: 'sorted' });
    snap(sortedHL);
  }

  function divide(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    divide(left, mid);
    divide(mid + 1, right);
    merge(left, mid, right);
  }

  divide(0, a.length - 1);

  const finalHL = a.map((_, i) => ({ index: i, state: 'sorted' }));
  snap(finalHL);

  return steps;
}