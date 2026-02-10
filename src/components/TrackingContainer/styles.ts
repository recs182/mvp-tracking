import styled, { css } from 'styled-components'

export const TrackingButton = styled.button`
    padding: 0.5rem;
    color: #f8f9fa;
    background-color: var(--color-primary);
    border: 1px solid var(--color-primary);
    border-radius: 0.25rem;
    cursor: pointer;
    transition:
        color 125ms ease,
        background-color 125ms ease;

    &:hover {
        color: white;
        background-color: transparent;
        border-color: white;
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

export const TrackingInput = styled.input<{ $hasError?: boolean }>`
    padding: 0.5rem;
    width: 55px;
    border: 1px solid var(--color-primary);
    border-radius: 0.25rem;

    ${(props) =>
        props.$hasError &&
        css`
            border-color: var(--color-variation-progress);
        `}
`

export const TrackingToggleMenu = styled.button`
    padding: 0;
    color: white;
    font-size: 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;

    &:hover {
        color: var(--color-variation-ended);
    }
`
