import React from 'react';
import { default as SigmetsContainer } from './SigmetsContainer_deprecated';
import { mount } from 'enzyme';

const emptyDispatch = () => { /* intentionally left blank */ };
const emptyActions = { setGeoJSON: () => { /* intentionally left blank */ } };

describe('(Container) SigmetsContainer', () => {
  it('Renders a ReactStrap Col', () => {
    const _component = mount(<SigmetsContainer urls={{ BACKEND_SERVER_URL: 'http://localhost:8080' }} />);
    expect(_component.type()).to.eql(SigmetsContainer);
  });

  it('Allows setting collapse state', () => {
    const _component = mount(<SigmetsContainer urls={{ BACKEND_SERVER_URL: 'http://localhost:8080' }} />);
    expect(_component.state().isOpen).to.eql(true);
    _component.setState({ collapse: true });
    expect('everything').to.be.ok();
  });

  it('Allows triggering the toggle function', () => {
    const _component = mount(<SigmetsContainer urls={{ BACKEND_SERVER_URL: 'http://localhost:8080' }} dispatch={emptyDispatch} drawActions={emptyActions} />);
    expect(_component.state().isOpen).to.eql(true);
    const evt = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'F11',
      keyCode: 122
    });
    _component.instance().toggle(evt);
    expect(_component.state().isOpen).to.eql(false);
  });
});
