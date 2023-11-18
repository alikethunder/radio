import { forwardRef } from "react"
import { Link, useLocation, LinkProps } from "react-router-dom"

export const QueryLink = forwardRef<HTMLAnchorElement, LinkProps>(({ children, to, ...props }, ref) => {
  let { search } = useLocation()

  return (
    <Link to={to + search} {...props} ref={ref}>
      {children}
    </Link>
  )
})
