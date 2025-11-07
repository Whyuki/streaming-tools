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
  <div class="flex items-center justify-between">
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

    <p class="flex items-center">
      Stream depuis

      {{ elapsedTime }}

      {{
        (!elapsedTime.includes("h") ? "minute" : "") +
        (["0", "1"].some((value) => value === elapsedTime) ? "" : "s")
      }}

      <UPopover
        :content="{
          align: 'end',
          side: 'bottom',
        }"
      >
        <UButton
          icon="ic:sharp-edit"
          size="md"
          variant="ghost"
          class="text-slate-100 hover:text-white ms-4"
        />

        <template #content="{ close }">
          <div class="p-4 w-100 bg-stone-800">
            <p class="text-sm">
              Entrer le temps écoulé depuis le début du stream en minute (ex:
              15) ou en heure (ex: 1h30):
            </p>

            <UForm
              v-if="subjectsStore.startTime"
              :state
              class="flex gap-2 items-center justify-end"
              @submit="
                (e) => {
                  const timerInput = parseTimerInput(e.data.streamTimeElapsed);
                  if (subjectsStore.startTime && timerInput !== null) {
                    const newDate = new Date(Date.now() - timerInput);
                    newDate.setSeconds(0);
                    if (!isNaN(newDate.getTime())) {
                      subjectsStore.startTime = newDate;

                      state.streamTimeElapsed = undefined;
                      close();
                    }
                  }
                }
              "
            >
              <UFormField name="streamTimeElapsed" class="w-16">
                <UInput
                  v-model="state.streamTimeElapsed"
                  type="text"
                  placeholder="durée"
                  autofocus
                  :ui="{ base: elapsedTime.includes('h') ? ['pe-3'] : [] }"
                  @vue:before-mount="
                    () => {
                      state.streamTimeElapsed = elapsedTime;
                    }
                  "
                >
                </UInput>
              </UFormField>

              <UButton
                type="submit"
                icon="ic:sharp-check"
                size="md"
                class="bg-green-700 text-slate-100 hover:bg-green-600 hover:text-white"
              />
            </UForm>
          </div>
        </template>
      </UPopover>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useSubjectsStore } from "~/stores/subjects";

const subjectsStore = useSubjectsStore();

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
