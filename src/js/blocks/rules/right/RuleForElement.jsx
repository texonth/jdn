import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import { headerStyle, internalDivStyle } from "../../BlockStyles";
import { Input } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

const styles = {
  headerStyle,
  smallBtn: {
    width: "24px",
    height: "24px",
    padding: 0,
  },
  containerStyle: {
    display: "flex",
    ...internalDivStyle,
  },
  textInput: {
    margin: "5px",
    width: "200px",
  },
  headerContainer: {
    borderBottom: "2px solid #e1e4e8",
    padding: "0 10px 10px 10px",
    margin: "0 -10px",
  },
  navContainer: {
    margin: "0 -10px",
  },
  fieldsContainer: {
    marginTop: "10px",
  },
  fields: {
    margin: "5px 0",
  },
  field: {
    display: "inline-block",
    width: "100px",
  },
  addRule: {
    color: '#23a24d',
  },
  deleteRule: {
    color: '#dd2e44',
    marginLeft: "5px",
  },
  ruleLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};

@inject("mainModel")
@observer
class RuleForElement extends React.Component {
  @observable isEditable = false;

  handleEditRuleName = () => {
    this.isEditable = !this.isEditable;
  };

  handleSwitchTab = (index) => {
    this.props.mainModel.ruleBlockModel.handleSwitchRule(index);
  };

  getCurrentRuleFields = (rules, index) => {
    if (rules && rules.length) {
      return Object.keys(rules[index]);
    }
    return [];
  };

  handleDeleteRule = (e, index) => {
    e.stopPropagation();
    this.props.mainModel.ruleBlockModel.handleDeleteRuleItem(index);
  };

  handleAddRule = () => {
    this.props.mainModel.ruleBlockModel.handleAddRuleItem();
  };

  handleEditRule = (value, field) => {
    this.props.mainModel.ruleBlockModel.handleEditRuleName(value, field);
  };

  render() {
    const { classes, mainModel } = this.props;
    const title = mainModel.ruleBlockModel.currentRuleName;
    const ruleSet = mainModel.ruleBlockModel.currentRuleSet;
    const rules = mainModel.ruleBlockModel.rules[ruleSet][title] || [];
    const itemIndex = mainModel.ruleBlockModel.currentRuleItem;
    const ruleFields = this.getCurrentRuleFields(rules, itemIndex);

    return (
      <div>
        <div className={classes.headerContainer}>
          <span className={classes.headerStyle}>{title}</span>
        </div>
        <nav className={`UnderlineNav ${classes.navContainer}`}>
          <div className="UnderlineNav-body">
            {rules.map((rule, index) => {
              const cl = index === itemIndex ? ` selected` : "";
              return (
                <a
                  role="tab"
                  key={`Rule ${index + 1}`}
                  className={`UnderlineNav-item ${classes.ruleLink} ${cl}`}
                  onClick={() => {
                    this.handleSwitchTab(index);
                  }}
                >
                  {`Rule ${index + 1}`}
                  <CloseOutlined 
                    className={classes.deleteRule}
                    onClick={(e) => {
                      this.handleDeleteRule(e, index);
                    }}
                  />
                </a>
              );
            })}
            <a role="tab" className="UnderlineNav-item">
              <PlusOutlined 
                className={classes.addRule}
                onClick={this.handleAddRule}
              />
            </a>
          </div>
        </nav>
        <div className={classes.fieldsContainer}>
          {ruleFields.map((field) => {
            if (field !== "id") {
              return (
                <div key={field + title} className={classes.fields}>
                  <span className={classes.field}>{field} </span>
                  <Input
                    className='form-control textInput'
                    className={classes. textInput}
                    type="text"
                    value={rules[itemIndex][field]}
                    onChange={(e) => {
                      this.handleEditRule(e.target.value, field);
                    }}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

RuleForElement.propTypes = {};

const RuleForElementWrapper = injectSheet(styles)(RuleForElement);

export default RuleForElementWrapper;
