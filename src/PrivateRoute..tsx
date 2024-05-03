import React, {ReactNode} from "react"
import {  Navigate } from "react-router-dom"
import { useAuthContext } from "./contexts/AuthContext"

type Props = {
    children: ReactNode
}

const PrivateRoute = ({children} : Props) => {
    const { currentUser } = useAuthContext()

    if(!currentUser){
        return <Navigate to="/login" replace/>
    }else{
        return children;
    }
}

export default PrivateRoute