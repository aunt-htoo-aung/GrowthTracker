/**
 * DevTrack API Service
 *
 * ── MOCK MODE ──
 * All real API calls are commented out.
 * Local mock data is used so the full UI can be previewed without a backend.
 * When the backend is ready, uncomment the real calls and remove the mocks.
 *
 * Base URL (when backend is ready): configure via VITE_API_URL
 */

// ──────────────────────────────────────────────
//  Mock Data
// ──────────────────────────────────────────────

let nextId = 6;

let mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  bio: "Full-stack developer passionate about React and Node.js. Building cool stuff every day.",
  avatar: null,
  createdAt: "2025-09-15T10:00:00.000Z",
};

const mockEntries = [
  {
    id: 1,
    title: "Learned React Context API",
    date: "2026-06-20",
    description:
      "<p>Today I deep-dived into <b>React Context</b> and understood how to share state across components without prop drilling.</p><ul><li>Created an EntryContext</li><li>Used <code>useContext</code> hook in child components</li><li>Replaced all prop-based state with context</li></ul>",
    tags: ["React", "JavaScript", "State Management"],
    createdAt: "2026-06-20T09:30:00.000Z",
  },
  {
    id: 2,
    title: "Built a WYSIWYG Editor",
    date: "2026-06-19",
    description:
      "<p>Implemented a custom <b>rich text editor</b> using <code>contentEditable</code> and <code>execCommand</code>.</p><p>Features include bold, italic, underline, lists, headings, and alignment buttons with active state indicators.</p>",
    tags: ["React", "UI", "JavaScript"],
    createdAt: "2026-06-19T14:15:00.000Z",
  },
  {
    id: 3,
    title: "Tailwind CSS Responsive Layout",
    date: "2026-06-18",
    description:
      "<p>Rewrote the entire frontend layout to be fully <b>responsive</b> using Tailwind CSS utility classes.</p><ul><li>Mobile hamburger navigation</li><li>Responsive grid for dashboard stats</li><li>Flexible card layouts</li></ul>",
    tags: ["CSS", "Tailwind", "UI"],
    createdAt: "2026-06-18T11:00:00.000Z",
  },
  {
    id: 4,
    title: "Node.js REST API Setup",
    date: "2026-06-17",
    description:
      "<p>Set up the backend project with <b>Express.js</b> and <b>MongoDB</b>.</p><p>Created route skeletons for entries, tags, and auth. Configured CORS and environment variables.</p>",
    tags: ["Node.js", "Backend", "MongoDB"],
    createdAt: "2026-06-17T16:45:00.000Z",
  },
  {
    id: 5,
    title: "Bug Fix: Navigation Not Closing on Mobile",
    date: "2026-06-16",
    description:
      "<p>Fixed a bug where the mobile navigation menu didn't close after clicking a link.</p><p>Root cause: the <code>useEffect</code> for route change detection wasn't cleaning up properly. Added a proper cleanup function.</p>",
    tags: ["Bug Fix", "React", "Mobile"],
    createdAt: "2026-06-16T20:10:00.000Z",
  },
];

/** Small delay to simulate network latency */
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// ──────────────────────────────────────────────
//  Generic request helper (REAL API — commented out)
// ──────────────────────────────────────────────

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
//
// async function request(endpoint, options = {}) {
//   const url = `${BASE_URL}${endpoint}`;
//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers,
//     },
//     ...options,
//   };
//
//   const response = await fetch(url, config);
//
//   if (!response.ok) {
//     const error = new Error(`API Error: ${response.status} ${response.statusText}`);
//     error.status = response.status;
//     try {
//       error.data = await response.json();
//     } catch {
//       error.data = null;
//     }
//     throw error;
//   }
//
//   return response.json();
// }

// ──────────────────────────────────────────────
//  Entries API
// ──────────────────────────────────────────────

/**
 * GET /api/entries
 * Fetch all entries (optionally with query params)
 */
export async function getEntries(params = {}) {
  // const query = new URLSearchParams();
  // if (params.search) query.set("search", params.search);
  // if (params.tag) query.set("tag", params.tag);
  // if (params.dateFrom) query.set("dateFrom", params.dateFrom);
  // if (params.dateTo) query.set("dateTo", params.dateTo);
  // if (params.page) query.set("page", params.page);
  // if (params.size) query.set("size", params.size);
  // const queryString = query.toString();
  // return request(`/entries${queryString ? `?${queryString}` : ""}`);

  await delay();
  let result = [...mockEntries];

  if (params.search) {
    const s = params.search.toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(s) ||
        e.description.toLowerCase().includes(s)
    );
  }
  if (params.tag) {
    result = result.filter((e) =>
      e.tags.some((t) => t.toLowerCase() === params.tag.toLowerCase())
    );
  }
  if (params.dateFrom) {
    result = result.filter((e) => e.date >= params.dateFrom);
  }
  if (params.dateTo) {
    result = result.filter((e) => e.date <= params.dateTo);
  }

  return result;
}

/**
 * GET /api/entries/:id
 * Fetch a single entry by ID
 */
export async function getEntryById(id) {
  // return request(`/entries/${id}`);

  await delay(100);
  const entry = mockEntries.find((e) => e.id === Number(id));
  if (!entry) throw new Error("Entry not found");
  return { ...entry };
}

/**
 * POST /api/entries
 * Create a new entry
 */
export async function createEntry(data) {
  // return request("/entries", {
  //   method: "POST",
  //   body: JSON.stringify(data),
  // });

  await delay(300);
  const entry = {
    ...data,
    id: nextId++,
    createdAt: new Date().toISOString(),
  };
  mockEntries.unshift(entry);
  return entry;
}

/**
 * PUT /api/entries/:id
 * Update an existing entry
 */
export async function updateEntry(id, data) {
  // return request(`/entries/${id}`, {
  //   method: "PUT",
  //   body: JSON.stringify(data),
  // });

  await delay(300);
  const idx = mockEntries.findIndex((e) => e.id === Number(id));
  if (idx === -1) throw new Error("Entry not found");
  mockEntries[idx] = { ...mockEntries[idx], ...data, id: Number(id) };
  return { ...mockEntries[idx] };
}

/**
 * DELETE /api/entries/:id
 * Delete an entry
 */
export async function deleteEntry(id) {
  // return request(`/entries/${id}`, { method: "DELETE" });

  await delay(200);
  const idx = mockEntries.findIndex((e) => e.id === Number(id));
  if (idx === -1) throw new Error("Entry not found");
  mockEntries.splice(idx, 1);
  return { message: "Entry deleted successfully" };
}

// ──────────────────────────────────────────────
//  Tags API
// ──────────────────────────────────────────────

/**
 * GET /api/tags
 * Fetch all unique tags
 */
export async function getTags() {
  // return request("/tags");

  await delay(100);
  const tagSet = new Set();
  mockEntries.forEach((e) => e.tags?.forEach((t) => tagSet.add(t)));
  return [...tagSet].sort();
}

// ──────────────────────────────────────────────
//  Stats API
// ──────────────────────────────────────────────

/**
 * GET /api/stats
 * Fetch dashboard statistics
 */
export async function getStats() {
  // return request("/stats");

  await delay(200);
  const today = new Date().toISOString().split("T")[0];
  const contributions = {};
  mockEntries.forEach((e) => {
    contributions[e.date] = (contributions[e.date] || 0) + 1;
  });
  const tagCounts = {};
  mockEntries.forEach((e) =>
    e.tags?.forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    })
  );
  return {
    totalEntries: mockEntries.length,
    entriesToday: contributions[today] || 0,
    currentStreak: 5,
    longestStreak: 12,
    thisMonthEntries: mockEntries.filter((e) =>
      e.date.startsWith(today.slice(0, 7))
    ).length,
    weeklyDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    topTags: Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    contributions,
  };
}

// ──────────────────────────────────────────────
//  Auth API
// ──────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
export async function login(credentials) {
  // return request("/auth/login", {
  //   method: "POST",
  //   body: JSON.stringify(credentials),
  // });

  await delay(400);
  if (!credentials.email || !credentials.password) {
    throw new Error("Email and password are required");
  }
  // Mock: accept any credentials
  return { ...mockUser, token: "mock-jwt-token-12345" };
}

/**
 * POST /api/auth/register
 */
export async function register(userData) {
  // return request("/auth/register", {
  //   method: "POST",
  //   body: JSON.stringify(userData),
  // });

  await delay(400);
  if (!userData.name || !userData.email || !userData.password) {
    throw new Error("All fields are required");
  }
  mockUser = {
    ...mockUser,
    name: userData.name,
    email: userData.email,
    bio: "",
    createdAt: new Date().toISOString(),
  };
  return { ...mockUser, token: "mock-jwt-token-67890" };
}

/**
 * POST /api/auth/logout
 */
export async function logout() {
  // return request("/auth/logout", { method: "POST" });

  await delay(100);
  return { message: "Logged out successfully" };
}

/**
 * PUT /api/auth/profile
 * Update user profile
 */
export async function updateProfile(data) {
  // return request("/auth/profile", {
  //   method: "PUT",
  //   body: JSON.stringify(data),
  // });

  await delay(300);
  mockUser = { ...mockUser, ...data };
  return { ...mockUser };
}

/**
 * GET /api/auth/profile
 * Fetch current user profile
 */
export async function getProfile() {
  // return request("/auth/profile");

  await delay(150);
  return { ...mockUser };
}
