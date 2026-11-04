// AdminLayout.jsx
import Layout from './Layout.jsx';
import TopBarDG from './TopbarDG.jsx';
import SidebarDG from './SidebarDG.jsx';

function LayoutDG({ children }) {
  return <Layout TopBarComponent={TopBarDG} SideBarComponent={SidebarDG}>{children}</Layout>;
}
export default LayoutDG;