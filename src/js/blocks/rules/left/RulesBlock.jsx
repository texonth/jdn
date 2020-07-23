import React from "react";
import ReactFileReader from "react-file-reader";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";
import PropTypes from "prop-types";
import { Button } from "antd";
import LabelWrapper from "../../../components/Label/Label";
import { exportIcon, importIcon } from "../../../../icons/index";
import { headerStyle } from "../../BlockStyles";
import { Icon } from '@ant-design/icons';

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
        <LabelWrapper>{mainModel.ruleBlockModel.ruleName}</LabelWrapper>
        <div className={classes.buttonContainer}>
          <ReactFileReader
            handleFiles={(file) => {
              this.handleImportRules(file);
            }}
            fileTypes={[".json"]}
            multipleFiles={false}
          >

            <Button
              size={'small'}
            ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#464547" d="M8.25 12.125c.365 0 .674-.128.93-.383l3.937-3.937c.255-.274.383-.588.383-.944 0-.355-.123-.66-.37-.916-.245-.255-.56-.383-.943-.383h-1.421V2.938c0-.364-.128-.674-.383-.93-.255-.254-.565-.382-.93-.382H7.047c-.365 0-.675.128-.93.383s-.383.565-.383.93v2.624H4.313c-.365 0-.67.128-.917.383-.246.256-.373.56-.382.916-.01.356.114.67.369.944l3.937 3.937c.256.255.565.383.93.383zm0-1.313L4.312 6.876h2.735V2.937h2.406v3.938h2.735L8.25 10.813zm4.922 3.063c.091 0 .168-.032.232-.096s.096-.141.096-.232v-.656c0-.092-.032-.169-.096-.233s-.141-.095-.232-.095H3.328c-.091 0-.168.031-.232.095S3 12.8 3 12.891v.656c0 .091.032.168.096.232s.141.096.232.096h9.844z"/>
            </svg>Import</Button>
          </ReactFileReader>
          <Button
            size={'small'}
            onClick={this.handleExportRules}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path fill="#464547" d="M9.453 11.688c.365 0 .675-.128.93-.383.255-.256.383-.565.383-.93V8.187h1.421c.383 0 .698-.127.944-.382.246-.256.369-.56.369-.916s-.128-.67-.383-.944L9.18 2.008c-.256-.255-.565-.383-.93-.383-.365 0-.674.128-.93.383L3.383 5.945C3.128 6.22 3 6.533 3 6.89c0 .355.123.66.37.916.245.255.56.383.942.383h1.422v2.187c0 .365.128.674.383.93.255.255.565.383.93.383h2.406zm0-1.313H7.047v-3.5H4.313L8.25 2.937l3.938 3.938H9.453v3.5zm3.719 3.5c.091 0 .168-.032.232-.096s.096-.141.096-.232v-.656c0-.092-.032-.169-.096-.233s-.141-.095-.232-.095H3.328c-.091 0-.168.031-.232.095S3 12.8 3 12.891v.656c0 .091.032.168.096.232s.141.096.232.096h9.844z"/>
            </svg>Export</Button>
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
