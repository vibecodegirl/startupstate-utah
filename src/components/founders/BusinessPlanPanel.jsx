import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BusinessPlanPanel({ plan = [], onUpdateResource }) {
  const [expandedSteps, setExpandedSteps] = useState([0]);

  const toggleStep = (index) => {
    setExpandedSteps(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleResourceStatus = (stepIndex, resourceIndex, newStatus) => {
    onUpdateResource?.(stepIndex, resourceIndex, newStatus);
  };

  const completeStep = (stepIndex) => {
    onUpdateResource?.(stepIndex, null, null, true);
  };

  if (!plan || plan.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <p className="text-muted-foreground">No personalized plan yet. Complete the founder quiz to get started.</p>
      </div>
    );
  }

  const completedSteps = plan.filter(s => s.completed).length;
  const totalSteps = plan.length;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">Overall Progress</h3>
          <span className="text-sm font-bold text-primary">{completedSteps}/{totalSteps}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Plan Steps */}
      <div className="space-y-3">
        {plan.map((step, stepIndex) => (
          <div
            key={stepIndex}
            className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Step Header */}
            <button
              onClick={() => toggleStep(stepIndex)}
              className="w-full flex items-start gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
            >
              {step.completed ? (
                <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
              ) : (
                <Circle size={20} className="text-muted-foreground shrink-0 mt-0.5" />
              )}

              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {step.number}. {step.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{step.description}</p>
              </div>

              {expandedSteps.includes(stepIndex) ? (
                <ChevronUp size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              ) : (
                <ChevronDown size={18} className="text-muted-foreground shrink-0 mt-0.5" />
              )}
            </button>

            {/* Step Resources */}
            {expandedSteps.includes(stepIndex) && (
              <div className="border-t border-border p-4 space-y-3 bg-muted/20">
                {step.resources && step.resources.length > 0 ? (
                  <>
                    {step.resources.map((resource, resIndex) => (
                      <div
                        key={resIndex}
                        className="bg-white rounded-lg border border-border p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              {resource.name}
                              <ExternalLink size={12} />
                            </a>
                            {resource.notes && (
                              <p className="text-xs text-muted-foreground mt-1">{resource.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <select
                              value={resource.status || 'saved'}
                              onChange={(e) => toggleResourceStatus(stepIndex, resIndex, e.target.value)}
                              className="text-xs px-2 py-1 border border-border rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option value="saved">Saved</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="not_helpful">Not Helpful</option>
                            </select>
                            <button
                              onClick={() => toggleResourceStatus(stepIndex, resIndex, null)}
                              className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-destructive"
                              title="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {resource.status && (
                          <div className="text-xs">
                            {resource.status === 'completed' && (
                              <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                ✓ Completed
                              </span>
                            )}
                            {resource.status === 'in_progress' && (
                              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                                ⟳ In Progress
                              </span>
                            )}
                            {resource.status === 'not_helpful' && (
                              <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                ✕ Not Helpful
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No resources added yet.</p>
                )}

                {/* Mark Step Complete */}
                {!step.completed && (
                  <Button
                    onClick={() => completeStep(stepIndex)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm mt-2"
                  >
                    Mark Step Complete
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}