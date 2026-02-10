import styled, { css } from 'styled-components'

export const TrackingAsideStyled = styled.aside<{ $open: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    background-color: var(--color-even-row);
    border-right: 1px solid var(--color-odd-row);
    transform: translateX(-100%);
    transition: transform 125ms ease;
    z-index: 4;

    @media (min-width: 770px) {
        width: 350px;
    }

    ${({ $open }) =>
        $open &&
        css`
            transform: translateX(0);
        `}
`

export const AsideContentContainer = styled.div`
    &:not(:last-child) {
        border-bottom: 1px solid var(--color-odd-row);
    }
`

export const AsideContentHeader = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: white;
    font-weight: bold;
`

export const AsideContentOverflow = styled.div`
    height: calc(100dvh - 140px);
    overflow-y: auto;
`

export const ChangeContainer = styled.div`
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: white;
    &:nth-child(odd) {
        background-color: var(--color-odd-row);
    }
`

export const ChangeInformationContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export const ChangeInformation = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    color: var(--color-variation-ended);
    font-size: 12px;
`

export const ResetAllContainer = styled.div`
    padding: 0 1rem 1rem;
    display: flex;
    flex-direction: row;
`

export const ResetAllButton = styled.button`
    padding: 0.5rem;
    color: var(--color-variation-progress);
    background-color: transparent;
    border: 1px solid var(--color-variation-progress);
    cursor: pointer;
    transition:
        color 125ms,
        background-color 125ms;

    &:hover {
        color: white;
        background-color: var(--color-variation-progress);
    }
`
