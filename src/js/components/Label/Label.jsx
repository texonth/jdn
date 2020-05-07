import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";

const styles = {
  label: {
    background: "#6f42c1",
    padding: "3px 5px",
    color: "white",
    fontWeight: "600",
    borderRadius: "3px",
  },
};

class Label extends React.Component {
  handleClick = () => {
    const { onclick } = this.props;
    if (onclick) {
      this.props.onclick();
    }
  };

  render() {
    const { children, classes } = this.props;

    return (
      <span className={classes.label} onClick={this.handleClick}>
        {children}
      </span>
    );
  }
}

Label.propTypes = {};

const LabelWrapper = injectSheet(styles)(Label);

export default LabelWrapper;
