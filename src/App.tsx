import styled from 'styled-components'

import RuleCreator from "./RuleCreator"

function App() {
    return (
        <StyledContainer>
            <div className="header-section">
                <h4>Rule</h4>

                <p className="header-description">The offer will be triggered based on the rules in this section</p>

                <hr />
            </div>

            <RuleCreator />
        </StyledContainer>
    )
}

export default App

export const StyledContainer = styled.div`
    max-width: 48rem;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 0%.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);

    .header-section {
        color: #202223;
        margin-bottom: 1rem;
        
        h4 {
            font-weight: 600;
            margin: 0;
        }
    
        .header-description {
            /* color: #6b7280; */
            font-size: 14px;
            margin: 0.5rem 0;
        }

        hr {
            border-color: #EBEBEB
        }
    }

`;
