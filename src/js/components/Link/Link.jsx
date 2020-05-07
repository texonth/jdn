import React from "react";
import PropTypes from "prop-types";

class Link extends React.Component {
  handleClick = () => {
    const { onclick } = this.props;
    if (onclick) {
      this.props.onclick();
    }
  };

  render() {
    const { label, className, icon } = this.props;
    let cl = `btn-link ${className}`;
    return (
      <button className={cl} type="button" onClick={this.handleClick}>
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

Link.propTypes = {};

export default Link;
