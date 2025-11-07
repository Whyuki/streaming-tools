<template>
  <div class="p-2">
    <ol>
      <li
        v-for="subject in filteredSubjects"
        :key="subject.id"
        :class="{
          'border-cyan-600 bg-my-blue': subject.status === 'finished',
          'translate-x-3 border-purple-600 bg-my-purple': subject.status === 'active',
          'border-gray-600 bg-my-gray': subject.status === 'upcoming',
        }"
        class="relative mb-2 flex items-center justify-between border-l-4 p-1 transition-all duration-300"
      >
        <!-- bookmark img -->

        <img
          v-if="subject.status === 'active'"
          src="/images/newspaper_tag.webp"
          alt="bookmark"
          class="absolute bottom-0 -left-8.5 size-9 rounded-none"
        />

        <div class="ms-1.5 flex min-w-0 flex-1 flex-wrap items-start justify-between">
          <p class="max-w-full flex-none overflow-hidden text-xl wrap-break-word">
            {{ subject.title }}
            <span
              v-if="subject.sources.length === 0 && !props.small"
              class="invisible inline-flex h-1 w-25"
            ></span>
          </p>
          <ul
            v-if="!props.small && subject.sources.length > 0"
            class="max-w-full overflow-hidden pr-20 text-ellipsis whitespace-nowrap"
          >
            <li
              v-for="source in subject.sources"
              :key="source.id"
              class="mr-2 inline"
            >
              <UAvatar
                :src="source.logo"
                :alt="source.label"
                class="size-6 rounded-none"
              />
            </li>
          </ul>
        </div>
        <div
          v-if="!props.small"
          class="flex justify-between gap-4"
        >
          <div class="absolute right-0 bottom-0 flex items-end justify-center">
            <UBadge
              v-if="subject.startTime"
              size="xs"
              class="flex items-center bg-slate-500/60 py-0 text-xl font-normal text-slate-200"
            >
              {{
                subject.startTime && subjectsStore.startTime
                  ? computeElapsedTime(
                      subjectsStore.startTime.getTime(),
                      subject.startTime.getTime(),
                      true,
                    )
                  : 0
              }}'
            </UBadge>
            <UBadge
              v-if="subject.startTime"
              size="xs"
              class="bg-slate-950/40 py-0 text-xl font-normal text-slate-100 uppercase"
            >
              {{
                subject.startTime?.getHours().toString().padStart(2, '0') +
                ':' +
                subject.startTime?.getMinutes().toString().padStart(2, '0')
              }}
            </UBadge>
            <UBadge
              v-else
              size="xs"
              class="bg-gray-900/80 py-0 text-xl font-normal text-slate-100 uppercase"
            >
              À venir
            </UBadge>
          </div>
          <!-- <span
            v-if="subject.startTime"
            class="flex items-center text-lg text-slate-100"
          >
            {{
              subject.startTime && subjectsStore.startTime
                ? computeElapsedTime(
                    subjectsStore.startTime.getTime(),
                    subject.startTime.getTime(),
                    true
                  )
                : 0
            }}'
          </span> -->
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
  import { useSubjectsStore } from '~/stores/subjects'

  const subjectsStore = useSubjectsStore()

  const props = defineProps<{
    small?: boolean
  }>()

  const filteredSubjects = computed(() => {
    return subjectsStore.subjects.filter((subject) => subject.title.trim() !== '')
  })
</script>
