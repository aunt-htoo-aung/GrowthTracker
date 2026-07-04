import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box, LinkButton, Button } from "../components/UIElements";
import { useEntries } from "../context/EntryContext";
import {
  Settings,
  BookOpen,
  FileText,
  Plus,
  Flame,
  Calendar,
  TrendingUp,
  Inbox,
  Search,
  X,
  Edit2,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Dashboard() {
  const { contributions, loading, error } = useEntries();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-sm">Loading entries...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="text-sm font-medium mb-2">Failed to load entries</p>
            <p className="text-xs text-slate-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <WelcomeBox />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <SummaryBox />
          <CalendarBox>
            <ContributionCalendar data={contributions} />
          </CalendarBox>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <EntriesPanel />
          <StatsOverview />
        </div>
      </main>
    </div>
  );
}

/* ── Welcome ── */
const WelcomeBox = () => (
  <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-slate-800">Welcome Back, Aung!</h2>
      <p className="text-sm text-slate-500 mt-1">Track your daily learning progress</p>
    </div>
    <LinkButton to="/entry">
      <Plus size={16} />
      Add Today&apos;s Progress
    </LinkButton>
  </Box>
);

/* ── Summary Cards ── */
const SummaryBox = () => {
  const { entriesToday, currentStreak, totalEntries, thisMonthEntries } = useEntries();

  const stats = [
    { label: "Entries Today", value: entriesToday, icon: <FileText size={18} />, color: "text-blue-600 bg-blue-50" },
    { label: "Current Streak", value: `${currentStreak} ${currentStreak === 1 ? "day" : "days"}`, icon: <Flame size={18} />, color: "text-orange-600 bg-orange-50" },
    { label: "Total Entries", value: totalEntries, icon: <TrendingUp size={18} />, color: "text-green-600 bg-green-50" },
    { label: "This Month", value: thisMonthEntries, icon: <Calendar size={18} />, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3">
      {stats.map((s) => (
        <Box key={s.label} className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${s.color}`}>
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 truncate">{s.label}</p>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
          </div>
        </Box>
      ))}
    </div>
  );
};

/* ── Calendar ── */
const CalendarBox = ({ children }) => (
  <Box className="lg:col-span-3">
    <h2 className="font-semibold text-slate-800 mb-3">Contribution Calendar</h2>
    {children}
  </Box>
);

const levelColors = [
  "bg-gray-100",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
];

function ContributionCell({ count, date }) {
  const level = Math.min(count, 4);
  return (
    <div
      title={`${date} — ${count} ${count === 1 ? "entry" : "entries"}`}
      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${levelColors[level]} hover:ring-2 hover:ring-gray-300 cursor-pointer transition`}
    />
  );
}

function CalendarLegend() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
      <span>Less</span>
      {levelColors.map((c, i) => (
        <span key={i} className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${c} rounded-sm`} />
      ))}
      <span>More</span>
    </div>
  );
}

function getLast52Weeks() {
  const weeks = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  let currentWeek = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    currentWeek.push(new Date(d));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) weeks.push(currentWeek);
  return weeks;
}

function ContributionCalendar({ data }) {
  const weeks = getLast52Weeks();
  return (
    <div className="overflow-x-auto -mx-1">
      <div className="flex gap-[3px] min-w-[600px] sm:min-w-0">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-[3px]">
            {week.map((day) => {
              const dateStr = day.toISOString().split("T")[0];
              return (
                <ContributionCell
                  key={dateStr}
                  date={dateStr}
                  count={data[dateStr] || 0}
                />
              );
            })}
          </div>
        ))}
      </div>
      <CalendarLegend />
    </div>
  );
}

/* ── Entries Panel (Search + Filter + List) ── */
function EntriesPanel() {
  const { entries, deleteEntry, topTags } = useEntries();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // filter entries based on search, date range, and tag
  const filteredEntries = useMemo(() => {
    let result = entries;

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // date range
    if (dateFrom) {
      result = result.filter((e) => e.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((e) => e.date <= dateTo);
    }

    // tag filter
    if (filterTag) {
      result = result.filter((e) => e.tags?.includes(filterTag));
    }

    return result;
  }, [entries, search, dateFrom, dateTo, filterTag]);

  const displayEntries = showAll ? filteredEntries : filteredEntries.slice(0, 5);
  const hasMore = filteredEntries.length > 5 && !showAll;
  const hasActiveFilters = search || dateFrom || dateTo || filterTag;

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setFilterTag("");
  };

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      try {
        await deleteEntry(id);
      } catch (err) {
        alert("Failed to delete entry. Please try again.");
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  if (entries.length === 0) {
    return (
      <Box className="lg:col-span-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Entries</h2>
          <LinkButton to="/entry" variant="ghost" className="text-xs">
            <Plus size={14} /> New
          </LinkButton>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Inbox size={48} className="mb-3 text-slate-300" />
          <p className="text-sm font-medium">No entries yet</p>
          <p className="text-xs mt-1">Add your first progress entry to get started</p>
          <LinkButton to="/entry" className="mt-4 text-xs">
            <Plus size={14} /> Add Entry
          </LinkButton>
        </div>
      </Box>
    );
  }

  return (
    <Box className="lg:col-span-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <h2 className="font-semibold text-slate-800">
          {hasActiveFilters ? `Entries (${filteredEntries.length})` : "Entries"}
        </h2>
        <div className="flex items-center gap-2">
          <LinkButton to="/entry" variant="ghost" className="text-xs">
            <Plus size={14} /> New
          </LinkButton>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              showFilters || hasActiveFilters
                ? "bg-blue-50 text-blue-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Filter size={12} />
            Filters
            {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entries by title, description, or tag..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date From */}
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
            </div>
            {/* Date To */}
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
            </div>
            {/* Tag Filter */}
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Tag</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              >
                <option value="">All tags</option>
                {topTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Entry List */}
      <div className="space-y-3">
        {displayEntries.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Search size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">No entries found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          displayEntries.map((entry) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              confirmDelete={confirmDelete}
              onDelete={handleDelete}
              onEdit={() => navigate(`/entry/${entry.id}`)}
            />
          ))
        )}
      </div>

      {/* Show more / less */}
      {hasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Show all {filteredEntries.length} entries
        </button>
      )}
      {showAll && filteredEntries.length > 5 && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Show less
        </button>
      )}
    </Box>
  );
}

/* ── Single Entry Item ── */
function EntryItem({ entry, confirmDelete, onDelete, onEdit }) {
  const iconForEntry = (entry) => {
    if (entry.tags?.includes("Reading")) return <BookOpen size={18} />;
    if (entry.tags?.some((t) => ["Java", "React", "Python", "JavaScript", "TypeScript", "API"].includes(t)))
      return <Settings size={18} />;
    return <FileText size={18} />;
  };

  const colorForEntry = (entry) => {
    if (entry.tags?.includes("Reading")) return { bg: "bg-amber-500", tag: "bg-amber-50 text-amber-700" };
    if (entry.tags?.some((t) => ["Docker", "DevOps"].includes(t))) return { bg: "bg-emerald-600", tag: "bg-emerald-50 text-emerald-700" };
    return { bg: "bg-blue-600", tag: "bg-blue-50 text-blue-700" };
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const c = colorForEntry(entry);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition group">
      <div className={`p-2.5 rounded-lg text-white shrink-0 ${c.bg}`}>
        {iconForEntry(entry)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
            {entry.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400">{formatDate(entry.date)}</span>
            <button
              onClick={onEdit}
              className="p-1 rounded text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition opacity-0 group-hover:opacity-100"
              title="Edit entry"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className={`p-1 rounded transition opacity-0 group-hover:opacity-100 ${
                confirmDelete === entry.id
                  ? "text-red-600 bg-red-50"
                  : "text-slate-300 hover:text-red-600 hover:bg-red-50"
              }`}
              title={confirmDelete === entry.id ? "Click again to confirm" : "Delete entry"}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <p
          className="text-sm text-slate-500 mt-1 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: entry.description }}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {entry.tags?.map((tag) => (
            <span key={tag} className={`px-2 py-0.5 rounded-md text-xs font-medium ${c.tag}`}>
              {tag}
            </span>
          ))}
        </div>
        {entry.createdAt && (
          <p className="text-xs text-slate-300 mt-1.5">
            Created {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        {confirmDelete === entry.id && (
          <p className="text-xs text-red-500 mt-1">Click delete again to confirm</p>
        )}
      </div>
    </div>
  );
}

/* ── Stats Overview ── */
function StatsOverview() {
  const { weeklyDays, thisMonthEntries, longestStreak, topTags } = useEntries();

  return (
    <Box className="lg:col-span-1">
      <h2 className="font-semibold text-slate-800 mb-4">Stats Overview</h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <span className="text-sm text-slate-500">Weekly Goal</span>
          <span className="text-sm font-bold text-slate-800">{weeklyDays} / 7 days</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <span className="text-sm text-slate-500">This Month</span>
          <span className="text-sm font-bold text-slate-800">{thisMonthEntries} entries</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <span className="text-sm text-slate-500">Longest Streak</span>
          <span className="text-sm font-bold text-slate-800">{longestStreak} days</span>
        </div>

        {topTags.length > 0 && (
          <div>
            <p className="text-sm text-slate-500 mb-2">Top Tags</p>
            <div className="flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-100 cursor-pointer transition"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}
