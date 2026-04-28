<template>
  <div
    class="cube-root"
    :style="{
      '--w': sizePx + 'px',
      '--h': sizePx / 2 + 'px',
      '--roll-duration': `${rollDurationMs}ms`,
    }"
  >
    <div class="cube-bird" :style="birdStyle">
      <div class="cube-outer" :class="{ 'cube-outer--rolling': rolling }">
        <div class="cube-inner" :style="innerStyle">
          <div
            v-for="face in renderedFaces"
            :key="face.cls"
            class="cube-face rounded-lg border-2 border-black/50 shadow-inner"
            :class="face.cls"
            :style="{ backgroundColor: faceColor, filter: `brightness(${face.brightness})` }"
          >
            <div class="cube-face-inner flex h-full w-full items-center justify-center">
              <template v-if="useEyes && face.value >= 1 && face.value <= 6">
                <div class="grid h-[72%] w-[72%] grid-cols-3 grid-rows-3 gap-0.5 p-0.5">
                  <div v-for="cell in 9" :key="cell" class="flex items-center justify-center">
                    <span
                      v-if="dotCells(face.value).includes(cell - 1)"
                      class="block min-h-[0.2rem] min-w-[0.2rem] rounded-full"
                      :style="{ backgroundColor: markColor, width: `${pipSizePx}px`, height: `${pipSizePx}px` }"
                    />
                  </div>
                </div>
              </template>
              <span
                v-else
                class="select-none font-black tabular-nums"
                :style="{ color: markColor, fontFamily, fontSize: `${fontSizePx}px`, lineHeight: 1 }"
              >
                {{ face.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const DOT: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 3, 6, 2, 5, 8],
};

function dotCells(v: number): number[] {
  return DOT[v] ?? [];
}

/** Top=1, bottom=6, front=2, back=5, right=3, left=4 — opposites sum to 7 */
const faces = [
  { cls: 'cube-face--top', value: 1 },
  { cls: 'cube-face--bottom', value: 6 },
  { cls: 'cube-face--front', value: 2 },
  { cls: 'cube-face--back', value: 5 },
  { cls: 'cube-face--right', value: 3 },
  { cls: 'cube-face--left', value: 4 },
];

const BASE_VIEW_TILT_X_DEG = 0;
const BASE_VIEW_TILT_Y_DEG = 0;

const props = withDefaults(
  defineProps<{
    result: number;
    settledFace?: number;
    rolling: boolean;
    faceColor: string;
    markColor: string;
    useEyes: boolean;
    sizePx: number;
    rollDurationMs?: number;
    viewTiltXDeg?: number;
    viewTiltYDeg?: number;
    highlightSettledFace?: boolean;
    fontFamily?: string;
    fontSizePx?: number;
    pipSizePx?: number;
    /** true: Gewinnzahl auf der Vorderseite (+Z) zur Kamera; false: oben (+Y) */
    winnerOnFront?: boolean;
  }>(),
  {
    settledFace: 2,
    rollDurationMs: 110,
    viewTiltXDeg: 0,
    viewTiltYDeg: 0,
    highlightSettledFace: false,
    fontFamily: 'system-ui, sans-serif',
    fontSizePx: 32,
    pipSizePx: 16,
    winnerOnFront: true,
  }
);

/** Gewinnzahl auf der Oberseite (+Y) — nach Vogel-Neigung eher als „Deckel“ sichtbar */
function restTransformTop(v: number): string {
  switch (v) {
    case 1:
      return 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    case 2:
      return 'rotateX(-90deg) rotateY(0deg) rotateZ(0deg)';
    case 3:
      return 'rotateX(0deg) rotateY(0deg) rotateZ(90deg)';
    case 4:
      return 'rotateX(0deg) rotateY(0deg) rotateZ(-90deg)';
    case 5:
      return 'rotateX(90deg) rotateY(0deg) rotateZ(0deg)';
    case 6:
      return 'rotateX(180deg) rotateY(0deg) rotateZ(0deg)';
    default:
      return 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
  }
}

/**
 * Gewinnzahl auf der Vorderseite (+Z), Standardwürfel: vorne=2, hinten=5, oben=1, unten=6, rechts=3, links=4
 */
function restTransformFront(v: number): string {
  switch (v) {
    case 2:
      return 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
    case 1:
      return 'rotateX(-90deg) rotateY(0deg) rotateZ(0deg)';
    case 6:
      return 'rotateX(90deg) rotateY(0deg) rotateZ(0deg)';
    case 5:
      return 'rotateX(0deg) rotateY(180deg) rotateZ(0deg)';
    case 3:
      return 'rotateX(0deg) rotateY(-90deg) rotateZ(0deg)';
    case 4:
      return 'rotateX(0deg) rotateY(90deg) rotateZ(0deg)';
    default:
      return 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
  }
}

const innerStyle = computed(() => {
  const rv = Math.min(6, Math.max(1, Math.floor(props.settledFace)));
  const t = props.winnerOnFront ? restTransformFront(rv) : restTransformTop(rv);
  return {
    transform: t,
    transition: props.rolling ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
    transformStyle: 'preserve-3d' as const,
  };
});

const renderedFaces = computed(() => {
  const settled = Math.min(6, Math.max(1, Math.floor(props.settledFace)));
  return faces.map((face) => ({
    ...face,
    value: face.value === settled ? Math.max(1, Math.floor(props.result)) : face.value,
    isSettled: face.value === settled,
    brightness:
      props.highlightSettledFace && face.value === settled
        ? 1.22
        : props.highlightSettledFace
          ? 0.72
          : 1,
  }));
});

const birdStyle = computed(() => {
  const tiltX = Math.max(-45, Math.min(45, Math.round(props.viewTiltXDeg)));
  const tiltY = Math.max(-45, Math.min(45, Math.round(props.viewTiltYDeg)));
  return {
    transform: `rotateX(${BASE_VIEW_TILT_X_DEG + tiltX}deg) rotateY(${BASE_VIEW_TILT_Y_DEG + tiltY}deg)`,
  };
});

</script>

<style scoped>
.cube-root {
  width: var(--w);
  height: var(--w);
  perspective: 560px;
  perspective-origin: 50% 50%;
}

/* Leichte Schräge: Vorderseite (+Z) bleibt zur Kamera, nicht Vogelperspektive „oben rechts“ */
.cube-bird {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.cube-outer {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.cube-outer--rolling {
  animation: cube-outer-rattle var(--roll-duration) linear infinite;
}

@keyframes cube-outer-rattle {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  25% {
    transform: rotateX(92deg) rotateY(48deg) rotateZ(-22deg);
  }
  50% {
    transform: rotateX(188deg) rotateY(-55deg) rotateZ(18deg);
  }
  75% {
    transform: rotateX(270deg) rotateY(120deg) rotateZ(-35deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(180deg) rotateZ(0deg);
  }
}

.cube-inner {
  position: relative;
  width: var(--w);
  height: var(--w);
  transform-style: preserve-3d;
}

.cube-face {
  position: absolute;
  inset: 0;
  width: var(--w);
  height: var(--w);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.cube-face--front {
  transform: rotateY(0deg) translateZ(var(--h));
}
.cube-face--back {
  transform: rotateY(180deg) translateZ(var(--h));
}
.cube-face--right {
  transform: rotateY(90deg) translateZ(var(--h));
}
.cube-face--left {
  transform: rotateY(-90deg) translateZ(var(--h));
}
.cube-face--top {
  transform: rotateX(90deg) translateZ(var(--h));
}
.cube-face--bottom {
  transform: rotateX(-90deg) translateZ(var(--h));
}
</style>
