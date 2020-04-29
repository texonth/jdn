import React from 'react';
import injectSheet from 'react-jss';
import ReactFileReader from 'react-file-reader';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";
import Button from '../../../components/Button/Button';
import { exportIcon, importIcon, back } from '../../../../icons/index';

const styles = {
	generateStyle: {
		margin: '10px 0 10px 10px'
	},
	buttonContainer: {
		display: 'flex',
		margin: '20px 0',
	},
	btn: {
		marginRight: '5px'
	},
};

@inject('mainModel')
@observer
class ManageSettings extends React.Component {
	handleSettings = () => {
		const { mainModel } = this.props;

		mainModel.setRightPart('GeneralSettingsWrapper');
	};

	handleExportTemplate = () => {
		const { mainModel } = this.props;

		mainModel.settingsModel.downloadCurrentTemplate();
	};

	handleImportTemplate = (file) => {
		const { mainModel } = this.props;

		mainModel.generateBlockModel.clearGeneration();
		mainModel.settingsModel.importNewTemplate(file, mainModel);
	};

	handleBack = () => {
		const { mainModel } = this.props;

		mainModel.setLeftPart('ManageBlockWrapper');
		if (mainModel.generateBlockModel.pages.length) {
			mainModel.setRightPart('ManageResultsWrapper');
		} else {
			mainModel.setRightPart();
		}
	};

	render () {
		const { classes } = this.props;
		return (
			<div>
				<div className={`${classes.generateStyle} BtnGroup`}>
					<Button
						className='BtnGroup-item'
						icon={back}
						onclick={this.handleBack}
					/>
					<Button
						className='BtnGroup-item'
						label={'Settings'}
						onclick={this.handleSettings}/>
				</div>
				<div className={classes.buttonContainer}>
					<ReactFileReader
						handleFiles={file => {this.handleImportTemplate(file)}}
						fileTypes={[".json"]}
						multipleFiles={false}
					>
						<Button className={classes.btn} label={'Import'} icon={importIcon}/>
					</ReactFileReader>
					<Button className={classes.btn} label={'Export'} icon={exportIcon} onclick={this.handleExportTemplate}/>
				</div>
			</div>
		)
	}
}

ManageSettings.propTypes = {};

const ManageSettingsWrapper = injectSheet(styles)(ManageSettings);

export default ManageSettingsWrapper;
