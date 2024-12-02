import React, { useState, useEffect } from 'react';
import { Battery } from './types/battery';
import { BatteryGroupFilter } from './components/Filters/BatteryGroupFilter';
import { NumericFilter } from './components/Filters/NumericFilter';
import { BatteryTable } from './components/BatteryTable/BatteryTable';
import { BATTERY_TYPES } from './constants/batteryData';
import { searchBatteries } from './services/amazonApi';
import { checkAndUpdatePrices } from './services/priceUpdater';

function App() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [minAh, setMinAh] = useState("");
  const [minCCA, setMinCCA] = useState("");
  const [minCA, setMinCA] = useState("");
  const [minReserve, setMinReserve] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check and update prices if needed
        await checkAndUpdatePrices();
        
        // Fetch initial data
        const data = await searchBatteries({
          group: selectedGroup === 'all' ? undefined : selectedGroup,
          type: selectedType === 'all' ? undefined : selectedType,
          minAh: minAh ? Number(minAh) : undefined,
          minCCA: minCCA ? Number(minCCA) : undefined,
        });
        setBatteries(data);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [selectedGroup, selectedType, minAh, minCCA]);

  const handleSort = (column: string) => {
    const sorted = [...batteries].sort((a: any, b: any) => a[column] - b[column]);
    setBatteries(sorted);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Car Battery Price Comparison</h1>
          <p className="mt-2 text-gray-600">Find the best deals on car batteries with real-time pricing</p>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Section */}
          <aside className="lg:col-span-3 mb-6 lg:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
              <BatteryGroupFilter
                selectedGroup={selectedGroup}
                onChange={setSelectedGroup}
              />

              <fieldset>
                <legend className="text-sm font-medium mb-2">Battery Type</legend>
                <div className="space-y-2">
                  {BATTERY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`w-full px-4 py-2 rounded border transition-colors ${
                        selectedType === type.value
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'bg-white hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-4">
                <NumericFilter
                  label="Min Amp Hours (Ah)"
                  value={minAh}
                  onChange={setMinAh}
                  placeholder="e.g., 60"
                />
                <NumericFilter
                  label="Min Cold Cranking Amps"
                  value={minCCA}
                  onChange={setMinCCA}
                  placeholder="e.g., 650"
                />
                <NumericFilter
                  label="Min Cranking Amps"
                  value={minCA}
                  onChange={setMinCA}
                  placeholder="e.g., 810"
                />
                <NumericFilter
                  label="Min Reserve Capacity"
                  value={minReserve}
                  onChange={setMinReserve}
                  placeholder="Minutes"
                />
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <BatteryTable batteries={batteries} onSort={handleSort} />
            )}
          </main>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <a href="/faq" className="hover:underline">FAQ</a>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
            <a href="/terms" className="hover:underline">Terms of Service</a>
            <span className="flex gap-1">
              This site is supported by paid affiliate links.
              <a href="/about" className="text-blue-600 hover:underline">Learn more</a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;