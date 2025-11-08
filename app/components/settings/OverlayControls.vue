<template>
  <div class="mb-4 grid grid-cols-2 gap-2">
    <UPopover
      :content="{
        align: 'end',
        side: 'bottom',
      }"
    >
      <UButton
        block
        variant="soft"
        color="error"
        >Nouveau sommaire</UButton
      >
      <template #content="{ close }">
        <div class="flex w-120 flex-col bg-slate-950 p-4">
          <p>Êtes-vous sûr de vouloir créer un nouveau sommaire ?</p>
          <p class="mb-4">Cela réinitialisera toutes les données.</p>
          <div class="flex justify-end">
            <UButton
              class="bg-red-800 hover:bg-red-700"
              variant="solid"
              @click="
                () => {
                  subjectsStore.reset()
                  close()
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
      class="bg-emerald-800 hover:bg-emerald-700"
      @click.prevent="subjectsStore.startStream"
    >
      Démarrer le sommaire
    </UButton>
    <UPopover
      v-else
      :content="{
        align: 'end',
        side: 'bottom',
      }"
    >
      <UButton
        block
        variant="soft"
        color="warning"
      >
        Redémarrer le sommaire
      </UButton>
      <template
        v-if="subjectsStore.startTime"
        #content="{ close }"
      >
        <div class="flex w-120 flex-col bg-slate-950 p-4">
          <p>Êtes-vous sûr de vouloir redémarrer le sommaire ?</p>
          <p class="mb-4">
            Cela réinitialisera uniquement l'heure de début ainsi que l'état d'avancement des
            sujets.
          </p>
          <div class="flex justify-end">
            <UButton
              class="bg-red-800 hover:bg-red-700"
              variant="solid"
              @click="
                () => {
                  subjectsStore.startStream()
                  close()
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
  <div
    v-if="subjectsStore.startTime"
    class="flex items-center justify-between"
  >
    <div class="flex items-center gap-2">
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
            console.log([e, subjectsStore.startTime])
            if (subjectsStore.startTime && typeof e === 'string') {
              const [hours, minutes] = e.split(':')
              const newDate = new Date(subjectsStore.startTime)
              newDate.setHours(Number(hours))
              newDate.setMinutes(Number(minutes))
              newDate.setSeconds(0)

              if (!isNaN(newDate.getTime())) {
                subjectsStore.startTime = newDate
              }
            }
          }
        "
      />
    </div>

    <p class="flex items-center">
      Temps écoulé :

      {{ elapsedTime }}

      {{
        !elapsedTime.includes('h')
          ? 'minute' + (['0', '1'].some((value) => value === elapsedTime) ? '' : 's')
          : ''
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
          class="ms-4 text-slate-100 hover:text-white"
        />

        <template #content="{ close }">
          <div class="w-100 bg-stone-800 p-4">
            <p class="text-sm">
              Entrer le temps écoulé depuis le début du stream en minute (ex: 15) ou en heure (ex:
              1h30):
            </p>

            <UForm
              v-if="subjectsStore.startTime"
              :state
              class="flex items-center justify-end gap-2"
              @submit="
                (e) => {
                  const timerInput = parseTimerInput(e.data.streamTimeElapsed)
                  if (subjectsStore.startTime && timerInput !== null) {
                    const newDate = new Date(Date.now() - timerInput)
                    newDate.setSeconds(0)
                    if (!isNaN(newDate.getTime())) {
                      subjectsStore.startTime = newDate

                      state.streamTimeElapsed = undefined
                      close()
                    }
                  }
                }
              "
            >
              <UFormField
                name="streamTimeElapsed"
                class="w-16"
              >
                <UInput
                  v-model="state.streamTimeElapsed"
                  type="text"
                  placeholder="durée"
                  autofocus
                  :ui="{ base: elapsedTime.includes('h') ? ['pe-3'] : [] }"
                  @vue:before-mount="
                    () => {
                      state.streamTimeElapsed = elapsedTime
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
  <p
    v-else
    class="flex justify-center text-slate-200"
  >
    Le sommaire n'a pas encore commencé
  </p>
</template>

<script setup lang="ts">
  import { useSubjectsStore } from '~/stores/subjects'

  const subjectsStore = useSubjectsStore()

  const state = reactive({
    streamTimeElapsed: undefined as string | undefined,
  })

  const elapsedTime = ref(
    computeElapsedTime(subjectsStore.startTime?.getTime() ?? Date.now(), Date.now()),
  )

  watch(
    () => subjectsStore.startTime,
    () => {
      elapsedTime.value = computeElapsedTime(
        subjectsStore.startTime?.getTime() ?? Date.now(),
        Date.now(),
      )
    },
  )

  onMounted(() => {
    const interval = setInterval(() => {
      const newElapsedTime = computeElapsedTime(
        subjectsStore.startTime?.getTime() ?? Date.now(),
        Date.now(),
      )
      if (newElapsedTime !== elapsedTime.value) {
        elapsedTime.value = newElapsedTime
      }
    }, 1000)

    return () => clearInterval(interval)
  })
</script>
