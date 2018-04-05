/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

type PAGINATION_PART_TYPE =
  | 'WHOLE_PAGES'
  | 'HEAD_PART'
  | 'MIDDLE_PART'
  | 'TAIL_PART';

type PAGINATION_ACTIONS_TYPE =
  | 'PREV'
  | 'NEXT'

type PaginationProps = {
  handleChangePage: (x: number) => void,
  activePage: number,
  partialPageCount: number,
  totalCount: number,
  perPageItemCount: number,
  className: string,
  prePageText: string,
  nextPageText: string,
}

type PageButtonProps = {
  children?: string,
  handleClick?: () => void,
  disabled?: boolean,
  active?: boolean,
}

const PAGINATION_PART = {
  WHOLE_PAGES: 'WHOLE_PAGES',
  HEAD_PART: 'HEAD_PART',
  MIDDLE_PART: 'MIDDLE_PART',
  TAIL_PART: 'TAIL_PART',
};

const PAGINATION_ACTIONS = {
  PREV: 'PREV',
  NEXT: 'NEXT',
};

const PageButtonHOC = (className: string) => {
  const PageButton = ({
    children,
    handleClick,
    disabled,
    active,
  }: PageButtonProps): React$Element<*> => {
    const btnClassName = `${className}__btn`;
    const disableClassName = disabled ? `${className}__btn--disable` : '';
    const activeClassName = active ? `${className}__btn--active` : '';

    return (
      <li className={ `${className}__item` } onClick={ handleClick }>
        <button
          className={ `${btnClassName} ${disableClassName || activeClassName}` }
        >{ children }</button>
      </li>
    );
  };

  PageButton.displayName = 'PageButton';
  PageButton.defaultProps = {
    handleClick: () => {},
    children: '',
    disabled: false,
    active: false,
  };

  return PageButton;
};

export default class Pagination extends Component {

  PageButton: (c: PageButtonProps) => React$Element<*>;
  changePageByAction: (status: PAGINATION_ACTIONS_TYPE) => () => void;
  changePage: (status: number) => () => void;
  pageCount: number;
  lastPage: number;
  halfPartialPageCount: number;
  pageArr: number[];

  static propTypes = {
    handleChangePage: PropTypes.func.isRequired,
    activePage: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    perPageItemCount: PropTypes.number.isRequired,
    partialPageCount: PropTypes.number,
    nextPageText: PropTypes.string,
    prePageText: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: 'react-pagination-status',
    prePageText: '上一頁',
    nextPageText: '下一頁',
    partialPageCount: 5,
  };

  constructor(props: PaginationProps) {
    super(props);
    this.changePageByAction = this.changePageByAction.bind(this);
    this.changePage = this.changePage.bind(this);
    this.pageCount = Math.ceil(props.totalCount / props.perPageItemCount);
    this.lastPage = this.pageCount - 1;
    this.pageArr = [...new Array(this.pageCount).keys()];
    this.halfPartialPageCount = Math.floor(props.partialPageCount / 2);
    this.PageButton = PageButtonHOC(props.className);
  }

  changePage(newPage: number): Function {
    return (): void => {
      const { activePage }: { activePage: number } = this.props;

      if (activePage !== newPage && !isNaN(newPage)) {
        this.props.handleChangePage(newPage);
      }
    };
  }

  changePageByAction(status: PAGINATION_ACTIONS_TYPE): Function {
    return (): void => {
      const { activePage }: { activePage: number } = this.props;
      let newPage: number;

      switch (status) {
        case PAGINATION_ACTIONS.PREV:
          newPage = activePage === 0 ? activePage : activePage - 1;
          break;
        case PAGINATION_ACTIONS.NEXT:
          newPage = activePage === this.lastPage ? activePage : activePage + 1;
          break;
        default:
          newPage = activePage;
      }

      if (activePage !== newPage) this.props.handleChangePage(newPage);
    };
  }

  getPaginationStatus(activePage: number): PAGINATION_PART_TYPE {
    if (this.pageCount <= this.props.partialPageCount) {
      return PAGINATION_PART.WHOLE_PAGES;
    }

    if (activePage < this.props.partialPageCount) {
      return PAGINATION_PART.HEAD_PART;
    }

    if (this.pageCount - activePage <= this.props.partialPageCount) {
      return PAGINATION_PART.TAIL_PART;
    }

    return PAGINATION_PART.MIDDLE_PART;
  }

  getPartialPages(
    status: PAGINATION_PART_TYPE,
    partialCount: number,
    activePage: number,
  ): number[] {
    switch (status) {
      case PAGINATION_PART.HEAD_PART:
        return this.pageArr.slice(0, partialCount);
      case PAGINATION_PART.TAIL_PART:
        return this.pageArr.slice(this.pageCount - partialCount);
      case PAGINATION_PART.MIDDLE_PART:
        return this.pageArr.slice(
          activePage - this.halfPartialPageCount,
          activePage + this.halfPartialPageCount + 1,
        );
      default:
        return this.pageArr;

    }
  }

  render() {
    const { PageButton } = this;
    const {
      activePage,
      partialPageCount,
      prePageText,
      nextPageText,
      className,
    }: {
      activePage: number,
      partialPageCount: number,
      prePageText: string,
      nextPageText: string,
      className: string,
    } = this.props;

    const paginationStatus = this.getPaginationStatus(activePage);
    const partialPages = this.getPartialPages(paginationStatus, partialPageCount, activePage);

    const firstPage = this.pageArr[0];
    const lastPage = this.pageArr[this.pageArr.length - 1];

    const isWholePages = paginationStatus === PAGINATION_PART.WHOLE_PAGES;
    const isInHeadPart = paginationStatus === PAGINATION_PART.HEAD_PART;
    const isInMiddlePart = paginationStatus === PAGINATION_PART.MIDDLE_PART;
    const isInTailPart = paginationStatus === PAGINATION_PART.TAIL_PART;

    const isFirstPage = activePage === firstPage;
    const isLastPage = activePage === lastPage;

    return (
      <ul className={ className }>
        <PageButton
          handleClick={ this.changePageByAction(PAGINATION_ACTIONS.PREV) }
          disabled={ isFirstPage }
        >
          { prePageText }
        </PageButton>
        {
          !isWholePages && (!isInHeadPart || isInMiddlePart) && (
            <React.Fragment>
              <PageButton handleClick={ this.changePage(firstPage) }>
                { firstPage + 1 }
              </PageButton>
              <PageButton disabled>...</PageButton>
            </React.Fragment>
          )
        }
        {
          partialPages.map((u: number) =>
            <PageButton
              handleClick={ this.changePage(u) }
              key={ `page-${u}` }
              active={ activePage === u }
            >{ u + 1 }</PageButton>,
          )
        }
        {
          !isWholePages && (!isInTailPart || isInMiddlePart) && (
            <React.Fragment>
              <PageButton disabled>...</PageButton>
              <PageButton handleClick={ this.changePage(lastPage) }>
                { lastPage + 1 }
              </PageButton>
            </React.Fragment>
          )
        }
        <PageButton
          handleClick={ this.changePageByAction(PAGINATION_ACTIONS.NEXT) }
          disabled={ isLastPage }
        >
          { nextPageText }
        </PageButton>
      </ul>
    );
  }
}
