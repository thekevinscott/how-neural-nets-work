import React, { Component } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

const getClassNames = (state, isBefore) => ({
  [`${state}Before`]: isBefore,
  [`${state}After`]: !isBefore,
  [`${state}`]: true,
});

export default (args = {}) => Child => {
  return class Wrapper extends Component {
    render() {
      const {
        visible,
        className,
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

            if (args.styles) {
              const _className = classNames(
                args.className,
                ...classNames(
                  className || "",
                  getClassNames(state, isBefore)
                ).split(" ").map(name => {
                  return args.styles[name];
                }),
              );
              return (
                <div
                  className={_className}
                  style={{
                    transitionDuration: `${this.props.duration}ms`,
                  }}
                >
                  <Child
                    {...this.props}
                    state={state}
                    isBefore={isBefore}
                  />
                </div>
              );
            }

            return (
              <Child
                {...this.props}
                className={classNames(
                  className || "",
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
