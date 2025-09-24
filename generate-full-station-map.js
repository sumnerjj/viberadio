#!/usr/bin/env node

// Generate comprehensive station map for RadioTuner from validation results
const fs = require('fs');

// Load the validation results
const results = JSON.parse(fs.readFileSync('radio-validation-results.json', 'utf8'));
const workingStations = results.workingStations;

console.log(`Found ${workingStations.length} working stations to map`);

// Generate AM frequencies from 530 to 1700 (full AM band)
// Use increments of 10 kHz for better coverage
const frequencies = [];
for (let freq = 530; freq <= 1700; freq += 10) {
  frequencies.push(freq);
}

console.log(`Available frequencies: ${frequencies.length} (${frequencies[0]} to ${frequencies[frequencies.length-1]})`);

// Clean and prepare station data
function cleanStationName(name) {
  return name.trim().replace(/"/g, '\\"');
}

function cleanGenre(genre) {
  if (!genre || genre === 'Unknown') return 'Variety';
  return genre.replace(/"/g, '\\"');
}

function cleanCountry(country) {
  if (!country || country === 'Unknown') return 'International';
  // Simplify long country names
  const countryMap = {
    'The United States Of America': 'USA',
    'The Russian Federation': 'Russia',
    'The United Kingdom Of Great Britain And Northern Ireland': 'UK',
    'The Netherlands': 'Netherlands',
    'Islamic Republic Of Iran': 'Iran'
  };
  return countryMap[country] || country;
}

function cleanLanguage(language) {
  if (!language || language === 'Unknown') return 'Unknown';
  // Capitalize first letter
  return language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
}

// Generate the station map
let stationMapCode = '  // Predefined stations mapped to frequency ranges\n';
stationMapCode += '  // Using VERIFIED WORKING streams from comprehensive testing (141 confirmed working stations from 208 tested)\n';
stationMapCode += '  // Updated with Radio Browser API stations - 67.8% success rate - FULL EXPANDED LIST\n';
stationMapCode += '  const stationMap = {\n';

// Map working stations to frequencies
const maxStations = Math.min(workingStations.length, frequencies.length);
for (let i = 0; i < maxStations; i++) {
  const station = workingStations[i];
  const frequency = frequencies[i];

  stationMapCode += `    ${frequency}: {\n`;
  stationMapCode += `      name: "${cleanStationName(station.name)}",\n`;
  stationMapCode += `      url: "${station.url}",\n`;
  stationMapCode += `      fallbackUrl: undefined,\n`;
  stationMapCode += `      genre: "${cleanGenre(station.genre)}",\n`;
  stationMapCode += `      country: "${cleanCountry(station.country)}",\n`;
  stationMapCode += `      language: "${cleanLanguage(station.language)}"\n`;
  stationMapCode += `    },\n`;
}

stationMapCode += '  };\n';

// Write to file
fs.writeFileSync('station-map-full.txt', stationMapCode);

console.log(`\n✅ Generated station map with ${maxStations} stations`);
console.log(`📁 Saved to station-map-full.txt`);
console.log(`🎵 Frequency range: ${frequencies[0]} - ${frequencies[maxStations-1]} kHz`);

console.log('\n🔥 Sample stations:');
workingStations.slice(0, 10).forEach((station, i) => {
  console.log(`${frequencies[i]} kHz: ${station.name} (${cleanCountry(station.country)} - ${cleanGenre(station.genre)})`);
});

console.log('\n📊 Country breakdown:');
const countryCounts = {};
workingStations.forEach(station => {
  const country = cleanCountry(station.country);
  countryCounts[country] = (countryCounts[country] || 0) + 1;
});

Object.entries(countryCounts)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([country, count]) => {
    console.log(`  ${country}: ${count} stations`);
  });

console.log('\n🎭 Genre breakdown:');
const genreCounts = {};
workingStations.forEach(station => {
  const genre = cleanGenre(station.genre).split(',')[0].trim(); // Take first genre
  genreCounts[genre] = (genreCounts[genre] || 0) + 1;
});

Object.entries(genreCounts)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([genre, count]) => {
    console.log(`  ${genre}: ${count} stations`);
  });