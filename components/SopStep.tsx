import React, { useState } from 'react';
import { SopStepType } from '../types';
import ComplianceIcon from './ComplianceIcon';

interface SopStepProps {
  step: SopStepType;
  stepNumber: number;
  isHovered: boolean;
}

const SopStep: React.FC<SopStepProps> = ({ step, stepNumber, isHovered }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 p-4 border transition-colors duration-300 animate-fadeIn ${
        isHovered ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex justify-between items-start">
        <div className='flex-grow'>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-left w-full">
                <div className="flex items-center">
                    <span className="text-blue-500 font-bold mr-3">{stepNumber}.</span>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{step.title}</h3>
                    <span className="ml-2 text-gray-400 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                </div>
            </button>
            <div 
              className="overflow-hidden transition-all duration-500 ease-in-out"
              style={{ maxHeight: isExpanded ? '500px' : '0' }}
            >
                <p className="mt-2 text-gray-600 dark:text-gray-400 pl-7">{step.description}</p>
            </div>
        </div>
        <div className="flex space-x-4 ml-4">
            <ComplianceIcon standard="NIST" status={step.compliance.nist.status} explanation={step.compliance.nist.explanation} />
            <ComplianceIcon standard="ISO" status={step.compliance.iso.status} explanation={step.compliance.iso.explanation} />
            <ComplianceIcon standard="GDPR" status={step.compliance.gdpr.status} explanation={step.compliance.gdpr.explanation} />
        </div>
      </div>
    </div>
  );
};

export default SopStep;