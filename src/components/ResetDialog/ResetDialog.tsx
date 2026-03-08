import { type FC } from 'react'
import { AlertDialog, Button, Flex } from '@radix-ui/themes'

interface ResetDialogProps {
    onOpenChange: (open: boolean) => void
    open: boolean
    resetTracker: () => void
}

export const ResetDialog: FC<ResetDialogProps> = ({ onOpenChange, open, resetTracker }) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Content>
                <AlertDialog.Title>Reset tracker</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure? This will clear all tracked mobs.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button color="gray" variant="soft">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button color="red" variant="surface" onClick={resetTracker}>
                            Reset
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}
