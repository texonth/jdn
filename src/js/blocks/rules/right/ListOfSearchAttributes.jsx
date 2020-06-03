import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import { headerStyle, internalDivStyle } from "../../BlockStyles";
import { Button, Input } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';

const styles = {
  headerStyle,
  smallBtn: {
    border: "none",
  },
  containerStyle: {
    display: "flex",
    "align-items": "center",
    ...internalDivStyle,
  },
  textInput: {
    margin: "5px",
    width: "200px",
  },
  addRule: {
    border: "none",
    color: '#23a24d',
  },
  deleteRule: {
    color: '#dd2e44',
    marginLeft: "5px",
    border: "none",
  },
};

@inject("mainModel")
@observer
class ListOfSearchAttributes extends React.Component {
  handleChangeAttribute = (value, index) => {
    const { ruleBlockModel } = this.props.mainModel;
    ruleBlockModel.changeListOfAttr(value, index);
  };

  handleDeleteItem = (index) => {
    const { ruleBlockModel } = this.props.mainModel;
    ruleBlockModel.deleteItemFromListOfAttr(index);
  };

  handleAddItem = () => {
    const { ruleBlockModel } = this.props.mainModel;
    ruleBlockModel.addItemToListOfAttr();
  };

  render() {
    const { classes, mainModel } = this.props;
    const list = mainModel.ruleBlockModel.rules.ListOfSearchAttributes || [];
    return (
      <div>
        <div>
          <span className={classes.headerStyle}>Unique attributes </span>
          <Button
            className={classes.addRule}
            size='large'
            type='dashed'
            icon={<PlusOutlined />}
            onClick={this.handleAddItem}
          />
        </div>
        {list.map((item, index) => (
          <div className={classes.containerStyle} key={`general${index}`}>
            <Input
              className={classes.textInput}
              type="text"
              placeholder="Attribute name"
              value={item}
              index={index}
              onChange={(event) => {
                this.handleChangeAttribute(event.target.value, index);
              }}
            />
            <Button 
              className={classes.smallBtn, classes.deleteRule}
              icon={<CloseOutlined twoToneColor="#eb2f96" />}
              type="text"
              onClick={() => {
                this.handleDeleteItem(index);
              }}
            />
          </div>
        ))}
      </div>
    );
  }
}

ListOfSearchAttributes.propTypes = {};

const ListOfSearchAttributesWrapper = injectSheet(styles)(
  ListOfSearchAttributes
);

export default ListOfSearchAttributesWrapper;
