import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function NumericFilter({ label, value, onChange, placeholder }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="number"
        placeholder={placeholder}
        className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}