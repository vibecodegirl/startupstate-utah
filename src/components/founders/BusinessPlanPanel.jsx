import { useState } from 'react';
import { X, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BusinessPlanPanel({ onClose }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    owners: '',
    email: '',
    phone: '',
    address: '',
    elevatorPitch: '',
    problem: '',
    solution: '',
    pricePoint: '',
    targetCustomers: [],
    customerDetails: '',
    marketResearch: [],
    marketResearchDetails: '',
    marketingChannels: [],
    marketingDetails: '',
    financing: [],
    expenses: '',
    projectedRevenue: '',
    revenueDetails: '',
    primaryGoal: '',
    goalDetails: '',
    teamStructure: '',
    teamMembers: '',
    teamDetails: '',
    longTermVision: '',
    legalRequirements: '',
    legalResearched: '',
    finalStatement: '',
  });

  const steps = [
    { title: 'Business Identity', fields: ['businessName', 'owners', 'email', 'phone', 'address', 'elevatorPitch'] },
    { title: 'Problem & Solution', fields: ['problem', 'solution', 'pricePoint'] },
    { title: 'Target Market', fields: ['targetCustomers', 'customerDetails'] },
    { title: 'Competition & Research', fields: ['marketResearch', 'marketResearchDetails'] },
    { title: 'Marketing Strategy', fields: ['marketingChannels', 'marketingDetails'] },
    { title: 'Financing & Expenses', fields: ['financing', 'expenses'] },
    { title: 'Revenue Projection', fields: ['projectedRevenue', 'revenueDetails'] },
    { title: 'Milestones & Goals', fields: ['primaryGoal', 'goalDetails'] },
    { title: 'Team', fields: ['teamStructure', 'teamMembers', 'teamDetails'] },
    { title: 'Vision & Legal', fields: ['longTermVision', 'legalRequirements', 'legalResearched'] },
    { title: 'Final Statement', fields: ['finalStatement'] },
  ];

  const currentStep = steps[step];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSave = () => {
    sessionStorage.setItem('businessPlan', JSON.stringify(formData));
    alert('Business plan saved! You can access it from your founder profile.');
  };

  const downloadPDF = () => {
    const content = `
BUSINESS PLAN

1. Business Identity
Name: ${formData.businessName}
Owners: ${formData.owners}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${formData.address}
Elevator Pitch: ${formData.elevatorPitch}

2. Problem & Solution
Problem: ${formData.problem}
Solution: ${formData.solution}
Price Point: ${formData.pricePoint}

3. Target Market
Customers: ${formData.targetCustomers.join(', ')}
Details: ${formData.customerDetails}

4. Competition & Research
Research Methods: ${formData.marketResearch.join(', ')}
Details: ${formData.marketResearchDetails}

5. Marketing Strategy
Channels: ${formData.marketingChannels.join(', ')}
Details: ${formData.marketingDetails}

6. Financing & Expenses
Financing: ${formData.financing.join(', ')}
Expenses: ${formData.expenses}

7. Revenue
Projected Annual Revenue: ${formData.projectedRevenue}
Details: ${formData.revenueDetails}

8. Milestones & Goals
Primary Goal: ${formData.primaryGoal}
Details: ${formData.goalDetails}

9. Team
Structure: ${formData.teamStructure}
Members: ${formData.teamMembers}
Details: ${formData.teamDetails}

10. Vision & Legal
Vision: ${formData.longTermVision}
Legal Requirements: ${formData.legalRequirements}
Researched: ${formData.legalResearched}

11. Final Statement
${formData.finalStatement}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BusinessPlan_${formData.businessName || 'Draft'}.txt`;
    a.click();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
          <div>
            <h2 className="font-manrope font-bold text-lg text-foreground">Business Plan Generator</h2>
            <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <h3 className="font-manrope font-bold text-xl text-foreground">{currentStep.title}</h3>

          {step === 0 && (
            <div className="space-y-4">
              <input type="text" placeholder="Business Name *" value={formData.businessName} onChange={(e) => handleInputChange('businessName', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="text" placeholder="Business Owners" value={formData.owners} onChange={(e) => handleInputChange('owners', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input type="text" placeholder="Address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Elevator Pitch (1-2 sentences) *" value={formData.elevatorPitch} onChange={(e) => handleInputChange('elevatorPitch', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <textarea placeholder="Describe the problem your customers are facing *" value={formData.problem} onChange={(e) => handleInputChange('problem', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <textarea placeholder="What is your solution? What sets you apart? *" value={formData.solution} onChange={(e) => handleInputChange('solution', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <input type="text" placeholder="Can you provide this at a price customers will pay?" value={formData.pricePoint} onChange={(e) => handleInputChange('pricePoint', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Who are your ideal customers?</label>
              {['Individuals', 'Small Businesses', 'Corporations', 'Other'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.targetCustomers.includes(opt)} onChange={(e) => handleInputChange('targetCustomers', e.target.checked ? [...formData.targetCustomers, opt] : formData.targetCustomers.filter(c => c !== opt))} className="accent-primary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
              <textarea placeholder="Additional customer details" value={formData.customerDetails} onChange={(e) => handleInputChange('customerDetails', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">How will you research your market?</label>
              {['Online Research', 'Surveys & Interviews', 'Other'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.marketResearch.includes(opt)} onChange={(e) => handleInputChange('marketResearch', e.target.checked ? [...formData.marketResearch, opt] : formData.marketResearch.filter(c => c !== opt))} className="accent-primary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
              <textarea placeholder="Market research details" value={formData.marketResearchDetails} onChange={(e) => handleInputChange('marketResearchDetails', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">How will you reach your audience?</label>
              {['Social Media', 'Content Marketing', 'Paid Advertising', 'Other'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.marketingChannels.includes(opt)} onChange={(e) => handleInputChange('marketingChannels', e.target.checked ? [...formData.marketingChannels, opt] : formData.marketingChannels.filter(c => c !== opt))} className="accent-primary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
              <textarea placeholder="Marketing strategy details" value={formData.marketingDetails} onChange={(e) => handleInputChange('marketingDetails', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">How do you plan to finance?</label>
              {['Savings', 'Borrowing', 'Investors', 'Business Profits', 'Other'].map(opt => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.financing.includes(opt)} onChange={(e) => handleInputChange('financing', e.target.checked ? [...formData.financing, opt] : formData.financing.filter(c => c !== opt))} className="accent-primary" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
              <textarea placeholder="Major startup expenses (rent, equipment, inventory, etc)" value={formData.expenses} onChange={(e) => handleInputChange('expenses', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Projected annual revenue (Year 1)?</label>
              <select value={formData.projectedRevenue} onChange={(e) => handleInputChange('projectedRevenue', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select...</option>
                <option value="Less than $10,000">Less than $10,000</option>
                <option value="$10,000 - $50,000">$10,000 - $50,000</option>
                <option value="Over $50,000">Over $50,000</option>
              </select>
              <textarea placeholder="Revenue generation plan details" value={formData.revenueDetails} onChange={(e) => handleInputChange('revenueDetails', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Primary goal for next year?</label>
              <select value={formData.primaryGoal} onChange={(e) => handleInputChange('primaryGoal', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select...</option>
                <option value="Launch the business">Launch the business</option>
                <option value="Achieve profitability">Achieve profitability</option>
                <option value="Expand to new markets">Expand to new markets</option>
                <option value="Other">Other</option>
              </select>
              <textarea placeholder="Goal details" value={formData.goalDetails} onChange={(e) => handleInputChange('goalDetails', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Are you building alone or with partners?</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="team" value="Alone" checked={formData.teamStructure === 'Alone'} onChange={(e) => handleInputChange('teamStructure', e.target.value)} className="accent-primary" />
                  <span className="text-sm">Alone</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="team" value="With partners" checked={formData.teamStructure === 'With partners'} onChange={(e) => handleInputChange('teamStructure', e.target.value)} className="accent-primary" />
                  <span className="text-sm">With partners</span>
                </label>
              </div>
              <input type="text" placeholder="Partner names (if applicable)" value={formData.teamMembers} onChange={(e) => handleInputChange('teamMembers', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Team details & key roles" value={formData.teamDetails} onChange={(e) => handleInputChange('teamDetails', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium">Long-term vision?</label>
              <select value={formData.longTermVision} onChange={(e) => handleInputChange('longTermVision', e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select...</option>
                <option value="Supplemental income">Supplemental income</option>
                <option value="Full family support">Full family support</option>
                <option value="Build a unicorn">Build a unicorn</option>
              </select>
              <textarea placeholder="Legal requirements & licenses needed" value={formData.legalRequirements} onChange={(e) => handleInputChange('legalRequirements', e.target.value)} rows={3} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.legalResearched === 'Yes'} onChange={(e) => handleInputChange('legalResearched', e.target.checked ? 'Yes' : 'No')} className="accent-primary" />
                <span className="text-sm">Have you researched legal requirements?</span>
              </label>
            </div>
          )}

          {step === 10 && (
            <div className="space-y-4">
              <textarea placeholder="Final statement: Why will your business succeed in Utah?" value={formData.finalStatement} onChange={(e) => handleInputChange('finalStatement', e.target.value)} rows={5} className="w-full border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 shrink-0 gap-3">
          <Button variant="outline" onClick={handleBack} disabled={step === 0}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} className="gap-2">
              <Save size={14} /> Save
            </Button>
            {step === steps.length - 1 && (
              <Button variant="outline" onClick={downloadPDF} className="gap-2">
                <Download size={14} /> Export PDF
              </Button>
            )}
            <Button onClick={step === steps.length - 1 ? downloadPDF : handleNext} className="bg-primary hover:bg-green-dark text-white">
              {step === steps.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}