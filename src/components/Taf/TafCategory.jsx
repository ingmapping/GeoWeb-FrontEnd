import React, { Component } from 'react';
import { arrayMove } from 'react-sortable-hoc';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from 'reactstrap';
import { createTAFJSONFromInput, setTACColumnInput, removeInputPropsFromTafJSON, cloneObjectAndSkipNullProps } from './FromTacCodeToTafjson';
import TafTable from './TafTable';

/**
  TafCategory is the component which renders an editable and sortable TAF table.
  The UI is generated from a TAF JSON and it can generate/update TAF JSON from user input

  The component hierarchy is structured as follows:

                                  TACColumn(s) -> BaseForecast -> \
                                                                    --> TafTable -> TafCategory -> Taf
      TACColumn(s) -> ChangeGroup(s) -> SortableChangeGroup(s) -> /

*/
class TafCategory extends Component {
  constructor (props) {
    super(props);
    this.onSortEnd = this.onSortEnd.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onAddRow = this.onAddRow.bind(this);
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
    this.updateTACtoTAFJSONtoTac = this.updateTACtoTAFJSONtoTac.bind(this);

    let TAFStartHour = moment().utc().hour();
    TAFStartHour = TAFStartHour + 6;
    TAFStartHour = parseInt(TAFStartHour / 6);
    TAFStartHour = TAFStartHour * (6);
    this.state = {
      tafJSON: {
        forecast:{},
        metadata:{
          validityStart: moment().utc().hour(TAFStartHour).add(0, 'hour').format('YYYY-MM-DDTHH:00:00') + 'Z',
          validityEnd: moment().utc().hour(TAFStartHour).add(30, 'hour').format('YYYY-MM-DDTHH:00:00') + 'Z'
        },
        changegroups:[]
      }
    };
  };

  /*
    Event handler which handles change events from all input (TAC) fields.
    - colIndex is the corresponding TACColumn
    - rowIndex -1 means BaseForecast, other values (>= 0) are ChangeGroups
  */
  onChange (event, rowIndex, colIndex) {
    let fieldVal = event.target.value;
    if (fieldVal === undefined || fieldVal === null) fieldVal = '';
    fieldVal = fieldVal.toUpperCase();
    let clonedTafState = cloneObjectAndSkipNullProps(this.state.tafJSON);
    setTACColumnInput(fieldVal, rowIndex, colIndex, rowIndex >= 0 ? clonedTafState.changegroups[rowIndex] : clonedTafState);
    this.setState({
      tafJSON: createTAFJSONFromInput(clonedTafState)
    });
  }

  /*
    Function to update whole UI, roundtrip from TAC->JSON->TAC
    - First TAC fields are converted to TAF json object.
    - Second, TAC fields are rendered from TAF json (by setState)
  */
  updateTACtoTAFJSONtoTac () {
    /* First from form inputs to TAF JSON */
    let newTAFJSON = removeInputPropsFromTafJSON(createTAFJSONFromInput(this.state.tafJSON));
    if (!newTAFJSON) {
      console.log('error newTAFJSON is null');
      return;
    }
    /* Then update state and inputs will be rendered from JSON */
    this.setState({
      tafJSON: newTAFJSON
    });
    return newTAFJSON;
  }

  /*
    Event handler which handles keyUp events from input fields. E.g. arrow keys, Enter key, Esc key, etc...
  */
  onKeyUp (event, row, col, inputValue) {
    if (event.keyCode === 13) {
      this.onAddRow();
    }
    if (event.keyCode === 27) {
      this.updateTACtoTAFJSONtoTac();
    }
    if (this.state.tafJSON.changegroups.length > 0) {
      if (event.keyCode === 38) { // KEY ARROW UP
        if (row === 0) { // Up from changegroup to baseforecast
          this.refs['taftable'].refs['baseforecast'].refs['column_' + col].refs['inputfield'].focus();
        } else if (row > 0) { // Up from changegroup to changegroup
          this.refs['taftable'].refs['changegroup_' + (row - 1)].refs['sortablechangegroup'].refs['column_' + col].refs['inputfield'].focus();
        }
      }
      if (event.keyCode === 40) { // KEY ARROW DOWN
        if (row === -1) { // Down from baseforecast to changegroup
          this.refs['taftable'].refs['changegroup_' + (row + 1)].refs['sortablechangegroup'].refs['column_' + col].refs['inputfield'].focus();
        } else if (row >= 0 && row < (this.state.tafJSON.changegroups.length - 1)) { // Down from changegroup to changegroup
          this.refs['taftable'].refs['changegroup_' + (row + 1)].refs['sortablechangegroup'].refs['column_' + col].refs['inputfield'].focus();
        }
      }
    }
  }

  /*
    Event handler that is called upon jumping out of an input field.
  */
  onFocusOut () {
    this.updateTACtoTAFJSONtoTac();
    let taf = removeInputPropsFromTafJSON(createTAFJSONFromInput(this.state.tafJSON));
    this.props.validateTaf(taf);
  }

  /*
    This function adds a new changegroup to the TAF.
    This method is for example fired upon clicking the 'Add row button' next to changegroups.
  */
  onAddRow () {
    let newTaf = cloneObjectAndSkipNullProps(this.state.tafJSON);
    newTaf.changegroups.push({});
    this.setState({
      tafJSON: newTaf
    });
  }

  /*
    This function removes a changeGroup by given rowIndex.
  */
  onDeleteRow (rowIndex) {
    let newTaf = cloneObjectAndSkipNullProps(this.state.tafJSON);
    newTaf.changegroups.splice(rowIndex, 1);
    this.setState({
      tafJSON: newTaf
    });
  };

  /*
    Callback function called by SortableElement and SortableContainer when changegroups are sorted by Drag and Drop
  */
  onSortEnd ({ oldIndex, newIndex }) {
    let newTaf = cloneObjectAndSkipNullProps(this.state.tafJSON);
    newTaf.changegroups = arrayMove(newTaf.changegroups, oldIndex, newIndex);
    this.setState({
      tafJSON: newTaf
    });
  };

  shouldComponentUpdate (nextProps, nextState) {
    return true;
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      validation: nextProps.validation
    });
    let tafJSON = null;
    if (nextProps.taf) {
      if (typeof nextProps.taf === 'string') {
        try {
          tafJSON = JSON.parse(nextProps.taf);
        } catch (e) {
          console.log(e);
        }
      } else {
        tafJSON = nextProps.taf;
      }
      if (tafJSON !== null) {
        if (tafJSON.changegroups) {
          let uuid = null;
          if (tafJSON.metadata && tafJSON.metadata.uuid) {
            uuid = tafJSON.metadata.uuid;
          }
          if (this.changegroupsSet === uuid) return;
          this.changegroupsSet = uuid;
          this.setState({
            tafJSON: Object.assign({}, tafJSON)
          });
        }
      }
    }
  }

  render () {
    const flatten = list => list.reduce(
      (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
    );
    return (
      <div style={{ margin: '0px', padding:'0px', overflow:'auto', display:'inline-block' }}>
        <div>{this.state.tafJSON.metadata.uuid}</div>
        <div style={{ backgroundColor:'#EEE', padding:'5px' }}>
          <TafTable
            ref={'taftable'}
            validation={this.state.validation}
            tafJSON={this.state.tafJSON}
            onSortEnd={this.onSortEnd}
            onChange={this.onChange}
            onKeyUp={this.onKeyUp}
            onAddRow={this.onAddRow}
            onDeleteRow={this.onDeleteRow}
            editable={this.props.editable}
            onFocusOut={this.onFocusOut} />
        </div>
        <div style={{ float:'right' }}>
          <Button color='primary' onClick={() => {
            let taf = removeInputPropsFromTafJSON(createTAFJSONFromInput(this.state.tafJSON));
            this.props.saveTaf(taf);
          }} >Save</Button>
          <Button onClick={() => { alert('Sending a TAF out is not yet implemented'); }} color='primary'>Send</Button>
        </div>
        { this.state.validation
          ? <div style={{ backgroundColor:'#FAA' }} >
            { (flatten(Object.values(this.state.validation).filter(v => Array.isArray(v)))).map((value, index) => {
              return (<div key={'errmessageno' + index}>{index} - {value}</div>);
            })}
          </div> : null
        }
      </div>);
  }
}

TafCategory.propTypes = {
  taf: PropTypes.object,
  saveTaf :PropTypes.func,
  validateTaf :PropTypes.func,
  editable: PropTypes.bool,
  validation:PropTypes.object
};

export default TafCategory;