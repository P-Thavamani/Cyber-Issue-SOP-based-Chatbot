import React from 'react';

// Fix: The 'value' prop is made optional and its rendering is conditional to resolve errors when the component is used without a value.
interface DashboardCardProps {
  title: string;
  value?: string | number;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex flex-col animate-fadeIn">
      <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      {(value != null && value !== '') && <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-gray-100">{value}</p>}
      <div className="mt-4 flex-grow">{children}</div>
    </div>
  );
};

export default DashboardCard;
