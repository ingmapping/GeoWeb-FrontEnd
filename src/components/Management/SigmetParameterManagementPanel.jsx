
import React from 'react';
import Panel from '../Panel';
import { Input, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { Icon } from 'react-fa';
import { BACKEND_SERVER_URL } from '../../routes/ADAGUC/constants/backend.js';
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
export default class LocationManagementPanel extends React.Component {
  componentWillMount () {
    axios.get(BACKEND_SERVER_URL + '/sigmet/getsigmetparameters').then((res) => {
      this.sigmetParameters = res.data;
    });
  }
  render () {
    if (!this.sigmetParameters) {
      return <Panel />;
    } else {
      return (
        <ParameterMapper sigmetParameters={this.sigmetParameters} />
      );
    }
  }
}

export class ParameterMapper extends React.Component {
  constructor () {
    super();
    this.setEditMode = this.setEditMode.bind(this);
    this.deleteFirArea = this.deleteFirArea.bind(this);
    this.addFirLocation = this.addFirLocation.bind(this);
    this.saveSigmetParameters = this.saveSigmetParameters.bind(this);
    this.state = {
      sigmetParameters: {}
    };
  }

  saveSigmetParameters () {
    const maxhoursofvalidity = parseInt(document.querySelector('#maxhoursofvalidity').value);
    const hoursbeforevalidity = parseInt(document.querySelector('#hoursbeforevalidity').value);
    const locationIndicatorWmo = document.querySelector('#location_indicator_wmo').value;
    let firs = [];
    for (var i = 0; i < this.state.sigmetParameters.firareas.length; ++i) {
      firs.push({
        firnameinput: document.querySelector('#firnameinput' + i).value,
        areapresetinput: document.querySelector('#areapresetinput' + i).value,
        icaoinput: document.querySelector('#icaoinput' + i).value
      });
    }
    const newSigmetParameterObj = {
      maxhoursofvalidity: maxhoursofvalidity,
      hoursbeforevalidity: hoursbeforevalidity,
      location_indicator_wmo: locationIndicatorWmo,
      firareas: firs
    };
  }
  deleteFirArea (i) {
    let arrayCpy = cloneDeep(this.state.sigmetParameters);
    arrayCpy.firareas.splice(i, 1);
    this.setState({ sigmetParameters: arrayCpy });
  }
  addFirLocation () {
    let arrayCpy = cloneDeep(this.state.sigmetParameters);
    console.log(arrayCpy);
    arrayCpy.firareas.push({ });
    this.setState({ sigmetParameters: arrayCpy });
  }

  setEditMode (i) {
    let arrayCpy = this.state.sigmetParameters.map((a) => Object.assign(a));
    arrayCpy[i].edit = true;
    this.setState({ sigmetParameters: arrayCpy });
  }
  componentWillMount () {
    this.setState({ sigmetParameters: this.props.sigmetParameters });
  }
  componentWillReceiveProps (nextprops) {
    this.setState({ sigmetParameters: nextprops.sigmetParameters });
  }
  render () {
    return (
      <Panel style={{ overflowX: 'hidden', overflowY: 'auto' }}>
        <Row style={{ flex: 1, maxHeight: '15rem' }}>
          {['maxhoursofvalidity', 'hoursbeforevalidity', 'location_indicator_wmo'].map((p, i) =>
            <SigmetCard key={i} i={i} title={p} value={this.state.sigmetParameters[p].toString()} />
          )}
        </Row>
        <Row style={{ flex: 1 }}>
          <Row><h2>FIR areas</h2></Row>
          <Row style={{ flex: 1 }}>
            {this.state.sigmetParameters.firareas.map((fir, i) =>
              <SigmetCard key={i} i={i} fir title={fir.firname} firdata={fir} deleteFirArea={this.deleteFirArea} />
            )}
          </Row>
        </Row>
        <Row style={{ bottom: '1rem', position: 'fixed' }}>
          <Col>
            <Button color='primary' onClick={this.saveSigmetParameters} style={{ marginRight: '1rem' }}>Save</Button>
            <Button color='primary' onClick={this.addFirLocation}>Add</Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}
ParameterMapper.propTypes = {
  sigmetParameters: React.PropTypes.object.isRequired
};

class SigmetCard extends React.Component {
  render () {
    const { title, firdata, value, i, deleteFirArea, fir } = this.props;
    return (!fir
    ? <Col><ParameterCard i={i} title={title} value={value} /></Col>
    : <Col><FirCard i={i} title={title} areapreset={firdata.areapreset} icao={firdata.location_indicator_icao} deleteFirArea={deleteFirArea} /></Col>);
  }
}
SigmetCard.propTypes = {
  title: React.PropTypes.string.isRequired,
  value: React.PropTypes.string,
  firdata: React.PropTypes.object,
  i: React.PropTypes.number.isRequired,
  fir: React.PropTypes.bool,
  deleteFirArea: React.PropTypes.func
};

class ParameterCard extends React.Component {
  getTitle (p) {
    switch (p) {
      case 'maxhoursofvalidity':
        return 'Max. hours of validity';
      case 'hoursbeforevalidity':
        return 'Hours before validity';
      case 'location_indicator_wmo':
        return 'WMO Location Indicator';
      default:
        return p;
    }
  }

  render () {
    const { title, value, i } = this.props;
    return <Card className='col-auto loc-card' key={i} block>
      <CardTitle>{this.getTitle(title)}</CardTitle>
      <CardText>
        <table style={{ display: 'table', width: '100%' }}>
          <tbody>
            <tr>
              <td><Input step='any' id={title} placeholder='value' defaultValue={value} required /></td>
            </tr>
          </tbody>
        </table>
      </CardText>
    </Card>;
  }
}
ParameterCard.propTypes = {
  title: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  i: React.PropTypes.number.isRequired
};

class FirCard extends React.Component {
  render () {
    const { i, title, areapreset, icao, deleteFirArea } = this.props;
    return <Card className='col-auto loc-card' key={i} style={{ minHeight: '13rem' }} block>
      <CardTitle><Input id={'firnameinput' + i} placeholder='FIR name' defaultValue={title} required /></CardTitle>
      <CardText>
        <table style={{ display: 'table', width: '100%' }}>
          <tbody>
            <tr>
              <td>Area Preset</td>
              <td><Input id={'areapresetinput' + i} placeholder='Area preset' defaultValue={areapreset} required /></td>
            </tr>
            <tr>
              <td>ICAO name</td>
              <td><Input id={'icaoinput' + i} placeholder='ICAO name' defaultValue={icao} required /></td>
            </tr>
          </tbody>
        </table>
        <Icon name='times' onClick={() => deleteFirArea(i)} />
      </CardText>
    </Card>;
  }
}
FirCard.propTypes = {
  title: React.PropTypes.string,
  areapreset: React.PropTypes.string,
  icao: React.PropTypes.string,
  i: React.PropTypes.number.isRequired,
  deleteFirArea: React.PropTypes.func.isRequired
};