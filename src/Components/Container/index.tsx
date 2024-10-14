import { ReactNode } from "react";

export function Container({children}:{children: ReactNode}){
    return(
        <div className="w-full max-w-screen-xl px-1 mx-auto my-5">
            {children}
        </div>
    )
}