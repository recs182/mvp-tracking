import styled, { css } from 'styled-components'

export const UpdateButton = styled.button`
    padding: 0.5rem;
    color: #f8f9fa;
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    border-radius: 0.25rem;
    cursor: pointer;
    transition:
        color 0.2s ease,
        background-color 0.2s ease;

    &:hover {
        color: var(--color-primary);
        background-color: transparent;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        &:hover {
            color: #f8f9fa;
            background-color: var(--color-primary);
            border: 1px solid var(--color-primary);
        }
    }
`

export const InputTombTime = styled.input<{ $hasError?: boolean }>`
    padding: 0.5rem;
    width: 55px;
    border: 1px solid var(--color-primary);
    border-radius: 0.25rem;

    ${(props) =>
        props.$hasError &&
        css`
            border-color: var(--color-error);
        `}
`
