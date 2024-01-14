import { default as IndexPage } from './projects-page.mdx';
import { default as RocketCarPage } from './rocket-car/rocket-car-page.mdx';

export const projectRoutes = {
  'rocket-car': RocketCarPage,
  'rocket-car/journey': RocketCarPage,
  'rocket-car/journey/render': RocketCarPage,
  'rocket-car/journey/physics': RocketCarPage,
  'rocket-car/journey/multiplayer': RocketCarPage,
  'rocket-car/demo': RocketCarPage,
  '': IndexPage,
};
let a;
export function projectsRouter(slug?: string[]) {
  const stringSlug = slug ? slug.join('/') : '';
  if (!Object.keys(projectRoutes).includes(stringSlug)) throw new Error();
  const Component = projectRoutes[stringSlug as keyof typeof projectRoutes];
  return <Component />;
}
