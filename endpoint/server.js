/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Default entry point for App Engine Node.js runtime. Defines a
 * web service which returns the mapid to be used by clients to display map
 * tiles showing slope computed in real time from SRTM DEM data. See
 * accompanying README file for instructions on how to set up authentication.
 */
const ee = require('@google/earthengine');
const express = require('express');
const privateKey = require('./private-key.json');
const port = process.env.PORT || 3000;
var cors = require('cors')

// Define endpoint at /mapid.
const app = express().get('/mapid', cors(), (_, response) => {
  const srtm = ee.Image('CGIAR/SRTM90_V4');
  const slope = ee.Terrain.slope(srtm);
  slope.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
});

app.options('*', cors());

/*
pass params like this...

var dataset = ee.Image('Oxford/MAP/accessibility_to_healthcare_2019');
var accessibility = dataset.select('accessibility');
var accessibilityVis = {
  min: 0.0,
  max: 41556.0,
  gamma: 4.0,
};

print(accessibility.getMap(accessibilityVis));
*/

// NEW DATA...

app.get('/GFSAD1000_Cropland', cors(), (_, response) => {
  const dataset = ee.Image('USGS/GFSAD1000_V1');
  const cropMask = dataset.select('landcover');
  const cropMaskVis = {
    min: 0.0,
    max: 5.0,
    palette: ['black', 'orange', 'brown', '02a50f', 'green', 'yellow'],
  };
  cropMask.getMap(cropMaskVis, ({mapid}) => response.send(mapid));
});

app.get('/Biomass_Carbon_Density', cors(), (_, response) => {
  const dataset = ee.ImageCollection("NASA/ORNL/biomass_carbon_density/v1");
  const visualization = {
    bands: ['agb'],
    min: -50.0,
    max: 80.0,
    palette: ['d9f0a3', 'addd8e', '78c679', '41ab5d', '238443', '005a32']
  };

  dataset.getMap(visualization, ({mapid}) => response.send(mapid));
});

app.get('/Accessibility_to_Healthcare_2019', cors(), (_, response) => {
  const dataset = ee.Image('Oxford/MAP/accessibility_to_healthcare_2019');
  const accessibility = dataset.select('accessibility');
  const accessibilityVis = {
    min: 0.0,
    max: 41556.0,
    gamma: 4.0,
  };
  accessibility.getMap(accessibilityVis, ({mapid}) => response.send(mapid));
});

app.get('/Keetch-Byram_Drought_Index', cors(), (_, response) => {
      const collection = ee.ImageCollection('UTOKYO/WTLAB/KBDI/v1')
      .select('KBDI')
      .filterDate('2019-01-01', '2019-01-10');
    const bandViz = {
      min: 0,
      max: 800,
      palette: [
        '001a4d', '003cb3', '80aaff', '336600', 'cccc00', 'cc9900', 'cc6600',
        '660033'
      ]
    };
    collection.getMap(bandViz, ({mapid}) => response.send(mapid));
});

app.get('/Chlorophyll-a_concentration', cors(), (_, response) => {
      const dataset = ee.ImageCollection("JAXA/GCOM-C/L3/OCEAN/CHLA/V2")
                .filterDate('2020-01-01', '2020-02-01');
      const vis = {
        bands: ['CHLA_AVE'],
        min: -2,
        max: 2,
        palette: [
          '3500a8','0800ba','003fd6',
          '00aca9','77f800','ff8800',
          'b30000','920000','880000'
        ]
      };

      dataset.getMap(vis, ({mapid}) => response.send(mapid));
});

//Hansen_Global_Forest_Change

app.get('/Hansen_Global_Forest_Change', cors(), (_, response) => {
    const dataset = ee.Image('UMD/hansen/global_forest_change_2019_v1_7');
    /* eslint-disable-next-line */
    const treeCoverVisParam = {
      bands: ['treecover2000'],
      min: 0,
      max: 100,
      palette: ['black', 'green']
    };

    const treeLossVisParam = {
      bands: ['lossyear'],
      min: 0,
      max: 19,
      palette: ['yellow', 'red']
    };
    dataset.getMap(treeLossVisParam, ({mapid}) => response.send(mapid));
});

app.get('/HYCOM', cors(), (_, response) => {
    const dataset = ee.ImageCollection('HYCOM/sea_temp_salinity')
                  .filter(ee.Filter.date('2018-08-01', '2018-08-15'));
    const seaWaterTemperature = dataset.select('water_temp_0');
    const visParams = {
      min: -20000.0,
      max: 15000.0,
      palette: ['000000', '005aff', '43c8c8', 'fff700', 'ff0000'],
    };
    seaWaterTemperature.getMap(visParams, ({mapid}) => response.send(mapid));

});

//YCEO_Surface_Urban_Heat_Islands

app.get('/YCEO_Surface_Urban_Heat_Islands', cors(), (_, response) => {
  const dataset = ee.ImageCollection("YALE/YCEO/UHI/UHI_yearly_pixel/v4");

  const visualization = {
    bands: ['Daytime'],
    min: -1.5,
    max: 7.5,
    palette: [
      "#313695","#74add1","#fed976","#feb24c","#fd8d3c","#fc4e2a",
      "#e31a1c","#b10026",
    ]
  };
  dataset.getMap(visualization, ({mapid}) => response.send(mapid));
});


// OLD DATA...


app.get('/mapid2', cors(), (_, response) => {
  const srtm = ee.Image('UMD/hansen/global_forest_change_2015');
  // const slope = ee.Terrain.slope(srtm);
  srtm.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
});

// https://developers.google.com/earth-engine/datasets/catalog/FAO_WAPOR_2_L1_RET_D
app.get('/mapid3', cors(), (_, response) => {
  const coll = ee.ImageCollection('FAO/WAPOR/2/L1_RET_D');
  const image = coll.first();
  image.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
});

// https://developers.google.com/earth-engine/datasets/catalog/CSP_ERGo_1_0_Global_ALOS_CHILI
app.get('/mapid4', cors(), (_, response) => {
  const coll = ee.Image('CSP/ERGo/1_0/Global/ALOS_CHILI');
  coll.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
});

//https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_2_Metadata
app.get('/mapid5', cors(), (_, response) => {
  const coll = ee.Image("JRC/GSW1_2/Metadata");
  coll.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
});

// https://developers.google.com/earth-engine/datasets/catalog/OpenLandMap_CLM_CLM_LST_MOD11A2-DAY_SD_v01

app.get('/mapid6', cors(), (_, response) => {
  const coll = ee.Image("OpenLandMap/CLM/CLM_LST_MOD11A2-DAY_SD/v01");
  coll.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
});

// https://developers.google.com/earth-engine/datasets/catalog/WWF_HydroSHEDS_03DIR
app.get('/mapid7', cors(), (_, response) => {
  const coll = ee.Image("WWF/HydroSHEDS/03DIR");
  coll.getMap({min: 0, max: 60}, ({mapid}) => response.send(mapid));
});

app.use(cors({origin: '*'}));

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

console.log('Authenticating Earth Engine API using private key...');
ee.data.authenticateViaPrivateKey(
    privateKey,
    () => {
      console.log('Authentication successful.');
      ee.initialize(
          null, null,
          () => {
            console.log('Earth Engine client library initialized.');
            app.listen(port);
            console.log(`Listening on port ${port}`);
          },
          (err) => {
            console.log(err);
            console.log(
                `Please make sure you have created a service account and have been approved.
Visit https://developers.google.com/earth-engine/service_account#how-do-i-create-a-service-account to learn more.`);
          });
    },
    (err) => {
      console.log(err);
    });
