import logo from "../../assets/logo.png";

export default function Header({ rightSlot }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 sm:rounded-t-2xl">
      <div className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="App logo"
          className="h-17 w-17 rounded-full object-contain"
        />
        <div>
          <h1 className="text-sm font-semibold text-gray-800">
            Bharatpur Tourist Assistant
          </h1>
          <p className="text-xs text-gray-400">Ask me anything, anytime</p>
        </div>
      </div>

      {rightSlot}
    </div>
  );
}