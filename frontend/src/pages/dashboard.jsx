import Navbar from "../components/Navbar";
import { Button, Box } from "../components/UIElements";
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <WelcomeBox />
      <div className="flex">
        <SummaryBox />
        <CalendarBox />
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
    <Box className="w-1/4 flex flex-col justify-center">
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

const CalendarBox = () => {
  return (
    <Box className="w-3/4">
      <h2 className="font-bold text-md text-blue-800 p-2 border-b border-gray-300">
        Calendar View
      </h2>
    </Box>
  );
};
