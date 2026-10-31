# Kanban Task Board — Machine Coding Project

A responsive, feature-rich **Kanban Task Board** built with modern React (Vite), HTML5 Drag-and-Drop, search & priority filters, and LocalStorage persistence.

Designed with human-learner code clarity: well-structured components, thoughtful comments, clean separation of concerns, and accessible keyboard/mobile controls.

---

## 📸 Application Previews

| Desktop View (3-Column Kanban Grid) | Mobile View (Adaptive Navigation Tabs) |
| :---: | :---: |
| ![Desktop View](./desktop_view.png) | ![Mobile View](./mobile_view.png) |

---

## 🚀 Live Features & User Experience

### 1. 3-Column Task Progression
* **Todo:** Tasks ready to be started.
* **In Progress:** Active work items currently being executed.
* **Completed:** Done tasks.

### 2. Dual Status Movement (Desktop & Mobile Friendly)
* **HTML5 Drag and Drop:** Drag any task card and drop it onto any column. Columns dynamically highlight (`column-drag-over`) as drop targets.
* **Quick-Move Controls:** Every card has directional arrows (`←` / `→`) and a status dropdown. This ensures touch users on mobile and keyboard navigation users can move tasks effortlessly without relying on drag-and-drop.

### 3. Add & Edit Modal with Real-Time Validation
* Fields:
  * **Title:** Required, 2–80 characters.
  * **Status:** Todo, In Progress, Completed.
  * **Priority:** High, Medium, Low.
  * **Due Date:** Date selector with automatic today/tomorrow/relative labels.
  * **Description:** Optional multi-line notes (up to 500 characters).
* Inline validation with clear error messages.
* Accessible: Autofocuses title input upon opening, and closes on `Esc` key or backdrop click.

### 4. Delete Confirmation Dialog
* Deleting triggers a confirmation modal displaying the specific task title to prevent accidental data loss.

### 5. Multi-Parameter Search & Filtering
* **Live Keyword Search:** Instant search matching task title or description with a quick-clear (`X`) button.
* **Priority Filter:** Filter by High, Medium, or Low priority.
* **Column / Status Filter:** View tasks from specific columns or all columns simultaneously.
* **Active Filter Summary:** Shows matching count (e.g. `Showing 4 of 6`) and a "Clear Filters" button.

### 6. Overdue Due Date Alerts
* If a task has a due date in the past and is not yet in the `Completed` column, it automatically displays an **Overdue** alert badge with red indicator styling and increments the top sprint alert counter.

### 7. Sprint Metrics Dashboard
* Dynamic progress bar showing sprint completion percentage (`completedCount / totalCount * 100`).
* Real-time badges for Total, Todo, In Progress, Completed, and Overdue tasks.

### 8. Persistence via LocalStorage
* All task operations (create, edit, delete, status move) synchronize automatically with browser LocalStorage.
* Safe JSON wrapper prevents crashes in private browsing mode or storage quota limits.
* Includes a "Reset Demo Data" button to easily restore starter tasks.

### 9. Fully Responsive Layout
* **Desktop ($> 900px$):** 3-column side-by-side grid.
* **Mobile / Tablet ($\le 900px$):** Adaptive column switcher tabs (`All Columns`, `Todo (3)`, `In Progress (2)`, `Completed (1)`) preventing horizontal scrolling.

---

## 📁 Component Structure & Architecture

```
src/
├── components/
│   ├── Header.jsx              # Branding, sprint title, "New Task" and "Reset" buttons
│   ├── MetricsBar.jsx          # Completion progress bar & metric counter badges
│   ├── FilterBar.jsx           # Keyword search input, priority and status filter selects
│   ├── KanbanBoard.jsx         # Board container with mobile navigation tabs
│   ├── KanbanColumn.jsx        # Column drop target, header badge, and task cards list
│   ├── TaskCard.jsx            # Card with priority pill, due date badge, DnD, and move buttons
│   ├── TaskModal.jsx           # Create/Edit task modal with form validation
│   ├── DeleteConfirmModal.jsx  # Deletion confirmation dialog
│   └── EmptyState.jsx          # UX empty states (empty column vs zero search results)
├── data/
│   └── initialTasks.js         # Realistic starter mock tasks
├── utils/
│   ├── dateHelpers.js          # Due date formatting, overdue checks, and date helpers
│   └── storage.js              # Safe LocalStorage serialization and recovery
├── App.jsx                     # Core application state, filtering, and DnD handlers
├── index.css                   # Custom responsive CSS design tokens & animations
└── main.jsx                    # React 19 entry point
```

---

## 🧠 Key State Management Decisions

1. **Lazy State Initializer for LocalStorage:**
   ```javascript
   const [tasks, setTasks] = useState(() => loadTasksFromStorage(initialTasks));
   ```
   *Why:* Passing a function to `useState` ensures `localStorage.getItem()` only runs during the initial mount, preventing blocking disk reads on every subsequent re-render.
2. **`useMemo` for Derived Filtering & Metrics:**
   ```javascript
   const filteredTasks = useMemo(() => { ... }, [tasks, searchQuery, priorityFilter, statusFilter]);
   ```
   *Why:* Filtering and counting are derived purely from existing state. Using `useMemo` avoids redundant filtering calculations on modal open/close renders.
3. **Optimistic LocalStorage Sync:**
   ```javascript
   useEffect(() => { saveTasksToStorage(tasks); }, [tasks]);
   ```
   *Why:* Centralizes storage writes into a single clean effect rather than scattering `localStorage.setItem` inside every handler.

---

## 🛠️ Local Development & Build

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server (http://localhost:5173)
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🧪 Automated Testing

### 1. Headless Logic & State Verification Suite (23 Tests)
```bash
node test_logic.js
```
*Verifies: Initial schema, input validation, CRUD operations, state transitions, search and priority filtering, and overdue date calculations.*

### 2. Real Browser Integration & Screenshot Test
```bash
node browser_test.js
```
*Launches headless Chrome/Edge, verifies column and card rendering, interacts with search, and takes high-resolution desktop and mobile screenshots.*

---

## 🌐 Production Deployment Guide

### Deploying to Vercel:
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import the repository.
4. Framework Preset: **Vite**.
5. Click **Deploy**. Vercel will build and serve your app at a live `.vercel.app` URL.

### Deploying to GitHub Pages:
1. In `vite.config.js`, set `base: './'`.
2. Run `npm run build`.
3. Deploy the generated `dist` folder to GitHub Pages via `gh-pages` or the GitHub Actions static pages workflow.
