import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserCotext = createContext({});

export function UserCotextProvider({children})
{
    const [user,    setUser]    = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() =>
    {
        if (!user)
        {
           axios.get("/profile").then(({data}) =>
            {
                setUser(data);
                setIsReady(true);
            });
        }
    }, []);

    return (
        <UserCotext.Provider value = {{user, setUser, isReady}}>
            {children}
        </UserCotext.Provider>
    );
}