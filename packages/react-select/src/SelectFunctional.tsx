import * as React from 'react';
import {
  AriaAttributes,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  RefCallback,
  TouchEventHandler,
  // MouseEventHandler,
  // FormEventHandler,
} from 'react';
// import { MenuPlacer } from './components/Menu';
// import {
//   formatGroupLabel as formatGroupLabelBuiltin,
//   getOptionLabel as getOptionLabelBuiltin,
//   getOptionValue as getOptionValueBuiltin,
//   isOptionDisabled as isOptionDisabledBuiltin,
// } from './builtins';
import { AriaLiveMessages, AriaSelection } from './accessibility/index';
import {
  ActionMeta,
  GroupBase,
  Options,
  GetOptionLabel,
  GetOptionValue,
  InputActionMeta,
  MenuPlacement,
  MenuPosition,
  OnChangeValue,
  OptionsOrGroups,
  PropsValue,
  FocusDirection,
  SetValueAction,
} from './types';
import {
  ClassNamesConfig,
  defaultStyles,
  StylesConfig,
  StylesProps,
} from './styles';
import { FilterOptionOption } from './filters';
import { defaultTheme, ThemeConfig } from './theme';
// import { isAppleDevice } from './accessibility/helpers';
import {
  classNames,
  // cleanValue,
  // isTouchCapable,
  // isMobileDevice,
  // noop,
  // scrollIntoView,
  // isDocumentElement,
  notNullish,
  valueTernary,
  multiValueAsValue,
  singleValueAsValue,
} from './utils';
import { defaultComponents, SelectComponentsConfig } from './components/index';
// import { DummyInput, ScrollManager } from './internal/index';

interface FocusableOptionWithId<Option> {
  data: Option;
  id: string;
}
export type FormatOptionLabelContext = 'menu' | 'value';
export interface FormatOptionLabelMeta<Option> {
  context: FormatOptionLabelContext;
  inputValue: string;
  selectValue: Options<Option>;
}

export interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  /** HTML ID of an element containing an error message related to the input**/
  'aria-errormessage'?: AriaAttributes['aria-errormessage'];
  /** Indicate if the value entered in the field is invalid **/
  'aria-invalid'?: AriaAttributes['aria-invalid'];
  /** Aria label (for assistive tech) */
  'aria-label'?: AriaAttributes['aria-label'];
  /** HTML ID of an element that should be used as the label (for assistive tech) */
  'aria-labelledby'?: AriaAttributes['aria-labelledby'];
  /** Used to set the priority with which screen reader should treat updates to live regions. The possible settings are: off, polite (default) or assertive */
  'aria-live'?: AriaAttributes['aria-live'];
  /** Customise the messages used by the aria-live component */
  ariaLiveMessages?: AriaLiveMessages<Option, IsMulti, Group>;
  /** Focus the control when it is mounted */
  autoFocus?: boolean;
  /** Remove the currently focused option when the user presses backspace when Select isClearable or isMulti */
  backspaceRemovesValue: boolean;
  /** Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices) */
  blurInputOnSelect: boolean;
  /** When the user reaches the top/bottom of the menu, prevent scroll on the scroll-parent  */
  captureMenuScroll: boolean;
  /** Sets a className attribute on the outer component */
  className?: string;
  /**
   * If provided, all inner components will be given a prefixed className attribute.
   *
   * This is useful when styling via CSS classes instead of the Styles API approach.
   */
  classNamePrefix?: string | null;
  /**
   * Provide classNames based on state for each inner component
   */
  classNames: ClassNamesConfig<Option, IsMulti, Group>;
  /** Close the select menu when the user selects an option */
  closeMenuOnSelect: boolean;
  /**
   * If `true`, close the select menu when the user scrolls the document/body.
   *
   * If a function, takes a standard javascript `ScrollEvent` you return a boolean:
   *
   * `true` => The menu closes
   *
   * `false` => The menu stays open
   *
   * This is useful when you have a scrollable modal and want to portal the menu out,
   * but want to avoid graphical issues.
   */
  closeMenuOnScroll: boolean | ((event: Event) => boolean);
  /**
   * This complex object includes all the compositional components that are used
   * in `react-select`. If you wish to overwrite a component, pass in an object
   * with the appropriate namespace.
   *
   * If you only wish to restyle a component, we recommend using the `styles` prop
   * instead. For a list of the components that can be passed in, and the shape
   * that will be passed to them, see [the components docs](/components)
   */
  components: SelectComponentsConfig<Option, IsMulti, Group>;
  /** Whether the value of the select, e.g. SingleValue, should be displayed in the control. */
  controlShouldRenderValue: boolean;
  /** Delimiter used to join multiple values into a single HTML Input value */
  delimiter?: string;
  /** Clear all values when the user presses escape AND the menu is closed */
  escapeClearsValue: boolean;
  /** Custom method to filter whether an option should be displayed in the menu */
  filterOption:
    | ((option: FilterOptionOption<Option>, inputValue: string) => boolean)
    | null;
  /**
   * Formats group labels in the menu as React components
   *
   * An example can be found in the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  formatGroupLabel: (group: Group) => ReactNode;
  /** Formats option labels in the menu and control as React components */
  formatOptionLabel?: (
    data: Option,
    formatOptionLabelMeta: FormatOptionLabelMeta<Option>
  ) => ReactNode;
  /**
   * Resolves option data to a string to be displayed as the label by components
   *
   * Note: Failure to resolve to a string type can interfere with filtering and
   * screen reader support.
   */
  getOptionLabel: GetOptionLabel<Option>;
  /** Resolves option data to a string to compare options and specify value attributes */
  getOptionValue: GetOptionValue<Option>;
  /** Hide the selected option from the menu */
  hideSelectedOptions?: boolean;
  /** The id to set on the SelectContainer component. */
  id?: string;
  /** The value of the search input */
  inputValue: string;
  /** The id of the search input */
  inputId?: string;
  /** Define an id prefix for the select components e.g. {your-id}-value */
  instanceId?: number | string;
  /** Is the select value clearable */
  isClearable?: boolean;
  /** Is the select disabled */
  isDisabled: boolean;
  /** Is the select in a state of loading (async) */
  isLoading: boolean;
  /**
   * Override the built-in logic to detect whether an option is disabled
   *
   * An example can be found in the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  isOptionDisabled: (option: Option, selectValue: Options<Option>) => boolean;
  /** Override the built-in logic to detect whether an option is selected */
  isOptionSelected?: (option: Option, selectValue: Options<Option>) => boolean;
  /** Support multiple selected options */
  isMulti: IsMulti;
  /** Is the select direction right-to-left */
  isRtl: boolean;
  /** Whether to enable search functionality */
  isSearchable: boolean;
  /** Async: Text to display when loading options */
  loadingMessage: (obj: { inputValue: string }) => ReactNode;
  /** Minimum height of the menu before flipping */
  minMenuHeight: number;
  /** Maximum height of the menu before scrolling */
  maxMenuHeight: number;
  /** Whether the menu is open */
  menuIsOpen: boolean;
  /**
   * Default placement of the menu in relation to the control. 'auto' will flip
   * when there isn't enough space below the control.
   */
  menuPlacement: MenuPlacement;
  /** The CSS position value of the menu, when "fixed" extra layout management is required */
  menuPosition: MenuPosition;
  /**
   * Whether the menu should use a portal, and where it should attach
   *
   * An example can be found in the [Portaling](/advanced#portaling) documentation
   */
  menuPortalTarget?: HTMLElement | null;
  /** Whether to block scroll events when the menu is open */
  menuShouldBlockScroll: boolean;
  /** Whether the menu should be scrolled into view when it opens */
  menuShouldScrollIntoView: boolean;
  /** Name of the HTML Input (optional - without this, no input will be rendered) */
  name?: string;
  /** Text to display when there are no options */
  noOptionsMessage: (obj: { inputValue: string }) => ReactNode;
  /** Handle blur events on the control */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the select */
  onChange: (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => void;
  /** Handle focus events on the control */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the input */
  onInputChange: (newValue: string, actionMeta: InputActionMeta) => void;
  /** Handle key down events on the select */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  /** Handle the menu opening */
  onMenuOpen: () => void;
  /** Handle the menu closing */
  onMenuClose: () => void;
  /** Fired when the user scrolls to the top of the menu */
  onMenuScrollToTop?: (event: WheelEvent | TouchEvent) => void;
  /** Fired when the user scrolls to the bottom of the menu */
  onMenuScrollToBottom?: (event: WheelEvent | TouchEvent) => void;
  /** Allows control of whether the menu is opened when the Select is focused */
  openMenuOnFocus: boolean;
  /** Allows control of whether the menu is opened when the Select is clicked */
  openMenuOnClick: boolean;
  /** Array of options that populate the select menu */
  options: OptionsOrGroups<Option, Group>;
  /** Number of options to jump in menu when page{up|down} keys are used */
  pageSize: number;
  /** Placeholder for the select value */
  placeholder: ReactNode;
  /** Status to relay to screen readers */
  screenReaderStatus: (obj: { count: number }) => string;
  /**
   * Style modifier methods
   *
   * A basic example can be found at the bottom of the [Replacing builtins](/advanced#replacing-builtins) documentation.
   */
  styles: StylesConfig<Option, IsMulti, Group>;
  /** Theme modifier method */
  theme?: ThemeConfig;
  /** Sets the tabIndex attribute on the input */
  tabIndex: number;
  /** Select the currently focused option when the user presses tab */
  tabSelectsValue: boolean;
  /** Remove all non-essential styles */
  unstyled: boolean;
  /** The value of the select; reflected by the selected option */
  value: PropsValue<Option>;
  /** Sets the form attribute on the input */
  form?: string;
  /** Marks the value-holding input as required for form validation */
  required?: boolean;
}

interface State<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  ariaSelection: AriaSelection<Option, IsMulti> | null;
  inputIsHidden: boolean;
  isFocused: boolean;
  focusedOption: Option | null;
  focusedOptionId: string | null;
  focusableOptionsWithIds: FocusableOptionWithId<Option>[];
  focusedValue: Option | null;
  selectValue: Options<Option>;
  clearFocusValueOnUpdate: boolean;
  prevWasFocused: boolean;
  inputIsHiddenAfterUpdate: boolean | null | undefined;
  prevProps: Props<Option, IsMulti, Group> | void;
  instancePrefix: string;
}

interface CategorizedOption<Option> {
  type: 'option';
  data: Option;
  isDisabled: boolean;
  isSelected: boolean;
  label: string;
  value: string;
  index: number;
}

interface CategorizedGroup<Option, Group extends GroupBase<Option>> {
  type: 'group';
  data: Group;
  options: readonly CategorizedOption<Option>[];
  index: number;
}

type CategorizedGroupOrOption<Option, Group extends GroupBase<Option>> =
  | CategorizedGroup<Option, Group>
  | CategorizedOption<Option>;

function buildFocusableOptionsFromCategorizedOptions<
  Option,
  Group extends GroupBase<Option>
>(categorizedOptions: readonly CategorizedGroupOrOption<Option, Group>[]) {
  return categorizedOptions.reduce<Option[]>(
    (optionsAccumulator, categorizedOption) => {
      if (categorizedOption.type === 'group') {
        optionsAccumulator.push(
          ...categorizedOption.options.map((option) => option.data)
        );
      } else {
        optionsAccumulator.push(categorizedOption.data);
      }
      return optionsAccumulator;
    },
    []
  );
}

function isOptionDisabled<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>
): boolean {
  return typeof props.isOptionDisabled === 'function'
    ? props.isOptionDisabled(option, selectValue)
    : false;
}

const getOptionValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  data: Option
): string => {
  return props.getOptionValue(data);
};

const shouldHideSelectedOptions = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>
) => {
  const { hideSelectedOptions, isMulti } = props;
  if (hideSelectedOptions === undefined) return isMulti;
  return hideSelectedOptions;
};

function isOptionSelected<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>
): boolean {
  if (selectValue.indexOf(option) > -1) return true;
  if (typeof props.isOptionSelected === 'function') {
    return props.isOptionSelected(option, selectValue);
  }
  const candidate = getOptionValue(props, option);
  return selectValue.some((i) => getOptionValue(props, i) === candidate);
}
function toCategorizedOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: Option,
  selectValue: Options<Option>,
  index: number
): CategorizedOption<Option> {
  const isDisabled = isOptionDisabled(props, option, selectValue);
  const isSelected = isOptionSelected(props, option, selectValue);
  const label = getOptionLabel(props, option);
  const value = getOptionValue(props, option);

  return {
    type: 'option',
    data: option,
    isDisabled,
    isSelected,
    label,
    value,
    index,
  };
}

const getOptionLabel = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  data: Option
): string => {
  return props.getOptionLabel(data);
};

function filterOption<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  option: FilterOptionOption<Option>,
  inputValue: string
) {
  return props.filterOption ? props.filterOption(option, inputValue) : true;
}

function isFocusable<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  categorizedOption: CategorizedOption<Option>
) {
  const { inputValue = '' } = props;
  const { data, isSelected, label, value } = categorizedOption;

  return (
    (!shouldHideSelectedOptions(props) || !isSelected) &&
    filterOption(props, { label, value, data }, inputValue)
  );
}

function buildCategorizedOptions<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>,
  selectValue: Options<Option>
): CategorizedGroupOrOption<Option, Group>[] {
  return props.options
    .map((groupOrOption, groupOrOptionIndex) => {
      if ('options' in groupOrOption) {
        const categorizedOptions = groupOrOption.options
          .map((option, optionIndex) =>
            toCategorizedOption(props, option, selectValue, optionIndex)
          )
          .filter((categorizedOption) => isFocusable(props, categorizedOption));
        return categorizedOptions.length > 0
          ? {
              type: 'group' as const,
              data: groupOrOption,
              options: categorizedOptions,
              index: groupOrOptionIndex,
            }
          : undefined;
      }
      const categorizedOption = toCategorizedOption(
        props,
        groupOrOption,
        selectValue,
        groupOrOptionIndex
      );
      return isFocusable(props, categorizedOption)
        ? categorizedOption
        : undefined;
    })
    .filter(notNullish);
}

export default function SelectFunctional<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  const [selectState, setSelectState] = React.useState<
    State<Option, IsMulti, Group>
  >({
    ariaSelection: null,
    focusedOption: null,
    focusedOptionId: null,
    focusableOptionsWithIds: [],
    focusedValue: null,
    inputIsHidden: false,
    isFocused: false,
    selectValue: [],
    clearFocusValueOnUpdate: false,
    prevWasFocused: false,
    inputIsHiddenAfterUpdate: undefined,
    prevProps: undefined,
    instancePrefix: '',
  });
  React.useEffect(() => {
    setSelectState({
      ariaSelection: null,
      focusedOption: null,
      focusedOptionId: null,
      focusableOptionsWithIds: [],
      focusedValue: null,
      inputIsHidden: false,
      isFocused: false,
      selectValue: [],
      clearFocusValueOnUpdate: false,
      prevWasFocused: false,
      inputIsHiddenAfterUpdate: undefined,
      prevProps: undefined,
      instancePrefix: '',
    });
  }, []);

  // Refs
  // ------------------------------

  const controlRef = React.useRef<HTMLDivElement | null>(null);
  const getControlRef: RefCallback<HTMLDivElement> = (ref) => {
    controlRef.current = ref;
  };
  // const focusedOptionRef = React.useRef<HTMLDivElement | null>(null);
  // const getFocusedOptionRef: RefCallback<HTMLDivElement> = (ref) => {
  //   focusedOptionRef.current = ref;
  // };
  const menuListRef = React.useRef<HTMLDivElement | null>(null);
  // const getMenuListRef: RefCallback<HTMLDivElement> = (ref) => {
  //   menuListRef.current = ref;
  // };
  // let inputRef: HTMLInputElement | null = null;
  // const inputRef = React.useRef<HTMLDivElement | null>(null);
  // const getInputRef: RefCallback<HTMLInputElement> = (ref) => {
  //   inputRef.current = ref;
  // };

  const buildFocusableOptions = () =>
    buildFocusableOptionsFromCategorizedOptions(
      buildCategorizedOptions(props, selectState.selectValue)
    );

  const getFocusableOptions = () =>
    props.menuIsOpen ? buildFocusableOptions() : [];
  const getClassNames = <Key extends keyof StylesProps<Option, IsMulti, Group>>(
    key: Key,
    newProps: StylesProps<Option, IsMulti, Group>[Key]
  ) => props.classNames[key]?.(newProps as any);

  const getStyles = <Key extends keyof StylesProps<Option, IsMulti, Group>>(
    key: Key,
    newProps: StylesProps<Option, IsMulti, Group>[Key]
  ) => {
    const { unstyled } = props;
    const base = defaultStyles[key](newProps as any, unstyled);
    base.boxSizing = 'border-box';
    const custom = props.styles[key];
    return custom ? custom(base, newProps as any) : base;
  };

  // function formatOptionLabel(
  //   data: Option,
  //   context: FormatOptionLabelContext
  // ): ReactNode {
  //   if (typeof props.formatOptionLabel === 'function') {
  //     const { inputValue } = props;
  //     const { selectValue } = selectState;
  //     return props.formatOptionLabel(data, {
  //       context,
  //       inputValue,
  //       selectValue,
  //     });
  //   } else {
  //     return getOptionLabel(props, data);
  //   }
  // }

  // function formatGroupLabel(data: Group) {
  //   return props.formatGroupLabel(data);
  // }

  const selectOption = (newValue: Option) => {
    const { blurInputOnSelect, isMulti, name } = props;
    console.log(blurInputOnSelect);
    console.log(name);
    const { selectValue } = selectState;
    const deselected =
      isMulti && isOptionSelected(props, newValue, selectValue);
    const isDisabled = isOptionDisabled(props, newValue, selectValue);

    if (deselected) {
      // const candidate = getOptionValue(newValue);
      // setValue(
      //   multiValueAsValue(
      //     selectValue.filter((i) => getOptionValue(i) !== candidate)
      //   ),
      //   'deselect-option',
      //   newValue
      // );
    } else if (!isDisabled) {
      // Select option if option is not disabled
      if (isMulti) {
        setValue(
          multiValueAsValue([...selectValue, newValue]),
          'select-option',
          newValue
        );
      } else {
        setValue(singleValueAsValue(newValue), 'select-option');
      }
    } else {
      // ariaOnChange(singleValueAsValue(newValue), {
      //   action: 'select-option',
      //   option: newValue,
      //   name,
      // });
      return;
    }

    // if (blurInputOnSelect) {
    //   blurInput();
    // }
  };

  function getTheme() {
    // Use the default theme if there are no customisations.
    if (!props.theme) {
      return defaultTheme;
    }
    // If the theme prop is a function, assume the function
    // knows how to merge the passed-in default theme with
    // its own modifications.
    if (typeof props.theme === 'function') {
      return props.theme(defaultTheme);
    }
    // Otherwise, if a plain theme object was passed in,
    // overlay it with the default theme.
    return {
      ...defaultTheme,
      ...props.theme,
    };
  }

  const setValue = (
    newValue: OnChangeValue<Option, IsMulti>,
    action: SetValueAction,
    option?: Option
  ) => {
    const { closeMenuOnSelect, isMulti, inputValue } = props;
    console.log(isMulti);
    onInputChange('', { action: 'set-value', prevInputValue: inputValue });
    if (closeMenuOnSelect) {
      // this.setState({
      //   inputIsHiddenAfterUpdate: !isMulti,
      // });
      onMenuClose();
    }
    // when the select value should change, we should reset focusedValue
    // this.setState({ clearFocusValueOnUpdate: true });
    onChange(newValue, { action, option });
  };

  function hasValue(): boolean {
    const { selectValue } = selectState;
    return selectValue.length > 0;
  }
  const getComponents = () => {
    return defaultComponents(props);
  };

  const { Control, SelectContainer, ValueContainer } = getComponents();

  const cx = (...args: any) => classNames(props.classNamePrefix, ...args);
  const getValue = () => selectState.selectValue;
  const clearValue = () => {
    const { selectValue } = selectState;
    console.log(selectValue);
    // onChange(valueTernary(props.isMulti, [], null), {
    //   action: 'clear',
    //   removedValues: selectValue,
    // });
  };
  const getCommonProps = () => {
    const { isMulti, isRtl, options } = props;
    return {
      clearValue,
      cx,
      getStyles,
      getClassNames,
      getValue,
      hasValue: hasValue(),
      isMulti,
      isRtl,
      options,
      selectOption,
      selectProps: props,
      setValue,
      theme: getTheme(),
    };
  };

  const onChange = (
    newValue: OnChangeValue<Option, IsMulti>,
    actionMeta: ActionMeta<Option>
  ) => {
    const { name } = props;
    actionMeta.name = name;

    // ariaOnChange(newValue, actionMeta);
    // onChange(newValue, actionMeta);
  };

  const popValue = () => {
    const { isMulti } = props;
    const { selectValue } = selectState;
    const lastSelectedValue = selectValue[selectValue.length - 1];
    const newValueArray = selectValue.slice(0, selectValue.length - 1);
    const newValue = valueTernary(
      isMulti,
      newValueArray,
      newValueArray[0] || null
    );

    onChange(newValue, {
      action: 'pop-value',
      removedValue: lastSelectedValue,
    });
  };

  function onMenuClose() {
    onInputChange('', {
      action: 'menu-close',
      prevInputValue: props.inputValue,
    });

    props.onMenuClose();
  }

  function onInputChange(newValue: string, actionMeta: InputActionMeta) {
    props.onInputChange(newValue, actionMeta);
  }

  const removeValue = (removedValue: Option) => {
    const { isMulti } = props;
    const { selectValue } = selectState;
    const candidate = getOptionValue(props, removedValue);
    const newValueArray = selectValue.filter(
      (i) => getOptionValue(props, i) !== candidate
    );
    const newValue = valueTernary(
      isMulti,
      newValueArray,
      newValueArray[0] || null
    );

    onChange(newValue, { action: 'remove-value', removedValue });
    // this.focusInput();
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const {
      isMulti,
      backspaceRemovesValue,
      escapeClearsValue,
      inputValue,
      isClearable,
      isDisabled,
      menuIsOpen,
      // onKeyDown,
      tabSelectsValue,
      openMenuOnFocus,
    } = props;
    const { focusedOption, focusedValue, selectValue } = selectState;
    let isComposing = false;

    if (isDisabled) return;

    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    // Block option hover events when the user has just pressed a key
    // blockOptionHover = true;
    switch (event.key) {
      case 'ArrowLeft':
        if (!isMulti || inputValue) return;
        focusValue('previous');
        break;
      case 'ArrowRight':
        if (!isMulti || inputValue) return;
        focusValue('next');
        break;
      case 'Delete':
      case 'Backspace':
        if (inputValue) return;
        if (focusedValue) {
          removeValue(focusedValue);
        } else {
          if (!backspaceRemovesValue) return;
          if (isMulti) {
            popValue();
          } else if (isClearable) {
            clearValue();
          }
        }
        break;
      case 'Tab':
        if (isComposing) return;

        if (
          event.shiftKey ||
          !menuIsOpen ||
          !tabSelectsValue ||
          !focusedOption ||
          // don't capture the event if the menu opens on focus and the focused
          // option is already selected; it breaks the flow of navigation
          (openMenuOnFocus &&
            isOptionSelected(props, focusedOption, selectValue))
        ) {
          return;
        }
        selectOption(focusedOption);
        break;
      case 'Enter':
        if (event.keyCode === 229) {
          // ignore the keydown event from an Input Method Editor(IME)
          // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
          break;
        }
        if (menuIsOpen) {
          if (!focusedOption) return;
          if (isComposing) return;
          selectOption(focusedOption);
          break;
        }
        return;
      case 'Escape':
        if (menuIsOpen) {
          // setState({
          //   inputIsHiddenAfterUpdate: false,
          // });
          onInputChange('', {
            action: 'menu-close',
            prevInputValue: inputValue,
          });
          onMenuClose();
        } else if (isClearable && escapeClearsValue) {
          clearValue();
        }
        break;
      case ' ': // space
        if (inputValue) {
          return;
        }
        if (!menuIsOpen) {
          openMenu('first');
          break;
        }
        if (!focusedOption) return;
        selectOption(focusedOption);
        break;
      case 'ArrowUp':
        if (menuIsOpen) {
          focusOption('up');
        } else {
          openMenu('last');
        }
        break;
      case 'ArrowDown':
        if (menuIsOpen) {
          focusOption('down');
        } else {
          openMenu('first');
        }
        break;
      case 'PageUp':
        if (!menuIsOpen) return;
        focusOption('pageup');
        break;
      case 'PageDown':
        if (!menuIsOpen) return;
        focusOption('pagedown');
        break;
      case 'Home':
        if (!menuIsOpen) return;
        focusOption('first');
        break;
      case 'End':
        if (!menuIsOpen) return;
        focusOption('last');
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  // function focusInput() {
  //   if (!inputRef.current) return;
  //   inputRef.current.focus();
  // }

  function openMenu(menuFocusOption: 'first' | 'last') {
    const { selectValue, isFocused } = selectState;
    const focusableOptions = buildFocusableOptions();
    let openAtIndex =
      menuFocusOption === 'first' ? 0 : focusableOptions.length - 1;
    console.log(openAtIndex);
    if (!props.isMulti) {
      const selectedIndex = focusableOptions.indexOf(selectValue[0]);
      if (selectedIndex > -1) {
        // openAtIndex = selectedIndex;
      }
    }
    let scrollToFocusedOptionOnUpdate;

    // only scroll if the menu isn't already open
    scrollToFocusedOptionOnUpdate = !(isFocused && menuListRef);
    console.log(scrollToFocusedOptionOnUpdate);
    // this.setState(
    //   {
    //     inputIsHiddenAfterUpdate: false,
    //     focusedValue: null,
    //     focusedOption: focusableOptions[openAtIndex],
    //     focusedOptionId: this.getFocusedOptionId(focusableOptions[openAtIndex]),
    //   },
    //   () => onMenuOpen()
    // );
  }
  function focusOption(direction: FocusDirection = 'first') {
    const { pageSize } = props;
    const { focusedOption } = selectState;
    const options = getFocusableOptions();
    let scrollToFocusedOptionOnUpdate = false;
    if (!options.length) return;
    let nextFocus = 0; // handles 'first'
    let focusedIndex = options.indexOf(focusedOption!);
    if (!focusedOption) {
      focusedIndex = -1;
    }

    if (direction === 'up') {
      nextFocus = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
    } else if (direction === 'down') {
      nextFocus = (focusedIndex + 1) % options.length;
    } else if (direction === 'pageup') {
      nextFocus = focusedIndex - pageSize;
      if (nextFocus < 0) nextFocus = 0;
    } else if (direction === 'pagedown') {
      nextFocus = focusedIndex + pageSize;
      if (nextFocus > options.length - 1) nextFocus = options.length - 1;
    } else if (direction === 'last') {
      nextFocus = options.length - 1;
    }
    scrollToFocusedOptionOnUpdate = true;
    console.log(scrollToFocusedOptionOnUpdate);
    // setState({
    //   focusedOption: options[nextFocus],
    //   focusedValue: null,
    //   focusedOptionId: getFocusedOptionId(options[nextFocus]),
    // });
  }

  function focusValue(direction: 'previous' | 'next') {
    const { selectValue, focusedValue } = selectState;

    // Only multiselects support value focusing
    if (!props.isMulti) return;

    // this.setState({
    //   focusedOption: null,
    // });

    let focusedIndex = selectValue.indexOf(focusedValue!);
    if (!focusedValue) {
      focusedIndex = -1;
    }

    const lastIndex = selectValue.length - 1;
    let nextFocus = -1;
    if (!selectValue.length) return;
    switch (direction) {
      case 'previous':
        if (focusedIndex === 0) {
          // don't cycle from the start to the end
          nextFocus = 0;
        } else if (focusedIndex === -1) {
          // if nothing is focused, focus the last value first
          nextFocus = lastIndex;
        } else {
          nextFocus = focusedIndex - 1;
        }
        break;
      case 'next':
        if (focusedIndex > -1 && focusedIndex < lastIndex) {
          nextFocus = focusedIndex + 1;
        }
        break;
    }
    console.log(nextFocus);
    // this.setState({
    //   inputIsHidden: nextFocus !== -1,
    //   focusedValue: selectValue[nextFocus],
    // });
  }
  // function onMenuOpen() {
  //   props.onMenuOpen();
  // }
  // const handleInputChange: FormEventHandler<HTMLInputElement> = (event) => {
  //   const { inputValue: prevInputValue } = props;
  //   const inputValue = event.currentTarget.value;
  //   // this.setState({ inputIsHiddenAfterUpdate: false });
  //   onInputChange(inputValue, { action: 'input-change', prevInputValue });
  //   if (!props.menuIsOpen) {
  //     onMenuOpen();
  //   }
  // };
  // const onInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
  //   const { inputValue: prevInputValue } = props;
  //   if (menuListRef) {
  //     inputRef.current!.focus();
  //     return;
  //   }
  //   if (props.onBlur) {
  //     props.onBlur(event);
  //   }
  //   onInputChange('', { action: 'input-blur', prevInputValue });
  //   onMenuClose();
  //   // setState({
  //   //   focusedValue: null,
  //   //   isFocused: false,
  //   // });
  // };
  // const onInputFocus: FocusEventHandler<HTMLInputElement> = (event) => {
  //   let openAfterFocus = false;
  //   if (props.onFocus) {
  //     props.onFocus(event);
  //   }
  //   // setState({
  //   //   inputIsHiddenAfterUpdate: false,
  //   //   isFocused: true,
  //   // });
  //   if (openAfterFocus || props.openMenuOnFocus) {
  //     openMenu('first');
  //   }
  //   openAfterFocus = false;
  // };
  const onControlMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // Event captured by dropdown indicator
    if (event.defaultPrevented) {
      return;
    }
    const { openMenuOnClick } = props;
    if (!selectState.isFocused) {
      if (openMenuOnClick) {
        // this.openAfterFocus = true;
      }
      // focusInput();
    } else if (!props.menuIsOpen) {
      if (openMenuOnClick) {
        openMenu('first');
      }
    } else {
      if (
        (event.target as HTMLElement).tagName !== 'INPUT' &&
        (event.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        onMenuClose();
      }
    }
    if (
      (event.target as HTMLElement).tagName !== 'INPUT' &&
      (event.target as HTMLElement).tagName !== 'TEXTAREA'
    ) {
      event.preventDefault();
    }
  };

  const onControlTouchEnd: TouchEventHandler<HTMLDivElement> = (event) => {
    // if (this.userIsDragging) return;
    onControlMouseDown(event);
  };

  const { className, id, isDisabled, menuIsOpen } = props;
  const { isFocused } = selectState;
  const commonProps = getCommonProps();

  return (
    <SelectContainer
      {...commonProps}
      className={className}
      innerProps={{
        id: id,
        onKeyDown: onKeyDown,
      }}
      isDisabled={isDisabled}
      isFocused={isFocused}
    >
      {/* {renderLiveRegion()} */}
      <Control
        {...commonProps}
        innerRef={getControlRef}
        innerProps={{
          onMouseDown: onControlMouseDown,
          onTouchEnd: onControlTouchEnd,
        }}
        isDisabled={isDisabled}
        isFocused={isFocused}
        menuIsOpen={menuIsOpen}
      >
        <ValueContainer {...commonProps} isDisabled={isDisabled}>
          <input type="text" />
          {/* {renderInput()} */}
        </ValueContainer>
      </Control>
      {/* {renderMenu} */}
    </SelectContainer>
  );
}
