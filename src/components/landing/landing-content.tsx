import { DarkModeToggle } from '../misc/dark-mode-toggle';

export function LandingContent() {
  return (
    <div className="h-screen w-full p-4 flex flex-col">
      <DarkModeToggle className="ml-auto" />
      <a href="/project">Projects</a>
      <a href="/project/rocket-car">Rocket Car</a>
      <a href="/project/rocket-car/intro">Rocket Car Intro</a>
    </div>
  );
}
