import { LinksFunction } from "@remix-run/node";

import styles from "../styles/index.css"

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles }
  ]
}

export default function Index() {
  return (
    <div className="landing-page">
      <section className="hero">
        <img src="/images/hero.jpg" alt="Hero Landing Image" />
        Hello World
      </section>
    </div>
  );
}
