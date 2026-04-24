<template>
  <div
    class="min-h-screen text-white"
    :class="[
      obsMode && chromaKeyUi ? 'bg-[#00FF00]' : 'bg-night',
      obsMode ? 'flex flex-col items-center justify-center px-2 py-4' : 'px-4 py-6',
    ]"
  >
    <div
      class="flex w-full flex-col gap-8"
      :class="obsMode ? 'items-center justify-center' : 'mx-auto max-w-[min(97vw,1760px)] lg:flex-row lg:items-start lg:gap-8'"
    >
      <template v-if="!obsMode">
        <div class="flex min-w-0 flex-1 flex-col gap-4 lg:basis-[64%]">
          <div class="rounded-2xl border border-white/10 bg-night/50 p-4 shadow-lg shadow-black/10">
            <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Streamer Würfel</h1>
                <p class="mt-1 text-sm text-dim-gray">Baue deinen Wurf links, prüfe ihn rechts in der Live-Vorschau.</p>
              </div>
              <div class="rounded-full border border-white/10 bg-eerie-black px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-moonstone">
                {{ diceCount }}W{{ sides }}
              </div>
            </div>

            <div class="rounded-xl border border-white/10 bg-eerie-black/35 p-1">
              <div class="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  class="rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition"
                  :class="editorTab === 'base' ? 'bg-white text-night shadow' : 'text-dim-gray hover:text-white'"
                  @click="editorTab = 'base'"
                >
                  Basis
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition"
                  :class="editorTab === 'style' ? 'bg-white text-night shadow' : 'text-dim-gray hover:text-white'"
                  @click="editorTab = 'style'"
                >
                  Würfel
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition"
                  :class="editorTab === 'colors' ? 'bg-white text-night shadow' : 'text-dim-gray hover:text-white'"
                  @click="editorTab = 'colors'"
                >
                  Farben
                </button>
                <button
                  type="button"
                  class="rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition"
                  :class="editorTab === 'share' ? 'bg-white text-night shadow' : 'text-dim-gray hover:text-white'"
                  @click="editorTab = 'share'"
                >
                  Share
                </button>
              </div>
            </div>
          </div>

          <div v-if="editorTab === 'base'" class="grid gap-4 xl:grid-cols-[0.82fr,1.18fr]">
            <section class="rounded-2xl border border-white/10 bg-night/50 p-4 text-sm shadow-lg shadow-black/10">
              <div class="mb-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-dim-gray">Wurf</p>
                <p class="mt-1 text-xs text-dim-gray">Anzahl und Seitenzahl des Wurfs.</p>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold uppercase tracking-wide text-dim-gray">Anzahl Würfel</span>
                  <select v-model.number="diceCount" class="rounded-lg border border-gray-600 bg-eerie-black px-3 py-2.5 text-white">
                    <option v-for="n in DICE_COUNT_OPTIONS" :key="n" :value="n">{{ n }}</option>
                  </select>
                </label>
                <label class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold uppercase tracking-wide text-dim-gray">Seiten</span>
                  <input
                    v-model.number="sides"
                    type="number"
                    min="2"
                    max="20"
                    class="rounded-lg border border-gray-600 bg-eerie-black px-3 py-2.5 text-white"
                  />
                </label>
              </div>
              <div class="mt-4 grid gap-2.5">
                <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-eerie-black/40 px-3 py-2.5">
                  <span>Chroma-Key</span>
                  <input v-model="chromaKeyUi" type="checkbox" class="rounded border-gray-500" />
                </label>
                <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-eerie-black/40 px-3 py-2.5">
                  <span>Würfelton beim Wurf</span>
                  <input v-model="soundDiceEnabled" type="checkbox" class="rounded border-gray-500" />
                </label>
              </div>
            </section>

            <section class="rounded-2xl border border-white/10 bg-night/50 p-4 text-sm shadow-lg shadow-black/10">
              <div class="grid gap-5 xl:grid-cols-[0.78fr,1.22fr]">
                <div>
                  <div class="mb-4">
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-dim-gray">Geschwindigkeit</p>
                  </div>
                  <div class="space-y-4">
                    <label class="flex flex-col gap-2">
                      <span class="flex items-center justify-between gap-3">
                        <span>3D-Wurfgeschwindigkeit</span>
                        <span class="text-xs font-semibold text-moonstone">{{ rollSpeedLabel }}</span>
                      </span>
                      <input v-model.number="rollAnimationUi" type="range" min="0" max="100" step="5" class="w-full accent-twitch-purple" />
                    </label>
                    <label class="flex flex-col gap-2" :class="!soundDiceEnabled ? 'opacity-55' : ''">
                      <span class="flex items-center justify-between gap-3">
                        <span>Soundgeschwindigkeit</span>
                        <span class="text-xs font-semibold text-moonstone">{{ soundSpeedLabel }}</span>
                      </span>
                      <input v-model.number="soundTickUi" type="range" min="0" max="100" step="5" class="w-full accent-twitch-purple" :disabled="!soundDiceEnabled" />
                    </label>
                  </div>
                </div>

                <div>
                  <div class="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-dim-gray">Endposition</p>
                      <p class="mt-1 text-xs text-dim-gray">Ziehe den Vorschau-Würfel. Die helle Seite ist die Gewinnseite.</p>
                    </div>
                    <button
                      type="button"
                      class="shrink-0 rounded border border-white/15 px-2.5 py-1 text-xs font-semibold text-white hover:border-moonstone/50 hover:bg-white/5"
                      @click="resetEndPose"
                    >
                      Reset
                    </button>
                  </div>
                  <div
                    ref="posePreviewRef"
                    class="flex cursor-grab touch-none items-center justify-center rounded-lg border border-white/10 bg-eerie-black/40 p-4 active:cursor-grabbing"
                    @pointerdown="startPoseDrag"
                    @pointermove="updatePoseDrag"
                    @pointerup="endPoseDrag"
                    @pointercancel="endPoseDrag"
                    @pointerleave="endPoseDrag"
                  >
                    <DiceCube3d
                      :result="posePreviewValue"
                      :settled-face="posePreviewSettledFace"
                      :rolling="false"
                      :face-color="posePreviewFaceColor"
                      :mark-color="posePreviewMarkColor"
                      :use-eyes="posePreviewUseEyes"
                      :chroma="false"
                      :size-px="110"
                      :roll-duration-ms="rollAnimationMs"
                      :view-tilt-x-deg="endTiltXDeg"
                      :view-tilt-y-deg="endTiltYDeg"
                  :highlight-settled-face="true"
                  :font-family="selectedFontFamily"
                  :font-size-px="fontSizePx"
                  :pip-size-px="pipSizePx"
                  :winner-on-front="true"
                />
                  </div>
                  <div class="mt-4 grid gap-3 sm:grid-cols-2">
                    <label class="flex flex-col gap-2">
                      <span class="flex items-center justify-between gap-3">
                        <span>Oben / Unten</span>
                        <span class="text-xs font-semibold text-moonstone">{{ endTiltXDeg }}°</span>
                      </span>
                      <input v-model.number="endTiltXUi" type="range" min="0" max="100" step="5" class="w-full accent-twitch-purple" />
                    </label>
                    <label class="flex flex-col gap-2">
                      <span class="flex items-center justify-between gap-3">
                        <span>Links / Rechts</span>
                        <span class="text-xs font-semibold text-moonstone">{{ endTiltYDeg }}°</span>
                      </span>
                      <input v-model.number="endTiltYUi" type="range" min="0" max="100" step="5" class="w-full accent-twitch-purple" />
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div v-else-if="editorTab === 'style'" class="grid gap-4">
            <section class="rounded-2xl border border-white/10 bg-night/50 p-4 text-sm shadow-lg shadow-black/10">
              <div class="mb-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-dim-gray">Look</p>
                <p class="mt-1 text-xs text-dim-gray">Größe, Schrift und Anzeigeeinstellungen für deine Würfel.</p>
              </div>
              <div class="grid gap-4 xl:grid-cols-2">
                <div class="space-y-4">
                <div v-if="colorMode !== 'custom'" class="grid grid-cols-2 gap-2">
                  <label class="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-eerie-black/40 px-3 py-2.5">
                    <span>Zahlen</span>
                    <input v-model="globalDisplay" type="radio" value="number" class="rounded border-gray-500" />
                  </label>
                  <label
                    class="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-eerie-black/40 px-3 py-2.5"
                    :class="!eyesAllowed ? 'cursor-not-allowed opacity-45' : ''"
                  >
                    <span>Augen</span>
                    <input
                      v-model="globalDisplay"
                      type="radio"
                      value="eyes"
                      class="rounded border-gray-500"
                      :disabled="!eyesAllowed"
                    />
                  </label>
                </div>

                <label class="flex flex-col gap-2">
                  <span class="flex items-center justify-between gap-3">
                    <span>Würfelgröße</span>
                    <span class="text-xs font-semibold text-moonstone">{{ dieScaleLabel }}</span>
                  </span>
                  <input v-model.number="dieScaleUi" type="range" min="0" max="100" step="5" class="w-full accent-twitch-purple" />
                </label>
                <label class="flex flex-col gap-2" :class="!usesNumbers ? 'opacity-50' : ''">
                  <span>Schrift</span>
                  <select v-model="fontPreset" class="rounded-lg border border-gray-600 bg-eerie-black px-3 py-2.5 text-white" :disabled="!usesNumbers">
                    <option v-for="font in FONT_PRESETS" :key="font.id" :value="font.id">{{ font.label }}</option>
                  </select>
                </label>
                </div>

                <div class="space-y-4">
                <label class="flex flex-col gap-2" :class="!usesNumbers ? 'opacity-50' : ''">
                  <span class="flex items-center justify-between gap-3">
                    <span>Zahlengröße</span>
                    <span class="text-xs font-semibold text-moonstone">{{ fontSizeLabel }}</span>
                  </span>
                  <input v-model.number="fontSizeUi" type="range" min="0" max="100" step="5" class="w-full accent-twitch-purple" :disabled="!usesNumbers" />
                </label>
                <label class="flex flex-col gap-2" :class="!usesEyes ? 'opacity-50' : ''">
                  <span class="flex items-center justify-between gap-3">
                    <span>Augengröße</span>
                    <span class="text-xs font-semibold text-moonstone">{{ pipSizeLabel }}</span>
                  </span>
                  <input
                    v-model.number="pipSizeUi"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    class="w-full accent-twitch-purple"
                    :disabled="!usesEyes"
                  />
                </label>
                </div>
              </div>
            </section>
          </div>

          <div v-else-if="editorTab === 'colors'" class="grid gap-4">
            <section class="flex min-h-[32rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-night/50 p-4 text-sm shadow-lg shadow-black/10">
              <div class="mb-3 shrink-0">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-dim-gray">Farben</p>
                <p class="mt-1 text-xs text-dim-gray">Wechsle zwischen Presets und individuellen Würfelfarben.</p>
              </div>
              <div class="flex min-h-0 flex-1 flex-col gap-3">
                <div class="shrink-0 flex rounded-lg border border-white/10 bg-night p-0.5" role="tablist" aria-label="Farbmodus">
                  <button
                    type="button"
                    role="tab"
                    class="flex-1 rounded-md px-2 py-2 text-xs font-semibold transition sm:text-sm"
                    :class="colorTabActive === 'presets' ? 'bg-eerie-black text-white shadow' : 'text-dim-gray hover:text-white'"
                    :aria-selected="colorTabActive === 'presets'"
                    @click="colorTabActive = 'presets'"
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    role="tab"
                    class="flex-1 rounded-md px-2 py-2 text-xs font-semibold transition sm:text-sm"
                    :class="colorTabActive === 'custom' ? 'bg-eerie-black text-white shadow' : 'text-dim-gray hover:text-white'"
                    :aria-selected="colorTabActive === 'custom'"
                    @click="colorTabActive = 'custom'"
                  >
                    Custom
                  </button>
                </div>

                <div v-show="colorTabActive === 'presets'" role="tabpanel" class="flex min-h-0 flex-1 flex-col gap-3">
                  <div class="grid grid-cols-2 gap-2 lg:grid-cols-3">
                    <button
                      v-for="category in COLOR_PRESET_CATEGORIES"
                      :key="category.id"
                      type="button"
                      class="rounded-lg border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] transition"
                      :class="colorPresetCategory === category.id ? 'border-moonstone/60 bg-white/8 text-white' : 'border-white/10 bg-eerie-black/30 text-dim-gray hover:text-white'"
                      @click="selectColorPresetCategory(category.id)"
                    >
                      {{ category.label }}
                    </button>
                  </div>

                  <div v-if="colorPresetCategory === 'single'" class="flex shrink-0 flex-col gap-3">
                    <label class="flex flex-wrap items-center gap-2">
                      Würfelfarbe
                      <input v-model="singleFace" type="color" class="h-9 w-14 cursor-pointer rounded border border-gray-600 bg-night" />
                      <span class="text-dim-gray">{{ singleFace }}</span>
                    </label>
                    <label class="flex flex-wrap items-center gap-2">
                      Zahlen / Augen
                      <input v-model="singleMark" type="color" class="h-9 w-14 cursor-pointer rounded border border-gray-600 bg-night" />
                      <span class="text-dim-gray">{{ singleMark }}</span>
                    </label>
                  </div>

                  <div v-else-if="colorPresetCategory === 'fantasy'" class="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pt-1">
                    <ul class="grid grid-cols-2 gap-2" role="list">
                      <li v-for="(pal, pi) in fantasyPalettes" :key="pal.name">
                        <label class="flex h-full cursor-pointer items-center gap-2 rounded-lg border border-transparent bg-eerie-black/30 p-2 hover:border-white/10 has-[:checked]:border-moonstone/50 has-[:checked]:bg-white/5">
                          <input
                            type="radio"
                            class="sr-only"
                            :checked="selectedSchemeId === `f-${pi}`"
                            @change="pickFantasyAt(pi)"
                          />
                          <div class="min-w-0 flex-1">
                            <p class="text-[11px] font-medium text-white">{{ pal.name }}</p>
                            <div class="mt-1 flex flex-wrap gap-0.5">
                              <span
                                v-for="(c, ci) in pal.colors.slice(0, 12)"
                                :key="ci"
                                class="h-3.5 w-3.5 shrink-0 rounded-sm ring-1 ring-black/25"
                                :style="{ backgroundColor: c }"
                              />
                            </div>
                          </div>
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div v-else class="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pt-1">
                    <ul class="grid grid-cols-2 gap-2" role="list">
                      <li v-for="(scheme, schemeIndex) in activeThemeGroup?.schemes ?? []" :key="`${colorPresetCategory}-${schemeIndex}`">
                        <label class="flex h-full cursor-pointer items-center gap-2 rounded-lg border border-transparent bg-eerie-black/30 p-2 hover:border-white/10 has-[:checked]:border-moonstone/50 has-[:checked]:bg-white/5">
                          <input
                            type="radio"
                            class="sr-only"
                            :checked="activeThemeGroupIndex !== null && selectedSchemeId === themeId(activeThemeGroupIndex, schemeIndex)"
                            @change="activeThemeGroupIndex !== null && pickThemeAt(activeThemeGroupIndex, schemeIndex)"
                          />
                          <div class="min-w-0 flex-1">
                            <p class="text-[11px] font-medium text-white">Schema {{ schemeIndex + 1 }}</p>
                            <div class="mt-1 flex flex-wrap gap-0.5">
                              <span
                                v-for="(c, ci) in scheme.colors.slice(0, 12)"
                                :key="ci"
                                class="h-3.5 w-3.5 shrink-0 rounded-sm ring-1 ring-black/25"
                                :style="{ backgroundColor: c }"
                              />
                            </div>
                          </div>
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>

                <div v-show="colorTabActive === 'custom'" role="tabpanel" class="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pt-1">
                  <div
                    v-for="(d, di) in customDice"
                    :key="di"
                    class="rounded border border-white/10 bg-eerie-black/40 p-2"
                  >
                    <p class="mb-2 text-[11px] font-semibold text-moonstone">Würfel {{ di + 1 }}</p>
                    <div class="flex flex-wrap items-center gap-2">
                      <label class="flex items-center gap-1 text-xs">
                        Fläche
                        <input v-model="d.face" type="color" class="h-8 w-12 cursor-pointer rounded border border-gray-600" />
                      </label>
                      <label class="flex items-center gap-1 text-xs">
                        Zahl / Auge
                        <input v-model="d.mark" type="color" class="h-8 w-12 cursor-pointer rounded border border-gray-600" />
                      </label>
                    </div>
                    <div class="mt-2 flex flex-wrap gap-3 text-xs">
                      <label class="flex cursor-pointer items-center gap-1">
                        <input v-model="d.display" type="radio" value="number" class="border-gray-500" />
                        Zahl
                      </label>
                      <label class="flex cursor-pointer items-center gap-1" :class="!eyesAllowed ? 'cursor-not-allowed opacity-45' : ''">
                        <input
                          v-model="d.display"
                          type="radio"
                          value="eyes"
                          class="border-gray-500"
                          :disabled="!eyesAllowed"
                        />
                        Augen
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div v-else class="grid gap-4">
            <section class="rounded-2xl border border-white/10 bg-night/50 p-4 text-sm shadow-lg shadow-black/10">
              <div class="mb-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-dim-gray">Share</p>
                <p class="mt-1 text-xs text-dim-gray">Erzeuge einen Link fuer OBS oder zum direkten Teilen.</p>
              </div>
              <div class="grid gap-2.5 sm:grid-cols-3">
                <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-eerie-black/40 px-3 py-2.5">
                  <span>OBS-Ansicht</span>
                  <input v-model="shareIncludeObs" type="checkbox" class="rounded border-gray-500" />
                </label>
                <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-eerie-black/40 px-3 py-2.5">
                  <span>Chroma-Gruen</span>
                  <input v-model="shareIncludeChroma" type="checkbox" class="rounded border-gray-500" />
                </label>
                <label class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-eerie-black/40 px-3 py-2.5">
                  <span>Auto-Wurf</span>
                  <input v-model="shareIncludeAutoroll" type="checkbox" class="rounded border-gray-500" />
                </label>
              </div>
              <div class="mt-4 flex gap-2">
                <input
                  :value="shareUrlDisplay"
                  readonly
                  class="min-w-0 flex-1 rounded-lg border border-gray-600 bg-eerie-black px-3 py-2 text-sm text-white"
                  @focus="onShareInputFocus"
                />
                <button
                  type="button"
                  class="shrink-0 rounded-lg bg-twitch-purple px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
                  @click="copyShareLink"
                >
                  {{ shareCopied ? 'Kopiert' : 'Kopieren' }}
                </button>
              </div>
            </section>
          </div>
        </div>

        <div class="flex w-full flex-col gap-4 lg:sticky lg:top-4 lg:basis-[36%]">
          <section class="rounded-2xl border border-white/10 bg-night/50 p-4 shadow-lg shadow-black/10">
            <div class="mb-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-dim-gray">Preview</p>
                <p class="mt-1 text-xs text-dim-gray">Live-Ansicht des aktuellen Wurfs und aller Styling-Optionen.</p>
              </div>
            </div>

            <div
              ref="diceStageRef"
              class="relative w-full overflow-hidden shadow-lg"
              :class="
                chromaKeyUi
                  ? 'rounded-lg border-[3px] border-black/50 ring-1 ring-black/30'
                  : 'rounded-lg border-[3px] border-moonstone/45 ring-1 ring-white/10'
              "
              :style="diceStageOuterStyle"
            >
              <div class="dice-3d-stage w-full px-4 py-8 sm:px-7 sm:py-10">
                <div class="grid justify-items-center justify-center gap-x-7 gap-y-12" :style="grid3dColumnsStyle">
                  <div v-for="(_, i) in results" :key="'d3-' + i" class="flex w-full max-w-[190px] items-center justify-center">
                    <DiceCube3d
                      :result="results[i] ?? 1"
                      :settled-face="settledFaceForDie(i)"
                      :rolling="isRolling"
                      :face-color="faceColorAt(i)"
                      :mark-color="markColorAt(i)"
                      :use-eyes="displayForDie(i) === 'eyes'"
                      :chroma="chromaKeyUi"
                      :size-px="cubeSizePx"
                      :roll-duration-ms="rollAnimationMs"
                      :view-tilt-x-deg="endTiltXDeg"
                      :view-tilt-y-deg="endTiltYDeg"
                      :font-family="selectedFontFamily"
                      :font-size-px="fontSizePx"
                      :pip-size-px="pipSizePx"
                      :winner-on-front="true"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                :disabled="isRolling"
                class="rounded-lg px-8 py-3 font-bold text-white shadow-lg transition enabled:bg-twitch-purple enabled:hover:bg-violet-600 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                @click="roll"
              >
                {{ isRolling ? 'Würfelt …' : 'Würfeln' }}
              </button>
            </div>
          </section>

          <div class="rounded-xl border border-white/10 bg-night/40 px-4 py-3 text-center shadow-lg shadow-black/10">
            <p class="min-h-[1.5rem] text-sm font-bold tracking-wide text-white sm:text-base">
              <span v-if="isRolling" class="text-moonstone">…</span>
              <span v-else class="tabular-nums">{{ results.join(' · ') }}</span>
            </p>
          </div>
        </div>
      </template>

      <div v-else class="flex w-full flex-col items-center">
        <div class="w-full max-w-[min(92vmin,880px)]">
          <p class="mb-3 min-h-[1.75rem] w-full text-center text-xl font-bold tracking-wide">
            <span v-if="isRolling" class="text-moonstone">…</span>
            <span v-else class="tabular-nums text-white">{{ results.join(' · ') }}</span>
          </p>
          <div
            ref="diceStageRef"
            class="relative w-full overflow-hidden shadow-lg"
            :class="
              chromaKeyUi
                ? 'rounded-lg border-[3px] border-black/50 ring-1 ring-black/30'
                : 'rounded-lg border-[3px] border-moonstone/45 ring-1 ring-white/10'
            "
            :style="diceStageOuterStyle"
          >
            <div class="dice-3d-stage w-full px-4 py-8 sm:px-7 sm:py-10">
              <div class="grid justify-items-center justify-center gap-x-7 gap-y-12" :style="grid3dColumnsStyle">
                <div v-for="(_, i) in results" :key="'d3-' + i" class="flex w-full max-w-[190px] items-center justify-center">
                  <DiceCube3d
                    :result="results[i] ?? 1"
                    :settled-face="settledFaceForDie(i)"
                    :rolling="isRolling"
                    :face-color="faceColorAt(i)"
                    :mark-color="markColorAt(i)"
                    :use-eyes="displayForDie(i) === 'eyes'"
                    :chroma="chromaKeyUi"
                    :size-px="cubeSizePx"
                    :roll-duration-ms="rollAnimationMs"
                    :view-tilt-x-deg="endTiltXDeg"
                    :view-tilt-y-deg="endTiltYDeg"
                    :font-family="selectedFontFamily"
                    :font-size-px="fontSizePx"
                    :pip-size-px="pipSizePx"
                    :winner-on-front="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { colorSchemeGroups, fantasyPalettes, allThemeColors, themePresetGlobalIndex } from '~/utils/diceColorData';

const route = useRoute();
const router = useRouter();

const DICE_COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const FONT_PRESETS = [
  { id: 'system', label: 'System', family: 'system-ui, sans-serif' },
  { id: 'rubik', label: 'Rubik', family: '\"Rubik\", system-ui, sans-serif' },
  { id: 'fredoka', label: 'Fredoka', family: '\"Fredoka\", system-ui, sans-serif' },
  { id: 'space-grotesk', label: 'Space Grotesk', family: '\"Space Grotesk\", system-ui, sans-serif' },
  { id: 'bungee', label: 'Bungee', family: '\"Bungee\", system-ui, sans-serif' },
  { id: 'serif', label: 'Serif', family: 'Georgia, Cambria, \"Times New Roman\", serif' },
  { id: 'mono', label: 'Mono', family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
  { id: 'rounded', label: 'Rounded', family: '\"Trebuchet MS\", \"Avenir Next\", Arial, sans-serif' },
] as const;

const COLOR_PRESET_CATEGORIES = [
  { id: 'single', label: 'Einfarbig' },
  { id: 'bunt', label: 'Bunt' },
  { id: 'pastell', label: 'Pastell' },
  { id: 'zweifarbig', label: 'Zweifarbig' },
  { id: 'dark', label: 'Dark' },
  { id: 'fantasy', label: 'Fantasy' },
] as const;

type ColorPresetCategory = (typeof COLOR_PRESET_CATEGORIES)[number]['id'];

const obsMode = computed(() => {
  const o = route.query.obs;
  return o === '1' || o === 'true' || o === 'yes';
});

const chromaKeyUi = ref(false);
const soundDiceEnabled = ref(true);
const rollAnimationMs = ref(110);
const soundTickMs = ref(70);
const endTiltXDeg = ref(0);
const endTiltYDeg = ref(0);
const dieScale = ref(1);
const fontSizePx = ref(32);
const pipSizePx = ref(16);
const fontPreset = ref<(typeof FONT_PRESETS)[number]['id']>('system');
const editorTab = ref<'base' | 'style' | 'colors' | 'share'>('base');

function relativeLuminance(hex: string): number {
  const h = hex.replace('#', '');
  if (h.length !== 6) return 0;
  const r = Number.parseInt(h.slice(0, 2), 16) / 255;
  const g = Number.parseInt(h.slice(2, 4), 16) / 255;
  const b = Number.parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const diceCount = ref(2);
const sides = ref(6);
const colorMode = ref<'theme' | 'fantasy' | 'single' | 'custom'>('theme');
const themePresetIndex = ref(0);
const fantasyIndex = ref(0);
const singleFace = ref('#1e88e5');
const singleMark = ref('#ffffff');
const globalDisplay = ref<'number' | 'eyes'>('eyes');

type CustomDie = { face: string; mark: string; display: 'number' | 'eyes' };

function defaultCustomDie(): CustomDie {
  return {
    face: '#3498db',
    mark: '#ffffff',
    display: 'number',
  };
}

const customDice = ref<CustomDie[]>([defaultCustomDie(), defaultCustomDie()]);

const eyesAllowed = computed(() => sides.value >= 2 && sides.value <= 6);
const diceStageRef = ref<HTMLElement | null>(null);
const diceStageWidth = ref(640);
let resizeObs: ResizeObserver | null = null;

/** Cointoss-artige Stage: #1C1E1E bzw. Chroma-Grün */
const diceStageOuterStyle = computed(() => {
  const bg = chromaKeyUi.value ? '#00FF00' : '#1C1E1E';
  return { backgroundColor: bg };
});

const grid3dColumnsStyle = computed(() => {
  const cols = Math.min(5, Math.max(1, diceCount.value));
  return { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };
});

const cubeSizePx = computed(() => {
  const cols = Math.min(5, Math.max(1, diceCount.value));
  const w = Math.max(220, diceStageWidth.value - 88);
  const gap = 28;
  const inner = w - gap * (cols - 1);
  const per = inner / cols;
  return Math.max(52, Math.min(140, Math.floor(per * 0.74 * dieScale.value)));
});

const selectedFontFamily = computed(
  () => FONT_PRESETS.find((font) => font.id === fontPreset.value)?.family ?? FONT_PRESETS[0].family
);

const usesNumbers = computed(() => {
  if (colorMode.value === 'custom') {
    return customDice.value.some((die) => die.display === 'number');
  }
  return globalDisplay.value === 'number';
});

const usesEyes = computed(() => {
  if (!eyesAllowed.value) return false;
  if (colorMode.value === 'custom') {
    return customDice.value.some((die) => die.display === 'eyes');
  }
  return globalDisplay.value === 'eyes';
});

const rollSpeedLabel = computed(() => {
  if (rollAnimationMs.value <= 90) return 'Schnell';
  if (rollAnimationMs.value >= 320) return 'Sehr langsam';
  if (rollAnimationMs.value >= 180) return 'Langsam';
  return 'Mittel';
});

const rollAnimationUi = computed({
  get: () => 100 - Math.round(((rollAnimationMs.value - 70) / (420 - 70)) * 100),
  set: (ui: number) => {
    const clampedUi = Math.max(0, Math.min(100, Number(ui) || 0));
    const actual = 420 - ((420 - 70) * clampedUi) / 100;
    rollAnimationMs.value = clampRollAnimationMs(actual);
  },
});

const soundSpeedLabel = computed(() => {
  if (soundTickMs.value <= 65) return 'Schnell';
  if (soundTickMs.value >= 120) return 'Langsam';
  return 'Mittel';
});

const soundTickUi = computed({
  get: () => 100 - Math.round(((soundTickMs.value - 55) / (150 - 55)) * 100),
  set: (ui: number) => {
    const clampedUi = Math.max(0, Math.min(100, Number(ui) || 0));
    const actual = 150 - ((150 - 55) * clampedUi) / 100;
    soundTickMs.value = clampSoundTickMs(actual);
  },
});

const dieScaleUi = computed({
  get: () => Math.round(((dieScale.value - 0.75) / (1.2 - 0.75)) * 100),
  set: (ui: number) => {
    const clampedUi = Math.max(0, Math.min(100, Number(ui) || 0));
    dieScale.value = clampUnitScale(0.75 + ((1.2 - 0.75) * clampedUi) / 100);
  },
});

const fontSizeUi = computed({
  get: () => Math.round(((fontSizePx.value - 20) / (140 - 20)) * 100),
  set: (ui: number) => {
    const clampedUi = Math.max(0, Math.min(100, Number(ui) || 0));
    fontSizePx.value = clampFontSizePx(20 + ((140 - 20) * clampedUi) / 100);
  },
});

const pipSizeUi = computed({
  get: () => Math.round(((pipSizePx.value - 8) / (72 - 8)) * 100),
  set: (ui: number) => {
    const clampedUi = Math.max(0, Math.min(100, Number(ui) || 0));
    pipSizePx.value = clampPipSizePx(8 + ((72 - 8) * clampedUi) / 100);
  },
});

const dieScaleLabel = computed(() => `${Math.round(dieScale.value * 100)}%`);
const fontSizeLabel = computed(() => `${fontSizePx.value}px`);
const pipSizeLabel = computed(() => `${pipSizePx.value}px`);

const endTiltXUi = computed({
  get: () => 50 - Math.round((endTiltXDeg.value / 45) * 50),
  set: (ui: number) => {
    const clampedUi = Math.max(0, Math.min(100, Number(ui) || 0));
    endTiltXDeg.value = clampEndTiltDeg(((50 - clampedUi) / 50) * 45);
  },
});

const endTiltYUi = computed({
  get: () => 50 + Math.round((endTiltYDeg.value / 45) * 50),
  set: (ui: number) => {
    const clampedUi = Math.max(0, Math.min(100, Number(ui) || 0));
    endTiltYDeg.value = clampEndTiltDeg(((clampedUi - 50) / 50) * 45);
  },
});

const colorTabActive = ref<'presets' | 'custom'>('presets');
const colorPresetCategory = ref<ColorPresetCategory>('bunt');
let syncingColorTab = false;

function themeId(groupIndex: number, schemeIndex: number): string {
  return `t-${themePresetGlobalIndex(groupIndex, schemeIndex)}`;
}

const selectedSchemeId = computed(() => {
  if (colorMode.value === 'fantasy') return `f-${fantasyIndex.value}`;
  if (colorMode.value === 'theme') return `t-${themePresetIndex.value}`;
  return '';
});

const themeCategoryToTitle: Record<Exclude<ColorPresetCategory, 'single' | 'fantasy'>, string> = {
  bunt: 'Bunt',
  pastell: 'Pastell',
  zweifarbig: 'Zweifarbig',
  dark: 'Dark',
};

function themeCategoryFromGroupTitle(title: string): Exclude<ColorPresetCategory, 'single' | 'fantasy'> {
  const normalized = title.trim().toLowerCase();
  if (normalized === 'pastell') return 'pastell';
  if (normalized === 'zweifarbig') return 'zweifarbig';
  if (normalized === 'dark') return 'dark';
  return 'bunt';
}

const activeThemeGroupIndex = computed(() => {
  const wantedTitle = themeCategoryToTitle[colorPresetCategory.value as Exclude<ColorPresetCategory, 'single' | 'fantasy'>];
  if (!wantedTitle) return null;
  return colorSchemeGroups.findIndex((group) => group.title === wantedTitle);
});

const activeThemeGroup = computed(() => {
  const idx = activeThemeGroupIndex.value;
  return idx === null || idx < 0 ? null : colorSchemeGroups[idx] ?? null;
});

function pickThemeAt(groupIndex: number, schemeIndex: number) {
  themePresetIndex.value = themePresetGlobalIndex(groupIndex, schemeIndex);
  colorMode.value = 'theme';
  colorPresetCategory.value = themeCategoryFromGroupTitle(colorSchemeGroups[groupIndex]?.title ?? 'Bunt');
  colorTabActive.value = 'presets';
}

function pickFantasyAt(pi: number) {
  fantasyIndex.value = pi;
  colorMode.value = 'fantasy';
  colorPresetCategory.value = 'fantasy';
  colorTabActive.value = 'presets';
}

function selectColorPresetCategory(category: ColorPresetCategory) {
  colorPresetCategory.value = category;
  colorTabActive.value = 'presets';
  if (category === 'single') {
    colorMode.value = 'single';
    return;
  }
  if (category === 'fantasy') {
    colorMode.value = 'fantasy';
    return;
  }
  const groupIndex = colorSchemeGroups.findIndex((group) => group.title === themeCategoryToTitle[category]);
  if (groupIndex >= 0) {
    colorMode.value = 'theme';
    const schemeCount = colorSchemeGroups[groupIndex]?.schemes.length ?? 0;
    const currentThemeLocalIndex = themePresetIndex.value - themePresetGlobalIndex(groupIndex, 0);
    if (currentThemeLocalIndex < 0 || currentThemeLocalIndex >= schemeCount) {
      themePresetIndex.value = themePresetGlobalIndex(groupIndex, 0);
    }
  }
}

function syncTabFromColorMode() {
  if (syncingColorTab) return;
  syncingColorTab = true;
  try {
    if (colorMode.value === 'custom') {
      colorTabActive.value = 'custom';
      return;
    }
    colorTabActive.value = 'presets';
    if (colorMode.value === 'single') {
      colorPresetCategory.value = 'single';
      return;
    }
    if (colorMode.value === 'fantasy') {
      colorPresetCategory.value = 'fantasy';
      return;
    }
    let remaining = themePresetIndex.value;
    let matchedTitle = 'Bunt';
    for (const group of colorSchemeGroups) {
      if (remaining < group.schemes.length) {
        matchedTitle = group.title;
        break;
      }
      remaining -= group.schemes.length;
    }
    colorPresetCategory.value = themeCategoryFromGroupTitle(matchedTitle);
  } finally {
    syncingColorTab = false;
  }
}

watch(colorMode, syncTabFromColorMode, { immediate: true });

watch(colorTabActive, (t) => {
  if (syncingColorTab) return;
  if (t === 'custom') {
    if (colorMode.value !== 'custom') colorMode.value = 'custom';
    syncCustomDiceLength();
    return;
  }
  selectColorPresetCategory(colorPresetCategory.value);
});

/** Volldokument-Grün nur in OBS; normale Ansicht bleibt dunkel, Chroma nur auf der Würfel-Stage */
useHead(() => ({
  htmlAttrs: {
    class: obsMode.value && chromaKeyUi.value ? 'chroma-key-active' : undefined,
  },
}));

const results = ref<number[]>([1, 1]);
const shuffleDisplay = ref<number[]>([1, 1]);
const isRolling = ref(false);
let shuffleIntervalId = 0;
let audioCtx: AudioContext | null = null;
let audioResumeBump: (() => void) | null = null;

function getAudioContext(): AudioContext | null {
  if (import.meta.server) return null;
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  return audioCtx;
}

function playDiceTick(soundSpeedMs = 70) {
  if (!soundDiceEnabled.value || import.meta.server) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  const clamped = clampSoundTickMs(soundSpeedMs);
  const tNorm = (clamped - 55) / (150 - 55);
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  const startFreq = 560 - tNorm * 180 + Math.random() * 70;
  const endFreq = 210 - tNorm * 35;
  const attack = 0.002 + tNorm * 0.0015;
  const sustain = 0.038 + tNorm * 0.028;
  const peakGain = 0.105 + tNorm * 0.02;
  osc.frequency.setValueAtTime(startFreq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(90, endFreq), t + sustain * 0.82);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peakGain, t + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + sustain);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + sustain + 0.008);
}

const shareOpen = ref(false);
const shareIncludeObs = ref(false);
const shareIncludeChroma = ref(false);
const shareIncludeAutoroll = ref(false);
const shareCopied = ref(false);
let shareCopyResetId = 0;

function clampDiceCount(n: number): number {
  return Math.max(1, Math.min(10, Math.floor(n)));
}

function clampSides(n: number): number {
  return Math.max(2, Math.min(20, Math.floor(n)));
}

function clampRollAnimationMs(n: number): number {
  return Math.max(70, Math.min(420, Math.round(n / 5) * 5));
}

function clampSoundTickMs(n: number): number {
  return Math.max(55, Math.min(150, Math.round(n / 5) * 5));
}

function clampEndTiltDeg(n: number): number {
  return Math.max(-45, Math.min(45, Math.round(n / 5) * 5));
}

function clampUnitScale(n: number): number {
  return Math.round(Math.max(0.75, Math.min(1.3, n)) * 100) / 100;
}

function clampFontSizePx(n: number): number {
  return Math.max(20, Math.min(140, Math.round(n)));
}

function clampPipSizePx(n: number): number {
  return Math.max(8, Math.min(72, Math.round(n)));
}

function legacySoundTickMsFromAnimation(animationMs: number): number {
  const tNorm = (clampRollAnimationMs(animationMs) - 70) / (420 - 70);
  return clampSoundTickMs(55 + tNorm * 45);
}

function currentRollTickMs(): number {
  return clampSoundTickMs(soundTickMs.value);
}

const posePreviewRef = ref<HTMLElement | null>(null);
const poseDragActive = ref(false);
const poseDragStart = ref<{ x: number; y: number; tiltX: number; tiltY: number } | null>(null);

const posePreviewValue = computed(() => {
  if (displayForDie(0) === 'eyes') return 5;
  return Math.max(1, Math.min(99, sides.value));
});
const posePreviewSettledFace = computed(() => 2);
const posePreviewFaceColor = computed(() => faceColorAt(0));
const posePreviewMarkColor = computed(() => markColorAt(0));
const posePreviewUseEyes = computed(() => displayForDie(0) === 'eyes');

function resetEndPose() {
  endTiltXDeg.value = 0;
  endTiltYDeg.value = 0;
}

function startPoseDrag(e: PointerEvent) {
  const el = posePreviewRef.value;
  if (!el) return;
  poseDragActive.value = true;
  poseDragStart.value = {
    x: e.clientX,
    y: e.clientY,
    tiltX: endTiltXDeg.value,
    tiltY: endTiltYDeg.value,
  };
  el.setPointerCapture?.(e.pointerId);
}

function updatePoseDrag(e: PointerEvent) {
  if (!poseDragActive.value || !poseDragStart.value) return;
  const dx = e.clientX - poseDragStart.value.x;
  const dy = e.clientY - poseDragStart.value.y;
  endTiltYDeg.value = clampEndTiltDeg(poseDragStart.value.tiltY + dx * 0.35);
  endTiltXDeg.value = clampEndTiltDeg(poseDragStart.value.tiltX - dy * 0.35);
}

function endPoseDrag(e?: PointerEvent) {
  if (e && posePreviewRef.value?.hasPointerCapture?.(e.pointerId)) {
    posePreviewRef.value.releasePointerCapture(e.pointerId);
  }
  poseDragActive.value = false;
  poseDragStart.value = null;
}

function randomRoll(): number {
  return Math.floor(Math.random() * sides.value) + 1;
}

function syncResultsLength() {
  const n = diceCount.value;
  while (results.value.length < n) {
    results.value.push(randomRoll());
  }
  if (results.value.length > n) {
    results.value = results.value.slice(0, n);
  }
  while (shuffleDisplay.value.length < n) {
    shuffleDisplay.value.push(randomRoll());
  }
  if (shuffleDisplay.value.length > n) {
    shuffleDisplay.value = shuffleDisplay.value.slice(0, n);
  }
}

function syncCustomDiceLength() {
  const n = diceCount.value;
  while (customDice.value.length < n) {
    customDice.value.push(defaultCustomDie());
  }
  if (customDice.value.length > n) {
    customDice.value = customDice.value.slice(0, n);
  }
}

watch(diceCount, (c) => {
  diceCount.value = clampDiceCount(Number(c) || 1);
  syncResultsLength();
  syncCustomDiceLength();
});

watch(sides, (s) => {
  sides.value = clampSides(Number(s) || 6);
  for (let i = 0; i < results.value.length; i++) {
    if (results.value[i] > sides.value) {
      results.value[i] = sides.value;
    }
  }
  for (let i = 0; i < shuffleDisplay.value.length; i++) {
    if (shuffleDisplay.value[i] > sides.value) {
      shuffleDisplay.value[i] = sides.value;
    }
  }
  if (!eyesAllowed.value) {
    globalDisplay.value = 'number';
    customDice.value.forEach((d) => {
      d.display = 'number';
    });
  }
});

watch(rollAnimationMs, (ms) => {
  rollAnimationMs.value = clampRollAnimationMs(Number(ms) || 110);
});

watch(soundTickMs, (ms) => {
  soundTickMs.value = clampSoundTickMs(Number(ms) || 70);
});

watch(endTiltXDeg, (deg) => {
  endTiltXDeg.value = clampEndTiltDeg(Number(deg) || 0);
});

watch(endTiltYDeg, (deg) => {
  endTiltYDeg.value = clampEndTiltDeg(Number(deg) || 0);
});

watch(dieScale, (v) => {
  dieScale.value = clampUnitScale(Number(v) || 1);
});

watch(fontSizePx, (v) => {
  fontSizePx.value = clampFontSizePx(Number(v) || 32);
});

watch(pipSizePx, (v) => {
  pipSizePx.value = clampPipSizePx(Number(v) || 16);
});

watch(
  colorMode,
  (m) => {
    if (m === 'custom') {
      syncCustomDiceLength();
    }
  },
  { flush: 'post' }
);

function faceColorAt(i: number): string {
  if (colorMode.value === 'custom') {
    return customDice.value[i]?.face ?? '#3498db';
  }
  if (colorMode.value === 'single') {
    return singleFace.value;
  }
  if (colorMode.value === 'fantasy') {
    const p = fantasyPalettes[fantasyIndex.value] ?? fantasyPalettes[0];
    return p.colors[i % p.colors.length];
  }
  const pal = allThemeColors[themePresetIndex.value] ?? allThemeColors[0];
  return pal[i % pal.length];
}

function markColorAt(i: number): string {
  if (colorMode.value === 'custom') {
    return customDice.value[i]?.mark ?? '#ffffff';
  }
  if (colorMode.value === 'single') {
    return singleMark.value;
  }
  if (colorMode.value === 'fantasy') {
    return fantasyPalettes[fantasyIndex.value]?.mark ?? '#ffffff';
  }
  const face = faceColorAt(i);
  return relativeLuminance(face) > 0.55 ? '#1c1e1e' : '#ffffff';
}

function displayForDie(i: number): 'number' | 'eyes' {
  if (!eyesAllowed.value) return 'number';
  if (colorMode.value === 'custom') {
    return customDice.value[i]?.display === 'eyes' ? 'eyes' : 'number';
  }
  return globalDisplay.value;
}

function resultToCubeFace(value: number): number {
  return ((Math.max(1, Math.floor(value)) - 1) % 6) + 1;
}

function settledFaceForDie(i: number): number {
  return resultToCubeFace(results.value[i] ?? 1);
}

const ROLL_MS = 1100;
function roll() {
  if (isRolling.value) return;
  void getAudioContext()?.resume();
  isRolling.value = true;
  syncResultsLength();
  shuffleDisplay.value = results.value.map(() => randomRoll());
  playDiceTick(soundTickMs.value);

  if (shuffleIntervalId) clearInterval(shuffleIntervalId);
  const tickMs = currentRollTickMs();
  shuffleIntervalId = window.setInterval(() => {
    playDiceTick(soundTickMs.value);
  }, tickMs);

  window.setTimeout(() => {
    if (shuffleIntervalId) {
      clearInterval(shuffleIntervalId);
      shuffleIntervalId = 0;
    }
    results.value = results.value.map(() => randomRoll());
    shuffleDisplay.value = [...results.value];
    isRolling.value = false;
  }, ROLL_MS);
}

function buildToolQuery(): Record<string, string> {
  const q: Record<string, string> = {};

  if (diceCount.value !== 2) q.n = String(diceCount.value);
  if (sides.value !== 6) q.s = String(sides.value);
  if (colorMode.value !== 'theme') q.cm = colorMode.value;

  if (colorMode.value === 'theme' && themePresetIndex.value !== 0) {
    q.p = String(themePresetIndex.value);
  }
  if (colorMode.value === 'fantasy' && fantasyIndex.value !== 0) {
    q.fp = String(fantasyIndex.value);
  }
  if (colorMode.value === 'single') {
    q.fc = singleFace.value.replace('#', '');
    q.mc = singleMark.value.replace('#', '');
  }
  if (colorMode.value === 'custom') {
    q.cd = encodeURIComponent(JSON.stringify(customDice.value));
  }

  if (eyesAllowed.value && colorMode.value !== 'custom' && globalDisplay.value === 'eyes') {
    q.disp = 'e';
  }

  q.chroma = chromaKeyUi.value ? '1' : '0';
  q.d3 = '1';
  if (rollAnimationMs.value !== 110) q.d3spd = String(rollAnimationMs.value);
  if (endTiltXDeg.value !== 0) q.d3tx = String(endTiltXDeg.value);
  if (endTiltYDeg.value !== 0) q.d3ty = String(endTiltYDeg.value);
  if (dieScale.value !== 1) q.ds = String(Math.round(dieScale.value * 100));
  if (fontSizePx.value !== 32) q.fpx = String(fontSizePx.value);
  if (pipSizePx.value !== 16) q.ppx = String(pipSizePx.value);
  if (fontPreset.value !== 'system') q.font = fontPreset.value;
  if (soundTickMs.value !== 70) q.sndspd = String(soundTickMs.value);
  if (!soundDiceEnabled.value) q.snd = '0';

  return q;
}

function mergeQueryWithRoute(tool: Record<string, string>) {
  const cur = route.query as Record<string, string | string[]>;
  const out: Record<string, string> = {};
  const passthrough = ['obs', 'autostart', 'autoroll'];
  for (const k of passthrough) {
    const v = cur[k];
    if (typeof v === 'string' && v.length) out[k] = v;
  }
  for (const [k, v] of Object.entries(tool)) {
    out[k] = v;
  }
  return out;
}

let urlPushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleUrlSync() {
  if (import.meta.server) return;
  if (urlPushTimer) clearTimeout(urlPushTimer);
  urlPushTimer = setTimeout(() => {
    urlPushTimer = null;
    const tool = buildToolQuery();
    const next = mergeQueryWithRoute(tool);
    const a = new URLSearchParams(next).toString();
    const b = new URLSearchParams(route.query as Record<string, string>).toString();
    if (a !== b) {
      void router.replace({ query: next });
    }
  }, 280);
}

watch(
  [
    diceCount,
    sides,
    colorMode,
    themePresetIndex,
    fantasyIndex,
    singleFace,
    singleMark,
    globalDisplay,
    customDice,
    chromaKeyUi,
    rollAnimationMs,
    endTiltXDeg,
    endTiltYDeg,
    dieScale,
    fontSizePx,
    pipSizePx,
    fontPreset,
    soundTickMs,
    soundDiceEnabled,
  ],
  () => {
    scheduleUrlSync();
  },
  { deep: true }
);

function applyQueryFromRoute() {
  const q = route.query;

  const n = Number(q.n ?? q.dice);
  if (!Number.isNaN(n)) diceCount.value = clampDiceCount(n);

  const s = Number(q.s ?? q.sides);
  if (!Number.isNaN(s)) sides.value = clampSides(s);

  const cm = q.cm;
  if (cm === 'theme' || cm === 'fantasy' || cm === 'single' || cm === 'custom') {
    colorMode.value = cm;
  }

  const p = Number(q.p ?? q.preset);
  if (!Number.isNaN(p) && p >= 0 && p < allThemeColors.length) {
    themePresetIndex.value = Math.floor(p);
  }

  const fp = Number(q.fp);
  if (!Number.isNaN(fp) && fp >= 0 && fp < fantasyPalettes.length) {
    fantasyIndex.value = Math.floor(fp);
  }

  const fc = q.fc;
  if (typeof fc === 'string' && /^[0-9a-fA-F]{6}$/.test(fc)) {
    singleFace.value = `#${fc}`;
  }
  const mc = q.mc;
  if (typeof mc === 'string' && /^[0-9a-fA-F]{6}$/.test(mc)) {
    singleMark.value = `#${mc}`;
  }

  const cd = q.cd;
  if (colorMode.value === 'custom' && typeof cd === 'string' && cd.length > 0) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cd)) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) {
        customDice.value = parsed.map((item: unknown) => {
          const o = item as Record<string, unknown>;
          const face = typeof o.face === 'string' ? o.face : '#3498db';
          const mark = typeof o.mark === 'string' ? o.mark : '#ffffff';
          const display = o.display === 'eyes' ? 'eyes' : 'number';
          return { face, mark, display };
        });
      }
    } catch {
      /* ignore */
    }
  }

  const disp = q.disp;
  if (colorMode.value !== 'custom') {
    if (disp === 'e') globalDisplay.value = 'eyes';
    else if (disp === 'n' || disp === 'num') globalDisplay.value = 'number';
  }

  const chroma = q.chroma;
  if (chroma === '1' || chroma === 'true' || chroma === 'yes') {
    chromaKeyUi.value = true;
  } else {
    chromaKeyUi.value = false;
  }

  const d3spd = Number(q.d3spd ?? q.dice3dSpeed);
  if (!Number.isNaN(d3spd)) {
    rollAnimationMs.value = clampRollAnimationMs(d3spd);
  }

  const d3tx = Number(q.d3tx ?? q.dice3dTiltX);
  if (!Number.isNaN(d3tx)) {
    endTiltXDeg.value = clampEndTiltDeg(d3tx);
  }

  const d3ty = Number(q.d3ty ?? q.dice3dTiltY);
  if (!Number.isNaN(d3ty)) {
    endTiltYDeg.value = clampEndTiltDeg(d3ty);
  }

  const ds = Number(q.ds ?? q.dieSize);
  if (!Number.isNaN(ds)) {
    dieScale.value = clampUnitScale(ds / 100);
  }

  const fpx = Number(q.fpx ?? q.fontPx);
  if (!Number.isNaN(fpx)) {
    fontSizePx.value = clampFontSizePx(fpx);
  } else {
    const fs = Number(q.fs ?? q.fontSize);
    if (!Number.isNaN(fs)) {
      fontSizePx.value = clampFontSizePx((fs / 100) * 32);
    }
  }

  const ppx = Number(q.ppx ?? q.pipPx);
  if (!Number.isNaN(ppx)) {
    pipSizePx.value = clampPipSizePx(ppx);
  } else {
    const ps = Number(q.ps ?? q.pipSize);
    if (!Number.isNaN(ps)) {
      pipSizePx.value = clampPipSizePx((ps / 100) * 16);
    }
  }

  const font = q.font;
  if (typeof font === 'string' && FONT_PRESETS.some((preset) => preset.id === font)) {
    fontPreset.value = font as (typeof FONT_PRESETS)[number]['id'];
  }

  const sndspd = Number(q.sndspd ?? q.soundSpeed);
  if (!Number.isNaN(sndspd)) {
    soundTickMs.value = clampSoundTickMs(sndspd);
  } else if (!Number.isNaN(d3spd)) {
    soundTickMs.value = legacySoundTickMsFromAnimation(d3spd);
  }

  const snd = q.snd;
  soundDiceEnabled.value = !(
    snd === '0' ||
    snd === 'false' ||
    snd === 'off' ||
    snd === 'no'
  );

  syncResultsLength();
  syncCustomDiceLength();

  if (!eyesAllowed.value) {
    globalDisplay.value = 'number';
    customDice.value.forEach((d) => {
      d.display = 'number';
    });
  }
}

function buildShareUrl(includeObs: boolean, includeChroma: boolean, includeAutoroll: boolean): string {
  if (import.meta.server) return '';
  const tool = buildToolQuery();
  if (includeObs) tool.obs = '1';
  if (includeChroma) tool.chroma = '1';
  if (includeAutoroll) tool.autoroll = '1';
  const qs = new URLSearchParams(tool).toString();
  const path = route.path || '/';
  return `${window.location.origin}${path}${qs ? `?${qs}` : ''}`;
}

const shareUrlDisplay = computed(() =>
  buildShareUrl(shareIncludeObs.value, shareIncludeChroma.value, shareIncludeAutoroll.value)
);

function onShareInputFocus(e: Event) {
  const t = e.target as HTMLInputElement | null;
  t?.select();
}

async function copyShareLink() {
  const url = buildShareUrl(shareIncludeObs.value, shareIncludeChroma.value, shareIncludeAutoroll.value);
  try {
    await navigator.clipboard?.writeText(url);
    shareCopied.value = true;
    clearTimeout(shareCopyResetId);
    shareCopyResetId = window.setTimeout(() => {
      shareCopied.value = false;
    }, 2000);
  } catch {
    shareCopied.value = false;
  }
}

applyQueryFromRoute();

let autorollTimeoutId = 0;

function wantsAutorollFromQuery() {
  const a = route.query.autoroll ?? route.query.autostart;
  return a === '1' || a === 'true' || a === 'yes';
}

function scheduleAutoroll() {
  if (import.meta.server) return;
  clearTimeout(autorollTimeoutId);
  if (!wantsAutorollFromQuery()) return;
  autorollTimeoutId = window.setTimeout(() => {
    autorollTimeoutId = 0;
    roll();
  }, 1000);
}

onMounted(() => {
  audioResumeBump = () => {
    void getAudioContext()?.resume();
  };
  window.addEventListener('pointerdown', audioResumeBump, { capture: true, passive: true });
  window.addEventListener('touchstart', audioResumeBump, { capture: true, passive: true });
  scheduleAutoroll();
  nextTick(() => {
    const el = diceStageRef.value;
    if (el) {
      diceStageWidth.value = Math.max(200, Math.floor(el.getBoundingClientRect().width));
      resizeObs = new ResizeObserver((entries) => {
        const cr = entries[0]?.contentRect;
        if (cr) {
          diceStageWidth.value = Math.max(200, Math.floor(cr.width));
        }
      });
      resizeObs.observe(el);
    }
  });
});

watch(
  () => route.query,
  () => {
    applyQueryFromRoute();
    scheduleAutoroll();
  },
  { deep: true }
);

onUnmounted(() => {
  if (shuffleIntervalId) clearInterval(shuffleIntervalId);
  if (urlPushTimer) clearTimeout(urlPushTimer);
  clearTimeout(autorollTimeoutId);
  clearTimeout(shareCopyResetId);
  if (resizeObs) {
    resizeObs.disconnect();
    resizeObs = null;
  }
  if (audioResumeBump) {
    window.removeEventListener('pointerdown', audioResumeBump, true);
    window.removeEventListener('touchstart', audioResumeBump, true);
    audioResumeBump = null;
  }
  if (audioCtx) {
    void audioCtx.close();
    audioCtx = null;
  }
});
</script>
