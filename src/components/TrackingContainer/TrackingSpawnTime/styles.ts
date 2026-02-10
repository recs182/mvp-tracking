import styled, { css } from 'styled-components'

export const TimerContainer = styled.div<{
    $variationProgress: boolean
    $variationStart: boolean
    $variationFinished: boolean
}>`
    ${(props) => {
        if (props.$variationFinished) {
            return css`
                color: var(--color-variation-ended);
            `
        }

        if (props.$variationProgress) {
            return css`
                color: var(--color-variation-progress);
            `
        }

        if (props.$variationStart) {
            return css`
                color: var(--color-variation-start);
            `
        }
    }}
`

export const RelativeDateContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;

    @media (min-width: 770px) {
        justify-content: flex-start;
    }
`
