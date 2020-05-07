import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";
import Select from "react-select";

const styles = {
  selectContainer: {
    display: "flex",
    alignItems: "center",
  },
  selectElement: {
    width: "200px",
  },
  label: {
    marginRight: "10px",
  },
};

class CustomSelect extends React.Component {
  state = {
    selectedOption: this.props.defaultValue,
  };

  handleChange = (selectedOption) => {
    const { change } = this.props;

    this.setState({ selectedOption });
    if (change) {
      change(selectedOption);
    }
  };

  render() {
    const { label, classes, options = [] } = this.props;
    const { selectedOption } = this.state;

    return (
      <div className={classes.selectContainer}>
        {label && <span className={classes.label}>{label}</span>}
        <div className={classes.selectElement}>
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />
        </div>
      </div>
    );
  }
}

CustomSelect.propTypes = {};
const CustomSelectWrapper = injectSheet(styles)(CustomSelect);

export default CustomSelectWrapper;
