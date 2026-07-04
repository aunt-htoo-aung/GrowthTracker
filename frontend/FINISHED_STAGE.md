# DevTrack - Finished Stage Tracker

> This file tracks the implementation status of every feature described in `project_idea.md`.
> Updated: 2026-06-20 (full rewrite: responsive + routing + working buttons)

---

## Legend

- [x] Done
- [~] Partially Done (UI exists, no logic/backend)
- [ ] Not Started

---

## 1. Tech Stack & Infrastructure

| Item | Status | Notes |
|------|--------|-------|
| React 19.2 + Vite 7.2.4 | [x] | `main.jsx`, `App.jsx` |
| Tailwind CSS 4.1 | [x] | `index.css` with `@import "tailwindcss"` + base responsive styles |
| lucide-react icons | [x] | Used in `dashboard.jsx`, `Entry.jsx`, `Navbar.jsx` |
| ESLint config | [x] | `eslint.config.js` |
| React Router | [x] | `react-router-dom` — routes for `/` (Dashboard), `/entry` (New Entry), `/entry/:id` (Edit) |
| State management | [x] | React Context (`EntryContext`) — global entries state, CRUD via API, computed stats; loading/error states |
| Backend API integration | [x] | API service layer (`src/services/api.js`) with `fetch`-based CRUD; base URL configurable via `VITE_API_URL` env var |

---

## 2. User Management

| Feature | Status | Notes |
|---------|--------|-------|
| User registration | [x] | `Register.jsx` — name, email, password, confirm password; strength hints; API call |
| User login | [x] | `Login.jsx` — email + password; show/hide password toggle; error display |
| User logout | [x] | Navbar logout button; redirects to `/login`; clears user state |
| Profile management | [x] | `Profile.jsx` — view/edit name & bio; avatar with initials; member since; account actions |

---

## 3. Progress Entry Management

| Feature | Status | Notes |
|---------|--------|-------|
| Create new entry (UI) | [x] | `Entry.jsx` — full form with date picker, title, description, tags |
| Create new entry (logic) | [x] | Form collects data, saves to context via `addEntry()`, navigates back to dashboard |
| Edit existing entry | [x] | `/entry/:id` loads entry data into form; `updateEntry()` saves changes |
| Delete entry | [x] | Trash icon on each entry; double-click to confirm delete |
| View entry history | [x] | Dashboard shows entries with search/filter; shows latest 5 by default with "Show all" option |

### Entry Fields

| Field | Status | Notes |
|-------|--------|-------|
| Date | [x] | Native date picker input, defaults to today |
| Title | [x] | Controlled input wired to state |
| Description | [x] | Rich text editor (`contentEditable`); toolbar with active state indicators: **Bold**, *Italic*, alignment (left/center/right/justify), links, bullet/ordered lists; keyboard shortcuts (Ctrl+B/I/U) |
| Tags | [x] | Add/remove via click or Enter key; custom tag input with autocomplete from existing tags; popular tag suggestions |
| Created At | [x] | Displayed on each entry item in dashboard ("Created Jun 18, 2026, 10:00 AM") |

---

## 4. Tag Management

| Feature | Status | Notes |
|---------|--------|-------|
| Dynamic tag creation | [x] | Custom tag input with Enter key or + button in `Entry.jsx` |
| Auto-suggestions from existing tags | [x] | Autocomplete dropdown from `allTags` in context as user types in tag input |
| Multiple tags per entry | [x] | Full add/remove UI with visual feedback |
| Tag-based filtering | [x] | Tag dropdown in filter controls; filters entries list in real-time |

---

## 5. Search and Filtering

| Feature | Status | Notes |
|---------|--------|-------|
| Search by title | [x] | Search bar on Dashboard filters by title text |
| Search by description | [x] | Search bar on Dashboard filters by description content |
| Search by tags | [x] | Search bar on Dashboard filters by tag names |
| Filter by date range | [x] | From/To date pickers in filter panel |
| Filter by specific tags | [x] | Tag dropdown in filter panel |
| Filter by month | [~] | Date range picker can be used to filter by month (no dedicated month dropdown) |
| Filter by year | [~] | Date range picker can be used to filter by year (no dedicated year dropdown) |

---

## 6. Analytics Dashboard

| Feature | Status | Notes |
|---------|--------|-------|
| Contribution Calendar | [x] | GitHub-style heatmap with `overflow-x-auto`; data computed from entries |
| Total Entries stat | [x] | Card stat with icon — real count from context |
| Current Streak stat | [x] | Card stat with icon — computed from actual entries |
| Longest Streak stat | [x] | Card stat with icon — computed from actual entries |
| Monthly Activities stat | [x] | Card stat with icon — real count for current month |
| Most Used Tags | [x] | Top 6 tags computed from all entries |
| Recent Activities | [x] | Shows latest 5 entries from context with tags, icons, dates; empty state when no entries |
| Welcome box | [~] | Welcome message + "Add Today's Progress" button (navigates to /entry) |

---

## 7. Layout & Navigation

| Feature | Status | Notes |
|---------|--------|-------|
| Navbar | [x] | Sticky top nav with brand + desktop links + mobile hamburger menu; active link highlighting |
| Page routing | [x] | React Router with `/`, `/entry`, `/entry/:id` |
| Entry page accessible | [x] | "Add Today's Progress" button and "New Entry" nav link navigate to `/entry` |
| Breadcrumb navigation | [x] | Entry page has working "Dashboard" breadcrumb link |
| Mobile hamburger menu | [x] | Toggleable dropdown on screens < 640px |

---

## 8. Non-Functional Requirements

| Requirement | Status | Notes |
|-------------|--------|-------|
| Fast search results | [x] | Client-side search with `useMemo` filtering — instant results |
| Responsive UI | [x] | Full rewrite: CSS Grid layout, responsive at all breakpoints (320px+), overflow-x on calendar |
| Mobile-friendly design | [x] | Hamburger nav, stacked layouts, touch-friendly tap targets, scrollable calendar |
| Password encryption | [~] | Backend responsibility; frontend sends plain password over HTTPS |
| Secure authentication | [x] | AuthContext with login/register/logout API calls; protected routes |
| User-specific data isolation | [~] | Protected routes redirect to login; backend must enforce data isolation |
| Clean and intuitive interface | [x] | Consistent design system with card-based layout |
| Easy entry creation process | [x] | Functional form with validation, tag management, date picker, navigation |

---

## 9. Component Inventory

| File | Components | Status |
|------|-----------|--------|
| `src/main.jsx` | App entry point | [x] Working |
| `src/App.jsx` | Root with `BrowserRouter`, `Routes`, `EntryProvider` | [x] Routing + context configured |
| `src/index.css` | Global styles + base responsive utilities | [x] Tailwind + custom |
| `src/context/EntryContext.jsx` | `EntryProvider`, `useEntries` | [x] Global state, CRUD via API, computed stats, loading/error states |
| `src/context/AuthContext.jsx` | `AuthProvider`, `useAuth` | [x] User state, login/register/logout, profile update |
| `src/components/Navbar.jsx` | `Navbar` (with hamburger menu, active links) | [x] Full navigation, auth-aware links, logout |
| `src/components/UIElements.jsx` | `Button`, `LinkButton`, `Box` | [x] Multi-variant buttons, responsive box |
| `src/components/ProtectedRoute.jsx` | `ProtectedRoute` | [x] Redirects to login if not authenticated |
| `src/services/api.js` | API service functions | [x] Fetch-based CRUD, configurable base URL, auth + profile endpoints |
| `src/pages/dashboard.jsx` | `Dashboard`, `WelcomeBox`, `SummaryBox`, `CalendarBox`, `ContributionCalendar`, `ContributionCell`, `CalendarLegend`, `EntriesPanel`, `EntryItem`, `StatsOverview` | [x] Full responsive UI, search, filter, delete, edit, createdAt timestamp |
| `src/pages/Entry.jsx` | `AddEntry` (create/edit form) | [x] Create and edit mode, tag autocomplete, WYSIWYG editor |
| `src/pages/Login.jsx` | `Login` | [x] Email + password form, show/hide password, error display |
| `src/pages/Register.jsx` | `Register` | [x] Name + email + password form, strength hints, confirm password |
| `src/pages/Profile.jsx` | `Profile` | [x] View/edit profile, avatar, bio, account actions |

---

## 10. Implementation Priority (Suggested Next Steps)

1. **Backend API** — Implement the backend endpoints (see `src/services/api.js` for contract)
2. **Dark mode** — Toggle between light and dark themes
3. **Export entries** — PDF or CSV export functionality
4. **Entry detail/view page** — Dedicated page for viewing full entry content
5. **Weekly summaries** — AI-generated learning summaries
6. **Learning goals** — Set and track milestones

---

## Change Log

### 2026-06-20 — User Management (Auth UI + Protected Routes)

**New files:**
- `src/context/AuthContext.jsx` — Auth state management with `login()`, `register()`, `logout()`, `updateProfile()`; `isAuthenticated` flag; `loading`/`error` states
- `src/components/ProtectedRoute.jsx` — Redirects unauthenticated users to `/login`
- `src/pages/Login.jsx` — Login form with email + password; show/hide password toggle; error banner; loading state on submit
- `src/pages/Register.jsx` — Registration form with name, email, password, confirm password; password strength hints (8+ chars, uppercase, number); mismatch validation
- `src/pages/Profile.jsx` — View/edit profile page; avatar with initials; member since date; bio editing; account actions (change password, delete account links)

**Files changed:**
- `src/App.jsx` — Wrapped with `AuthProvider`; added routes for `/login`, `/register`, `/profile`; wrapped protected routes with `ProtectedRoute`
- `src/components/Navbar.jsx` — Auth-aware navigation: shows Dashboard/New Entry for authenticated users, Sign In/Sign Up for guests; profile avatar link; logout button; mobile menu updated
- `src/services/api.js` — Added `updateProfile()` and `getProfile()` endpoints
- `src/pages/dashboard.jsx` — Added `createdAt` timestamp display on entry items

### 2026-06-20 — API Integration Layer

**New files:**
- `src/services/api.js` — API service with `fetch`-based CRUD functions; `BASE_URL` from `VITE_API_URL` env var (default `http://localhost:8080/api`); endpoints: `GET /entries` (with search/tag/date query params), `GET /entries/:id`, `POST /entries`, `PUT /entries/:id`, `DELETE /entries/:id`, `GET /tags`, `GET /stats`, `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`

**Files changed:**
- `src/context/EntryContext.jsx` — Removed localStorage; added `loading` and `error` states; `useEffect` fetches entries on mount via `api.getEntries()`; `addEntry`/`updateEntry`/`deleteEntry` now async and call API; added `refetchEntries` helper
- `src/pages/dashboard.jsx` — Added loading spinner state while entries load; added error state with retry button; delete handler now async with error alert
- `src/pages/Entry.jsx` — Submit handler now async with `submitting` state; shows "Saving..."/"Adding..." on button during request; error alert on failure

### 2026-06-20 — Entry CRUD, Search & Filter, Tag Autocomplete, LocalStorage

**Files changed:**
- `src/context/EntryContext.jsx` — Added localStorage persistence (`devtrack_entries` key); added `getEntryById()` helper; added `allTags` computed value (sorted unique tags from all entries); entries now load from localStorage on init
- `src/pages/Entry.jsx` — Added edit mode via `/entry/:id` route using `useParams`; form pre-fills with entry data when editing; submit calls `updateEntry()` for edits; replaced static popular tags with tag autocomplete dropdown from context `allTags`; search icon in tag input; dropdown shows matching suggestions as user types
- `src/pages/dashboard.jsx` — Replaced `RecentEntries` with `EntriesPanel` component: search bar (title/description/tag filtering), filter panel (date range + tag dropdown), edit buttons (pencil icon on each entry), delete buttons (trash icon with double-click confirmation), "Show all" / "Show less" toggle, empty state for no results; added `EntryItem` sub-component with hover-visible action buttons

### 2026-06-20 — State Management (React Context)

**New files:**
- `src/context/EntryContext.jsx` — React Context provider with global entries state; CRUD operations (`addEntry`, `deleteEntry`, `updateEntry`); computed values via `useMemo`: `contributions` (calendar data), `entriesToday`, `totalEntries`, `thisMonthEntries`, `currentStreak`, `longestStreak`, `weeklyDays`, `topTags`; seeded with 7 demo entries

**Files changed:**
- `src/App.jsx` — Wrapped `BrowserRouter` with `EntryProvider`
- `src/pages/Entry.jsx` — `handleSubmit` now calls `addEntry()` from context instead of `console.log`
- `src/pages/dashboard.jsx` — All components now read from context: `SummaryBox` uses real stats, `ContributionCalendar` uses computed contributions, `RecentEntries` shows latest 5 entries with empty state, `StatsOverview` uses real weekly goal/month/streak/top tags

### 2026-06-20 — Toolbar Active State Indicators + Alignment Buttons

**Files changed:**
- `src/pages/Entry.jsx` — Added active state tracking via `document.queryCommandState()` and `selectionchange` listener; replaced single paragraph button with 4 alignment buttons (left, center, right, justify); created `ToolbarBtn` component that highlights active formatting in blue; added `AlignCenter`, `AlignRight`, `AlignJustify` icons from lucide-react; toolbar now shows visual feedback when bold, italic, lists, or alignment is active on the current text

### 2026-06-20 — Rich Text Editor (WYSIWYG Description)

**Files changed:**
- `src/pages/Entry.jsx` — Replaced `<textarea>` with `contentEditable` div for WYSIWYG rich text editing; toolbar now uses `document.execCommand` for live formatting: bold, italic, paragraph blocks, hyperlinks (with URL prompt), bullet lists, numbered lists; toolbar moved above editor; added `onMouseDown` preventDefault on buttons to preserve text selection; added Ctrl+B/I/U keyboard shortcuts; editor syncs innerHTML to state via `onInput`

### 2026-06-20 — Markdown Toolbar Buttons Functional

**Files changed:**
- `src/pages/Entry.jsx` — Added `useRef` for textarea; implemented `wrapSelection()` and `insertAtLineStart()` helpers; wired toolbar buttons: **Bold** → `**text**`, *Italic* → `*text*`, [Hyperlink](url) → `[text](https://)`, Bullet list → `- `, Ordered list → `1. `, Paragraph break → double newline; toolbar icons converted to accessible `<button>` elements with hover states, tooltips, and a divider separator

### 2026-06-20 — Full Rewrite: Responsive + Routing + Working Buttons

**Dependencies added:**
- `react-router-dom` — client-side routing

**Files rewritten:**
- `src/App.jsx` — Added `BrowserRouter` with routes for `/`, `/entry`, `/entry/:id`; wrapped in `min-h-screen bg-gray-50`
- `src/components/Navbar.jsx` — Complete rewrite: sticky nav, desktop links with active highlighting, mobile hamburger menu with dropdown, `Link` components from react-router-dom, lucide icons for nav items
- `src/components/UIElements.jsx` — Added `LinkButton` (rendered as `<Link>`), multi-variant `Button` (primary/secondary/ghost/danger), responsive `Box` with consistent `rounded-xl` and `shadow-sm`
- `src/pages/dashboard.jsx` — Complete rewrite: CSS Grid `grid-cols-1 lg:grid-cols-4` layout, icon-based stat cards in SummaryBox, `overflow-x-auto` on ContributionCalendar, redesigned RecentEntries with tag chips, added Longest Streak stat, working "Add Today's Progress" button linking to `/entry`
- `src/pages/Entry.jsx` — Complete rewrite: functional form with `useState` for all fields, native date picker, controlled title/description inputs, tag add/remove with custom tag input (Enter key), popular tag toggle buttons, form validation (submit disabled until valid), `useNavigate` for back navigation, working Cancel link, `onSubmit` handler that logs entry and navigates home
- `src/index.css` — Added base responsive styles: antialiased text, smooth scrolling, date input styling, `line-clamp-2` utility

### 2026-06-20 — Initial Mobile Responsive Design

**Files changed:**
- `src/pages/dashboard.jsx` — Layout rows `flex` → `flex flex-col md:flex-row`; width classes updated; WelcomeBox wraps; ContributionCalendar gets `overflow-x-auto`; RecentEntries items stack vertically
- `src/pages/Entry.jsx` — Form fields stack on mobile; responsive padding/margins; footer actions wrap
- `src/components/Navbar.jsx` — Responsive padding and font size
- `src/components/UIElements.jsx` — Responsive Box margins
