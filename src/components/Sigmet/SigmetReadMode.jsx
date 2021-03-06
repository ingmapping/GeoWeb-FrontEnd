import React, { PureComponent } from 'react';
import { Button, Col } from 'reactstrap';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { READ_ABILITIES, byReadAbilities } from '../../containers/Sigmet/SigmetActions';
import { UNITS_ALT, DIRECTIONS, CHANGES, MODES_LVL } from './SigmetTemplates';

import WhatSection from './Sections/WhatSection';
import ValiditySection from './Sections/ValiditySection';
import ActionSection from './Sections/ActionSection';
import FirSection from './Sections/FirSection';
import HeightSection from './Sections/HeightSection';
import ProgressSection from './Sections/ProgressSection';
import ChangeSection from './Sections/ChangeSection';
import IssueSection from './Sections/IssueSection';

const DATE_TIME_FORMAT = 'DD MMM YYYY HH:mm UTC';

class SigmetReadMode extends PureComponent {
  getUnitLabel (unitName) {
    return UNITS_ALT.find((unit) => unit.unit === unitName).label;
  };

  showLevels (levelinfo) {
    if (!levelinfo) {
      return;
    }
    const level0 = levelinfo.levels[0];
    const level1 = levelinfo.levels[1];
    const is0FL = level0.unit === UNITS_ALT.FL;
    const is1FL = level1.unit === UNITS_ALT.FL;
    const unit0Label = this.getUnitLabel(level0.unit);
    const unit1Label = this.getUnitLabel(level1.unit);
    switch (levelinfo.mode) {
      case MODES_LVL.ABV:
        return `Above ${is0FL ? unit0Label : ''} ${level0.value} ${!is0FL ? unit0Label : ''}`;
      case MODES_LVL.AT:
        return `At ${is0FL ? unit0Label : ''} ${level0.value} ${!is0FL ? unit0Label : ''}`;
      case MODES_LVL.BETW:
        return `Between ${is0FL ? unit0Label : ''} ${level0.value} ${!is0FL ? unit0Label : ''} and
          ${is1FL ? unit1Label : ''} ${level1.value} ${!is1FL ? unit1Label : ''}`;
      case MODES_LVL.BETW_SFC:
        return `Between surface and ${is1FL ? unit1Label : ''} ${level1.value} ${!is1FL ? unit1Label : ''}`;
      case MODES_LVL.TOPS:
        return `Tops at ${is0FL ? unit0Label : ''} ${level0.value} ${!is0FL ? unit0Label : ''}`;
      case MODES_LVL.TOPS_ABV:
        return `Tops above ${is0FL ? unit0Label : ''} ${level0.value} ${!is0FL ? unit0Label : ''}`;
      case MODES_LVL.TOPS_BLW:
        return `Tops below ${is0FL ? unit0Label : ''} ${level0.value} ${!is0FL ? unit0Label : ''}`;
      default:
        return '';
    }
  }
  render () {
    const { dispatch, actions, abilities, focus, uuid, phenomenon, isObserved, obsFcTime, validdate, validdateEnd, firname, locationIndicatorIcao, issuedate,
      locationIndicatorMwo, levelinfo, movement, change, sequence } = this.props;
    const abilityCtAs = []; // CtA = Call To Action
    if (focus) {
      Object.values(READ_ABILITIES).map((ability) => {
        if (abilities[ability.check] === true) {
          abilityCtAs.push(ability);
        }
      });
      abilityCtAs.sort(byReadAbilities);
    }
    return <Button tag='div' className={`Sigmet row${focus ? ' focus' : ''}`} onClick={!focus ? (evt) => dispatch(actions.focusSigmetAction(evt, uuid)) : null}>
      <Col>
        <WhatSection>
          <span data-field='phenomenon'>{phenomenon}</span>
          <span data-field='obs_or_fcst'>{isObserved ? 'Observed' : 'Forecast'}</span>
          {obsFcTime
            ? <Moment format={DATE_TIME_FORMAT} date={obsFcTime} data-field='obsFcTime' />
            : <span data-field='obsFcTime'>
              {isObserved
                ? '(no observation time provided)'
                : '(no forecasted time provided)'
              }
            </span>
          }
        </WhatSection>

        <ValiditySection>
          <Moment format={DATE_TIME_FORMAT} date={validdate} data-field='validdate' />
          <Moment format={DATE_TIME_FORMAT} date={validdateEnd} data-field='validdate_end' />
        </ValiditySection>

        <FirSection>
          <span data-field='firname'>{firname}</span>
          <span data-field='location_indicator_icao'>{locationIndicatorIcao}</span>
        </FirSection>

        <HeightSection>
          <span data-field='level'>{this.showLevels(levelinfo)}</span>
        </HeightSection>

        {/* TODO: Can this be done better? */}
        {movement && movement.stationary === false && movement.hasOwnProperty('speed') && movement.hasOwnProperty('dir')
          ? <ProgressSection>
            <span data-field='movement'>Moving</span>
            <span data-field='speed'>{movement.speed}KT</span>
            <span data-field='direction'>{movement && DIRECTIONS.find((obj) => obj.shortName === movement.dir).longName}</span>
          </ProgressSection>
          : <ProgressSection>
            <span data-field='movement'>{movement && movement.stationary ? 'Stationary' : 'Movement is defined by area'}</span>
          </ProgressSection>
        }

        <ChangeSection>
          <span data-field='change'>{change && CHANGES.find((obj) => obj.shortName === change).longName}</span>
        </ChangeSection>

        <IssueSection>
          <Moment format={DATE_TIME_FORMAT} date={issuedate} data-field='issuedate' />
          <span data-field='issueLocation'>{locationIndicatorMwo}</span>
          <span data-field='sequence'>{sequence < 1 ? '(Not yet issued)' : sequence}</span>
        </IssueSection>

        <ActionSection colSize={2}>
          {abilityCtAs.map((ability) =>
            <Button key={`action-${ability.dataField}`}
              data-field={ability.dataField}
              color='primary'
              onClick={(evt) => dispatch(actions[ability.action](evt, uuid))}>
              {ability.label}
            </Button>
          )}
        </ActionSection>
      </Col>
    </Button>;
  }
}

const abilitiesPropTypes = {};
Object.values(READ_ABILITIES).map(ability => {
  abilitiesPropTypes[ability.check] = PropTypes.bool;
});

SigmetReadMode.propTypes = {
  dispatch: PropTypes.func,
  actions: PropTypes.shape({
    editSigmetAction: PropTypes.func,
    publishSigmetAction: PropTypes.func,
    cancelSigmetAction: PropTypes.func,
    deleteSigmetAction: PropTypes.func,
    focusSigmetAction: PropTypes.func
  }),
  abilities: PropTypes.shape(abilitiesPropTypes),
  focus: PropTypes.bool,
  uuid: PropTypes.string,
  phenomenon: PropTypes.string,
  isObserved: PropTypes.bool,
  obsFcTime: PropTypes.string,
  issuedate: PropTypes.string,
  validdate: PropTypes.string,
  validdateEnd: PropTypes.string,
  levelinfo: PropTypes.shape({
    mode: PropTypes.string,
    levels: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number,
      unit: PropTypes.string
    }))
  }),
  movement: PropTypes.shape({
    stationary: PropTypes.bool.isRequired,
    speed: PropTypes.number,
    dir: PropTypes.string
  }),
  change: PropTypes.string,
  sequence: PropTypes.number,
  locationIndicatorIcao: PropTypes.string,
  locationIndicatorMwo: PropTypes.string,
  firname: PropTypes.string
};

export default SigmetReadMode;
