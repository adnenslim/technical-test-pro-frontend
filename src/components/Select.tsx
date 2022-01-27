import React from 'react';

import { MenuItem, TextField } from '@material-ui/core';
import { Controller } from 'react-hook-form';

type Props = {
  background?: string;
  children: React.ReactNode;
  className?: string;
  control: any;
  dataTestId?: string;
  defaultValue?: string;
  disabled?: boolean;
  formState: any;
  height?: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  width?: string;
  margin?: string;
};

function Select({
  background,
  children,
  className,
  control,
  dataTestId,
  defaultValue = '',
  disabled = false,
  formState,
  height,
  label,
  name,
  placeholder,
  required,
  width = '300px',
  margin = '10px 0',
}: Props) {
  const rules = {
    required: required ? `Please select ${label}` : false,
  };

  return (
    <Controller
      name={name}
      render={({ field }) => (
        <TextField
          className={className}
          style={{
            background,
            height,
            width,
            margin,
          }}
          disabled={disabled}
          error={formState?.errors && name in formState.errors}
          fullWidth
          helperText={
            formState?.errors && name in formState.errors
              ? formState.errors[name].message
              : null
          }
          id={name}
          inputProps={{
            'data-testid': dataTestId,
          }}
          label={label}
          placeholder={placeholder}
          required={required}
          select
          size="small"
          variant="outlined"
          {...field}
        >
          {Array.isArray(children) &&
            children.map((option) => (
              <MenuItem key={option['key']} value={option['value']}>
                {option['fullName']}
              </MenuItem>
            ))}
        </TextField>
      )}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
    />
  );
}

export default React.memo(Select);
