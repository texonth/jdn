import React from "react";
import ReactFileReader from "react-file-reader";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";
import { Button, Tag } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { headerStyle } from "../../BlockStyles";

const styles = {
  headerStyle,
  buttonContainer: {
    display: "flex",
    margin: "20px 0",
  },
  btn: {
    marginRight: "5px",
  },
  list: {
    paddingLeft: "15px",
    display: "block",
  },
  link: {
    color: "black",
    cursor: "pointer",
  },
};

@observer
class ListOfHiddenItems extends React.Component {
  @observable show = false;

  @action
  handleShowList = () => {
    const { onClickRule, rightPart } = this.props;
    this.show = !this.show;
    onClickRule();
  };

  handleClickRule = (rule) => {
    const { onClickRule, rightPart, ruleSet } = this.props;

    onClickRule(rightPart, rule, ruleSet);
  };

  render() {
    const { name, list, className, linkClass } = this.props;
    return (
      <li>
        <a className={linkClass} onClick={this.handleShowList}>
          {name}
        </a>
        {this.show && (
          <ul className={className}>
            {list.map((item, index) => (
              <li
                key={item + index}
                onClick={() => {
                  this.handleClickRule(item);
                }}
              >
                <a className={linkClass}>{item}</a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }
}

@inject("mainModel")
@observer
class RulesBlock extends React.Component {
  handleSwitchRightPart = (part, currentRule, ruleSet) => {
    const { mainModel } = this.props;

    mainModel.setRightPart(part, currentRule, ruleSet);
    ruleSet
      ? mainModel.ruleBlockModel.setCurrentRuleSet(ruleSet)
      : mainModel.ruleBlockModel.setCurrentRuleSet("");
    currentRule
      ? mainModel.ruleBlockModel.setCurrentRuleName(currentRule)
      : mainModel.ruleBlockModel.setCurrentRuleName("");
  };

  handleExportRules = () => {
    const { mainModel } = this.props;
    const rulesName = mainModel.settingsModel.framework;

    mainModel.ruleBlockModel.downloadCurrentRules(rulesName);
  };

  handleImportRules = (file) => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.clearGeneration();
    mainModel.ruleBlockModel.importRules(file, mainModel);
  };

  render() {
    const { classes, mainModel } = this.props;
    const simpleRules =
      Object.keys(mainModel.ruleBlockModel.rules.SimpleRules) || [];
    const complexRules =
      Object.keys(mainModel.ruleBlockModel.rules.ComplexRules) || [];
    const compositeRules =
      Object.keys(mainModel.ruleBlockModel.rules.CompositeRules) || [];

    return (
      <div>
        <span className={classes.headerStyle}>Page: </span>
        <Tag color="#6f42c1">{mainModel.ruleBlockModel.ruleName}</Tag>
        <div className={classes.buttonContainer}>
          <ReactFileReader
            handleFiles={(file) => {
              this.handleImportRules(file);
            }}
            fileTypes={[".json"]}
            multipleFiles={false}
          >
            <Button
              icon={<LoginOutlined />}
              size='large'
            >
              Import
            </Button>
          </ReactFileReader>
          <Button
            icon={<LogoutOutlined />}
            size='large'
            onClick={this.handleExportRules}
          >
            Export
          </Button>
        </div>
        <div>
          <ul className={classes.list}>
            <li>
              <a
                className={classes.link}
                onClick={() => {
                  this.handleSwitchRightPart("ListOfSearchAttributesWrapper");
                }}
              >
                List of search attributes
              </a>
            </li>
            <ListOfHiddenItems
              name={"Simple elements"}
              className={classes.list}
              linkClass={classes.link}
              list={simpleRules}
              ruleSet={"SimpleRules"}
              rightPart={"RuleForElementWrapper"}
              onClickRule={this.handleSwitchRightPart}
            />
            <ListOfHiddenItems
              name={"Complex elements"}
              className={classes.list}
              linkClass={classes.link}
              list={complexRules}
              ruleSet={"ComplexRules"}
              rightPart={"RuleForElementWrapper"}
              onClickRule={this.handleSwitchRightPart}
            />
            <ListOfHiddenItems
              name={"Composite elements"}
              className={classes.list}
              linkClass={classes.link}
              list={compositeRules}
              ruleSet={"CompositeRules"}
              rightPart={"RuleForElementWrapper"}
              onClickRule={this.handleSwitchRightPart}
            />
          </ul>
        </div>
      </div>
    );
  }
}

RulesBlock.propTypes = {};

const RulesBlockWrapper = injectSheet(styles)(RulesBlock);

export default RulesBlockWrapper;
