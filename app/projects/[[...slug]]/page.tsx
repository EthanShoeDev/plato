import {
  projectRoutes,
  projectsRouter,
} from "@/components/projects/projects.router";

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(projectRoutes).map((slugString) => slugString.split("/"));
}

export default function Page({ params }: { params: { slug?: string[] } }) {
  return projectsRouter(params.slug);
}
