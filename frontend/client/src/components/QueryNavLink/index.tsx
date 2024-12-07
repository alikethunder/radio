import { forwardRef, memo } from "react"
import { NavLink, useLocation, NavLinkProps } from "react-router-dom"

//navlink can know if it's active

const QueryNavLink_comp = forwardRef<HTMLAnchorElement, NavLinkProps>(({ children, to, ...props }, ref) => {
  let { search } = useLocation()

  return (
    <NavLink to={to + search} {...props} ref={ref}>
      {children}
    </NavLink>
  )
})

export const QueryNavLink = memo(QueryNavLink_comp)