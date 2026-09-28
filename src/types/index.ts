export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type LeadSource =
  | 'Referral'
  | 'LinkedIn'
  | 'Twitter/X'
  | 'Inbound Website'
  | 'Dribbble'
  | 'Clutch'
  | 'Conference';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: LeadSource;
  service: string;
  estimatedValue: number;
  status: LeadStatus;
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  createdAt: string;
}

export type ClientStatus = 'Active' | 'Lead Won' | 'Retainer' | 'Completed' | 'Past';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar?: string;
  status: ClientStatus;
  totalRevenue: number;
  outstandingBalance: number;
  lastInteraction: string;
  notes: string;
  website?: string;
  billingAddress?: string;
  createdAt: string;
}

export type ProjectStatus =
  | 'Planning'
  | 'In Progress'
  | 'Review'
  | 'Waiting for Client'
  | 'Completed'
  | 'Archived';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Project {
  id: string;
  projectName: string;
  clientId: string;
  clientName: string;
  serviceType: string;
  startDate: string;
  deadline: string;
  budget: number;
  amountPaid: number;
  amountRemaining: number;
  progress: number; // 0 - 100
  status: ProjectStatus;
  priority: Priority;
  tasksCount: {
    total: number;
    completed: number;
  };
  notes: string;
  deliverables?: string[];
  createdAt: string;
}

export type ProposalStatus =
  | 'Draft'
  | 'Sent'
  | 'Viewed'
  | 'Negotiating'
  | 'Accepted'
  | 'Rejected';

export interface Proposal {
  id: string;
  proposalNumber: string;
  clientId?: string;
  clientName: string;
  leadId?: string;
  projectName: string;
  proposalValue: number;
  dateSent: string;
  expirationDate: string;
  status: ProposalStatus;
  scopeSummary: string;
  deliverables: string[];
  notes?: string;
  createdAt: string;
}

export type PaymentStatus = 'Pending' | 'Paid' | 'Overdue' | 'Partial';

export interface Payment {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  notes?: string;
  paymentMethod?: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  notes?: string;
  completedAt?: string;
  createdAt: string;
}

export type NotificationType =
  | 'payment_overdue'
  | 'deadline_soon'
  | 'followup_due'
  | 'proposal_expiring'
  | 'task_today'
  | 'lead_won';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  linkSection: 'payments' | 'projects' | 'leads' | 'proposals' | 'tasks';
  targetId?: string;
}

export interface UserSettings {
  freelancerName: string;
  agencyName: string;
  roleTitle: string;
  email: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD';
  hourlyRate: number;
  taxRate: number;
  invoicePrefix: string;
  emailAlerts: boolean;
  soundEffects: boolean;
}

export type NavigationSection =
  | 'overview'
  | 'leads'
  | 'clients'
  | 'projects'
  | 'proposals'
  | 'payments'
  | 'tasks'
  | 'calendar'
  | 'settings';
