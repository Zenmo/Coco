import {FunctionComponent} from "react"
import { ExternalLink } from "../../shared-components/links/ExternalLink"

export const GitLink: FunctionComponent = () => (
    <ExternalLink style={{marginBottom: "-.4rem"}} href="https://github.com/zenmo/local4local">
        <img style={{height: "1rem"}} src="/Git-Logo-2Color.svg" alt="Broncode" />
    </ExternalLink>
)
