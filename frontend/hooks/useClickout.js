import { useEffect, useRef, useState } from "react";

const useClickout = () => {
    const [showItem, setShowItem] = useState(null);
    let itemRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (!itemRef.current) return;
            if (!itemRef.current.contains(e.target)) {
                setShowItem(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    return { itemRef, showItem, setShowItem }
}

export default useClickout;