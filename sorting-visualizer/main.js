// ── State ────────────────────────────────────────────
let array        = [];
let steps        = [];       // all animation steps pre-computed
let stepIndex    = 0;
let isSorting    = false;
let isPaused     = false;
let animTimer    = null;
let currentAlgo  = 'bubble';
let startTime    = 0;

// ── Algorithm metadata ───────────────────────────────
const ALGO_INFO = {
  bubble: {
    name: 'Bubble Sort',
    desc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they\'re in the wrong order. The largest unsorted element "bubbles up" to its correct position each pass.',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    fn: bubbleSort,
  },
  selection: {
    name: 'Selection Sort',
    desc: 'Divides the list into a sorted and unsorted region. Repeatedly finds the minimum element from the unsorted region and places it at the beginning of the sorted region.',
    best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    fn: selectionSort,
  },
  insertion: {
    name: 'Insertion Sort',
    desc: 'Builds a sorted array one element at a time by taking each new element and inserting it into its correct position among the already-sorted elements.',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)',
    fn: insertionSort,
  },
  merge: {
    name: 'Merge Sort',
    desc: 'Divides the array in half recursively until single elements remain, then merges them back together in sorted order. A classic divide-and-conquer algorithm.',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',
    fn: mergeSort,
  },
  quick: {
    name: 'Quick Sort',
    desc: 'Picks a pivot element and partitions the array so all smaller elements come before it and larger ones after. Recursively applies the same logic to each partition.',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)',
    fn: quickSort,
  },
};

// Speed map: slider value → delay in ms
const SPEED_MAP  = { 1: 300, 2: 100, 3: 40, 4: 10, 5: 1 };
const SPEED_LABEL = { 1: 'Very Slow', 2: 'Slow', 3: 'Medium', 4: 'Fast', 5: 'Very Fast' };

// ── DOM refs ─────────────────────────────────────────
const barsContainer   = document.getElementById('bars-container');
const btnStart        = document.getElementById('btn-start');
const btnReset        = document.getElementById('btn-reset');
const btnPause        = document.getElementById('btn-pause');
const sizeSlider      = document.getElementById('size-slider');
const sizeVal         = document.getElementById('size-val');
const speedSlider     = document.getElementById('speed-slider');
const speedVal        = document.getElementById('speed-val');
const statComparisons = document.getElementById('stat-comparisons');
const statSwaps       = document.getElementById('stat-swaps');
const statTime        = document.getElementById('stat-time');
const statStatus      = document.getElementById('stat-status');
const infoTitle       = document.getElementById('info-title');
const infoDesc        = document.getElementById('info-desc');
const cxBest          = document.getElementById('cx-best');
const cxAvg           = document.getElementById('cx-avg');
const cxWorst         = document.getElementById('cx-worst');
const cxSpace         = document.getElementById('cx-space');

// ── Array helpers ────────────────────────────────────
function generateArray(n) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
}

function resetAll() {
  stopAnimation();
  array = generateArray(+sizeSlider.value);
  steps = [];
  stepIndex = 0;
  isSorting = false;
  isPaused  = false;
  updateStats(0, 0, '—', 'Ready');
  renderBars(array, []);
  btnStart.disabled = false;
  btnStart.textContent = '▶ Start';
  btnPause.disabled = true;
  btnPause.textContent = '⏸ Pause';
}

// ── Rendering ────────────────────────────────────────
const STATE_COLOR = {
  default: 'var(--c-default)',
  compare: 'var(--c-compare)',
  swap:    'var(--c-swap)',
  pivot:   'var(--c-pivot)',
  sorted:  'var(--c-sorted)',
};

function renderBars(arr, highlights) {
  // highlights: [{ index, state }]
  const max = Math.max(...arr, 1);
  barsContainer.innerHTML = '';
  arr.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(v / max) * 100}%`;
    const hl = highlights.find(h => h.index === i);
    bar.style.background = hl ? STATE_COLOR[hl.state] : STATE_COLOR.default;
    barsContainer.appendChild(bar);
  });
}

// ── Stats ────────────────────────────────────────────
function updateStats(comps, swaps, time, status) {
  statComparisons.textContent = comps;
  statSwaps.textContent       = swaps;
  statTime.textContent        = time;
  statStatus.textContent      = status;
}

// ── Algorithm info panel ─────────────────────────────
function updateInfoPanel(algo) {
  const info = ALGO_INFO[algo];
  infoTitle.textContent = info.name;
  infoDesc.textContent  = info.desc;
  cxBest.textContent    = info.best;
  cxAvg.textContent     = info.avg;
  cxWorst.textContent   = info.worst;
  cxSpace.textContent   = info.space;
}

// ── Animation engine ─────────────────────────────────
function runAnimation() {
  if (stepIndex >= steps.length) {
    // Done
    renderBars(steps[steps.length - 1].arr, []);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    const lastStep = steps[steps.length - 1];
    updateStats(lastStep.comparisons, lastStep.swaps, `${elapsed}s`, '✓ Done');
    isSorting = false;
    isPaused  = false;
    btnStart.disabled = true;
    btnPause.disabled = true;
    btnPause.textContent = '⏸ Pause';
    return;
  }

  const step = steps[stepIndex];
  renderBars(step.arr, step.highlights || []);
  updateStats(step.comparisons, step.swaps, `${((Date.now() - startTime) / 1000).toFixed(2)}s`, 'Sorting…');
  stepIndex++;

  const delay = SPEED_MAP[+speedSlider.value];
  animTimer = setTimeout(runAnimation, delay);
}

function stopAnimation() {
  if (animTimer) { clearTimeout(animTimer); animTimer = null; }
}

// ── Controls ─────────────────────────────────────────
btnStart.addEventListener('click', () => {
  if (isSorting) return;
  isSorting  = true;
  isPaused   = false;
  stepIndex  = 0;
  startTime  = Date.now();

  // Generate all steps via the selected algorithm
  const arrCopy = [...array];
  steps = ALGO_INFO[currentAlgo].fn(arrCopy);

  btnStart.disabled = true;
  btnPause.disabled = false;
  runAnimation();
});

btnPause.addEventListener('click', () => {
  if (!isSorting) return;
  if (!isPaused) {
    stopAnimation();
    isPaused = true;
    btnPause.textContent = '▶ Resume';
    statStatus.textContent = 'Paused';
  } else {
    isPaused = false;
    btnPause.textContent = '⏸ Pause';
    runAnimation();
  }
});

btnReset.addEventListener('click', resetAll);

sizeSlider.addEventListener('input', () => {
  sizeVal.textContent = sizeSlider.value;
  if (!isSorting) resetAll();
});

speedSlider.addEventListener('input', () => {
  speedVal.textContent = SPEED_LABEL[speedSlider.value];
});

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    if (isSorting) return;
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentAlgo = btn.dataset.algo;
    updateInfoPanel(currentAlgo);
    resetAll();
  });
});

// ── Init ──────────────────────────────────────────────
updateInfoPanel('bubble');
resetAll();