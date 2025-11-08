<template>
  <div class="mt-10 mb-4 grid grid-cols-4 gap-2">
    <h2 class="col-span-2 text-xl font-bold">Sujets</h2>
    <UButton
      :disabled="subjectsStore.activeSubjectIndex === null || subjectsStore.activeSubjectIndex < 0"
      icon="ic:sharp-keyboard-arrow-left"
      class="justify-center bg-cyan-800 hover:bg-cyan-700 disabled:bg-cyan-800"
      @click="previousSubject"
      >Précédent</UButton
    >
    <UButton
      :disabled="
        subjectsStore.activeSubjectIndex === null ||
        subjectsStore.activeSubjectIndex > subjectsStore.subjects.length - 1
      "
      icon="ic:sharp-keyboard-arrow-right"
      trailing
      :ui="{ trailingIcon: 'ms-[initial]' }"
      class="justify-center bg-cyan-800 hover:bg-cyan-700 disabled:bg-cyan-800"
      @click="nextSubject"
      >Suivant</UButton
    >
  </div>
  <div>
    <ol>
      <li
        v-for="subject in subjectsStore.subjects"
        :key="subject.id"
        :class="{
          'bg-my-blue': subject.status === 'finished',
          'bg-my-purple': subject.status === 'active',
          'bg-my-gray': subject.status === 'upcoming',
          'border-cyan-600': subject.status === 'finished',
          'border-purple-600': subject.status === 'active',
          'border-gray-600': subject.status === 'upcoming',
        }"
        class="border-l-4"
      >
        <UForm
          class="mb-2 flex justify-between"
          @submit.prevent="
            (event) => {
              console.log('form event:', event.type)
              toggleEditMode(subject.id)
            }
          "
        >
          <div
            v-if="subject.id !== editModeSubjectId"
            class="flex min-w-0 grow flex-col justify-between p-2"
          >
            <p class="w-full overflow-hidden text-lg font-bold wrap-break-word">
              {{ subject.title }}
            </p>
            <div class="flex justify-between">
              <ul class="flex gap-1">
                <li
                  v-for="source in subject.sources"
                  :key="source.id"
                  class="flex items-center gap-2"
                >
                  <img
                    :src="source.logo"
                    :alt="source.label"
                    class="h-5 w-5 object-contain"
                  />
                </li>
              </ul>
              <span
                v-if="subject.startTime"
                class="flex items-center"
              >
                <UIcon
                  name="ic:sharp-timer"
                  size="20"
                  class="mr-1"
                />
                {{
                  subject.startTime && subjectsStore.startTime
                    ? computeElapsedTime(
                        subjectsStore.startTime.getTime(),
                        subject.startTime.getTime(),
                        true,
                      )
                    : 0
                }}
                '
              </span>
            </div>
          </div>

          <div
            v-else
            class="flex grow flex-col justify-between p-2"
          >
            <UInput
              v-model="subject.title"
              class="text-lg font-bold"
              placeholder="Titre du sujet"
              autofocus
            />
            <UFieldGroup class="flex">
              <UInputMenu
                multiple
                open-on-focus
                :items="items"
                :model-value="computedSources"
                placeholder="Source(s)"
                size="sm"
                class="flex-1"
                :ui="{
                  itemLeadingAvatar: 'rounded-none',
                  tagsItem: 'p-px',
                  tagsItemDeleteIcon: 'size-4',
                }"
                @update:model-value="updateSources"
              >
                <template #tags-item-text="{ item }">
                  <div class="flex gap-1">
                    <UAvatar
                      :src="item.avatar.src"
                      :alt="item.avatar.alt"
                      size="3xs"
                      class="rounded-none"
                    />
                    <span class="text-xs">{{ item.label }}</span>
                  </div>
                </template>
              </UInputMenu>
              <UInput
                v-if="subject.startTime && subjectsStore.startTime"
                icon="ic:sharp-timer"
                type="text"
                class="w-24"
                :ui="{ base: 'h-full' }"
                :model-value="
                  subject.startTime && subjectsStore.startTime
                    ? computeElapsedTime(
                        subjectsStore.startTime.getTime(),
                        subject.startTime.getTime(),
                      )
                    : ''
                "
                @update:model-value="
                  (e) => {
                    if (subject.startTime && subjectsStore.startTime) {
                      const timerInput = parseTimerInput(e)
                      if (timerInput !== null) {
                        const newDate = new Date(subjectsStore.startTime.getTime() + timerInput)
                        subject.startTime = newDate
                      }
                    }
                  }
                "
              />
            </UFieldGroup>
          </div>

          <div class="flex flex-col items-end justify-between p-2">
            <div class="flex">
              <UButton
                :icon="subject.id === editModeSubjectId ? 'ic:sharp-check' : 'ic:sharp-edit'"
                type="submit"
                size="md"
                :variant="subject.id === editModeSubjectId ? 'solid' : 'ghost'"
                :class="{
                  'bg-green-800 text-slate-100 hover:bg-green-700 hover:text-white':
                    subject.id === editModeSubjectId,
                  'text-slate-100 hover:text-white': subject.id !== editModeSubjectId,
                }"
              />

              <UPopover
                :content="{
                  align: 'end',
                  side: 'bottom',
                }"
              >
                <UButton
                  icon="ic:sharp-delete"
                  size="md"
                  variant="ghost"
                  class="text-slate-300 hover:text-red-700"
                />

                <template #content>
                  <div class="flex flex-col bg-slate-950 p-4">
                    <p class="mb-4 w-125 overflow-hidden wrap-break-word">
                      Êtes-vous sûr de vouloir supprimer le sujet
                      <span class="font-medium text-orange-300">{{ subject.title }}</span>
                      ?
                    </p>
                    <div class="flex justify-end">
                      <UButton
                        class="bg-red-800 hover:bg-red-700"
                        variant="solid"
                        @click="subjectsStore.removeSubject(subject.id)"
                      >
                        Confirmer
                      </UButton>
                    </div>
                  </div>
                </template>
              </UPopover>
            </div>
            <div>
              <UBadge
                size="sm"
                class="bg-gray-900/40 font-bold text-white uppercase"
              >
                {{
                  subject.status === 'finished'
                    ? 'Terminé'
                    : subject.status === 'active'
                      ? 'En cours'
                      : 'À venir'
                }}
              </UBadge>
            </div>
          </div>
          <div class="flex flex-col justify-between">
            <UButton
              :disabled="!subjectsStore.isMovable(subject.id).up"
              :class="{
                'brightness-75': !subjectsStore.isMovable(subject.id).up,
              }"
              icon="ic:sharp-arrow-drop-up"
              size="md"
              class="bg-cyan-900 hover:bg-cyan-800 disabled:bg-cyan-900 disabled:hover:bg-cyan-900"
              variant="solid"
              @click="subjectsStore.moveSubject(subject.id, 'up')"
            />
            <UButton
              :disabled="!subjectsStore.isMovable(subject.id).down"
              :class="{
                'brightness-75': !subjectsStore.isMovable(subject.id).down,
              }"
              icon="ic:sharp-arrow-drop-down"
              size="md"
              class="bg-cyan-900 hover:bg-cyan-800 disabled:bg-cyan-900 disabled:hover:bg-cyan-900"
              variant="solid"
              @click="subjectsStore.moveSubject(subject.id, 'down')"
            />
          </div>
        </UForm>
      </li>
    </ol>
    <div class="mt-4 flex justify-center">
      <UButton
        icon="ic:sharp-plus"
        variant="soft"
        color="neutral"
        @click="addNewSubject()"
        >Ajouter un sujet</UButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  //TODO: add cancel button on edit mode
  import { useSubjectsStore } from '~/stores/subjects'

  const subjectsStore = useSubjectsStore()

  const editModeSubjectId = ref<number | null>(null)

  function addNewSubject() {
    subjectsStore.addSubject({
      title: '',
      status: 'upcoming',
      startTime: null,
      sources: [],
    })

    const last = subjectsStore.subjects[subjectsStore.subjects.length - 1]
    if (last) {
      editModeSubjectId.value = last.id
    }
  }

  function toggleEditMode(subjectId: number) {
    console.log('Toggling edit mode for subject ID:', subjectId, editModeSubjectId.value)
    if (editModeSubjectId.value === subjectId) {
      editModeSubjectId.value = null
    } else {
      editModeSubjectId.value = subjectId
    }
  }

  const items = ref<SourceItem[]>(
    [
      {
        value: 'liberation',
        label: 'Libération',
        avatar: { src: '/logos/liberation.jpg', alt: 'Libération' },
      },
      {
        value: 'lemonde',
        label: 'Le Monde',
        avatar: { src: '/logos/le_monde.png', alt: 'Le Monde' },
      },
      {
        value: 'lefigaro',
        label: 'Le Figaro',
        avatar: { src: '/logos/figaro.png', alt: 'Le Figaro' },
      },
      {
        value: 'lacroix',
        label: 'La Croix',
        avatar: { src: '/logos/la_croix.png', alt: 'La Croix' },
      },
      {
        value: 'leparisien',
        label: 'Le Parisien',
        avatar: { src: '/logos/le_parisien.png', alt: 'Le Parisien' },
      },
      {
        value: 'lhumanite',
        label: "L'Humanité",
        avatar: { src: '/logos/l_humanite.png', alt: "L'Humanité" },
      },
      {
        value: 'lesechos',
        label: 'Les Échos',
        avatar: { src: '/logos/Les_Echos.png', alt: 'Les Échos' },
      },
      {
        value: 'lequipe',
        label: "L'Équipe",
        avatar: { src: '/logos/l_Equipe.png', alt: "L'Équipe" },
      },
      {
        value: 'lopinion',
        label: "L'Opinion",
        avatar: { src: '/logos/l_opinion.png', alt: "L'Opinion" },
      },
    ].map((item) => ({
      ...item,
      avatar: {
        ...item.avatar,
        src: (useRuntimeConfig().app.baseURL + item.avatar.src).replace(/\/\/+/g, '/'),
      },
    })),
  )

  interface SourceItem {
    label: string
    value: string
    avatar: { src: string; alt: string }
  }

  function updateSources(selectedItems: SourceItem[]) {
    console.log('Selected items:', selectedItems)
    if (editModeSubjectId.value === null) return

    const subject = subjectsStore.getSubjectById(editModeSubjectId.value)
    if (!subject) return

    subjectsStore.updateSubject(editModeSubjectId.value, {
      ...subject,
      sources: selectedItems.map((item) => ({
        id: item.value,
        label: item.label,
        logo: item.avatar.src,
      })),
    })
  }

  const computedSources = computed(() => {
    if (editModeSubjectId.value === null) return []

    const subject = subjectsStore.getSubjectById(editModeSubjectId.value)
    if (!subject) return []

    return subject.sources.map((source) => ({
      label: source.label,
      value: source.id,
      avatar: { src: source.logo, alt: source.label },
    }))
  })

  function nextSubject() {
    subjectsStore.nextSubject()
  }

  function previousSubject() {
    subjectsStore.previousSubject()
  }
</script>
