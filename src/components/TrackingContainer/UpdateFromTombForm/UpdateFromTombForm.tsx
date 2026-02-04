import { memo, type ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { DateTime } from 'luxon'
// app
import { InputTombTime, UpdateButton } from '@/components/TrackingContainer/styles'
// self
import { FormContainer } from './styles'

type FormValues = { tombTime: string }

type UpdateFromTombFormProps = {
    updateFromTomb: (data: FormValues) => void
}

export const UpdateFromTombForm = memo<UpdateFromTombFormProps>(({ updateFromTomb }): ReactElement => {
    const {
        handleSubmit,
        formState: { errors, dirtyFields },
        register,
        reset,
    } = useForm<FormValues>({ mode: 'onChange' })

    const preUpdateHandler = (data: FormValues) => {
        reset()
        updateFromTomb(data)
    }

    const maxTime = DateTime.now().setZone('Europe/London').toFormat('HH:mm')
    const inputIsEmptyOrErrored = !dirtyFields['tombTime'] || errors['tombTime'] !== undefined

    return (
        <FormContainer onSubmit={handleSubmit(preUpdateHandler)}>
            <InputTombTime
                {...register('tombTime', { required: true, max: maxTime })}
                $hasError={Boolean(errors['tombTime'])}
                type="time"
            />
            <UpdateButton disabled={inputIsEmptyOrErrored} type="submit">
                Calculate
            </UpdateButton>
        </FormContainer>
    )
})
