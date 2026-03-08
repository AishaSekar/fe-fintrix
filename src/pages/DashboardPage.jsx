import SidebarComponent from "../components/SidebarComponent";
import TopNavbarComponent from "../components/TopNavbarComponent";

function DashboardPage() {
  return (
    <div className="d-flex min-vh-100 bg-light" style={{ overflow: "visible" }}>

      <SidebarComponent />

      <div className="flex-grow-1 d-flex flex-column">

        <TopNavbarComponent />

        <main className="p-4 flex-grow-1">

        </main>

      </div>

    </div>
  );
}

export default DashboardPage;