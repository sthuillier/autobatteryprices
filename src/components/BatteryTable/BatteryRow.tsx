import { Battery } from '../../types/battery';

interface Props {
  battery: Battery;
}

export function BatteryRow({ battery }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="p-4 border">
        <div className="font-medium">${battery.price.toFixed(2)}</div>
      </td>
      <td className="p-4 border">
        <div className="font-medium">Group {battery.bciGroup}</div>
        <div className="text-sm text-gray-600">{battery.dimensions}mm</div>
      </td>
      <td className="p-4 border">{battery.ampHours}Ah</td>
      <td className="p-4 border">{battery.coldCrankingAmps}A</td>
      <td className="p-4 border">{battery.crankingAmps}A</td>
      <td className="p-4 border">{battery.reserveCapacity} min</td>
      <td className="p-4 border">{battery.type}</td>
      <td className="p-4 border">{battery.warrantyYears} years</td>
      <td className="p-4 border">
        <a
          href={battery.affiliateLink}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {battery.title}
        </a>
      </td>
    </tr>
  );
}