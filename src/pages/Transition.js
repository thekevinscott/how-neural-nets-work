import React, { Component } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

const getClassNames = (state, isBefore) => ({
  [`${state}Before`]: isBefore,
  [`${state}After`]: !isBefore,
  [`${state}`]: true,
});

export default () => Child => {
  return class Wrapper extends Component {
    render() {
      const {
        visible,
        classname,
        current,
        index,
      } = this.props;

      return (
        <CSSTransition
          in={this.props.in}
          classNames=""
          timeout={0}
        >
          {(state) => {
            if (!visible) {
              return null;
            }

            const isBefore = current > index ? true : false;

            return (
              <Child
                {...this.props}
                className={classNames(
                  classname || "",
                  getClassNames(state, isBefore)
                )}
                state={state}
                isBefore={isBefore}
              />
            );
          }}
        </CSSTransition>
      );
    }
  }
};
