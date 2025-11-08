<template>
  <div class="inline-flex">
    <div
      id="settings"
      class="max-h-screen w-150 overflow-y-scroll p-2"
    >
      <SettingsOverlayControls />
      <SettingsSubjectList />
      <SettingsOptionsAccordion />
      <UCard
        variant="soft"
        class="my-4 bg-transparent"
      >
        <div class="flex items-center gap-4">
          <UAvatar
            src="https://github.com/Whyuki.png?size=100"
            class="size-12"
          ></UAvatar>

          <div>
            <p class="text-muted-foreground mb-2 text-sm">
              Ce
              <ULink
                as="a"
                href="https://github.com/Whyuki/streaming-tools"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-purple-300 hover:underline"
                >projet</ULink
              >
              à été développé par Whyuki pour
              <span class="group inline-block hover:animate-bounce">
                <UIcon
                  name="ri:sparkling-2-fill"
                  class="-scale-x-100 text-amber-500 group-hover:animate-pulse"
                ></UIcon>
                Samuel Etienne
                <UIcon
                  name="ri:sparkling-2-fill"
                  class="text-amber-500 group-hover:animate-pulse"
                ></UIcon>
              </span>
            </p>

            <p class="text-sm">
              N'hésitez pas à me contacter sur Discord
              <UBadge
                icon="ic:sharp-discord"
                trailing
                variant="soft"
                size="lg"
                class="bg-transparent px-1 py-0 text-[#777dcb] select-all"
                >.whyuki</UBadge
              >
              ou sur
              <ULink
                as="a"
                href="https://github.com/Whyuki"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-purple-300 hover:underline"
              >
                GitHub
                <UIcon
                  name="line-md:github-loop"
                  size="20"
                />
              </ULink>
              pour toute aide ou modifications.
            </p>
          </div>
        </div>
      </UCard>
    </div>
    <div
      id="overlay"
      class="ms-8"
    >
      <OverlayObs :style="{ width: overlayStore.overlayWidth + 'px' }" />
    </div>
    <div
      id="overlay"
      class="ms-16"
    >
      <OverlayObs
        :style="{ width: overlayStore.smallOverlayWidth + 'px' }"
        small
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useOverlayStore } from '~/stores/overlay'

  const overlayStore = useOverlayStore()
</script>
