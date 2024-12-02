import { useState } from 'react';
import { Battery } from '../../types/battery';
import { BatteryRow } from './BatteryRow';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  batteries: Battery[];
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

export function BatteryTable({ batteries }: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedBatteries = [...batteries].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    batteries.splice(0, batteries.length, ...sortedBatteries);
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUp size={16} className="inline text-gray-300" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp size={16} className="inline" /> : 
      <ArrowDown size={16} className="inline" />;
  };

  const SortableHeader = ({ label, field }: { label: string, field: string }) => (
    <th className="p-4 text-left border cursor-pointer hover:bg-gray-100" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">
        {label} {getSortIcon(field)}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <SortableHeader label="Price" field="price" />
            <th className="p-4 text-left border">Group (Dimensions)</th>
            <th className="p-4 text-left border">Capacity (Ah)</th>
            <SortableHeader label="CCA" field="coldCrankingAmps" />
            <SortableHeader label="CA" field="crankingAmps" />
            <SortableHeader label="Reserve" field="reserveCapacity" />
            <th className="p-4 text-left border">Type</th>
            <SortableHeader label="Warranty" field="warrantyYears" />
            <th className="p-4 text-left border">Buy</th>
          </tr>
        </thead>
        <tbody>
          {batteries.map((battery, index) => (
            <BatteryRow key={index} battery={battery} />
          ))}
        </tbody>
      </table>
    </div>
  );
}