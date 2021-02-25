// libaries used for fetching and parsing
const axios = require('axios');
const parseString = require('xml2js').parseString;

// function for calling fetch; returns a promise
async function getXML(url) {
  return axios.get(url)
    .catch(function (err) {
      console.warn('Something went wrong.', err);
    });
}

// extracting certain properties based on specs
// input arguments: output array and data to parse
const extractProperties = (store = [], data) => {
  console.log('Extracting Properties from XML Data')
  const properties = data.PhysicalProperty.Property
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i].PropertyID[0]
    if (prop.Address[0].City[0] === 'Madison') {
      store.push({
        property_id: prop.Identification[0].$.IDValue,
        name: prop.MarketingName[0],
        email: prop.Email[0],
      })
    }
  }
  console.log('Extraction Finished')
  return store
}

// invoke getXML and save promise
const promise = getXML('https://s3.amazonaws.com/abodo-misc/sample_abodo_feed.xml')

// construct output array
const properties = []

// resolve the promise
promise
  .then(res => {
    console.log('Data Found!')
    console.log('Parsing XML Data')
    parseString(res.data, (err, result) => {
      console.log('XML Data parsed')
      extractProperties(properties, result)
    })
  })
  // display properties after all the parsing and extraction
  .then(() => console.log(properties))