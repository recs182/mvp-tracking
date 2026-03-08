import { Button, Dialog, Flex, Table } from '@radix-ui/themes'
import { UpdateIcon } from '@radix-ui/react-icons'
import { DateTime } from 'luxon'
import type { FC } from 'react'
// app
import type { TrackingChange } from '@/containers/TrackingContainer/types'

interface HistoryDialogProps {
    changes: TrackingChange[]
    onOpenChange: (open: boolean) => void
    open: boolean
    undoChangeFactory: (change: TrackingChange) => () => void
}

export const HistoryDialog: FC<HistoryDialogProps> = ({ changes, onOpenChange, open, undoChangeFactory }) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content>
                <Dialog.Title>
                    <UpdateIcon /> Update history
                </Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    All updates you did in this session, you can undo action that were recently made.
                </Dialog.Description>

                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>MVP</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell />
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {changes.map((change, index) => {
                            const actionNumber = String(++index).padStart(2, '0')

                            const canUndo =
                                !change.action.startsWith('UNDO') &&
                                DateTime.now().diff(change.timestamp, 'minutes').minutes < 2

                            return (
                                <Table.Row key={`change-${change.mvp.id}-row-${index}`}>
                                    <Table.RowHeaderCell>{actionNumber}</Table.RowHeaderCell>
                                    <Table.Cell>{change.mvp.name}</Table.Cell>
                                    <Table.Cell>{change.timestamp.toLocaleString(DateTime.TIME_24_SIMPLE)}</Table.Cell>
                                    <Table.Cell>{change.action}</Table.Cell>
                                    <Table.Cell justify="end">
                                        {canUndo && (
                                            <Button onClick={undoChangeFactory(change)} variant="ghost">
                                                Undo
                                            </Button>
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table.Root>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button color="gray" variant="soft">
                            Close
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}
