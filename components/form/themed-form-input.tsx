import { HTMLInputTypeAttribute, forwardRef } from 'react'
import { Controller } from 'react-hook-form'
import { ControlProps } from './form'

interface ThemedFormInput extends ControlProps {
  type?: HTMLInputTypeAttribute
  placeholder?: string
  className?: string
}

const ThemedFormInput = forwardRef<HTMLInputElement, ThemedFormInput>(
  ({ control, name, rules, type = 'text', placeholder, className, ...props }: ThemedFormInput, ref) => {
    return (
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            className={'bg-dark bg-opacity-0 rounded-lg border border-white px-2 py-1 outline-none'.concat(
              ' ' + className,
            )}
            type={type}
            inputMode={type === 'number' ? 'decimal' : undefined}
            onBlur={onBlur}
            onChange={(value) => onChange(value.target.value)}
            onWheel={(e) => type === 'number' && e.currentTarget.blur()}
            placeholder={placeholder}
            value={value ?? ''}
            ref={ref}
            {...props}
          />
        )}
        name={name}
        rules={rules}
      />
    )
  },
)

ThemedFormInput.displayName = 'ThemedFormInput'

export default ThemedFormInput
