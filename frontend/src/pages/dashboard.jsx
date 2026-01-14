import Navbar from "../components/Navbar";
import { Button, Box } from "../components/UIElements";
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
      </div>
    </div>
  );
}

const WelcomeBox = () => {
  return (
    <Box className="flex justify-between items-center">
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
  return (
    <Box className="w-3/4 mt-4">
      <h2 className="font-bold text-md text-blue-800 p-2 border-b border-gray-300">
        Recent Entries
      </h2>
    </Box>
  );
}
