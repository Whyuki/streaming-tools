<template>
  <div class="grid grid-cols-2 gap-2 mb-4">
    <UPopover
      :content="{
        align: 'end',
        side: 'bottom',
      }"
    >
      <UButton block>Nouveau programme</UButton>
      <template #content="{ close }">
        <div class="flex flex-col p-4 bg-slate-950 w-80">
          <p>Êtes-vous sûr de vouloir créer un nouveau programme ?</p>
          <p class="mb-4">
            Cela réinitialisera le stream en cours et supprimera tous les
            sujets.
          </p>
          <div class="flex justify-end">
            <UButton
              class="bg-red-800 hover:bg-red-700"
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
        <div class="flex flex-col p-4 bg-slate-950 w-80">
          <p>Êtes-vous sûr de vouloir redémarrer le stream ?</p>
          <p class="mb-4">
            Cela réinitialisera l'heure de début du stream ainsi que l'état
            d'avancement des sujets.
          </p>
          <div class="flex justify-end">
            <UButton
              class="bg-red-800 hover:bg-red-700"
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
  <div v-if="subjectsStore.startTime" class="flex gap-2 items-center mb-4">
    <UForm
      :state
      @submit="
        (e) => {
          if (!editingTimeElapsed) {
            editingTimeElapsed = true;
            return;
          }
          const timerInput = parseTimerInput(e.data.streamTimeElapsed);
          if (subjectsStore.startTime && timerInput !== null) {
            const newDate = new Date(Date.now() - timerInput);
            newDate.setSeconds(0);
            if (!isNaN(newDate.getTime())) {
              subjectsStore.startTime = newDate;
              editingTimeElapsed = false;
              state.streamTimeElapsed = undefined;
            }
          }
        }
      "
    >
      <p>Stream depuis</p>
      <span
        v-if="!editingTimeElapsed"
        type="text"
        icon="ic:sharp-timer"
        name="streamTimeElapsed"
        :class="elapsedTime.includes('h') ? 'w-22' : 'w-31'"
        :ui="{ base: elapsedTime.includes('h') ? ['pe-3'] : [] }"
      >
        {{ elapsedTime }}
        <span v-show="!elapsedTime.includes('h')" class="text-zinc-400"
          >minutes</span
        >
      </span>
      <UInput
        v-else
        v-model="state.streamTimeElapsed"
        type="text"
        icon="ic:sharp-timer"
        name="streamTimeElapsed"
        placeholder="durée"
        autofocus
        :class="elapsedTime.includes('h') ? 'w-22' : 'w-31'"
        :ui="{ base: elapsedTime.includes('h') ? ['pe-3'] : [] }"
        @vue:before-mount="
          () => {
            state.streamTimeElapsed = elapsedTime;
          }
        "
      >
        <template v-if="elapsedTime && !elapsedTime.includes('h')" #trailing>
          <span class="text-zinc-400">minutes</span>
        </template>
      </UInput>
      <UButton
        type="submit"
        :icon="editingTimeElapsed ? 'ic:sharp-check' : 'ic:sharp-edit'"
        size="md"
        :variant="editingTimeElapsed ? 'solid' : 'ghost'"
        :class="{
          ' bg-green-700 text-slate-100 hover:bg-green-600 hover:text-white':
            editingTimeElapsed,
          'text-slate-100 hover:text-white': !editingTimeElapsed,
        }"
      />
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { useSubjectsStore } from "~/stores/subjects";

const subjectsStore = useSubjectsStore();

const editingTimeElapsed = ref(false);

const state = reactive({
  streamTimeElapsed: undefined as string | undefined,
});

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

onMounted(() => {
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
