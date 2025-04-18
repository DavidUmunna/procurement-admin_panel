import { Disclosure, Menu,Transition } from '@headlessui/react';
import { Bars4Icon, BellIcon, XMarkIcon, UserIcon, ClipboardDocumentListIcon, PlusCircleIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from "react-router-dom";
import React,{useState} from 'react';
import { useUser } from "./usercontext";
import user_img from "./assets/user.png";
import { motion } from 'framer-motion';
import { PanelLeft } from 'lucide-react';
import Sidebar from './Sidebar';


export const admin_roles=["procurement_officer","human_resources","internal_auditor","global_admin"]
const navigation = [
  { name: 'RequestList', to: '/requestlist', icon: ClipboardDocumentListIcon},
  { name: 'CreateRequest', to: '/createorder', icon: PlusCircleIcon },
  { name: 'AddUsers', to: '/addusers', icon: UserIcon, visibleTo:['admin','global_admin'] },
  { name: 'UserList', to: '/users', icon: UsersIcon, visibleTo:['admin','global_admin']}
  //{ name: 'Profile', to: '/dashboard', icon: UserIcon },
];
const sidebar=[
  {name:"Sidebar", to:'/sidebar', icon:PanelLeft}

]


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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="min-h-full w-full mb-4">
        <Disclosure as="nav" className="bg-gray-800  fixed top-0 left-0 w-full z-20 mb-3">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                  <div>
                      {sidebar
                        .filter(item => {
                          // If `visibleTo` exists, check if user has permission
                          if (item.visibleTo) {
                            return item.visibleTo.includes(user?.role);
                          }
                          // If no restriction, show it to everyone
                          return true;
                        })
                        .map(item => (
                          <Link
                            href={item.to}
                            onClick={() => setIsSidebarOpen(prev => !prev)}
                            key={item.name}
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                          >
                            <item.icon className="w-9 h-9 text-white" />
                          </Link>
                        ))}
                    </div>
                    <div className="shrink-0">
                      <img
                        alt="Halden"
                        src={require("./assets/admin-panel.png")}
                        className="h-8 w-8"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.filter(item => {
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
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                              isActive(item.to)
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 font-extrabold hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out'
                            )}
                          >
                            <item.icon className="h-6 w-6" />
                            
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                      <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={user_img} alt="" />
                        </Menu.Button>
                      </div>
                    
                      {/* Add transition wrapper here */}
                      <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                  <div className="-mr-2 flex md:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars4Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-150 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Disclosure.Panel className="md:hidden origin-top">
                  <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.to}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          isActive(item.to)
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium transition-all duration-300 ease-in-out'
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </Disclosure.Panel>
              </Transition>


            </>
          )}
        </Disclosure>

        {/* Bottom navigation bar for mobile */}
        <motion.div
          className="fixed bottom-0 left-0 w-full bg-gray-800 p-2 flex justify-around md:hidden z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {navigation.filter(item => {
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
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
                isActive(item.to) ? 'text-blue-400' : 'text-white hover:text-blue-300'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </motion.div>

        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Your content */}
          </div>
        </main>
      </div>
    </>
  );
}