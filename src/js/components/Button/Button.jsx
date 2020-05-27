import React from "react";
import PropTypes from "prop-types";

class Button extends React.Component {
  handleClick = () => {
    const { onclick } = this.props;

    if (onclick) {
      onclick();
    }
  };

  render() {
    const { label, className, icon, disabled } = this.props;
    let cl = `btn ${className}`;
    return (
      <button
        disabled={disabled}
        className={cl}
        type="button"
        onClick={this.handleClick}
      >
        {icon ? (
          <span>
            <img className="icon" src={icon} />
            <span className="buttonLabel"> {label} </span>
          </span>
        ) : (
          <span className="buttonLabel"> {label} </span>
        )}
      </button>
    );
  }
}

Button.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.string,
  onclick: PropTypes.func,
};

export default Button;
