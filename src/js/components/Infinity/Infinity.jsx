import React from "react"
import PropTypes from "prop-types"
import injectSheet from "react-jss"
import ReactLoading from "react-loading"

const styles = {
  container: {
    width: "50px",
    height: "50px",
  },
}

class Infinity extends React.Component {
  componentDidMount() {}
  render() {
    const { classes, size, color } = this.props
    return (
      <ReactLoading
        type={"spin"}
        color={color}
        height={size.height}
        width={size.width}
      />
    )
  }
}

Infinity.propTypes = {}

const InfinityWrapper = injectSheet(styles)(Infinity)

export default InfinityWrapper
