import React from 'react';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Setup' },
    { id: 2, label: 'Ideation' },
    { id: 3, label: 'Workspace' },
    { id: 4, label: 'Headlines' },
    { id: 5, label: 'Final' }
  ];

  return (
    <div className="progress-container">
      <div className="stepper">
        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isComplete = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className={`step ${isActive ? 'active' : ''}`}>
                <div className="step-circle">
                  {isComplete ? '✓' : step.id}
                </div>
                <div className="step-label">{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-line ${isComplete ? 'active' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
