import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './Button.module.css';

class Button extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
    };

    render() {
        return (
            <button className={css.Button} onClick={this.props.onClick}>
                Load more...
            </button>
        );
    }
}

export default Button;