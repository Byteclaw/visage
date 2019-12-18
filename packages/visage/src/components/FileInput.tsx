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
} from './shared';

const BaseFileInput = createComponent('input', {
  displayName: 'FileInputControl',
  defaultStyles: {
    ...visuallyHiddenStyles,
    '&:focus + div': {
      outlineColor: 'darkAccent',
    },
  },
});

const FileInputBox = createComponent('div', {
  displayName: 'FileInputBox',
  defaultStyles: {
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
  defaultStyles: props => ({
    '&::before': {
      // respect line height
      content: '"\\200b"',
    },
    // synthetic focus on drop
    '&[data-draggedover="true"]': {
      // cursor: 'copy',
      outlineColor: 'darkAccent',
    },
    backgroundColor: 'textInput',
    borderColor: 'textInputBorder',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: 'currentColor',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    overflow: 'hidden',
    outline: '2px solid transparent',
    outlineOffset: '-2px',
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
  boxProps?: ExtractVisageComponentProps<typeof FileInputBox>;
  controlProps?: ExtractVisageComponentProps<typeof FileInputControl>;
  label?: string | ((files: File[], placeholder: string) => string);
  onChange?: (files: File[]) => void;
}

export function FileInput({
  accept,
  boxProps,
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
    <FileInputBox {...boxProps}>
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
    </FileInputBox>
  );
}
