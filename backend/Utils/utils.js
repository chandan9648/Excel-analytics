import { toast } from "react-toastify";

export const handleSubmit = (msg) =>{
    toast.success(msg, {
        position: 'top-right'
    })
}


