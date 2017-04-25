import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import Icon from 'react-fa';
import CollapseOmni from '../components/CollapseOmni';
import TriggerItems from '../components/TriggerItems';
import Panel from '../components/Panel';
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';

const ITEMS = [
  {
    title: 'Active triggers',
    ref:   'active-triggers',
    icon: 'folder-open'
    // source: GET_CURRENT_TRIGGERS
  }
  // {
  //   title: 'Create new trigger',
  //   ref:   'add-trigger',
  //   icon: 'star-o',
  //   source: CREATE_TRIG
  // }
];

class TriggersContainer extends Component {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.discardTrigger = this.discardTrigger.bind(this);
    // this.fetchData = this.fetchData.bind(this);
    let isOpenCategory = {};
    ITEMS.forEach((item, index) => {
      isOpenCategory[item.ref] = false;
    });
    this.state = {
      triggers: [],
      discardedTriggers: [],
      isOpen: true,
      selectedItem: {},
      isOpenCategory: isOpenCategory,
      latestUpdateTime: moment().utc().format()
    };
  }

  toggle (evt) {
    this.setState({ isOpen: !this.state.isOpen });
    evt.preventDefault();
  }

  toggleCategory (category) {
    const newIsOpenCategory = cloneDeep(this.state.isOpenCategory);
    newIsOpenCategory[category] = !newIsOpenCategory[category];
    this.setState({ isOpenCategory: newIsOpenCategory });
  }

  select (category, index, geo) {
    if (typeof this.state.selectedItem.index !== 'undefined' &&
        this.state.selectedItem.category === category && this.state.selectedItem.index === index) {
      this.setState({ selectedItem: {} });
      return false;
    } else {
      this.setState({ selectedItem: { category: category, index: index, geojson: geo } });
      return true;
    }
  }

  discardTrigger (uuid) {
    const discardedTriggersCpy = cloneDeep(this.state.discardedTriggers);
    discardedTriggersCpy.push(uuid);
    this.setState({ discardedTriggers: discardedTriggersCpy });
  }

  render () {
    let title = <Row>
      <Button color='primary' onClick={this.toggle} title={this.state.isOpen ? 'Collapse panel' : 'Expand panel'}>
        <Icon name={this.state.isOpen ? 'angle-double-left' : 'angle-double-right'} />
      </Button>
    </Row>;
    return (
      <Col className='TriggerContainer'>
        <CollapseOmni className='CollapseOmni' isOpen={this.state.isOpen} isHorizontal >
          <Panel className='Panel' title={title}>
            <Col xs='auto' className='accordionsWrapper'>
              {ITEMS.map((item, index) =>
                <TriggerItems
                  key={index} onClick={this.toggle} triggers={this.state.triggers} title={item.title} parentCollapsed={!this.state.isOpen} discardedTriggers={this.state.discardedTriggers}
                  icon={item.icon} source={item.source} isOpen={this.state.isOpen && this.state.isOpenCategory[item.ref]}
                  dispatch={this.props.dispatch} actions={this.props.actions} discardTrigger={this.discardTrigger} />
              )}
            </Col>
          </Panel>
        </CollapseOmni>
      </Col>
    );
  }
}

TriggersContainer.propTypes = {
  dispatch: PropTypes.func,
  actions: PropTypes.object
};

export default TriggersContainer;
