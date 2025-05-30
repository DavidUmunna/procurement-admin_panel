import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon,ClipboardDocumentListIcon, PlusCircleIcon,UserIcon,UsersIcon,ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState,useRef,useEffect } from 'react';
import { useUser } from "./usercontext";
import user_img from "./assets/user.png";
import { motion } from 'framer-motion';
import { PanelLeft } from 'lucide-react';
import Sidebar from './Sidebar';

export const admin_roles = ["procurement_officer", "human_resources", "internal_auditor", "global_admin","admin",
  "Financial_manager","waste_management_manager","accounts","waste_management_supervisor","Environmental_lab_manager","PVT_manager","HSE_officer"];

const navigation = [
  { name: 'Requests', to: '/requestlist', icon: ClipboardDocumentListIcon },
  { name: 'Create', to: '/createorder', icon: PlusCircleIcon },
  { name: 'Add Users', to: '/addusers', icon: UserIcon, visibleTo: ['admin', 'global_admin'] },
  { name: 'Users', to: '/users', icon: UsersIcon, visibleTo: ['admin', 'global_admin'] },
  {name:'Tasks', to:'/usertasks', icon: ClipboardDocumentCheckIcon }
];

const userNavigation = [
  { name: 'Your Profile', to: "/dashboard" },
  { name: 'Sign out', to: '/signout' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef=useRef(null)
  const buttonRef=useRef(null)
  //const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(true)

  const isActive = (path) => location.pathname === path;

  const filteredNav = navigation.filter(item => {
    if (item.visibleTo) return item.visibleTo.includes(user?.role);
    return true;
  });

  useEffect(()=>{
    function Handleclickoutside(event){
      if(sidebarRef.current && !sidebarRef.current.contains(event.target) &&
         buttonRef.current && !buttonRef.current.contains(event.target)){
          setIsSidebarOpen(false)
         }}
      if (isSidebarOpen){
        document.addEventListener("mousedown",Handleclickoutside)

      }else{
        document.removeEventListener("mousedown",Handleclickoutside)
      }

      return ()=>{
        document.removeEventListener("mousedown",Handleclickoutside)
      }

    
  },[isSidebarOpen])

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 w-full z-20">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  {/* Sidebar toggle (only for admin) */}
                  {admin_roles.includes(user?.role) && (
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="p-2 text-gray-400 hover:text-white mr-2"
                      aria-label="Toggle sidebar"
                    >
                      <PanelLeft className="h-6 w-6" />
                    </button>
                  )}

                  <div className="flex-shrink-0">
                    <img
                      alt="Company Logo"
                      src={require("./assets/admin-panel.png")}
                      className="h-8 w-8"
                    />
                  </div>

                  {/* Desktop Navigation */}
                  <div className="hidden md:block ml-4">
                    <div className="flex space-x-4">
                      {filteredNav.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(
                            isActive(item.to)
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none"
                      aria-label="Notifications"
                    >
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <Menu as="div" className="relative ml-3">
                      <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full" src={user_img} alt="User" />
                      </Menu.Button>
                      <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute top-4 right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.to}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>

                {/* Mobile menu button */}
                <div className="-mr-2 flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <Disclosure.Panel className="md:hidden bg-gray-800">
              {/*<div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    as={Link}
                    key={item.name}
                    to={item.to}
                    className={classNames(
                      isActive(item.to)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium flex items-center gap-2'
                    )}
                  >
                    
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>*/}
              <div className="border-t border-gray-700 pt-4 pb-3">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src={user_img} alt="User" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.name}</div>
                    <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2 ">
                
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                    as={Link}
                    
                    key={item.name}
                    to={item.to}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                  
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Mobile Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 w-full  bg-gray-800 p-2 flex  justify-around items-center border-t border-gray-700 z-50 md:hidden "
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {filteredNav.map((item) => (
          <button
            key={item.name}
            className="flex flex-col items-center justify-center p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            onClick={() => navigate(item.to)}
          >
            <item.icon className="h-6 w-6 text-gray-300 hover:text-white" />
            <span className="text-xs mt-1 text-gray-300">{item.name}</span>
          </button>
        ))}
      </motion.div>

      <Sidebar isOpen={isSidebarOpen} ref={sidebarRef} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
}