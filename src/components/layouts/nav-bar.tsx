import { DarkModeToggle } from '../misc/dark-mode-toggle';

export function NavBar() {
  return (
    <nav className="flex flex-col border p-4 border-t-0 gap-4">
      <a className="hover:underline" href="/">
        Home
      </a>
      <a className="hover:underline" href="/project">
        Projects
      </a>
      <a className="hover:underline" href="/project/rocket-car">
        Rocket Car
      </a>
      <a className="hover:underline" href="/project/rocket-car/intro">
        Rocket Car Intro
      </a>
      <DarkModeToggle />
    </nav>
  );
}
