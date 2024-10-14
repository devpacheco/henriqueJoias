import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export function Input({placeholder, type, name, register, rules, error}: InputProps){
    return(
        <div>
            <input 
            className="w-full rounded-lg border-2 border-slate-900 h-11 my-1 px-2 py-2 bg-slate-300 outline-none placeholder:text-slate-600"
            type={type}
            placeholder={placeholder}
            {...register(name, rules)}
            id={name} 
            />
            {error && <p> {error} </p>}
        </div>
    )
}