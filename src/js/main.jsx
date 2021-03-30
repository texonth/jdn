import React from "react";
import ReactDOM from "react-dom";
import injectSheet from "react-jss";
import { observer, Provider } from "mobx-react";
import {computed, observable} from "mobx";

import GenerateResultsWrapper from "./blocks/generate/GenerateResults";
import GeneralSettingsWrapper from "./blocks/generate/GeneralSettings";
import { RulesBlock } from "./blocks/rules/RulesBlock";

import GenerateBlockWrapper from "./blocks/generate/GenerateBlock";

import MainModel from "./models/MainModel";

import { Menu, Button, Row, Col } from "antd";
const { SubMenu } = Menu;

import "antd/lib/style/themes/default.less";
import "antd/dist/antd.less";
import "../css/main.less";
const styles = {
  commonContainer: {
    position: "relative",
    overflowX: "hidden",
  },
  contentContainerDesktopTablet: {
    display: "flex",
    flexGrow: 1,
    marginLeft: "42px",
    height: "100vh",
    minHeight: "fit-content",
  },
  contentContainerMobile: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "400px",
    minHeight: "fit-content",
  },
};

@observer
class App extends React.Component {
  @observable mainModel = new MainModel();

  handleClick = (e) => {
    this.mainModel.setTab(e.key);
    this.setState({tab: e.key});
  };

  @computed get tab() {
    return this.mainModel.tab;
  }

  render() {
    const { classes } = this.props;
    console.log(this.props);
    console.log(this.mainModel);
    return (
      <Provider mainModel={this.mainModel}>
        <div className={classes.commonContainer}>
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.tab]}
            mode="horizontal"
          >
            <Menu.Item key="settings">Settings</Menu.Item>
            <Menu.Item key="urls">URLs</Menu.Item>
            <Menu.Item key="results">Results</Menu.Item>
            <Menu.Item disabled={true}>
              <Button size={"small"} type="primary">
                GENERATE
              </Button>
            </Menu.Item>
            <Menu.Item key="warnings">Warnings</Menu.Item>
          </Menu>

          {this.tab === "settings" && (
            <div key="settings">
              <Row>
                <Col span={8}>
                  <GeneralSettingsWrapper></GeneralSettingsWrapper>
                </Col>
                <Col
                  span={16}
                  style={{
                    padding: "10px",
                    minHeight: "100vh",
                    borderLeft: "2px solid #d8d8d8",
                  }}
                >
                  <RulesBlock></RulesBlock>
                </Col>
              </Row>
            </div>
          )}

          {this.tab === "urls" && (
            <div key="urls">
              <GenerateBlockWrapper></GenerateBlockWrapper>
              <GenerateResultsWrapper></GenerateResultsWrapper>
            </div>
          )}

          {this.tab === "results" && (
            <div key="results">
              {/*<ListOfSearchAttributesWrapper></ListOfSearchAttributesWrapper>*/}
              {/*<GeneralSettingsWrapper></GeneralSettingsWrapper>*/}
              <GenerateResultsWrapper></GenerateResultsWrapper>
            </div>
          )}

          {/*<LogComponentWrapper />*/}
          {/*{!this.mainModel.showLog && (*/}
          {/*<div>*/}
          {/*<TabsBlockWrapper />*/}
          {/*<MediaQuery minWidth={ScreenSizes.tablet}>*/}
          {/*<div className={classes.contentContainerDesktopTablet}>*/}
          {/*<LeftBlockWrapper>*/}
          {/*<ComponentLeft />*/}
          {/*</LeftBlockWrapper>*/}
          {/*<RightBlockWrapper>*/}
          {/*{ComponentRight && <ComponentRight />}*/}
          {/*</RightBlockWrapper>*/}
          {/*</div>*/}
          {/*</MediaQuery>*/}
          {/*<MediaQuery maxWidth={ScreenSizes.tablet}>*/}
          {/*<div className={classes.contentContainerMobile}>*/}
          {/*<LeftBlockWrapper>*/}
          {/*<ComponentLeft />*/}
          {/*</LeftBlockWrapper>*/}
          {/*<RightBlockWrapper>*/}
          {/*{ComponentRight && <ComponentRight />}*/}
          {/*</RightBlockWrapper>*/}
          {/*</div>*/}
          {/*</MediaQuery>*/}
          {/*</div>*/}
          {/*)}*/}
        </div>
      </Provider>
    );
  }
}

const AppWrapper = injectSheet(styles)(App);

const div = document.getElementById("chromeExtensionReactApp");

if (div instanceof Element) {
  ReactDOM.render(<AppWrapper />, div);
}
