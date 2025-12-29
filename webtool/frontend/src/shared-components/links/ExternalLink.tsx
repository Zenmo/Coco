import {Link} from "@radix-ui/themes"
import {ComponentProps, FunctionComponent} from "react"

export const ExternalLink: FunctionComponent<ComponentProps<typeof Link>> = ({children, ...props}) => (
    <Link
        target="_blank"
        {...props}
    >
        {children}
    </Link>
)
