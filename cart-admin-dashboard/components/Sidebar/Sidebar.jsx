'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  List,
  ShoppingCart,
  ChevronDown,
  HeartHandshake,
  MonitorCog,
  Truck,
  ClipboardClock,
  BookmarkX,
  UserRoundCog,
  PanelTop,
  Building2,
  BellRing,
  UserStar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('DEVICE');
    router.push('/login');
  };

  const toggleDropdown = (menuName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const menuSections = [

    {
      section: 'Product Management',
      items: [

        {
          name: 'Products',
          path: '/admin/products',
          icon: Package,
          subItems: [
            { name: 'Create Product', path: '/admin/products/create' },
            { name: 'Product List', path: '/admin/products/list' },

          ],
        },
        {
          name: 'Brands',
          path: '/admin/products',
          icon: Package,
          subItems: [
            { name: 'Create Brands', path: '/admin/brands/create' },
            { name: 'Brands List', path: '/admin/brands/list' },

          ],
        },
        {
          name: 'Models',
          path: '/admin/products',
          icon: Package,
          subItems: [
            { name: 'Create Models', path: '/admin/models/create' },
            { name: 'Models List', path: '/admin/models/list' },

          ],
        },
        {
          name: 'Product Types',
          path: '/admin/products',
          icon: Package,
          subItems: [
            { name: 'Create Product Types', path: '/admin/product-types/create' },
            { name: 'Product Types List', path: '/admin/product-types/list' },

          ],
        },

      ],
    },
    {
      section: 'Website Management',
      items: [
        {
          name: 'Registered Warranty',
          path: '/admin/registered-warranty',
          icon: Package,
          // subItems: [
          //   { name: 'Registered Warranty List', path: '/admin/registered-warranty/list' },

          // ],
        },
        {
          name: 'Stats Cards',
          path: '/admin/stats-cards',
          icon: Package,
          subItems: [
            { name: 'Create Stats Cards', path: '/admin/stats-cards/create' },
            { name: 'Stats Cards List', path: '/admin/stats-cards/list' },
          ],
        },
        {
          name: 'SEO Management',
          path: '/admin/seo',
          icon: PanelTop,
        },
      ]
    },

    {
      section: 'Green Grass Management',
      items: [
        {
          name: 'Green Grass Settings',
          path: '/admin/dealer-settings',
          icon: UserRoundCog,
          subItems: [
            { name: 'Dealership Requests', path: '/admin/dealership-requests/list' },
          ],
        },
      ],
    },

    {
      section: 'User Management',
      items: [
        {
          name: 'User Settings',
          path: '/admin/user-settings',
          icon: UserRoundCog,
          subItems: [
            { name: 'Create User', path: '/admin/user-settings/create' },
            { name: 'User List', path: '/admin/user-settings/list' },
          ],
        },
      ],
    },

    {
      section: 'Order Settings',
      items: [
        {
          name: 'Order Settings',
          path: '/admin/web-settings',
          icon: UserRoundCog,
          subItems: [
            { name: 'Order List', path: '/admin/orders/list' },

          ],
        },
      ],
    },
    {
      section: 'Account Settings',
      items: [
        {
          name: 'Profile Settings',
          path: '/admin/web-settings',
          icon: UserRoundCog,
          subItems: [
            { name: 'Roles & Permissions', path: '/admin/roles-permissions' },
            { name: 'Admin Settings', path: '/admin/settings' },
          ],
        },
      ],
    },

  ];

  return (
    <>
      <button
        className={`${isOpen ? "right-[200px] px-[10px] py-[-2px] pt-[4px] text-white bg-none border-none hover:bg-none" : "left-4 px-[10px] py-[5px] bg-white text-gray-800 border hover:bg-gray-100 rounded-md"} lg:hidden fixed top-4 z-50`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'X' : '☰'}
      </button>
      <div
        className={cn(
          'fixed top-0 left-0 h-screen bg-gray-900 text-white w-64 sm:w-72 p-4 sm:p-6 flex flex-col transition-transform duration-300 ease-in-out lg:transition-none lg:translate-x-0 z-40 overflow-y-auto',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-3 mb-6 sm:mb-8">
          <img src="https://elipsestudio.com/club-pro/assets/clubpro_logo.webp" alt="Qist Market" className='w-100 h-15' />

        </Link>
        <nav className="flex-1">
          {menuSections.map((section) => (
            <div key={section.section} className="mb-4 sm:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">
                {section.section}
              </h3>
              {section.items.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={cn(
                          'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 w-full text-left hover:bg-gray-700 rounded-lg transition-colors duration-200',
                          pathname === item.path || item.subItems.some((sub) => pathname === sub.path)
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300'
                        )}
                      >
                        <item.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span className="flex-1 text-sm sm:text-base">{item.name}</span>
                        <ChevronDown
                          className={cn(
                            'w-3 sm:w-4 h-3 sm:h-4 transition-transform duration-200',
                            openDropdowns[item.name] ? 'rotate-180' : ''
                          )}
                        />
                      </button>
                      {openDropdowns[item.name] && (
                        <div className="ml-6 sm:ml-8 mt-1 sm:mt-2 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.path}
                              className={cn(
                                'flex items-center gap-2 p-2 sm:p-3 hover:bg-gray-600 rounded-lg transition-colors duration-200 block text-xs sm:text-sm',
                                pathname === subItem.path ? 'bg-gray-600 text-white' : 'text-gray-300'
                              )}
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      className={cn(
                        'flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200',
                        pathname === item.path ? 'bg-gray-700 text-white' : 'text-gray-300'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="flex-1 text-sm sm:text-base">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="mt-auto text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3"
        >
          <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
          <span className="text-sm sm:text-base">Logout</span>
        </Button>
      </div>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}