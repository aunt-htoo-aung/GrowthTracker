import Navbar from "../components/Navbar";
import { Button, Box } from "../components/UIElements";
import { Settings, BookOpen, FileText } from "lucide-react"; // Using lucide for icons

export default function Dashboard() {
  const contributions = {
    "2026-01-01": 1,
    "2026-01-02": 4,
    "2026-01-05": 2,
  };

  return (
    <div>
      <Navbar />
      <WelcomeBox />
      <div className="flex m-0">
        <SummaryBox />
        <CalendarBox>
          <ContributionCalendar data={contributions} />
        </CalendarBox>
      </div>
      <div className="flex m-0">
        <RecentEntries />
        <StatsOverview />
      </div>
    </div>
  );
}

const WelcomeBox = () => {
  return (
    <Box className="flex justify-between items-center mb-0">
      <h2 className="font-bold">Welcome Back, Aung!</h2>
      <Button
        onClick={() => console.log("Button clicked!")}
        children="+ Add Today's Progress"
      />
    </Box>
  );
};

const SummaryBox = () => {
  return (
    <Box className="w-1/4 flex flex-col h-fit">
      <div className="px-2 me-2">
        <h2 className="font-bold text-md text-blue-800 p-2">
          Today's Progress
        </h2>
        <p className="font-semibold text-sm border-t border-gray-300 p-2 pt-4">
          Entries Today : 2
        </p>
        <p className="font-semibold text-sm border-t border-gray-300 p-2">
          Current Streak : 5
        </p>
        <p className="font-semibold text-sm border-t border-gray-300 p-2">
          Total Entries : 120
        </p>
      </div>
    </Box>
  );
};

const CalendarBox = ({ children }) => {
  return (
    <Box className="w-3/4">
      <h2 className="font-bold text-md text-blue-800 p-2 border-b border-gray-300">
        Contribution Calender
      </h2>
      {children}
    </Box>
  );
};

const levelColors = [
  "bg-gray-200",
  "bg-green-200",
  "bg-green-400",
  "bg-green-600",
  "bg-green-800",
];

function ContributionCell({ count, date }) {
  const level = Math.min(count, 4);

  return (
    <div
      title={`${date} • ${count} entries`}
      className={`
        w-3 h-3 rounded-sm
        ${levelColors[level]}
        hover:ring-1 hover:ring-gray-400
        cursor-pointer
      `}
    />
  );
}
function CalendarLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
      <span>Less</span>
      <div className="flex gap-1">
        <span className={`w-3 h-3 ${levelColors[0]} rounded-sm`} />
        <span className={`w-3 h-3 ${levelColors[1]} rounded-sm`} />
        <span className={`w-3 h-3 ${levelColors[2]} rounded-sm`} />
        <span className={`w-3 h-3 ${levelColors[3]} rounded-sm`} />
        <span className={`w-3 h-3 ${levelColors[4]} rounded-sm`} />
      </div>
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
    <div className="p-3">
      <div className="flex gap-1">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1">
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

function RecentEntries() {
  const entries = [
    {
      id: 1,
      title: "Built REST API with Spring Boot",
      desc: "Developed a RESTful API using Spring Boot and Spring Data JPA.",
      tag: "Coding",
      status: "Completed",
      color: "blue",
      progress: 40,
      icon: <Settings size={20} />,
    },
    {
      id: 2,
      title: "Studied Java Streams",
      desc: "Learned about Java Streams and functional programming.",
      tag: "Learning",
      status: "1 hour",
      color: "green",
      progress: 60,
      icon: <FileText size={20} />,
    },
    {
      id: 3,
      title: 'Read "Clean Code" - Chapter 3',
      desc: "Started reading the chapter on Functions from Clean Code.",
      tag: "Reading",
      status: "In Progress",
      color: "orange",
      progress: 30,
      icon: <BookOpen size={20} />,
    },
  ];
  return (
    <Box className="w-3/4 mt-4">
      <h2 className="font-bold text-md text-blue-800 p-2 border-b border-gray-300">
        Recent Entries
      </h2>
      <div className="p-3">
        <p className="text-sm font-light mb-3">January 19, 2026</p>
        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-4 group">
              {/* Icon Container */}
              <div
                className={`p-3 rounded-lg text-white shadow-sm ${
                  entry.color === "blue"
                    ? "bg-blue-600"
                    : entry.color === "green"
                    ? "bg-green-600"
                    : "bg-orange-500"
                }`}
              >
                {entry.icon}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-slate-800 text-lg hover:underline cursor-pointer">
                    {entry.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        entry.color === "blue"
                          ? "bg-green-600 text-white"
                          : entry.color === "green"
                          ? "bg-lime-200 text-lime-800"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      {entry.tag} {entry.status && `| ${entry.status}`}
                    </span>
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="w-48 h-1.5 bg-slate-200 rounded-full mb-3">
                  <div
                    className={`h-full rounded-full ${
                      entry.color === "blue"
                        ? "bg-green-500"
                        : entry.color === "green"
                        ? "bg-blue-900"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${entry.progress}%` }}
                  ></div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {entry.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}

function StatsOverview() {
  return (
    <Box className="w-1/4 h-fit mt-4">
      <h2 className="text-md font-bold text-slate-800 p-2 mb-2 border-b border-gray-300">
        Stats Overview
      </h2>

      <div className="p-2">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <span className="text-slate-600">Weekly Goal:</span>
          <span className="font-bold text-slate-800">5 / 7 days</span>
        </div>

        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <span className="text-slate-600">This Month:</span>
          <span className="font-bold text-slate-800">18 Entries</span>
        </div>

        <div>
          <span className="text-slate-600 block mb-3">Top Tags:</span>
          <div className="flex flex-wrap gap-2">
            {["Java", "React", "SQL"].map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200 cursor-pointer transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Box>
  );
}
