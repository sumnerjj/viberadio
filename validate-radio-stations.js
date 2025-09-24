#!/usr/bin/env node

// Radio Station Validation Script
// Tests radio streams from Radio Browser API and curated list

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Curated stations (from our existing list)
const CURATED_STATIONS = [
  { name: "Radio Paradise Main", url: "https://stream.radioparadise.com/mp3-128", genre: "Eclectic", country: "USA" },
  { name: "SomaFM Groove Salad", url: "https://ice1.somafm.com/groovesalad-256-mp3", genre: "Ambient", country: "USA" },
  { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3", genre: "Alternative", country: "USA" },
  { name: "WFMU", url: "https://stream0.wfmu.org/freeform-128k", genre: "Freeform", country: "USA" },
  { name: "Jazz24", url: "https://live.wostreaming.net/direct/ppm-jazz24mp3-ibc3", genre: "Jazz", country: "USA" },
  { name: "Classical MPR", url: "https://classical.streamguys1.com/classical-128k", genre: "Classical", country: "USA" },
  { name: "NTS Radio 1", url: "https://stream-relay-geo.ntslive.net/stream", genre: "Electronic", country: "UK" },
  { name: "BBC Radio 1", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one", genre: "Pop", country: "UK" },
  { name: "FIP France", url: "https://direct.fipradio.fr/live/fip-midfi.mp3", genre: "Eclectic", country: "France" },
  { name: "Radio Swiss Jazz", url: "https://stream.srg-ssr.ch/m/rsj/mp3_128", genre: "Jazz", country: "Switzerland" }
];

// Fetch stations from Radio Browser API
async function fetchRadioBrowserStations() {
  return new Promise((resolve, reject) => {
    const url = 'https://de1.api.radio-browser.info/json/stations/search?hidebroken=true&is_https=true&order=clickcount&reverse=true&limit=200';

    https.get(url, {
      headers: {
        'User-Agent': 'RadioApp/1.0'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const stations = JSON.parse(data);
          const mapped = stations.map(station => ({
            name: station.name || 'Unknown Station',
            url: station.url_resolved || station.url,
            genre: Array.isArray(station.tags) ? station.tags.join(', ') : (station.tags || 'Unknown'),
            country: station.country || 'Unknown',
            language: station.language || 'Unknown'
          }));
          resolve(mapped);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Test a single radio station URL
function testRadioStation(station, timeout = 8000) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    try {
      const parsedUrl = new URL(station.url);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const req = client.request({
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'HEAD',
        timeout: timeout,
        headers: {
          'User-Agent': 'RadioApp/1.0',
          'Accept': 'audio/*,*/*;q=0.1'
        }
      }, (res) => {
        const responseTime = Date.now() - startTime;

        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({
            station,
            working: true,
            statusCode: res.statusCode,
            responseTime,
            contentType: res.headers['content-type']
          });
        } else {
          resolve({
            station,
            working: false,
            statusCode: res.statusCode,
            responseTime,
            error: `HTTP ${res.statusCode}`
          });
        }
      });

      req.on('error', (error) => {
        const responseTime = Date.now() - startTime;
        resolve({
          station,
          working: false,
          responseTime,
          error: error.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        const responseTime = Date.now() - startTime;
        resolve({
          station,
          working: false,
          responseTime,
          error: 'Request timeout'
        });
      });

      req.end();
    } catch (error) {
      const responseTime = Date.now() - startTime;
      resolve({
        station,
        working: false,
        responseTime,
        error: error.message
      });
    }
  });
}

// Test stations in batches
async function testStations(stations, batchSize = 10) {
  console.log(`🚀 Testing ${stations.length} radio stations...`);

  const results = [];

  for (let i = 0; i < stations.length; i += batchSize) {
    const batch = stations.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(stations.length / batchSize);

    console.log(`📦 Testing batch ${batchNumber}/${totalBatches} (${batch.length} stations)`);

    const batchPromises = batch.map(station => testRadioStation(station));
    const batchResults = await Promise.all(batchPromises);

    results.push(...batchResults);

    // Show progress
    const working = results.filter(r => r.working).length;
    const tested = results.length;
    console.log(`   Progress: ${tested}/${stations.length} tested, ${working} working (${((working/tested)*100).toFixed(1)}%)`);

    // Small delay between batches
    if (i + batchSize < stations.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;
}

// Generate report
function generateReport(results) {
  const working = results.filter(r => r.working);
  const notWorking = results.filter(r => !r.working);

  console.log('\n📊 RADIO STATION VALIDATION REPORT');
  console.log('=================================');
  console.log(`Total stations tested: ${results.length}`);
  console.log(`✅ Working: ${working.length} (${((working.length / results.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Not working: ${notWorking.length} (${((notWorking.length / results.length) * 100).toFixed(1)}%)`);

  console.log('\n✅ WORKING STATIONS:');
  console.log('==================');
  working.forEach((result, index) => {
    console.log(`${index + 1}. ${result.station.name} (${result.station.genre})`);
    console.log(`   Country: ${result.station.country} | Response: ${result.responseTime}ms | Status: ${result.statusCode}`);
    console.log(`   URL: ${result.station.url}`);
    console.log('');
  });

  if (notWorking.length > 0) {
    console.log('\n❌ FAILED STATIONS (first 20):');
    console.log('=============================');
    notWorking.slice(0, 20).forEach((result, index) => {
      console.log(`${index + 1}. ${result.station.name} (${result.station.genre})`);
      console.log(`   Country: ${result.station.country} | Error: ${result.error}`);
      console.log(`   URL: ${result.station.url}`);
      console.log('');
    });

    if (notWorking.length > 20) {
      console.log(`... and ${notWorking.length - 20} more failed stations`);
    }
  }

  return { working, notWorking };
}

// Generate TypeScript code for working stations
function generateStationMapCode(workingStations) {
  const frequencies = [550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890, 900, 910, 920, 930, 940, 950, 960, 970, 980, 990, 1000, 1010, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 1100, 1110, 1120, 1130, 1140, 1150, 1160, 1170, 1180, 1190, 1200, 1210, 1220, 1230, 1240, 1250, 1260, 1270, 1280, 1290, 1300, 1310, 1320, 1330, 1340, 1350, 1360, 1370, 1380, 1390, 1400, 1410, 1420, 1430, 1440, 1450, 1460, 1470, 1480, 1490, 1500, 1510, 1520, 1530, 1540, 1550, 1560, 1570, 1580, 1590, 1600];

  console.log('\n🚀 TYPESCRIPT CODE FOR RADIO TUNER:');
  console.log('==================================');

  const stationsToUse = workingStations.slice(0, Math.min(workingStations.length, frequencies.length));

  console.log('const stationMap: Record<number, StationInfo> = {');

  stationsToUse.forEach((result, index) => {
    const station = result.station;
    const frequency = frequencies[index];

    console.log(`  ${frequency}: {`);
    console.log(`    name: "${station.name.replace(/"/g, '\\"')}",`);
    console.log(`    url: "${station.url}",`);
    console.log(`    fallbackUrl: undefined,`);
    console.log(`    genre: "${station.genre}",`);
    console.log(`    country: "${station.country}"`);
    console.log(`  },`);
  });

  console.log('};');
}

// Main function
async function main() {
  try {
    console.log('🎵 Radio Station Validation Starting...');
    console.log('========================================');

    // Fetch stations from Radio Browser API
    console.log('📡 Fetching stations from Radio Browser API...');
    const radioBrowserStations = await fetchRadioBrowserStations();
    console.log(`   Found ${radioBrowserStations.length} stations from Radio Browser API`);

    // Combine with curated stations
    const allStations = [...CURATED_STATIONS, ...radioBrowserStations];

    // Remove duplicates based on URL
    const uniqueStations = allStations.filter((station, index, array) =>
      array.findIndex(s => s.url === station.url) === index
    );

    console.log(`📻 Combined station list: ${uniqueStations.length} unique stations`);
    console.log(`   (${CURATED_STATIONS.length} curated + ${radioBrowserStations.length} from API)`);

    // Test all stations
    const results = await testStations(uniqueStations);

    // Generate report
    const { working, notWorking } = generateReport(results);

    // Generate TypeScript code for working stations
    if (working.length > 0) {
      generateStationMapCode(working);
    }

    // Write results to file
    const reportData = {
      timestamp: new Date().toISOString(),
      totalTested: results.length,
      working: working.length,
      failed: notWorking.length,
      successRate: ((working.length / results.length) * 100).toFixed(1) + '%',
      workingStations: working.map(r => r.station),
      failedStations: notWorking.map(r => ({ ...r.station, error: r.error }))
    };

    require('fs').writeFileSync(
      'radio-validation-results.json',
      JSON.stringify(reportData, null, 2)
    );

    console.log('\n💾 Results saved to radio-validation-results.json');
    console.log('\n✨ Validation complete!');

  } catch (error) {
    console.error('❌ Error during validation:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}