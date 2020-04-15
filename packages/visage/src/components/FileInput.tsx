import { ExtractVisageComponentProps } from '@byteclaw/visage-core';
import React, {
  DragEventHandler,
  ChangeEventHandler,
  useCallback,
  useRef,
  useState,
  MouseEventHandler,
  KeyboardEventHandler,
} from 'react';
import { createComponent } from '../core';
import {
  disabledControlStyles,
  disabledControlBooleanVariant,
  invalidControlStyles,
  invalidControlBooleanVariant,
  visuallyHiddenStyles,
  createSurfaceFocusShadow,
} from './shared';

const BaseFileInput = createComponent('input', {
  displayName: 'FileInputControl',
  styles: {
    ...visuallyHiddenStyles,
    '&:focus + div': {
      boxShadow: createSurfaceFocusShadow(),
    },
    '&[aria-invalid="true"]:focus + div': {
      boxShadow: createSurfaceFocusShadow('danger'),
    },
  },
});

const FileInputBase = createComponent('div', {
  displayName: 'FileInputBase',
  styles: {
    border: 'none',
    fontSize: 0,
    lineHeight: 0,
    display: 'inline-flex',
    position: 'relative',
    maxWidth: '100%',
  },
});

const FileInputControl = createComponent('div', {
  displayName: 'FileInputControlBase',
  styles: props => ({
    '&::before': {
      // respect line height
      content: '"\\200b"',
    },
    // synthetic focus on drop
    '&[data-draggedover="true"]': {
      boxShadow: createSurfaceFocusShadow(),
    },
    backgroundColor: 'color(shades tint(10%))',
    borderColor: 'color(shades shade(30%))',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: 'controlBorderRadius',
    color: 'currentColor',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    overflow: 'hidden',
    outline: 'none',
    m: 0,
    py: 1,
    px: 2,
    textOverflow: 'ellipsis',
    width: '100%',
    whiteSpace: 'nowrap',
    '&:not([data-readonly="true"])': {
      cursor: 'pointer',
    },
    ...(props.disabled ? disabledControlStyles : {}),
    ...(props.invalid ? invalidControlStyles : {}),
  }),
  variants: [disabledControlBooleanVariant, invalidControlBooleanVariant],
});

const defaultLabelFormatter = (files: File[]): string => {
  if (files.length === 0) {
    return '';
  }

  if (files.length === 1) {
    return '1 file selected';
  }

  return `${files.length} files selected`;
};

interface BaseFileInputProps
  extends ExtractVisageComponentProps<typeof BaseFileInput> {
  onChange?: any;
}

interface FileInputProps extends BaseFileInputProps {
  invalid?: boolean;
  baseProps?: ExtractVisageComponentProps<typeof FileInputBase>;
  controlProps?: ExtractVisageComponentProps<typeof FileInputControl>;
  label?: string | ((files: File[], placeholder: string) => string);
  onChange?: (files: File[]) => void;
}

export function FileInput({
  accept,
  baseProps,
  controlProps,
  disabled,
  invalid,
  label = defaultLabelFormatter,
  multiple,
  onChange,
  readOnly,
  placeholder = 'Choose a file',
  ...restProps
}: FileInputProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const previousFiles = useRef(files);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // const onDrag: DragEventHandler<HTMLDivElement> = useCallback(() => {}, []);
  const onDragEnter: DragEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);
  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);
  const onDragLeave: DragEventHandler<HTMLDivElement> = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);
  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      // if accept is filled, check if files are of the given types
      const acceptedMediaTypes: string[] = accept ? accept.split(',') : ['*/*'];

      const regex = new RegExp(
        `^(${acceptedMediaTypes
          .map(mediaType =>
            mediaType.replace(/\//g, '\\/').replace(/\*/g, '[^\\/]+'),
          )
          .join('|')})$`,
      );

      // check if all files are accepted
      if (Array.from(e.dataTransfer.files).every(f => regex.test(f.type))) {
        setFiles(Array.from(e.dataTransfer.files));
      }

      e.dataTransfer.clearData();
    },
    [accept],
  );
  const onClick: MouseEventHandler = useCallback(() => {
    if (inputRef.current) {
      // delegate click to hidden file input
      // if input is read only, just focus
      if (readOnly) {
        inputRef.current.focus();
      } else {
        inputRef.current.click();
      }
    }
  }, [readOnly]);
  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      setFiles(Array.from(e.currentTarget.files));
    }
  }, []);
  // disables keyboard interaction if input is readonly
  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      if (readOnly && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
      }
    },
    [readOnly],
  );

  if (previousFiles.current !== files) {
    previousFiles.current = files;

    if (onChange) {
      onChange(files);
    }
  }

  const generatedLabel =
    typeof label === 'function' ? label(files, placeholder) : label;

  return (
    <FileInputBase {...baseProps}>
      <BaseFileInput
        {...restProps}
        accept={accept}
        aria-invalid={invalid}
        aria-readonly={readOnly}
        disabled={disabled}
        multiple={multiple}
        onKeyDown={onInputKeyDown}
        onChange={onInputChange}
        placeholder={placeholder}
        ref={inputRef}
        readOnly={readOnly}
        type="file"
      />
      <FileInputControl
        {...controlProps}
        data-draggedover={dragging}
        data-readonly={readOnly}
        disabled={disabled}
        invalid={invalid}
        onClick={onClick}
        onDragEnter={!readOnly ? onDragEnter : undefined}
        onDragOver={!readOnly ? onDragOver : undefined}
        onDragLeave={!readOnly ? onDragLeave : undefined}
        onDrop={!readOnly ? onDrop : undefined}
      >
        {files.length === 0 ? placeholder : generatedLabel}
      </FileInputControl>
    </FileInputBase>
  );
}
