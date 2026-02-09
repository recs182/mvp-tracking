import styled, { css } from 'styled-components'

export const TimerContainer = styled.div<{
    $variationProgress: boolean
    $variationStart: boolean
    $variationFinished: boolean
}>`
    width: 180px;

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
    gap: 0.4rem;
`
