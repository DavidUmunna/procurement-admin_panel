import { Boxes, PlusSquare, UserPlus, Truck, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  const sidebar = [
    { name: "Inventory", to: "/#", icon: Boxes },
    { name: "Create Inventory", to: "/#", icon: PlusSquare },
    { name: "Add Supplier", to: "/#", icon: UserPlus },
    { name: "Supplier", to: "/#", icon: Truck },
    { name: "Duplicates", to: "/#", icon: Copy }
  ];

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gray-800 text-white z-20 shadow-xl
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold tracking-wide">Utilities</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {sidebar.map((item) => (
          <Link
            to={item.to}
            key={item.name}
            className="flex items-center gap-3 p-2 rounded-md transition-all duration-200 hover:bg-gray-700 hover:scale-[1.02]"
          >
            <item.icon className="w-5 h-5 text-gray-300" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
