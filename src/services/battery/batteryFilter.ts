import { Battery } from '../../types/battery';
import { BatterySearchParams } from './types';

export function filterBatteries(batteries: Battery[], params: BatterySearchParams): Battery[] {
  return batteries.filter(battery => {
    if (params.group && params.group !== 'all' && battery.bciGroup !== params.group) return false;
    if (params.type && params.type !== 'all' && battery.type !== params.type) return false;
    if (params.minAh && battery.ampHours < params.minAh) return false;
    if (params.minCCA && battery.coldCrankingAmps < params.minCCA) return false;
    return true;
  });
}