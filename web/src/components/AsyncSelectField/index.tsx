// import Icon from '@ant-design/icons';
import { Form } from 'antd';
import { Rule } from 'antd/lib/form';
import _ from 'lodash';
import { createContext, useContext } from 'react';
import { ActionMeta, SingleValue, MultiValue } from 'react-select';
import AsyncSelectOriginal from 'react-select/async';

// import s from '../../QuestionnaireResponseForm/fields/fields.module.scss';
// import { ReactComponent as ArrowSvg } from './images/arrowDropdown.svg';

// const ArrowIcon = (props: { className?: string; style?: CSSProperties }) => (
//     <Icon className={props.className} style={props.style} component={ArrowSvg} />
// );

interface Props<T> {
    fieldPath: (string | number)[];
    rules?: Rule[];
    label?: string;
    placeholder?: string;
    helpText?: string;
    formItemProps?: any;
    loadOptions: (searchText: string) => Promise<T[]>;
    readOnly?: boolean;
    onChange?: (v: SingleValue<T> | MultiValue<T>, action: ActionMeta<T>) => void;
    getOptionLabel: (option: T) => string | React.ReactElement;
    getOptionValue: (option: T) => string;
    isMulti?: boolean;
    testId?: string;
    required?: boolean;
}

const SelectContext = createContext<typeof AsyncSelectOriginal>(AsyncSelectOriginal);
export const SelectImplementationProvider = SelectContext.Provider;

export function AsyncSelectField<T>(props: Props<T>) {
    const {
        readOnly,
        // fieldPath,
        label,
        required,
        placeholder = 'Select...',
        helpText,
        // formItemProps,
        loadOptions,
        getOptionLabel,
        getOptionValue,
        isMulti,
        // rules,
        testId,
    } = props;

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: T[]) => void) => {
            (async () => callback(await loadOptions(searchText)))();
        },
        500,
    );

    return (
        <Form.Item
            extra={helpText}
            data-testid={testId}
            label={
                <span>
                    <span>{label} </span>
                    {!required && <span> - Optional</span>}
                </span>
            }
        >
            {/* TODO update Async select type definition*/}
            <AsyncSelectWrapper
                defaultOptions
                isDisabled={readOnly}
                menuPlacement="auto"
                loadOptions={debouncedLoadOptions}
                classNamePrefix="react-select"
                className="react-select"
                placeholder={placeholder}
                getOptionLabel={getOptionLabel as any}
                getOptionValue={getOptionValue}
                isClearable={!required}
                closeMenuOnSelect={!isMulti}
                isMulti={isMulti}
                components={{
                    IndicatorSeparator: () => null,
                    // DropdownIndicator: () => (
                    //     <ArrowIcon
                    //         style={{
                    //             fontSize: 8,
                    //         }}
                    //     />
                    // ),
                }}
                menuPortalTarget={document.body}
            />
        </Form.Item>
    );
}

function AsyncSelectWrapper(props: any) {
    const { onChange, value, isMulti } = props;

    const AsyncSelect = useContext(SelectContext);
    return (
        <AsyncSelect
            {...props}
            onChange={(newValue, action) => {
                if (isMulti) {
                    onChange?.(newValue, action);
                } else {
                    if (newValue === null) {
                        onChange?.([], action);
                    } else {
                        onChange?.([newValue], action);
                    }
                }
            }}
            value={value}
        />
    );
}
