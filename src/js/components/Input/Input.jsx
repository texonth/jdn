import React from "react";
import PropTypes from "prop-types";

class Input extends React.Component {
  handleChange = (value) => {
    const { onchange } = this.props;
    if (onchange) {
      this.props.onchange(value);
    }
  };

  render() {
    const { className, placeholder, value } = this.props;

    return (
      <input
        className={`${className} form-control`}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          this.handleChange(e.target.value);
        }}
      />
    );
  }
}

Input.propTypes = {};

export default Input;
