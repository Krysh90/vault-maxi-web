import { useForm, useWatch } from 'react-hook-form'
import { useWTIA } from '../../hooks/wtia.hook'
import { Button } from '../base/button'
import Form from '../form/form'
import ThemedFormInput from '../form/themed-form-input'
import { useEffect } from 'react'

export function WTIAGamble(): JSX.Element {
  const { nextMinAmount, gamble } = useWTIA()
  const { control, setValue } = useForm<{ amount: string }>({ mode: 'onTouched' })
  const amount = useWatch({ control, name: 'amount' })

  useEffect(() => {
    setValue('amount', nextMinAmount?.toString() ?? '')
  }, [nextMinAmount, setValue])

  return (
    <Form control={control}>
      <div className="flex flex-row justify-between items-center">
        <p>Enter amount</p>
        <div className="flex flex-row gap-1 items-center">
          <ThemedFormInput className="text-right" name="amount" type="number" />
          <p>DFI</p>
        </div>
      </div>
      <Button label="Gamble" onClick={() => gamble(amount)} />
    </Form>
  )
}
