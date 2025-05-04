// Layout.js
import Navbar from '../nav';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default Layout;
