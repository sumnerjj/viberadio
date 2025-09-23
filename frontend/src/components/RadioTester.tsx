import React, { useState } from 'react';
import { RadioStreamTester } from '../utils/testRadioStreams';
import RADIO_STATIONS, { RadioStation } from '../utils/radioStations';

interface TestResult {
  station: RadioStation;
  working: boolean;
  error?: string;
  responseTime?: number;
}

export const RadioTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTesting, setCurrentTesting] = useState<string>('');

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const tester = new RadioStreamTester(6000); // 6 second timeout

    console.log('🎯 Starting radio stream tests...');

    // Test stations one by one to show progress
    const allResults: TestResult[] = [];

    for (let i = 0; i < RADIO_STATIONS.length; i++) {
      const station = RADIO_STATIONS[i];
      setCurrentTesting(station.name);
      setProgress(((i + 1) / RADIO_STATIONS.length) * 100);

      try {
        const result = await tester.testStation(station);
        allResults.push(result as TestResult);
        setResults([...allResults]);

        console.log(
          result.working
            ? `✅ ${station.name} - OK (${result.responseTime}ms)`
            : `❌ ${station.name} - FAILED: ${result.error}`
        );
      } catch (error) {
        console.error(`💥 Error testing ${station.name}:`, error);
        allResults.push({
          station,
          working: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        setResults([...allResults]);
      }
    }

    setCurrentTesting('');
    setIsRunning(false);

    // Generate final report
    const working = allResults.filter(r => r.working);
    const failed = allResults.filter(r => !r.working);

    console.log('\n🎊 TESTING COMPLETE!');
    console.log(`✅ Working: ${working.length}/${allResults.length} stations`);
    console.log(`❌ Failed: ${failed.length}/${allResults.length} stations`);
    console.log('\n📋 WORKING STATIONS LIST:');

    working.forEach((result, index) => {
      console.log(`${index + 1}. ${result.station.name} (${result.station.genre}) - ${result.responseTime}ms`);
    });

    // Generate TypeScript code for working stations
    const workingStationsCode = generateWorkingStationsCode(working.map(r => r.station));
    console.log('\n💻 COPY THIS CODE FOR WORKING STATIONS:');
    console.log(workingStationsCode);
  };

  const generateWorkingStationsCode = (workingStations: RadioStation[]): string => {
    let code = '// Verified working radio stations\nconst workingStations = {\n';

    workingStations.forEach((station, index) => {
      const freq = 550 + (index * 50); // Distribute across AM band
      code += `  ${freq}: {\n`;
      code += `    name: "${station.name}",\n`;
      code += `    url: "${station.url}",\n`;
      if (station.fallbackUrl) {
        code += `    fallbackUrl: "${station.fallbackUrl}",\n`;
      }
      code += `    genre: "${station.genre}",\n`;
      code += `    country: "${station.country}",\n`;
      code += `    language: "${station.language}"\n`;
      code += `  },\n`;
    });

    code += '};';
    return code;
  };

  const workingStations = results.filter(r => r.working);
  const failedStations = results.filter(r => !r.working);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'monospace',
      background: '#1a1a1a',
      color: '#fff',
      minHeight: '100vh'
    }}>
      <h2>🧪 Radio Stream Tester</h2>
      <p>Testing {RADIO_STATIONS.length} radio stations...</p>

      <button
        onClick={runTests}
        disabled={isRunning}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isRunning ? '#666' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isRunning ? '🔄 Testing...' : '▶️ Start Test'}
      </button>

      {isRunning && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            Progress: {progress.toFixed(1)}% ({results.length}/{RADIO_STATIONS.length})
          </div>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#333',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }} />
          </div>
          {currentTesting && (
            <div style={{ marginTop: '10px', color: '#ffd700' }}>
              Testing: {currentTesting}
            </div>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>📊 Results Summary</h3>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: '#4ade80' }}>
              ✅ Working: {workingStations.length} stations
            </div>
            <div style={{ color: '#f87171' }}>
              ❌ Failed: {failedStations.length} stations
            </div>
            <div style={{ color: '#fbbf24' }}>
              📈 Success Rate: {((workingStations.length / results.length) * 100).toFixed(1)}%
            </div>
          </div>

          <h4>✅ Working Stations ({workingStations.length})</h4>
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#0f3f0f',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            {workingStations.map((result, index) => (
              <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                <span style={{ color: '#4ade80' }}>✅</span> {result.station.name}
                <span style={{ color: '#888' }}> - {result.station.genre}</span>
                <span style={{ color: '#fbbf24' }}> ({result.responseTime}ms)</span>
              </div>
            ))}
          </div>

          <h4>❌ Failed Stations ({failedStations.length})</h4>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#3f0f0f',
            padding: '10px',
            borderRadius: '5px'
          }}>
            {failedStations.map((result, index) => (
              <div key={index} style={{ marginBottom: '5px', fontSize: '12px' }}>
                <span style={{ color: '#f87171' }}>❌</span> {result.station.name}
                <span style={{ color: '#888' }}> - {result.error}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RadioTester;