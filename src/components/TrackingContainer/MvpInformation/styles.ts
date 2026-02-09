import styled from 'styled-components'

export const MvpInformationStyled = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 12px;

    & > button:first-child {
        padding: 0;
        color: white;
        font-size: 14px;
        font-weight: bold;
        text-align: left;
        background-color: transparent;
        border: none;
        cursor: pointer;

        &:hover {
            color: #adadad;
        }
    }
`
