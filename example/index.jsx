import { render } from 'react-dom';
import React from 'react';
import Pagination from '../src/index.jsx';

const App = class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleChangePage = ::this.handleChangePage;
        this.state = {
            activePage: 0
        }
    }

    handleChangePage(page) {
        this.setState({
            activePage: page
        })
    }

    render() {
        const { activePage } = this.state;

        return (
            <div>
                <div>now page number: { activePage +1 }</div>
                <Pagination
                    handleChangePage = { this.handleChangePage }
                    activePage = { activePage }
                    totalCount = { 10 }
                    perPageItemCount = { 2 }
                    nextPageText = "next"
                    prePageText = "prev"
                />
            </div>
        )
    }
}
render(
    <App />,
    document.getElementById('container')
);
