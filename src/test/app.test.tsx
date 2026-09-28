import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { App } from '../App';

describe('NEXUS Application Comprehensive Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Executive Dashboard with greeting, key metrics, and charts', async () => {
    render(<App />);

    // Check header & greeting
    expect(screen.getAllByText(/Nazmus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Active Projects/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pipeline Leads/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pending Invoices/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Total Revenue/i).length).toBeGreaterThan(0);

    // Check chart, pipeline, and widgets
    expect(screen.getByText(/Revenue Velocity/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversion Pipeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Engagements/i)).toBeInTheDocument();
    expect(screen.getByText(/Today's Focus/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Deadlines/i)).toBeInTheDocument();
  });

  it('navigates seamlessly between workspace sections', async () => {
    render(<App />);

    // Click Leads Hub in sidebar
    const leadsButton = screen.getAllByRole('button', { name: /Leads Hub/i })[0];
    fireEvent.click(leadsButton);
    expect(screen.getByRole('heading', { level: 1, name: /Lead Generation Pipeline/i })).toBeInTheDocument();

    // Click Clients
    const clientsButton = screen.getAllByRole('button', { name: /Clients/i })[0];
    fireEvent.click(clientsButton);
    expect(screen.getByRole('heading', { level: 1, name: /Client Directory & Accounts/i })).toBeInTheDocument();

    // Click Projects
    const projectsButton = screen.getAllByRole('button', { name: /Projects/i })[0];
    fireEvent.click(projectsButton);
    expect(screen.getByRole('heading', { level: 1, name: /Active Projects & Milestones/i })).toBeInTheDocument();

    // Click Proposals
    const proposalsButton = screen.getAllByRole('button', { name: /Proposals/i })[0];
    fireEvent.click(proposalsButton);
    expect(screen.getByRole('heading', { level: 1, name: /Proposals & Pitches/i })).toBeInTheDocument();

    // Click Payments & Invoices
    const paymentsButton = screen.getAllByRole('button', { name: /Payments & Invoices/i })[0];
    fireEvent.click(paymentsButton);
    expect(screen.getByRole('heading', { level: 1, name: /Financial Ledger & Invoices/i })).toBeInTheDocument();

    // Click Tasks
    const tasksButton = screen.getAllByRole('button', { name: /Tasks/i })[0];
    fireEvent.click(tasksButton);
    expect(screen.getByRole('heading', { level: 1, name: /Actionable Tasks & Sprints/i })).toBeInTheDocument();

    // Click Calendar
    const calendarButton = screen.getAllByRole('button', { name: /Calendar & Agenda/i })[0];
    fireEvent.click(calendarButton);
    expect(screen.getByRole('heading', { level: 1, name: /Master Calendar & Agenda/i })).toBeInTheDocument();

    // Click Settings
    const settingsButton = screen.getAllByRole('button', { name: /Settings/i })[0];
    fireEvent.click(settingsButton);
    expect(screen.getByRole('heading', { level: 1, name: /Studio OS Settings/i })).toBeInTheDocument();
  });

  it('allows adding a new lead and converts lead to client & project', async () => {
    render(<App />);

    // Go to Leads
    fireEvent.click(screen.getAllByRole('button', { name: /Leads Hub/i })[0]);

    // Click Add New Lead
    fireEvent.click(screen.getByRole('button', { name: /Add New Lead/i }));

    // Fill form
    fireEvent.change(screen.getByLabelText(/Contact Name/i), {
      target: { value: 'Rachel Green' },
    });
    fireEvent.change(screen.getByLabelText(/Company \/ Studio/i), {
      target: { value: 'Central Perk Digital' },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'rachel@centralperk.com' },
    });
    fireEvent.change(screen.getByLabelText(/Proposed Service \/ Scope/i), {
      target: { value: 'Next.js E-Commerce Redesign' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Create Lead/i }));

    // Verify lead appears in the table
    expect(screen.getByText('Rachel Green')).toBeInTheDocument();
    expect(screen.getByText('Central Perk Digital')).toBeInTheDocument();

    // Click on the newly created lead to open detail drawer
    fireEvent.click(screen.getByText('Rachel Green'));

    // Verify conversion action exists
    const convertBtn = screen.getByRole('button', {
      name: /Convert to Client & Project/i,
    });
    expect(convertBtn).toBeInTheDocument();
    fireEvent.click(convertBtn);

    // Verify user is redirected to Projects view with the new project
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /Active Projects & Milestones/i })
      ).toBeInTheDocument();
      expect(
        screen.getAllByText(/Central Perk Digital - Next.js E-Commerce Redesign/i).length
      ).toBeGreaterThan(0);
    });
  });

  it('marks an invoice as paid and recalculates financials', async () => {
    render(<App />);

    // Go to Payments
    fireEvent.click(screen.getAllByRole('button', { name: /Payments & Invoices/i })[0]);
    expect(
      screen.getByRole('heading', { level: 1, name: /Financial Ledger & Invoices/i })
    ).toBeInTheDocument();

    // Find a "Mark Paid" button and click it
    const markPaidButtons = screen.getAllByRole('button', { name: /Mark Paid/i });
    expect(markPaidButtons.length).toBeGreaterThan(0);

    fireEvent.click(markPaidButtons[0]);

    // Check toast notification
    await waitFor(() => {
      expect(screen.getByText(/Payment Received!/i)).toBeInTheDocument();
    });
  });

  it('toggles task completion with satisfying state update', async () => {
    render(<App />);

    // Go to Tasks
    fireEvent.click(screen.getAllByRole('button', { name: /Tasks/i })[0]);
    expect(
      screen.getByRole('heading', { level: 1, name: /Actionable Tasks & Sprints/i })
    ).toBeInTheDocument();

    // Find task toggle buttons
    const markDoneButtons = screen.getAllByLabelText(/Mark as done/i);
    expect(markDoneButtons.length).toBeGreaterThan(0);

    fireEvent.click(markDoneButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Task Complete!/i)).toBeInTheDocument();
    });
  });

  it('opens and navigates global search with keyboard shortcut', async () => {
    render(<App />);

    // Press Cmd+K / Ctrl+K
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    // Verify modal is open
    const searchInput = screen.getByPlaceholderText(/Type to search across everything/i);
    expect(searchInput).toBeInTheDocument();

    // Type search
    fireEvent.change(searchInput, { target: { value: 'Vanguard' } });

    // Verify search results appear
    await waitFor(() => {
      const results = screen.getAllByText(/Vanguard HFT Analytics Platform 2.0/i);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  it('accepts a proposal and converts it into an active project', async () => {
    render(<App />);

    // Go to Proposals
    fireEvent.click(screen.getAllByRole('button', { name: /Proposals/i })[0]);
    expect(
      screen.getByRole('heading', { level: 1, name: /Proposals & Pitches/i })
    ).toBeInTheDocument();

    // Click on proposal PROP-2026-088 (Zenith BioSciences)
    const propCard = screen.getAllByText(/PROP-2026-088/i)[0];
    fireEvent.click(propCard);

    // Accept proposal button in modal
    const acceptBtn = screen.getByRole('button', {
      name: /Mark as Accepted & Start Project/i,
    });
    expect(acceptBtn).toBeInTheDocument();
    fireEvent.click(acceptBtn);

    // Verify redirected to projects
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 1, name: /Active Projects & Milestones/i })
      ).toBeInTheDocument();
    });
  });

  it('opens invoice receipt modal and shows billing voucher', async () => {
    render(<App />);

    // Go to Payments
    fireEvent.click(screen.getAllByRole('button', { name: /Payments & Invoices/i })[0]);

    // Click Receipt on first invoice
    const receiptBtns = screen.getAllByRole('button', { name: /Receipt/i });
    expect(receiptBtns.length).toBeGreaterThan(0);
    fireEvent.click(receiptBtns[0]);

    // Verify modal content
    expect(screen.getByText(/Commercial Invoice Receipt/i)).toBeInTheDocument();
    expect(screen.getByText(/Official billing voucher/i)).toBeInTheDocument();
    expect(screen.getByText(/Print \/ Save PDF/i)).toBeInTheDocument();
  });
});

