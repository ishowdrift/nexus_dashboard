import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';

// View modules
import { OverviewView } from './components/dashboard/OverviewView';
import { LeadsView } from './components/leads/LeadsView';
import { ClientsView } from './components/clients/ClientsView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ProposalsView } from './components/proposals/ProposalsView';
import { PaymentsView } from './components/payments/PaymentsView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { currentSection } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewView />;
      case 'leads':
        return <LeadsView />;
      case 'clients':
        return <ClientsView />;
      case 'projects':
        return <ProjectsView />;
      case 'proposals':
        return <ProposalsView />;
      case 'payments':
        return <PaymentsView />;
      case 'tasks':
        return <TasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080A0E] text-[#E2E8F0] selection:bg-emerald-500/20 selection:text-emerald-300 font-sans">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Section Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {renderSection()}
        </main>
      </div>

      {/* Global Command Search (Ctrl+K) */}
      <CommandPalette />

      {/* Non-intrusive Toasts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
