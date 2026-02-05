import { memo, type ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { useMaskito } from '@maskito/react'
import { maskitoTimeOptionsGenerator } from '@maskito/kit'
import { DateTime } from 'luxon'
// app
import { InputTombTime, UpdateButton } from '@/components/TrackingContainer/styles'
import { defaultTimeZoneName } from '@/constants'
// self
import { FormContainer } from './styles'

type FormValues = { tombTime: string }

type UpdateFromTombFormProps = {
    updateFromTomb: (data: FormValues) => void
}

const maskitoOptions = maskitoTimeOptionsGenerator({ mode: 'HH:MM' })

export const UpdateFromTombForm = memo<UpdateFromTombFormProps>(({ updateFromTomb }): ReactElement => {
    const maskitoRef = useMaskito({ options: maskitoOptions })

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

    const inputIsEmptyOrErrored = !dirtyFields['tombTime'] || errors['tombTime'] !== undefined

    const placeholder = DateTime.now().setZone(defaultTimeZoneName).toFormat('HH:mm')

    const registerInput = register('tombTime', { required: true })

    return (
        <FormContainer onSubmit={handleSubmit(preUpdateHandler)}>
            <InputTombTime
                {...registerInput}
                ref={(node) => {
                    maskitoRef(node)
                    registerInput.ref(node)
                }}
                $hasError={Boolean(errors['tombTime'])}
                type="text"
                placeholder={placeholder}
            />
            <UpdateButton disabled={inputIsEmptyOrErrored} type="submit">
                Calculate
            </UpdateButton>
        </FormContainer>
    )
})
