import { forwardRef, memo } from "react"
import { Link, LinkProps, useSearchParams } from "react-router-dom"

//querylink with search params
const QueryLink_comp = forwardRef<HTMLAnchorElement, LinkProps>(({ children, to, ...props }, ref) => {
  const [search, _] = useSearchParams()

  const [to_path, to_search_string] = (to as string).split('?')

  if (to_search_string) {
    const to_search = new URLSearchParams(`?${to_search_string}`)

    for (const [key, val] of to_search.entries()) {
      search.set(key, val)
    }
  }

  return (
    <Link to={to_path + '?' + search.toString()} {...props} ref={ref}>
      {children}
    </Link>
  )
})

export const QueryLink = memo(QueryLink_comp)
