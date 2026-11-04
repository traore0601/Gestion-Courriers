// AdminLayout.jsx
import Layout from './Layout.jsx';
import TopBarAdmin from './TopbarAdmin.jsx';
import SidebarAdmin from './SidebarAdmin.jsx';

function AdminLayout({ children }) {
  return (
    <Layout TopBarComponent={TopBarAdmin} SideBarComponent={SidebarAdmin}>
      {children}
    </Layout>
  );
}

export default AdminLayout;