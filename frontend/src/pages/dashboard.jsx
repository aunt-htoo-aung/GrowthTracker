import Navbar from "../components/Navbar";
import { Button } from "../components/UIElements";
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-5">
        <WelcomeBox />
      </div>
    </div>
  );
}

const WelcomeBox = () => {
  return (
    <div className="p-2 border border-gray-200 bg-white rounded-lg shadow-md flex justify-between items-center">
      <h2 className="font-bold mb-2">Welcome Back, Aung!</h2>
      <Button
        onClick={() => console.log("Button clicked!")}
        children="+ Add Today's Progress"
      />
    </div>
  );
};
