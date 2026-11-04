// AdminLayout.jsx
import Layout from './Layout.jsx';
import TopBar from './Topbar.jsx';
import Sidebar from './Sidebar.jsx';

function LayoutSecretaire({ children }) {
  return <Layout TopBarComponent={TopBar} SideBarComponent={Sidebar}>{children}</Layout>;
}
export default LayoutSecretaire;