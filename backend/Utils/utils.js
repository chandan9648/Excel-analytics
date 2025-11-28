import { toast } from "react-toastify";

//react toast notification position
export const handleSubmit = (msg) =>{
    toast.success(msg, {
        position: 'top-right'
    })
}


