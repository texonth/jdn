import React from 'react';
import injectSheet from 'react-jss';
import MediaQuery from 'react-responsive';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ScreenSizes from '../../utils/screen-dimesions';

const styles = {
	rotateBlockDesktop: {
		margin: {
			left: '-35px',
			top: '155px',
			// right: '-22px'
		},
		width: '100px',
		transform: 'rotate(-90deg)',
		position: 'absolute',
	},
	blockTablet: {
		width: '100%',
		position: 'relative',
		display: 'block',
		margin: {
			right: '5px'
		},
	},
	leftBlock: {
		border: '1px solid #e1e4e8',
		padding: '10px',
		minWidth: '35%',
		width: '100%',
		minHeight: '400px',
		overflow: 'overlay',
	},
	rightBlock: {
		border: '1px solid #e1e4e8',
		padding: '10px',
		minWidth: '65%',
		width: '100%',
		minHeight: '400px',
		overflow: 'overlay',
	},
};


@inject('mainModel')
@observer
class Nav extends React.Component {
	handleSwitchTab = (tab) => {
		const { mainModel } = this.props;

		mainModel.switchTab(tab);
		if (tab === 2 && mainModel.generateBlockModel.pages.length) {
			mainModel.setRightPart('GenerateResultsWrapper');
		}
	};

	render () {
		const { direction, mainModel } = this.props;

		return (
			<nav className={direction ? `UnderlineNav UnderlineNav--${direction}` : 'UnderlineNav UnderlineNav'}>
				<div className='UnderlineNav-body' style={direction ? { flexDirection: 'row-reverse' } : {}}>
					{[0, 1, 2].map((index) => {
						const tab = mainModel.ApplicationMap.get(index).tabName;
						return (<a
							href='#url'
							role='tab'
							title={tab}
							key={tab + index}
							className={cn('UnderlineNav-item', { 'selected': index === mainModel.currentTab })}
							onClick={() => {
								this.handleSwitchTab(index)
							}}
						>{tab}</a>)
					})}
				</div>
			</nav>
		)
	}
}

class TabsBlock extends React.Component {
	render () {
		const { classes } = this.props;

		return (
			<div>
				<MediaQuery minWidth={ScreenSizes.tablet}>
					<div className={classes.rotateBlockDesktop}>
						<Nav/>
					</div>
				</MediaQuery>
				<MediaQuery maxWidth={ScreenSizes.tablet}>
					<div className={classes.blockTablet}>
						<Nav direction={'right'}/>
					</div>
				</MediaQuery>
			</div>
		)
	}
}

class LeftBlock extends React.Component {
	render () {
		const { classes, children } = this.props;
		return (
			<div className={classes.leftBlock}>{children}</div>
		)
	}
}

class RightBlock extends React.Component {
	render () {
		const { classes, children } = this.props;
		return (
			<div className={classes.rightBlock}>{children}</div>
		)
	}
}

TabsBlock.propTypes = {};

const TabsBlockWrapper = injectSheet(styles)(TabsBlock);
const LeftBlockWrapper = injectSheet(styles)(LeftBlock);
const RightBlockWrapper = injectSheet(styles)(RightBlock);

export { TabsBlockWrapper, LeftBlockWrapper, RightBlockWrapper };
