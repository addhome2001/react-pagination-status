import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { spy } from 'sinon';

import Pagination from '../src';

configure({ adapter: new Adapter() });

const handleChange = spy();

const shallowComponent = props =>
  shallow(
    <Pagination
      activePage={ 0 }
      perPageItemCount={ 10 }
      totalCount={ 40 }
      handleChangePage={ handleChange }
      { ...props }
    />,
  );

const mountComponent = props =>
  mount(
    <Pagination
      activePage={ 0 }
      perPageItemCount={ 10 }
      totalCount={ 40 }
      handleChangePage={ handleChange }
      { ...props }
    />,
  );

describe('Test DataTable shareComponent', () => {
  beforeEach(() => handleChange.reset());

  it('correct props', () => {
    const wrapper = shallowComponent();

    expect(wrapper.instance().props).eql({
      activePage: 0,
      totalCount: 40,
      perPageItemCount: 10,
      partialPageCount: 5,
      nextPageText: '下一頁',
      prePageText: '上一頁',
      className: 'react-pagination-status',
      handleChangePage: handleChange,
    });
  });

  it('with className: .active by defaultProps: activePage', () => {
    const wrapper = mountComponent({ activePage: 2 });

    expect(
      wrapper
        .find('PageButton')
        .at(3)
        .find('.react-pagination-status__btn--active')
        .exists(),
      ).to.equal(true);
  });

  describe('correct info of the buttons', () => {
    it('partial pages was no support', () => {
      const defaultProps = {
        prePageText: 'prev',
        nextPageText: 'next',
      };
      const wrapper = mountComponent(defaultProps);

      expect(wrapper.find('PageButton')).to.have.length(6);
      expect(wrapper.find('PageButton').map(n => n.text())).to.eql([
        defaultProps.prePageText,
        '1',
        '2',
        '3',
        '4',
        defaultProps.nextPageText,
      ]);
    });

    it('in the first part', () => {
      const defaultProps = {
        prePageText: 'prev',
        nextPageText: 'next',
        activePage: 1,
        perPageItemCount: 1,
        totalCount: 20,
      };
      const wrapper = mountComponent(defaultProps);

      expect(wrapper.find('PageButton')).to.have.length(9);
      expect(wrapper.find('PageButton').map(n => n.text())).to.eql([
        defaultProps.prePageText,
        '1',
        '2',
        '3',
        '4',
        '5',
        '...',
        '20',
        defaultProps.nextPageText,
      ]);
    });

    it('in the middle part', () => {
      const defaultProps = {
        prePageText: 'prev',
        nextPageText: 'next',
        activePage: 10,
        perPageItemCount: 1,
        totalCount: 20,
      };
      const wrapper = mountComponent(defaultProps);

      expect(wrapper.find('PageButton')).to.have.length(11);
      expect(wrapper.find('PageButton').map(n => n.text())).to.eql([
        defaultProps.prePageText,
        '1',
        '...',
        '9',
        '10',
        '11',
        '12',
        '13',
        '...',
        '20',
        defaultProps.nextPageText,
      ]);
    });

    it('in the tail part', () => {
      const defaultProps = {
        prePageText: 'prev',
        nextPageText: 'next',
        activePage: 20,
        perPageItemCount: 1,
        totalCount: 20,
      };
      const wrapper = mountComponent(defaultProps);

      expect(wrapper.find('PageButton')).to.have.length(9);
      expect(wrapper.find('PageButton').map(n => n.text())).to.eql([
        defaultProps.prePageText,
        '1',
        '...',
        '16',
        '17',
        '18',
        '19',
        '20',
        defaultProps.nextPageText,
      ]);
    });
  });

  describe('invoke handleChangePage', () => {
    it('clicks on the nextPageButton or prePageButton', () => {
      const wrapper = mountComponent();

      /* Click Prev Button */
      wrapper.find('PageButton').last().simulate('click');
      expect(handleChange.callCount).to.equal(1);
      expect(handleChange.calledWith(1)).to.equal(true);

      /* increasing 1 to the activePage */
      wrapper.setProps({ activePage: wrapper.instance().props.activePage + 1 });

      /* Click Next Button */
      wrapper.find('PageButton').first().simulate('click');
      expect(handleChange.callCount).to.equal(2);
      expect(handleChange.calledWith(0)).to.equal(true);
    });

    it('clicks on the first page button', () => {
      const wrapper = mountComponent({
        activePage: 10,
        perPageItemCount: 1,
        totalCount: 20,
      });

      wrapper.find('PageButton').at(1).simulate('click');

      expect(handleChange.callCount).to.equal(1);
      expect(handleChange.calledWith(0)).to.equal(true);
    });

    it('clicks on the last page button', () => {
      const wrapper = mountComponent({
        activePage: 10,
        perPageItemCount: 1,
        totalCount: 20,
      });

      wrapper.find('PageButton').at(9).simulate('click');
      expect(handleChange.callCount).to.equal(1);
      expect(handleChange.calledWith(19)).to.equal(true);
    });

    it('clicks on the ... button', () => {
      const wrapper = mountComponent({
        activePage: 10,
        perPageItemCount: 1,
        totalCount: 20,
      });

      wrapper.find('PageButton').at(2).simulate('click');
      wrapper.find('PageButton').at(8).simulate('click');
      expect(handleChange.callCount).to.equal(0);
    });

    it('clicks on the prePageButton button when on the first page', () => {
      const wrapper = mountComponent();

      wrapper.find('PageButton').at(0).simulate('click');
      expect(handleChange.callCount).to.equal(0);
    });

    it('clicks on the nextPageButton button when on the last page', () => {
      const wrapper = mountComponent({
        activePage: 3,
      });

      wrapper.find('PageButton').at(5).simulate('click');
      expect(handleChange.callCount).to.equal(0);
    });

    it('clicks on the page button', () => {
      const wrapper = mountComponent();

      wrapper.find('PageButton').at(2).simulate('click');
      expect(handleChange.callCount).to.equal(1);
      expect(handleChange.calledWith(1)).to.equal(true);

      wrapper.setProps({ activePage: 1 });

      expect(
        wrapper
          .find('PageButton')
          .at(2)
          .find('.react-pagination-status__btn--active')
          .exists(),
      ).to.equal(true);

      wrapper.find('PageButton').at(3).simulate('click');
      expect(handleChange.callCount).to.equal(2);
      expect(handleChange.calledWith(2)).to.equal(true);
      wrapper.setProps({ activePage: 2 });
      expect(
        wrapper
        .find('PageButton')
        .at(3)
        .find('.react-pagination-status__btn--active')
        .exists(),
      ).to.equal(true);
    });
  });
});
