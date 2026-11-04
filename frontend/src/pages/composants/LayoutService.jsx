// AdminLayout.jsx
import Layout from './Layout.jsx';
import TopBarService from './TopbarService.jsx';
import SidebarService from './SidebarService.jsx';

function LayoutService({ children }) {
  return <Layout TopBarComponent={TopBarService} SideBarComponent={SidebarService}>{children}</Layout>;
}
export default LayoutService;