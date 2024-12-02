import { BATTERY_GROUPS } from '../../constants/batteryData';

interface Props {
  selectedGroup: string;
  onChange: (value: string) => void;
}

export function BatteryGroupFilter({ selectedGroup, onChange }: Props) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium mb-2">Battery Group Size</legend>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange('all')}
          className={`w-full h-32 px-4 py-2 rounded border transition-colors ${
            selectedGroup === 'all'
              ? 'bg-blue-500 text-white border-blue-600'
              : 'bg-white hover:bg-gray-50 border-gray-300'
          }`}
        >
          <span className="text-lg font-medium">All Sizes</span>
        </button>
        {BATTERY_GROUPS.map((group) => (
          <button
            key={group.value}
            onClick={() => onChange(group.value)}
            className={`w-full h-32 px-4 py-2 rounded border transition-colors flex flex-col items-center justify-center ${
              selectedGroup === group.value
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white hover:bg-gray-50 border-gray-300'
            }`}
          >
            <span className="text-lg font-medium mb-2">Group {group.label}</span>
            <span className="text-sm">{group.dimensions}mm</span>
            <span className="text-xs mt-1">Fits: {group.cars}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}