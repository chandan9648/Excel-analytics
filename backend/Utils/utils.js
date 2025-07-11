import { toast } from "react-toastify";

export const handleSubmit = (msg) =>{
    toast.success(msg, {
        position: 'top-right'
    })
}


// export const handleChange = (msg) =>{
//     toast.error(msg, {
//         position: 'top-right'
//     })
// }
