import { Menu as AntMenu, Icon, Switch } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import config from 'utils/config';
import { arrayToTree } from 'utils';
import ReactAuthority from 'react-authority';

const { menu, menuSort } = config;
const menuMap = {};
menu.forEach(m => menuMap[m.key] = m);

class Menu extends Component {
  constructor(props) {
    super(props);
    this.menuTree = arrayToTree(menu, 'key', 'pKey', 'children');
    this.state = {
      openedKeys: this.getOpenedKeys()
    };
  }

  getCurrentKey() {
    const { pathname } = this.props.location;
    const key = pathname.replace(/^\//, '');
    const currentMenu = menu.find(m => m.route === pathname || key === m.key);
    return currentMenu && currentMenu.key;
  }

  getOpenedKeys() {
    let currentKey = this.getCurrentKey();
    const openedKeys = [];

    let pKey = menuMap[currentKey].pKey;
    while(pKey) {
      openedKeys.push(pKey);
      pKey = menuMap[pKey].pKey;
    }
    return openedKeys;
  }

  handleOpenChange = (keys) => {
    const { openedKeys } = this.state;
    if (keys.length < openedKeys.length) {
      this.setState({ openedKeys: keys });
    } else {
      const oldSet = new Set(openedKeys);
      let addKey = '';
      for(let k of keys) {
        if (!oldSet.has(k)) {
          addKey = k;
          break;
        }
      }

      const addPKey = menuMap[addKey].pKey;
      const newOpenedKeys = keys.filter(k => {
        return k === addKey || menuMap[k].pKey !== addPKey;
      });
      this.setState({
        openedKeys: newOpenedKeys
      });
    }

  }

  renderMenu([...menus ]) {
    const { app: { permissions = [] } } = this.props;
    menus.sort((a, b) => {
      let first = menuSort.find(m => m === a.key || m === b.key);
      return !first || first === a.key ? -1 : 1;
    });
    return menus.map(m => {
      if (m.children) {
        return (
          <ReactAuthority key={m.key} code={m.code} permission={permissions}>
            <AntMenu.SubMenu
              key={m.key}
              title={
                <span><Icon type={m.icon} /><span>{m.title}</span></span>
              }
            >
              {this.renderMenu(m.children)}
            </AntMenu.SubMenu>
          </ReactAuthority>
        );
      } else {
        return (
          <ReactAuthority key={m.key} code={m.code} permission={permissions}>
            <AntMenu.Item key={m.key}>
              <Link to={m.route}>
                <Icon type={m.icon} />
                <span>{m.title}</span>
              </Link>
            </AntMenu.Item>
          </ReactAuthority>
        );
      }
    });
  }

  render() {
    const { collapsed } = this.props;
    return (
      <div>
        <AntMenu
          theme="dark"
          mode={collapsed ? 'vertical' : 'inline'}
          inlineCollapsed={collapsed}
          selectedKeys={[this.getCurrentKey()]}
          openKeys={this.state.openedKeys}
          onOpenChange={this.handleOpenChange}
        >
          { this.renderMenu(this.menuTree) }
        </AntMenu>
      </div>
    )

  }
}


export default withRouter(connect(({ app, loading }) => ({ app, loading }))(Menu))
