import {  PlusSquare, UserPlus, Truck, Building2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useUser } from './usercontext';
export default function Sidebar({ isOpen, onClose }) {
  
  const {user}=useUser()
  const sidebar = [
    //{ name: "Inventory", to: "/#", icon: Boxes,visibleTo: ["procurement_officer","human_resources","internal_auditor","admin","global_admin"]  },
    { name: "Assets Management", to: "/assetsmanagement", icon: Briefcase,visibleTo: ["procurement_officer","admin","waste_management","human_resources","global_admin","PVT"] },
    { name: "Add Supplier", to: "/addsupplier", icon: UserPlus,visibleTo:["procurement_officer",'global_admin','admin'] },
    { name: "Supplier", to: "/supplierlist", icon: Truck,visibleTo:["procurement_officer",'global_admin','admin'] },
    { name:"Inventory management" ,to:"/inventorymanagement", icon:PlusSquare, visibleTo: ["procurement_officer","admin","waste_management","human_resources","global_admin","PVT"] },
    { name: "Department Assignment", to: "/departmentassignment", icon: Building2,visibleTo:["human_resources",'admin',"global_admin","PVT"] }
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
        {sidebar.filter(item => {
                          // If `visibleTo` exists, check if user has permission
                          if (item.visibleTo) {
                            return item.visibleTo.includes(user?.role);
                          }
                          // If no restriction, show it to everyone
                          return true;
                        }).map((item) => (
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
