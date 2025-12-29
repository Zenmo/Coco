import {Link, } from "@radix-ui/themes"
import {ComponentProps, FunctionComponent} from "react"
import {ExternalLinkIcon} from "@radix-ui/react-icons"
import { ExternalLink } from "./ExternalLink"

export const ExternalIconLink: FunctionComponent<ComponentProps<typeof Link>> = ({children, ...props}) => (
    <ExternalLink style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        ...props.style,
    }} {...props}>
        {children}
        <ExternalLinkIcon />
    </ExternalLink>
)
