import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Input, Select } from '../common/FormControls';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  DollarSign,
  User,
  CheckCircle2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDemoData,
    exportDataJSON,
    importDataJSON,
    addToast,
    financialMetrics,
  } = useApp();

  const [freelancerName, setFreelancerName] = useState(settings.freelancerName);
  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [roleTitle, setRoleTitle] = useState(settings.roleTitle);
  const [email, setEmail] = useState(settings.email);
  const [currency, setCurrency] = useState(settings.currency);
  const [hourlyRate, setHourlyRate] = useState(settings.hourlyRate.toString());
  const [taxRate, setTaxRate] = useState(settings.taxRate.toString());
  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      freelancerName,
      agencyName,
      roleTitle,
      email,
      currency: currency as any,
      hourlyRate: parseFloat(hourlyRate) || 150,
      taxRate: parseFloat(taxRate) || 10,
      invoicePrefix,
    });
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Backup Exported', 'Full workspace JSON downloaded to your device.', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Studio OS & Configuration
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            NEXUS PRO v2.4
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Branding, currency conventions, tax rates, and local database backup controls
        </p>
      </div>

      {/* Profile & Agency Branding */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
          <User className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-white">
            Professional Profile & Studio Identity
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Freelancer / Founder Name"
              value={freelancerName}
              onChange={(e) => setFreelancerName(e.target.value)}
              required
            />
            <Input
              label="Studio / Agency Brand Name"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Professional Role / Title"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              required
            />
            <Input
              label="Primary Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Select
              label="Operating Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'CAD', label: 'CAD ($)' },
              ]}
            />
            <Input
              label="Target Hourly ($/hr)"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            <Input
              label="Default Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
            <Input
              label="Invoice Number Prefix"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="neon" size="sm" type="submit">
              Save Profile Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* Data Sovereignty & Local Backup */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">
            Data Sovereignty & Local Backups
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          NEXUS operates with local-first persistence. All records are safely preserved in your browser's private local state. You can export complete backups, import them anytime, or reset to realistic demo seed data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            icon={<Download className="w-4 h-4 text-emerald-400" />}
          >
            Export Backup (JSON)
          </Button>

          <label className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-700/80 hover:border-slate-500 bg-slate-800/40 text-slate-200 hover:text-white cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import Backup (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            className="text-rose-400 hover:text-rose-300"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Reset to Demo Seed Data
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToDemoData}
        title="Reset to Initial Demo Data"
        message="This will re-seed your workspace with initial high-fidelity agency records (Aura Robotics, Vanguard FinTech, Lumina Health, etc.). Any local changes will be replaced."
        confirmText="Confirm Reset"
      />
    </div>
  );
};
