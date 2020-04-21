import React from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';
import MediaQuery from 'react-responsive';
import { observer, Provider } from 'mobx-react';
import { observable } from "mobx";
import PropTypes from 'prop-types';
import ScreenSizes from './utils/screen-dimesions';
import { TabsBlockWrapper, LeftBlockWrapper, RightBlockWrapper } from './blocks/tabs/Tabs';
import LogComponentWrapper from './blocks/log/LogComponent';
import MainModel from './models/MainModel';


const styles = {
  commonContainer: {
    height: '100vh',
    position: 'relative'
  },
  contentContainerDesktopTablet: {
    display: 'flex',
    flexGrow: 1,
    marginLeft: '42px',
    height: '100vh',
    minHeight: 'fit-content'
  },
  contentContainerMobile: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '400px',
    minHeight: 'fit-content'
  }
};

@observer
class App extends React.Component {
  @observable mainModel = new MainModel();

  render () {
    const { classes } = this.props;
    const currentLeftPart = this.mainModel.currentLeftPart;
    const ComponentLeft = this.mainModel.ApplicationMap.get(this.mainModel.currentTab).componentsLeft[currentLeftPart];
    const currentRightPart = this.mainModel.currentRightPart;
    const ComponentRight = this.mainModel.ApplicationMap.get(this.mainModel.currentTab).componentsRight[currentRightPart];

    return (
      <Provider mainModel={this.mainModel}>
        <div className={classes.commonContainer}>
          <LogComponentWrapper/>
          {!this.mainModel.showLog && <div>
            <TabsBlockWrapper/>
            <MediaQuery minWidth={ScreenSizes.tablet}>
              <div className={classes.contentContainerDesktopTablet}>
                <LeftBlockWrapper><ComponentLeft/></LeftBlockWrapper>
                <RightBlockWrapper>{ComponentRight && <ComponentRight/>}</RightBlockWrapper>
              </div>
            </MediaQuery>
            <MediaQuery maxWidth={ScreenSizes.tablet}>
              <div className={classes.contentContainerMobile}>
                <LeftBlockWrapper><ComponentLeft/></LeftBlockWrapper>
                <RightBlockWrapper>{ComponentRight && <ComponentRight/>}</RightBlockWrapper>
              </div>
            </MediaQuery>
          </div>}
        </div>
      </Provider>
    )
  }
}

const AppWrapper = injectSheet(styles)(App);

const div = document.getElementById("chromeExtensionReactApp");

if (div instanceof Element) {
  ReactDOM.render(
    <AppWrapper/>
    , div);
}