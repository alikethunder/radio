import { forwardRef } from "react"
import { NavLink, useLocation, NavLinkProps } from "react-router-dom"

export const QueryNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({ children, to, ...props }, ref) => {
  let { search } = useLocation()

  return (
    <NavLink to={to + search} {...props} ref={ref}>
      {children}
    </NavLink>
  )
})
