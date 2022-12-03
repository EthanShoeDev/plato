import CanvasBackgroundEffect from '../components/canvasBackgroundEffect'
import { ShowWindowDimensions } from '../hooks/windowSize.hook'


export default function Landing() {
    return (
        <div>
            <CanvasBackgroundEffect></CanvasBackgroundEffect>
            <ShowWindowDimensions></ShowWindowDimensions>
        </div>

    )
}