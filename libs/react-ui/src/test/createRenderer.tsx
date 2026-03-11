import { Fragment, StrictMode, cloneElement } from 'react';
import {
  render as rtlRender,
  act,
  type RenderOptions as RTLRenderOptions,
  type RenderResult,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type WrapperComponent = React.JSXElementConstructor<{
  children?: React.ReactNode;
}>;

export interface AppRenderResult<P extends object = object> extends RenderResult {
  user: ReturnType<typeof userEvent.setup>;
  forceUpdate: () => void;
  setProps: (props: Partial<P>) => void;
  setPropsAsync: (props: Partial<P>) => Promise<void>;
}

export interface CreateRendererOptions {
  strict?: boolean;
  wrapper?: WrapperComponent;
}

export interface AppRenderOptions extends Omit<RTLRenderOptions, 'wrapper'> {
  strict?: boolean;
  wrapper?: WrapperComponent;
}

const mountUi = (
  ui: React.ReactElement,
  Wrapper: WrapperComponent | undefined,
  strict: boolean,
  renderKey?: number,
) => {
  const keyedUi = renderKey == null ? ui : <Fragment key={renderKey}>{ui}</Fragment>;
  const wrapped = Wrapper ? <Wrapper>{keyedUi}</Wrapper> : keyedUi;

  return strict ? <StrictMode>{wrapped}</StrictMode> : wrapped;
};

export const createRenderer = (globalOptions: CreateRendererOptions = {}) => {
  const { strict: globalStrict = true, wrapper: GlobalWrapper } = globalOptions;

  return {
    render: <P extends object>(
      element: React.ReactElement<P>,
      options: AppRenderOptions = {},
    ): AppRenderResult<P> => {
      const { strict = globalStrict, wrapper = GlobalWrapper, ...rtlOptions } = options;

      let currentElement = element;
      let renderKey = 0;

      const result = rtlRender(mountUi(currentElement, wrapper, strict, renderKey), rtlOptions);
      const user = userEvent.setup();

      return {
        ...result,
        user,

        forceUpdate: () => {
          renderKey += 1;
          result.rerender(mountUi(currentElement, wrapper, strict, renderKey));
        },

        setProps: (props) => {
          currentElement = cloneElement(currentElement, props);
          result.rerender(mountUi(currentElement, wrapper, strict, renderKey));
        },

        setPropsAsync: async (props) => {
          await act(async () => {
            currentElement = cloneElement(currentElement, props);
            result.rerender(mountUi(currentElement, wrapper, strict, renderKey));
          });
        },
      };
    },
  };
};
