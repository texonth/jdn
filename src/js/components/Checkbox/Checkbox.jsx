import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {
	state = {
		isChecked: this.props.checked === 'true',
	};

	toggleCheckboxChange = () => {
		const { onCheckboxChange } = this.props;

		this.setState(({ isChecked }) => (
			{
				isChecked: !isChecked,
			}
		));

		if (onCheckboxChange) {
			onCheckboxChange(this.state.isChecked);
		}
	};

	render() {
		const { label } = this.props;
		const { isChecked } = this.state;

		return (
			<div className="checkbox">
				<label>
					<input
						type="checkbox"
						value={isChecked}
						checked={isChecked}
						onChange={this.toggleCheckboxChange}
					/>
					{label}
				</label>
			</div>
		);
	}
}

Checkbox.propTypes = {
	label: PropTypes.string.isRequired,
	onCheckboxChange: PropTypes.func.isRequired,
};

export default Checkbox;
