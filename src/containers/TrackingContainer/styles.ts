import styled, { css } from 'styled-components'

export const TrackingOverlay = styled.button<{ $show: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    border: none;
    cursor: pointer;
    backdrop-filter: blur(7px);
    transform: translateX(-100%);
    transition: transform 125ms ease;
    z-index: 3;

    ${({ $show }) =>
        $show &&
        css`
            transform: translateX(0);
        `}
`

export const TrackingContainerStyled = styled.div`
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-primary);
`

export const Header = styled.header`
    padding: 1rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: white;
    background-color: var(--color-primary);

    @media (min-width: 770px) {
        grid-template-columns: 3fr 1fr 10px;
    }

    @media (min-width: 1280px) {
        grid-template-columns: 480px 240px 10px;
    }
`

export const HeaderActionsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
`

export const SearchContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    > label {
        font-size: 12px;
    }
`

export const HeaderDisplayDates = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    @media (min-width: 770px) {
        flex-direction: column;
        align-items: flex-end;
        gap: 0;
    }
`

export const TrackerGridContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: white;
    overflow-x: auto;

    @media (min-width: 1280px) {
        width: fit-content;
    }

    > div:nth-child(even) {
        background-color: var(--color-even-row);
    }
`

export const TrackerGridRow = styled.div<{ $isHeader?: boolean }>`
    display: grid;
    grid-template-columns: 1fr;
    background-color: var(--color-odd-row);

    > :first-child {
        padding-top: 1rem;
    }

    > :last-child {
        padding-bottom: 1rem;
    }

    @media (min-width: 770px) {
        gap: 1rem;
        grid-template-columns: repeat(3, minmax(240px, 1fr));

        > :first-child {
            padding-top: 0;
        }

        > :last-child {
            padding-bottom: 0;
        }
    }

    ${({ $isHeader }) =>
        $isHeader &&
        css`
            position: sticky;
            top: 0;
            display: none;
            font-weight: bold;
            border-bottom: 1px solid var(--color-even-row);
            z-index: 2;

            @media (min-width: 770px) {
                display: grid;
            }
        `}
`

export const TrackerGridCell = styled.div`
    padding: 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (min-width: 770px) {
        padding: 0 0.5rem;
        min-height: 80px;
        align-items: flex-start;
        justify-content: center;
    }
`

export const MvpInformationContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
`

export const UpdateContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
`

export const TimeOfDeathContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
`

export const ActionButton = styled.button`
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
`

export const MvpSpriteContainer = styled.div`
    width: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const MvpSprite = styled.img`
    width: auto;
    max-height: 32px;
`
