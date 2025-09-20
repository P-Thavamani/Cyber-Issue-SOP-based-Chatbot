
import React from 'react';
import { ComplianceStatus } from '../types';
import CheckIcon from './icons/CheckIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import XIcon from './icons/XIcon';

interface ComplianceIconProps {
  standard: 'NIST' | 'ISO' | 'GDPR';
  status: ComplianceStatus;
  explanation: string;
}

const ComplianceIcon: React.FC<ComplianceIconProps> = ({ standard, status, explanation }) => {
  const getIcon = () => {
    switch (status) {
      case ComplianceStatus.Compliant:
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case ComplianceStatus.PartiallyCompliant:
        return <ExclamationIcon className="h-5 w-5 text-yellow-500" />;
      case ComplianceStatus.NotCompliant:
        return <XIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getBorderColor = () => {
    switch (status) {
        case ComplianceStatus.Compliant: return 'border-green-500';
        case ComplianceStatus.PartiallyCompliant: return 'border-yellow-500';
        case ComplianceStatus.NotCompliant: return 'border-red-500';
        default: return 'border-gray-400';
    }
  }

  return (
    <div className="relative group flex flex-col items-center">
      <div className={`p-1 border-2 rounded-full ${getBorderColor()}`}>
        {getIcon()}
      </div>
      <span className="text-xs font-semibold mt-1">{standard}</span>
      <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 dark:bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <p className="font-bold">{standard} - {status}</p>
        <p>{explanation}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800 dark:border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default ComplianceIcon;
