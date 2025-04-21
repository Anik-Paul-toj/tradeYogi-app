const { NseIndia } = require('stock-nse-india');

async function test() {
  const nseIndia = new NseIndia();
  const data = await nseIndia.getEquityHistoricalData('SBIN', {
    start: new Date('2024-03-01'),
    end: new Date('2024-03-24')
  });
  console.log(JSON.stringify(data, null, 2));
}

test().catch(console.error); 