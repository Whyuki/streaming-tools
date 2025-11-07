<template>
  <div class="p-2">
    <ol>
      <li
        v-for="subject in filteredSubjects"
        :key="subject.id"
        :class="{
          'bg-my-blue border-cyan-600': subject.status === 'finished',
          'bg-my-purple border-purple-600 translate-x-3':
            subject.status === 'active',
          'bg-my-gray border-gray-600': subject.status === 'upcoming',
        }"
        class="mb-2 flex justify-between border-l-4 p-1 items-center relative transition-all duration-300"
      >
        <!-- bookmark img -->

        <img
          v-if="subject.status === 'active'"
          src="/images/newspaper_tag.webp"
          alt="bookmark"
          class="size-9 rounded-none absolute -left-8.5 bottom-0"
        />

        <div
          class="inline-flex items-start gap-1 flex-col flex-1 min-w-0 ms-1.5"
        >
          <p class="text-xl overflow-hidden wrap-break-word w-full">
            {{ subject.title }}
            <span
              v-if="subject.sources.length === 0 && !props.small"
              class="invisible inline-flex h-1 w-25"
            ></span>
          </p>
          <ul
            v-if="!props.small && subject.sources.length > 0"
            class="whitespace-nowrap overflow-hidden text-ellipsis w-full pr-20"
          >
            <li
              v-for="source in subject.sources"
              :key="source.id"
              class="inline mr-2"
            >
              <UAvatar
                :src="source.logo"
                :alt="source.label"
                class="size-6 rounded-none"
              />
            </li>
          </ul>
        </div>
        <div v-if="!props.small" class="flex justify-between gap-4">
          <div class="flex items-end justify-center absolute bottom-0 right-0">
            <UBadge
              v-if="subject.startTime"
              size="xs"
              class="flex items-center font-normal text-xl text-slate-200 bg-slate-500/60 py-0"
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
            </UBadge>
            <UBadge
              v-if="subject.startTime"
              size="xs"
              class="uppercase text-slate-100 text-xl font-normal bg-slate-950/40 py-0"
            >
              {{
                subject.startTime?.getHours().toString().padStart(2, "0") +
                ":" +
                subject.startTime?.getMinutes().toString().padStart(2, "0")
              }}
            </UBadge>
            <UBadge
              v-else
              size="xs"
              class="uppercase font-normal text-slate-100 text-xl bg-gray-900/80 py-0"
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
import { useSubjectsStore } from "~/stores/subjects";

const subjectsStore = useSubjectsStore();

const props = defineProps<{
  small?: boolean;
}>();

const filteredSubjects = computed(() => {
  return subjectsStore.subjects.filter(
    (subject) => subject.title.trim() !== ""
  );
});
</script>
