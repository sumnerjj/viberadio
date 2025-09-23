// Radio stream testing utility
import { RadioStation } from './radioStations';

interface TestResult {
  station: RadioStation;
  working: boolean;
  error?: string;
  responseTime?: number;
  httpStatus?: number;
}

export class RadioStreamTester {
  private timeout: number;
  private results: TestResult[] = [];

  constructor(timeout = 8000) {
    this.timeout = timeout;
  }

  // Test a single station URL
  async testStation(station: RadioStation): Promise<TestResult> {
    console.log(`🧪 Testing: ${station.name} (${station.url})`);

    const startTime = Date.now();

    try {
      // First, try a HEAD request to check if the URL is accessible
      const headTest = await this.testWithFetch(station.url);

      if (headTest.working) {
        // If HEAD request works, try audio loading test
        const audioTest = await this.testWithAudio(station.url);
        const responseTime = Date.now() - startTime;

        const result: TestResult = {
          station,
          working: audioTest.working,
          error: audioTest.error,
          responseTime,
          httpStatus: headTest.httpStatus
        };

        this.results.push(result);
        return result;
      } else {
        // If HEAD request fails, try fallback URL if available
        if (station.fallbackUrl) {
          console.log(`🔄 Trying fallback URL for ${station.name}`);
          const fallbackTest = await this.testWithAudio(station.fallbackUrl);
          const responseTime = Date.now() - startTime;

          const result: TestResult = {
            station,
            working: fallbackTest.working,
            error: fallbackTest.error || headTest.error,
            responseTime,
            httpStatus: headTest.httpStatus
          };

          this.results.push(result);
          return result;
        } else {
          const responseTime = Date.now() - startTime;
          const result: TestResult = {
            station,
            working: false,
            error: headTest.error,
            responseTime,
            httpStatus: headTest.httpStatus
          };

          this.results.push(result);
          return result;
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: TestResult = {
        station,
        working: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      };

      this.results.push(result);
      return result;
    }
  }

  // Test URL accessibility with fetch
  private async testWithFetch(url: string): Promise<{ working: boolean; error?: string; httpStatus?: number }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // Bypass CORS for testing
      });

      clearTimeout(timeoutId);

      return {
        working: true,
        httpStatus: response.status
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { working: false, error: 'Request timeout' };
        }
        return { working: false, error: error.message };
      }
      return { working: false, error: 'Unknown fetch error' };
    }
  }

  // Test URL with Audio element (more reliable for audio streams)
  private async testWithAudio(url: string): Promise<{ working: boolean; error?: string }> {
    return new Promise((resolve) => {
      const audio = new Audio();
      let resolved = false;

      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          audio.removeEventListener('canplay', onCanPlay);
          audio.removeEventListener('error', onError);
          audio.removeEventListener('loadstart', onLoadStart);
          audio.src = '';
        }
      };

      const onCanPlay = () => {
        cleanup();
        resolve({ working: true });
      };

      const onError = (e: any) => {
        cleanup();
        const error = e.target?.error;
        let errorMessage = 'Audio load failed';

        if (error) {
          switch (error.code) {
            case 1: errorMessage = 'MEDIA_ERR_ABORTED'; break;
            case 2: errorMessage = 'MEDIA_ERR_NETWORK'; break;
            case 3: errorMessage = 'MEDIA_ERR_DECODE'; break;
            case 4: errorMessage = 'MEDIA_ERR_SRC_NOT_SUPPORTED'; break;
            default: errorMessage = 'Unknown media error';
          }
        }

        resolve({ working: false, error: errorMessage });
      };

      const onLoadStart = () => {
        // Give the stream some time to start loading
        setTimeout(() => {
          if (!resolved) {
            cleanup();
            resolve({ working: false, error: 'Load timeout' });
          }
        }, this.timeout);
      };

      audio.addEventListener('canplay', onCanPlay);
      audio.addEventListener('error', onError);
      audio.addEventListener('loadstart', onLoadStart);

      try {
        audio.src = url;
        audio.load();
      } catch (error) {
        cleanup();
        resolve({
          working: false,
          error: error instanceof Error ? error.message : 'Failed to load audio'
        });
      }
    });
  }

  // Test all stations in a list
  async testAllStations(stations: RadioStation[], maxConcurrent = 5): Promise<TestResult[]> {
    console.log(`🚀 Starting test of ${stations.length} radio stations...`);
    this.results = [];

    // Process stations in batches to avoid overwhelming the browser
    for (let i = 0; i < stations.length; i += maxConcurrent) {
      const batch = stations.slice(i, i + maxConcurrent);
      console.log(`📦 Testing batch ${Math.floor(i / maxConcurrent) + 1}/${Math.ceil(stations.length / maxConcurrent)}`);

      const batchPromises = batch.map(station => this.testStation(station));
      await Promise.all(batchPromises);

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return this.results;
  }

  // Generate a report of test results
  generateReport(): string {
    const working = this.results.filter(r => r.working);
    const notWorking = this.results.filter(r => !r.working);

    let report = `\n📊 RADIO STREAM TEST REPORT\n`;
    report += `=================================\n`;
    report += `Total stations tested: ${this.results.length}\n`;
    report += `✅ Working: ${working.length} (${((working.length / this.results.length) * 100).toFixed(1)}%)\n`;
    report += `❌ Not working: ${notWorking.length} (${((notWorking.length / this.results.length) * 100).toFixed(1)}%)\n\n`;

    report += `✅ WORKING STATIONS:\n`;
    report += `=====================\n`;
    working.forEach(result => {
      report += `${result.station.name} - ${result.station.genre} (${result.responseTime}ms)\n`;
      report += `   URL: ${result.station.url}\n\n`;
    });

    report += `❌ NOT WORKING STATIONS:\n`;
    report += `========================\n`;
    notWorking.forEach(result => {
      report += `${result.station.name} - ${result.station.genre}\n`;
      report += `   Error: ${result.error}\n`;
      report += `   URL: ${result.station.url}\n\n`;
    });

    return report;
  }

  // Get only working stations
  getWorkingStations(): RadioStation[] {
    return this.results
      .filter(r => r.working)
      .map(r => ({ ...r.station, tested: true, working: true }));
  }

  // Get stations that failed
  getFailedStations(): RadioStation[] {
    return this.results
      .filter(r => !r.working)
      .map(r => ({ ...r.station, tested: true, working: false, error: r.error }));
  }
}

// Utility function to run tests from browser console
export async function testAllRadioStations(stations: RadioStation[]): Promise<TestResult[]> {
  const tester = new RadioStreamTester();
  const results = await tester.testAllStations(stations);

  console.log(tester.generateReport());

  return results;
}

export default RadioStreamTester;