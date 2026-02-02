import TopBar from './TopBar';
import Header from './Header';

import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <MobileHeader />
      <Header />

      
      <main className="flex-1">{children}</main>
      
      {/* Mobile only bottom nav */}
      <Footer/>
      <MobileBottomNav />
    </div>
  );
}