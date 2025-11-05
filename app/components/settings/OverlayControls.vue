<template>
  <div class="grid grid-cols-2 gap-2 p-2">
    <UPopover
      :content="{
        align: 'end',
        side: 'bottom',
      }"
    >
      <UButton block>Nouveau programme</UButton>
      <template #content="{ close }">
        <div class="flex flex-col p-4 bg-slate-700 w-80">
          <p>Êtes-vous sûr de vouloir créer un nouveau programme ?</p>
          <p class="mb-4">
            Cela réinitialisera le stream en cours et supprimera tous les
            sujets.
          </p>
          <div class="flex justify-end">
            <UButton
              color="error"
              variant="solid"
              @click="
                () => {
                  subjectsStore.reset();
                  close();
                }
              "
            >
              Confirmer
            </UButton>
          </div>
        </div>
      </template>
    </UPopover>

    <UButton
      v-if="!subjectsStore.startTime"
      block
      @click.prevent="subjectsStore.startStream"
    >
      Démarrer le stream
    </UButton>
    <UPopover
      v-else
      :content="{
        align: 'end',
        side: 'bottom',
      }"
    >
      <UButton block> Redémarrer le stream </UButton>
      <template v-if="subjectsStore.startTime" #content="{ close }">
        <div class="flex flex-col p-4 bg-slate-700 w-80">
          <p>Êtes-vous sûr de vouloir redémarrer le stream ?</p>
          <p class="mb-4">
            Cela réinitialisera l'heure de début du stream ainsi que l'état
            d'avancement des sujets.
          </p>
          <div class="flex justify-end">
            <UButton
              color="error"
              variant="solid"
              @click="
                () => {
                  subjectsStore.startStream();
                  close();
                }
              "
            >
              Confirmer
            </UButton>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
  <div v-if="subjectsStore.startTime" class="flex gap-2 items-center">
    <p>Heure de début du stream</p>

    <UInput
      type="time"
      name="streamStartTime"
      placeholder="HH:MM"
      _class="w-24"
      :model-value="
        String(subjectsStore.startTime.getHours()).padStart(2, '0') +
        ':' +
        String(subjectsStore.startTime.getMinutes()).padStart(2, '0')
      "
      @update:model-value="
        (e) => {
          console.log([e, subjectsStore.startTime]);
          if (subjectsStore.startTime && typeof e === 'string') {
            const [hours, minutes] = e.split(':');
            const newDate = new Date(subjectsStore.startTime);
            newDate.setHours(Number(hours));
            newDate.setMinutes(Number(minutes));
            newDate.setSeconds(0);

            if (!isNaN(newDate.getTime())) {
              subjectsStore.startTime = newDate;
            }
          }
        }
      "
    />
  </div>
  <div v-if="subjectsStore.startTime" class="flex gap-2 items-center">
    <p>Stream depuis</p>
    <UInput
      type="text"
      icon="ic:sharp-timer"
      name="streamTimeElapsed"
      placeholder="durée"
      :class="elapsedTime.includes('h') ? 'w-22' : 'w-31'"
      :ui="{ base: elapsedTime.includes('h') ? ['pe-3'] : [] }"
      :model-value="elapsedTime"
      @update:model-value="
        (e) => {
          const timerInput = parseTimerInput(e);
          if (subjectsStore.startTime && timerInput) {
            const newDate = new Date(Date.now() - timerInput);
            newDate.setSeconds(0);

            if (!isNaN(newDate.getTime())) {
              subjectsStore.startTime = newDate;
            }
          }
        }
      "
    >
      <template v-if="elapsedTime && !elapsedTime.includes('h')" #trailing>
        <span class="text-zinc-400">minutes</span>
      </template>
    </UInput>
  </div>
</template>

<script setup lang="ts">
import { useSubjectsStore } from "~/stores/subjects";

const subjectsStore = useSubjectsStore();

const elapsedTime = ref(
  computeElapsedTime(
    subjectsStore.startTime?.getTime() ?? Date.now(),
    Date.now()
  )
);

watch(
  () => subjectsStore.startTime,
  () => {
    elapsedTime.value = computeElapsedTime(
      subjectsStore.startTime?.getTime() ?? Date.now(),
      Date.now()
    );
  }
);

effect(() => {
  const interval = setInterval(() => {
    const newElapsedTime = computeElapsedTime(
      subjectsStore.startTime?.getTime() ?? Date.now(),
      Date.now()
    );
    if (newElapsedTime !== elapsedTime.value) {
      elapsedTime.value = newElapsedTime;
    }
  }, 1000);

  return () => clearInterval(interval);
});
</script>
