import styled, { css } from 'styled-components'

export const TimerContainer = styled.div<{ $alreadyInVariation: boolean; $variation: boolean }>`
    width: 180px;

    ${(props) => {
        if (props.$alreadyInVariation) {
            return css`
                color: var(--color-error);
            `
        }

        if (props.$variation) {
            return css`
                color: var(--color-warning);
            `
        }
    }}
`

export const RelativeDateContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
`
