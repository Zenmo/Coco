import {ComponentProps, FunctionComponent} from "react"
import {ExternalLink} from "../shared-components/links/ExternalLink.tsx"

export const Header: FunctionComponent<ComponentProps<"h1">> = (props) => (
    <h1 css={{
        display: "flex",
        alignItems: "center",
        padding: ".4em .7em",
        margin: "0",
    }} {...props}>
        <ExternalLink href="https://local4local.nu">
            <img src="/local4local-logo.svg" alt="Local4Local"/>
        </ExternalLink>
        <span css={{
            paddingBottom: ".42em",
            paddingLeft: "1em",
        }}>Coöperatie Configurator</span>
    </h1>
)
