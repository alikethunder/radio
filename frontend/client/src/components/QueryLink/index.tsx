import { forwardRef } from "react"
import { Link, useLocation, LinkProps } from "react-router-dom"

export const QueryLink = forwardRef<HTMLAnchorElement, LinkProps>(({ children, to, ...props }, ref) => {

  let { search } = useLocation()

  const [to_path, to_search_string] = (to as string).split('?')

  const q_search = new URLSearchParams(search)

  if (to_search_string) {
    const to_search = new URLSearchParams(`?${to_search_string}`)

    for (const [key, val] of to_search.entries()) {
      q_search.set(key, val)
    }
  }

  return (
    <Link to={to_path + '?' + q_search.toString()} {...props} ref={ref}>
      {children}
    </Link>
  )
})
