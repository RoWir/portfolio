import { PropsWithChildren, ReactElement, SetStateAction, useEffect } from "react";
import './FullscreenWrap.css'

const FullscreenWrap: React.FC<PropsWithChildren & {setFullscreenApp: React.Dispatch<SetStateAction<ReactElement|null>>}> = ({ children, setFullscreenApp }) => {
    useEffect(() => {
        document.body.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'x') {
                setFullscreenApp(null);
            }
        });
    },[])
    
    return (
        <div className="fullscreenWrap">
            {children}
        </div>
    );
}

export default FullscreenWrap;