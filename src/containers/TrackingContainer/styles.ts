import styled from 'styled-components'

export const TrackingContainerStyled = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-primary);
`
export const TrackingTableResponsive = styled.div`
    overflow: auto;
`

export const TrackingTable = styled.table`
    background-color: white;

    &,
    th,
    td {
        border-collapse: collapse;
    }
`

export const TrackingRow = styled.tr`
    &:nth-child(even) {
        background-color: var(--color-secondary);
    }
`

export const TrackingHeaderCell = styled.th`
    position: sticky;
    top: 0;
    padding: 0.5rem;
    text-align: left;
    background-color: white;
    z-index: 2;
`

export const TrackingCell = styled.td`
    padding: 0.5rem;
`

export const TrackingHeader = styled.thead``

export const TrackingBody = styled.tbody``

export const MvpNameMapSpawn = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 12px;

    & > div:first-child {
        font-size: 14px;
        font-weight: bold;
    }
`

export const UpdateContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
`
export const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    > label {
        font-size: 12px;
    }
`

export const TimeOfDeathContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
`

export const ResetButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
`
