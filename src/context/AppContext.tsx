import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Lead,
  Client,
  Project,
  Proposal,
  Payment,
  Task,
  AppNotification,
  UserSettings,
  NavigationSection,
  LeadStatus,
  ProjectStatus,
  ProposalStatus,
  PaymentStatus,
  TaskStatus,
} from '../types';
import {
  initialSettings,
  initialLeads,
  initialClients,
  initialProjects,
  initialProposals,
  initialPayments,
  initialTasks,
  initialNotifications,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & UI
  currentSection: NavigationSection;
  setCurrentSection: (section: NavigationSection) => void;
  navigateTo: (section: NavigationSection, targetId?: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  
  // Selection drawers / modals
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProposalId: string | null;
  setSelectedProposalId: (id: string | null) => void;
  selectedInvoiceReceiptId: string | null;
  setSelectedInvoiceReceiptId: (id: string | null) => void;

  // Data
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  proposals: Proposal[];
  payments: Payment[];
  tasks: Task[];
  notifications: AppNotification[];
  settings: UserSettings;

  // Toast & sound/confetti
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  triggerConfetti: () => void;

  // Lead actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  changeLeadStatus: (id: string, status: LeadStatus) => void;
  convertLeadToClientAndProject: (leadId: string) => { clientId: string; projectId: string };

  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'tasksCount'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  changeProjectStatus: (id: string, status: ProjectStatus) => void;
  updateProjectProgress: (id: string, progress: number) => void;

  // Proposal actions
  addProposal: (proposal: Omit<Proposal, 'id' | 'createdAt'>) => Proposal;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;
  changeProposalStatus: (id: string, status: ProposalStatus) => void;
  acceptProposal: (id: string) => void;

  // Payment actions
  addPayment: (payment: Omit<Payment, 'id'>) => Payment;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  markPaymentPaid: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;

  // Settings & System
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetToDemoData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;

  // Computed Financial Metrics
  financialMetrics: {
    totalRevenue: number;
    pendingAmount: number;
    overdueAmount: number;
    paidAmount: number;
    activeProjectsCount: number;
    pipelineValue: number;
    totalLeadsCount: number;
    completedTasksCount: number;
    pendingTasksCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'nexus_business_os_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or seed data
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
      return saved ? JSON.parse(saved) : initialLeads;
    } catch {
      return initialLeads;
    }
  });

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
      return saved ? JSON.parse(saved) : initialClients;
    } catch {
      return initialClients;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_proposals`);
      return saved ? JSON.parse(saved) : initialProposals;
    } catch {
      return initialProposals;
    }
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_payments`);
      return saved ? JSON.parse(saved) : initialPayments;
    } catch {
      return initialPayments;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialSettings;
    } catch {
      return initialSettings;
    }
  });

  // UI state
  const [currentSection, setCurrentSection] = useState<NavigationSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState<boolean>(false);

  // Selection drawers / modals
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [selectedInvoiceReceiptId, setSelectedInvoiceReceiptId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
      localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
      localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projects));
      localStorage.setItem(`${STORAGE_KEY}_proposals`, JSON.stringify(proposals));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [leads, clients, projects, proposals, payments, tasks, notifications, settings]);

  // Keyboard shortcut for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B'],
        disableForReducedMotion: true,
      });
    } catch {
      // safe fallback
    }
  };

  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (section: NavigationSection, targetId?: string) => {
    setCurrentSection(section);
    if (targetId) {
      if (section === 'leads') setSelectedLeadId(targetId);
      if (section === 'clients') setSelectedClientId(targetId);
      if (section === 'projects') setSelectedProjectId(targetId);
      if (section === 'proposals') setSelectedProposalId(targetId);
      if (section === 'payments') setSelectedInvoiceReceiptId(targetId);
    }
  };

  // Lead actions
  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>): Lead => {
    const id = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...newLeadData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    addToast('Lead Added', `${newLead.name} (${newLead.company}) added to pipeline.`, 'success');
    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
    addToast('Lead Updated', 'Changes saved successfully.', 'info');
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    if (selectedLeadId === id) setSelectedLeadId(null);
    addToast('Lead Removed', 'Lead was removed from the pipeline.', 'info');
  };

  const changeLeadStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
    if (status === 'Won') {
      triggerConfetti();
      addToast('Deal Won! 🎉', 'Lead marked as won. Ready to convert to client & project.', 'success');
    } else {
      addToast('Status Updated', `Lead status changed to ${status}.`, 'info');
    }
  };

  const convertLeadToClientAndProject = (leadId: string): { clientId: string; projectId: string } => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const clientId = `client-${Date.now()}`;
    const projectId = `proj-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 30);
    const deadline = deadlineDate.toISOString().split('T')[0];

    const newClient: Client = {
      id: clientId,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      status: 'Active',
      totalRevenue: lead.estimatedValue,
      outstandingBalance: lead.estimatedValue,
      lastInteraction: today,
      notes: `Converted from lead (${lead.service}). ${lead.notes}`,
      createdAt: today,
    };

    const newProject: Project = {
      id: projectId,
      projectName: `${lead.company} - ${lead.service}`,
      clientId,
      clientName: lead.company,
      serviceType: lead.service,
      startDate: today,
      deadline,
      budget: lead.estimatedValue,
      amountPaid: 0,
      amountRemaining: lead.estimatedValue,
      progress: 5,
      status: 'Planning',
      priority: 'High',
      tasksCount: { total: 3, completed: 0 },
      notes: `Project generated from converted lead. Initial kickoff milestone required.`,
      deliverables: ['Discovery Brief', 'Architecture & Prototype', 'Final Handover'],
      createdAt: today,
    };

    // Auto-generate kickoff task
    const kickoffTask: Task = {
      id: `task-${Date.now()}`,
      title: `Project Kickoff & Technical Architecture with ${lead.name}`,
      projectId,
      projectName: newProject.projectName,
      clientId,
      clientName: lead.company,
      priority: 'High',
      dueDate: today,
      status: 'To Do',
      notes: 'Send welcome packet, repository access, and schedule kickoff video call.',
      createdAt: today,
    };

    setClients((prev) => [newClient, ...prev]);
    setProjects((prev) => [newProject, ...prev]);
    setTasks((prev) => [kickoffTask, ...prev]);
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'Won' } : l))
    );

    triggerConfetti();
    addToast(
      'Lead Converted Successfully! 🚀',
      `Created client "${lead.company}" and project "${newProject.projectName}".`,
      'success'
    );

    return { clientId, projectId };
  };

  // Client actions
  const addClient = (newClientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const id = `client-${Date.now()}`;
    const newClient: Client = {
      ...newClientData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    addToast('Client Added', `${newClient.company} is now an active client.`, 'success');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, ...updates } : client))
    );
    addToast('Client Updated', 'Client profile updated.', 'info');
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
    if (selectedClientId === id) setSelectedClientId(null);
    addToast('Client Removed', 'Client record removed.', 'info');
  };

  // Project actions
  const addProject = (
    newProjectData: Omit<Project, 'id' | 'createdAt' | 'tasksCount'>
  ): Project => {
    const id = `proj-${Date.now()}`;
    const newProject: Project = {
      ...newProjectData,
      id,
      tasksCount: { total: 0, completed: 0 },
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProject, ...prev]);
    addToast('Project Created', `${newProject.projectName} initiated.`, 'success');
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj))
    );
    addToast('Project Updated', 'Project specifications saved.', 'info');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id));
    if (selectedProjectId === id) setSelectedProjectId(null);
    addToast('Project Removed', 'Project record removed.', 'info');
  };

  const changeProjectStatus = (id: string, status: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const progress = status === 'Completed' ? 100 : p.progress;
          return { ...p, status, progress };
        }
        return p;
      })
    );
    if (status === 'Completed') {
      triggerConfetti();
      addToast('Project Completed! 🏆', 'All milestones achieved.', 'success');
    } else {
      addToast('Project Status Changed', `Status updated to ${status}.`, 'info');
    }
  };

  const updateProjectProgress = (id: string, progress: number) => {
    const clamped = Math.min(100, Math.max(0, progress));
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const status = clamped === 100 ? 'Completed' : p.status;
          return { ...p, progress: clamped, status };
        }
        return p;
      })
    );
    if (clamped === 100) {
      triggerConfetti();
      addToast('100% Progress! 🎉', 'Project marked as completed.', 'success');
    }
  };

  // Proposal actions
  const addProposal = (newProposalData: Omit<Proposal, 'id' | 'createdAt'>): Proposal => {
    const id = `prop-${Date.now()}`;
    const newProposal: Proposal = {
      ...newProposalData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProposals((prev) => [newProposal, ...prev]);
    addToast('Proposal Created', `${newProposal.proposalNumber} created.`, 'success');
    return newProposal;
  };

  const updateProposal = (id: string, updates: Partial<Proposal>) => {
    setProposals((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, ...updates } : prop))
    );
    addToast('Proposal Updated', 'Proposal changes saved.', 'info');
  };

  const deleteProposal = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
    if (selectedProposalId === id) setSelectedProposalId(null);
    addToast('Proposal Deleted', 'Proposal record removed.', 'info');
  };

  const changeProposalStatus = (id: string, status: ProposalStatus) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    if (status === 'Accepted') {
      triggerConfetti();
      addToast('Proposal Accepted! 🥂', 'Client approved the proposal scope & budget.', 'success');
    } else {
      addToast('Status Changed', `Proposal status is now ${status}.`, 'info');
    }
  };

  const acceptProposal = (id: string) => {
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) return;

    changeProposalStatus(id, 'Accepted');

    // Auto-create or link project
    const projectId = `proj-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 45);

    const newProject: Project = {
      id: projectId,
      projectName: proposal.projectName,
      clientId: proposal.clientId || 'client-custom',
      clientName: proposal.clientName,
      serviceType: 'Contract Project',
      startDate: today,
      deadline: deadlineDate.toISOString().split('T')[0],
      budget: proposal.proposalValue,
      amountPaid: 0,
      amountRemaining: proposal.proposalValue,
      progress: 0,
      status: 'Planning',
      priority: 'High',
      tasksCount: { total: proposal.deliverables.length, completed: 0 },
      notes: `Initiated from ${proposal.proposalNumber}: ${proposal.scopeSummary}`,
      deliverables: proposal.deliverables,
      createdAt: today,
    };

    setProjects((prev) => [newProject, ...prev]);
    addToast(
      'New Project Initiated',
      `"${proposal.projectName}" created from accepted proposal.`,
      'success'
    );
  };

  // Payment actions
  const addPayment = (newPaymentData: Omit<Payment, 'id'>): Payment => {
    const id = `pay-${Date.now()}`;
    const newPayment: Payment = { ...newPaymentData, id };
    setPayments((prev) => [newPayment, ...prev]);

    // Update project amount remaining/paid
    if (newPayment.projectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === newPayment.projectId && newPayment.status === 'Paid') {
            const amountPaid = p.amountPaid + newPayment.amount;
            const amountRemaining = Math.max(0, p.budget - amountPaid);
            return { ...p, amountPaid, amountRemaining };
          }
          return p;
        })
      );
    }

    addToast('Invoice Created', `${newPayment.invoiceNumber} ($${newPayment.amount.toLocaleString()}) logged.`, 'success');
    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Invoice Updated', 'Payment record updated.', 'info');
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    if (selectedInvoiceReceiptId === id) setSelectedInvoiceReceiptId(null);
    addToast('Invoice Removed', 'Invoice removed.', 'info');
  };

  const markPaymentPaid = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const payment = payments.find((p) => p.id === id);
    if (!payment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'Paid', paidDate: today } : p
      )
    );

    // Update project financials
    if (payment.projectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === payment.projectId && payment.status !== 'Paid') {
            const amountPaid = p.amountPaid + payment.amount;
            const amountRemaining = Math.max(0, p.budget - amountPaid);
            return { ...p, amountPaid, amountRemaining };
          }
          return p;
        })
      );
    }

    // Update client balance
    if (payment.clientId) {
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === payment.clientId) {
            const outstandingBalance = Math.max(0, c.outstandingBalance - payment.amount);
            const totalRevenue = c.totalRevenue + payment.amount;
            return { ...c, outstandingBalance, totalRevenue };
          }
          return c;
        })
      );
    }

    triggerConfetti();
    addToast('Payment Received! 💰', `${payment.invoiceNumber} marked as Paid.`, 'success');
  };

  // Task actions
  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const id = `task-${Date.now()}`;
    const newTask: Task = {
      ...newTaskData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);

    // Update project tasks count
    if (newTask.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === newTask.projectId
            ? {
                ...p,
                tasksCount: {
                  ...p.tasksCount,
                  total: p.tasksCount.total + 1,
                },
              }
            : p
        )
      );
    }

    addToast('Task Added', `"${newTask.title}" added to tasks.`, 'success');
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast('Task Saved', 'Task updated.', 'info');
  };

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (task?.projectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === task.projectId
            ? {
                ...p,
                tasksCount: {
                  total: Math.max(0, p.tasksCount.total - 1),
                  completed:
                    task.status === 'Done'
                      ? Math.max(0, p.tasksCount.completed - 1)
                      : p.tasksCount.completed,
                },
              }
            : p
        )
      );
    }
    addToast('Task Deleted', 'Task removed.', 'info');
  };

  const toggleTaskStatus = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const nextStatus: TaskStatus = task.status === 'Done' ? 'To Do' : 'Done';
    const isNowDone = nextStatus === 'Done';

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: nextStatus,
              completedAt: isNowDone ? today : undefined,
            }
          : t
      )
    );

    // Update project tasks count
    if (task.projectId) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === task.projectId) {
            const completed = isNowDone
              ? p.tasksCount.completed + 1
              : Math.max(0, p.tasksCount.completed - 1);
            return {
              ...p,
              tasksCount: { ...p.tasksCount, completed },
            };
          }
          return p;
        })
      );
    }

    if (isNowDone) {
      triggerConfetti();
      addToast('Task Complete! ✓', `"${task.title}" finished.`, 'success');
    }
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All marked as read.', 'info');
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    addToast('Settings Saved', 'Preferences updated successfully.', 'success');
  };

  const resetToDemoData = () => {
    setLeads(initialLeads);
    setClients(initialClients);
    setProjects(initialProjects);
    setProposals(initialProposals);
    setPayments(initialPayments);
    setTasks(initialTasks);
    setNotifications(initialNotifications);
    setSettings(initialSettings);
    localStorage.clear();
    addToast('Reset Complete', 'Workspace restored to initial demo data.', 'info');
  };

  const exportDataJSON = () => {
    const data = {
      leads,
      clients,
      projects,
      proposals,
      payments,
      tasks,
      settings,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.leads) setLeads(data.leads);
      if (data.clients) setClients(data.clients);
      if (data.projects) setProjects(data.projects);
      if (data.proposals) setProposals(data.proposals);
      if (data.payments) setPayments(data.payments);
      if (data.tasks) setTasks(data.tasks);
      if (data.settings) setSettings(data.settings);
      addToast('Data Imported', 'Workspace data successfully imported.', 'success');
      return true;
    } catch (err) {
      addToast('Import Failed', 'Invalid JSON backup format.', 'error');
      return false;
    }
  };

  // Computed Financial Metrics
  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'Pending')
    .reduce((acc, p) => acc + p.amount, 0);

  const overdueAmount = payments
    .filter((p) => p.status === 'Overdue')
    .reduce((acc, p) => acc + p.amount, 0);

  const paidAmount = totalRevenue;

  const activeProjectsCount = projects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Review' || p.status === 'Planning'
  ).length;

  const pipelineValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((acc, l) => acc + l.estimatedValue, 0);

  const totalLeadsCount = leads.length;

  const completedTasksCount = tasks.filter((t) => t.status === 'Done').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'Done').length;

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        navigateTo,
        sidebarCollapsed,
        setSidebarCollapsed,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickCreateOpen,
        setIsQuickCreateOpen,

        selectedLeadId,
        setSelectedLeadId,
        selectedClientId,
        setSelectedClientId,
        selectedProjectId,
        setSelectedProjectId,
        selectedProposalId,
        setSelectedProposalId,
        selectedInvoiceReceiptId,
        setSelectedInvoiceReceiptId,

        leads,
        clients,
        projects,
        proposals,
        payments,
        tasks,
        notifications,
        settings,

        toasts,
        addToast,
        removeToast,
        triggerConfetti,

        addLead,
        updateLead,
        deleteLead,
        changeLeadStatus,
        convertLeadToClientAndProject,

        addClient,
        updateClient,
        deleteClient,

        addProject,
        updateProject,
        deleteProject,
        changeProjectStatus,
        updateProjectProgress,

        addProposal,
        updateProposal,
        deleteProposal,
        changeProposalStatus,
        acceptProposal,

        addPayment,
        updatePayment,
        deletePayment,
        markPaymentPaid,

        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,

        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,

        updateSettings,
        resetToDemoData,
        exportDataJSON,
        importDataJSON,

        financialMetrics: {
          totalRevenue,
          pendingAmount,
          overdueAmount,
          paidAmount,
          activeProjectsCount,
          pipelineValue,
          totalLeadsCount,
          completedTasksCount,
          pendingTasksCount,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
