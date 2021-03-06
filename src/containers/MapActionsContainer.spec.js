import React from 'react';
import { default as MapActionsContainer } from './MapActionsContainer';
import { mount, shallow } from 'enzyme';

const state = {
  adagucProperties: {
    animationSettings: {
      animate: false,
      duration: 3
    },
    sources: [],
    timeDimension: '2017-07-19T11:32:03Z',
    cursor: null
  },
  mapProperties: {
    mapCreated: false,
    activeMapId: 0,
    layout: 'single',
    mapMode: 'pan',
    projectionName: 'EPSG:3857',
    boundingBox: {
      title: 'Netherlands',
      bbox: [
        314909.3659069278,
        6470493.345653814,
        859527.2396033217,
        7176664.533565958
      ]
    }
  },
  drawProperties: {
    geojson: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: []
          },
          properties: {
            prop0: 'value0',
            prop1: {
              'this': 'that'
            }
          }
        }
      ]
    },
    measureDistance: {
      isInEditMode: false
    }
  },

  panelsProperties: {
    wmjsLayers: [],
    baselayer: {
      service: 'http://geoservices.knmi.nl/cgi-bin/bgmaps.cgi?',
      name: 'streetmap',
      title: 'OpenStreetMap',
      format: 'image/gif',
      enabled: true
    },
    panels: [
      {
        overlays: [],
        panelsProperties: []
      },
      {
        overlays: [],
        panelsProperties: []
      },
      {
        overlays: [],
        panelsProperties: []
      },
      {
        overlays: [],
        panelsProperties: []
      }
    ]
  }
};

const emptyDispatch = () => null;
const emptyActions = {
  toggleAnimation: () => null,
  setTimeDimension: () => null,
  setMapMode: () => null
};

describe('(Container) MapActionsContainer', () => {
  let _deepComponent, _shallowComponent;
  beforeEach(() => {
    _deepComponent = mount(<MapActionsContainer urls={{ BACKEND_SERVER_URL: 'http://localhost:8080' }}
      user={{}}
      adagucActions={{ toggleAnimation: () => null, setTimeDimension: () => null }}
      mapProperties={state.mapProperties} adagucProperties={state.adagucProperties} dispatch={emptyDispatch} actions={emptyActions} />);
    _shallowComponent = shallow(<MapActionsContainer urls={{ BACKEND_SERVER_URL: 'http://localhost:8080' }}
      user={{}}
      adagucActions={{ toggleAnimation: () => null, setTimeDimension: () => null }}
      mapProperties={state.mapProperties} adagucProperties={state.adagucProperties} dispatch={emptyDispatch} actions={emptyActions} />);
  });
  it('Renders a ReactStrap Col', () => {
    expect(_deepComponent.type()).to.eql(MapActionsContainer);
  });
  it('Adds a data layer', () => {
    expect(_deepComponent.type()).to.eql(MapActionsContainer);
  });

  // it('Allows for triggering toggleAnimation', () => {
  //   _deepComponent.instance().toggleAnimation();
  //   expect('everything').to.be.ok();
  // });
  it('Allows for triggering togglePopside', () => {
    _shallowComponent.instance().togglePopside();
    expect('everything').to.be.ok();
  });
  // it('Allows for triggering goToNow', () => {
  //   global.getCurrentDateIso8601 = sinon.stub().returns({ toISO8601: () => {  intentionally left blank  } });
  //   _deepComponent.instance().goToNow();
  //   expect('everything').to.be.ok();
  // });
  // it('Allows for triggering generateMap', () => {
  //   _deepComponent.instance().generateMap([{ name: 'testName', text: 'testText' }]);
  //   expect('everything').to.be.ok();
  // });
  // it('Allows for triggering getLayerName', () => {
  //   let obs = _deepComponent.instance().getLayerName({ title: 'OBS' });
  //   expect(obs).to.eql('Observations');
  //   obs = _deepComponent.instance().getLayerName({ title: 'SAT' });
  //   expect(obs).to.eql('Satellite');
  //   obs = _deepComponent.instance().getLayerName({ title: 'LGT' });
  //   expect(obs).to.eql('Lightning');
  //   obs = _deepComponent.instance().getLayerName({ title: 'Harmonie36' });
  //   expect(obs).to.eql('Harmonie36');
  //   obs = _deepComponent.instance().getLayerName({ title: 'Harmonie36' });
  //   expect(obs).to.eql('HARMONIE');
  //   obs = _deepComponent.instance().getLayerName({ title: 'OVL' });
  //   expect(obs).to.eql('Overlay');
  //   obs = _deepComponent.instance().getLayerName({ title: 'RADAR_EXT' });
  //   expect(obs).to.eql('Radar (EXT)');
  //   expect('everything').to.be.ok();
  // });
  it('Allows for setting addLayer action state', () => {
    _deepComponent.setState({ action: 'addLayer' });
    expect('everything').to.be.ok();
  });
  it('Allows for setting selectPreset action state', () => {
    _deepComponent.setState({ action: 'selectPreset' });
    expect('everything').to.be.ok();
  });
  it('Allows for setting collapse state', () => {
    _deepComponent.setState({ collapse: true });
    expect('everything').to.be.ok();
  });
  it('Allows for setting popoverOpen state', () => {
    _shallowComponent.setState({ popoverOpen: true });
    expect('everything').to.be.ok();
  });
  it('Allows for creating a progtemp config', () => {
    const newAdaguc = {
      panelsProperties: {
        datalayers: [
          { title: 'Harmonie36', getDimension: () => '2017-03-24T06:00:00' }
        ]
      },
      wmjslayers: {
        panelsProperties: [{ title: 'Harmonie36', service: 'Harmonie36', getDimension: () => '2017-03-24T06:00:00' }],
        baselayers: [],
        overlays: []
      },
      sources: {
        data: [{ name: 'testName', title: 'testTitle' }],
        overlay: [{ name: 'testName', title: 'testTitle' }]
      },
      progtemp: {
        location: {
          name: 'EHDB',
          x: 5.18,
          y: 52.12
        }
      },
      mapMode: 'progtemp'
    };
    _deepComponent.setProps({ adagucProperties: newAdaguc });
    expect('everything').to.be.ok();
  });
});
