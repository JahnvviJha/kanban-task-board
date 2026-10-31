# Kanban Task Board — 90-Second Video Demo Walkthrough Script

Use this exact script when recording your 1–2 minute video demo for submission.

---

### Step 1: Introduction (0:00 – 0:15)
* **Screen Action:** Show the main board with the 3 columns: *Todo*, *In Progress*, and *Completed*.
* 🗣️ **Say directly:**
  > *"Hi everyone, this is my responsive Kanban Task Board built with React and Vite. It helps teams manage sprint tasks across three distinct columns: Todo, In Progress, and Completed. Let me walk you through the key features, architecture, and user experience."*

---

### Step 2: Dual Status Movement: Drag-and-Drop + Quick-Move (0:15 – 0:35)
* **Screen Action:** 
  1. Grab a card from *Todo* and drop it into *In Progress* (notice the column highlights in blue).
  2. Click the `[Completed →]` arrow button on another card.
* 🗣️ **Say directly:**
  > *"First, for status movement, we support two intuitive approaches. On desktop, users can use native HTML5 drag-and-drop to drag tasks between columns with clear visual drop target feedback.
  >
  > In addition, every card features directional quick-move arrow buttons and a status dropdown. This ensures touch users on mobile and keyboard users can move cards effortlessly without relying on drag-and-drop."*

---

### Step 3: Add & Edit Modal with Form Validation (0:35 – 0:55)
* **Screen Action:** 
  1. Click **"+ New Task"**.
  2. Click **"Create Task"** with an empty title to show the red validation message.
  3. Type: *"Prepare Sunday Mock Interview"*, set Priority to *High*, set Due Date, and click **"Create Task"**.
* 🗣️ **Say directly:**
  > *"Next is task creation and editing. Clicking 'New Task' opens an accessible modal with real-time validation to prevent empty submissions. We can set the title, column status, priority, and due dates. When saved, the new card appears immediately and updates the sprint metrics."*

---

### Step 4: Search, Filters & Overdue Alerts (0:55 – 1:15)
* **Screen Action:** 
  1. Type *"Git"* in the search box to filter in real-time, then clear it.
  2. Change Priority dropdown to *"High"*.
  3. Point to an overdue task card with its red alert badge and the top sprint overdue counter.
* 🗣️ **Say directly:**
  > *"We have multi-parameter filtering: instant keyword search across titles and descriptions, plus priority and status dropdowns.
  >
  > The board also includes automatic overdue detection: if an incomplete task's due date is in the past, it displays a red overdue alert badge and increments our top sprint counter."*

---

### Step 5: Responsive Mobile View & LocalStorage Persistence (1:15 – 1:35)
* **Screen Action:** 
  1. Press `F12` to open DevTools, toggle mobile view (showing the tab switcher: *All*, *Todo*, *In Progress*, *Completed*).
  2. Hit browser refresh (`Ctrl + R`) to show all cards remain intact.
* 🗣️ **Say directly:**
  > *"On mobile screens, the layout adapts into single-column views with interactive navigation tabs so users don't have to horizontally scroll.
  >
  > Finally, all state is backed by browser LocalStorage through a custom hook, so refreshing the page preserves all custom tasks and status moves."*

---

### Step 6: Code Architecture & Wrap Up (1:35 – 1:50)
* **Screen Action:** Briefly switch to VS Code to show the folder structure (`src/hooks/`, `src/components/kanban/`, `layout/`, `modals/`).
* 🗣️ **Say directly:**
  > *"Under the hood, the project is structured following clean React best practices. We separated business logic into custom hooks—`useTasks` for CRUD and persistence, and `useKanbanFilters` for search—and organized components into categorized folders like `layout`, `kanban`, and `modals`.
  >
  > Thank you for watching!"*
