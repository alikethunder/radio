

import { Link, Route, BrowserRouter, Switch } from "inferno-router"

export const Home = () => {
  return (
    <>
      <div>Home</div>
      <Link to="/About" className="link">
        <p>About</p>
      </Link>
    </>
  )
}