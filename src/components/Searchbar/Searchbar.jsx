import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

class Searchbar extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
    };

    state = { query: '' };

    handleChange = event => {
        this.setState({ query: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        this.props.onSubmit(this.state.query);
        this.setState({ query: '' });
    };

    render() {
        return (
            <header className={css.searchbar}>
                <form className={css.form} onSubmit={this.handleSubmit}>
                    <button type="submit" className={css.button}>
                        <span className={css.buttonLabel}>Search</span>
                    </button>
                    <input
                        className={css.input}
                        type="text"
                        autoComplete="off"
                        autoFocus
                        placeholder="Search images"
                        value={this.state.query}
                        onChange={this.handleChange}
                    />
                </form>
            </header>
        );
    }
}

export default Searchbar;