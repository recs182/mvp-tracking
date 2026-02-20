import { Fragment, memo, type ReactElement, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMaskito } from '@maskito/react'
import { maskitoTimeOptionsGenerator } from '@maskito/kit'
import { DateTime } from 'luxon'
import { Box, Button, Dialog, Flex, Strong, Table, Text } from '@radix-ui/themes'
// app
import { TrackingButton, TrackingInput } from '@/components/TrackingContainer/styles'
import { defaultDateTimeFormat, defaultTimeZoneName } from '@/constants'
// self
import { FormContainer } from './styles'

type FormValues = { tombTime: string }

type UpdateFromTombFormProps = {
    updateFromTomb: (data: FormValues & { confirmedTombTime?: DateTime }) => void
}

const maskitoOptions = maskitoTimeOptionsGenerator({ mode: 'HH:MM' })

export const UpdateFromTombForm = memo<UpdateFromTombFormProps>(({ updateFromTomb }): ReactElement => {
    const maskitoRef = useMaskito({ options: maskitoOptions })

    const [chosenTime, setChosenTime] = useState<DateTime | null>(null)
    const [confirmTimeDialog, setConfirmTimeDialog] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors, dirtyFields },
        register,
        reset,
    } = useForm<FormValues>({ mode: 'onChange' })

    const preUpdateHandler = (data: FormValues) => {
        const [hour, minute] = data.tombTime.split(':').map(Number)
        const tombTime = DateTime.now().setZone(defaultTimeZoneName).set({ hour, minute, second: 0, millisecond: 0 })

        reset()

        const thirtyMinutesAgo = DateTime.now().setZone(defaultTimeZoneName).minus({ minutes: 30 })
        if (tombTime.toMillis() > thirtyMinutesAgo.toMillis()) {
            setChosenTime(tombTime)
            setConfirmTimeDialog(true)
            return
        }
        updateFromTomb(data)
    }

    const confirmTimeFactory = useCallback(
        (dateTime: DateTime) => () => {
            setConfirmTimeDialog(false)
            setChosenTime(null)

            updateFromTomb({ confirmedTombTime: dateTime, tombTime: '' })
        },
        []
    )

    const inputIsEmptyOrErrored = !dirtyFields['tombTime'] || errors['tombTime'] !== undefined

    const placeholder = DateTime.now().setZone(defaultTimeZoneName).toFormat('HH:mm')

    const registerInput = register('tombTime', { required: true })

    return (
        <FormContainer onSubmit={handleSubmit(preUpdateHandler)}>
            <Dialog.Root open={confirmTimeDialog} onOpenChange={setConfirmTimeDialog}>
                <Dialog.Content>
                    <Dialog.Title>Choose the appropriate day</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        The time you inserted will be created in the future, sometimes this can happen for MVPs with
                        long respawn timers.
                    </Dialog.Description>

                    {chosenTime && (
                        <Fragment>
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeaderCell>Yesterday</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell justify="end">Current day</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.RowHeaderCell>
                                            {chosenTime.minus({ day: 1 }).toFormat(defaultDateTimeFormat)}
                                        </Table.RowHeaderCell>
                                        <Table.Cell justify="end">
                                            {chosenTime.toFormat(defaultDateTimeFormat)}
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>

                            <Box mt="4">
                                <Text size="2">
                                    To solve this you can either continue with the <Strong>Current day</Strong> or
                                    choose the day as <Strong>Yesterday</Strong>:
                                </Text>
                            </Box>

                            <Flex gap="3" mt="4" justify="between">
                                <Dialog.Close>
                                    <Button color="red" onClick={confirmTimeFactory(chosenTime.minus({ day: 1 }))}>
                                        Yesterday
                                    </Button>
                                </Dialog.Close>
                                <Dialog.Close>
                                    <Button color="gray" onClick={confirmTimeFactory(chosenTime)}>
                                        Current day
                                    </Button>
                                </Dialog.Close>
                            </Flex>
                        </Fragment>
                    )}
                </Dialog.Content>
            </Dialog.Root>

            <TrackingInput
                {...registerInput}
                ref={(node) => {
                    maskitoRef(node)
                    registerInput.ref(node)
                }}
                $hasError={Boolean(errors['tombTime'])}
                type="text"
                placeholder={placeholder}
            />
            <TrackingButton disabled={inputIsEmptyOrErrored} type="submit">
                Calculate
            </TrackingButton>
        </FormContainer>
    )
})
