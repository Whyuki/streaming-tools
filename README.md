# Overlay agendas stream

A web-based overlay application to manage and display live stream agendas with real-time timing and source attribution.

## Features

- **Stream Control Panel**: Full dashboard to manage subjects (agenda items) and timing
- **Subject Management**: Create, edit, reorder, and delete subjects
- **Source Attribution**: Assign news sources with logos to each subject (optional)
- **Status Tracking**: Visual indicators for active, finished, and upcoming subjects
- **Real-time Timing**: Automatic elapsed time tracking for each subject since start
- **Overlay Display**: Two customizable overlay sizes (full and compact) with configurable widths
- **Textual Agenda**: Generate a text summary of all subjects with their start times and elapsed durations
- **Persistent Storage**: Automatic localStorage backup of all settings and subject data

## Tech Stack

- **Framework**: Nuxt 4 + Vue 3
- **State Management**: Pinia
- **UI Components**: Nuxt UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the development server at `http://localhost:3000`:

```bash
npm run dev
```

## Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Usage

1. **In OBS**: Add a Browser source pointing to this application
2. Crop the source to display only your chosen overlay (full or compact size)

   > **Note:** To interact with the controls (manage subjects, start/stop timing), you need to interact with the browser source in OBS.

3. Add subjects to your agenda via the control panel
4. Start the agenda to begin timing 

   > **Note:** Start the agenda ideally at the start of the stream.
   But you can change the start time by modifying the displayed time or the time elapsed (since the stream started).

5. Use next/previous buttons to navigate through subjects
