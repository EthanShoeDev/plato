import { Footer } from '../misc/footer';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { CanvasBackgroundScene } from './canvas-background-scene';

export function LandingPage() {
  return (
    <main className="h-screen w-full relative">
      <ScrollArea className="w-full h-full">
        <CanvasBackgroundScene />
        <div className="min-h-screen w-full flex flex-col items-center">
          <div className="grow flex flex-col justify-center gap-4">
            <Button>Projects</Button>
            <Button>Blog</Button>
            <Button>Demos</Button>
          </div>
          <Footer className="" />
        </div>
      </ScrollArea>
    </main>
  );
}
