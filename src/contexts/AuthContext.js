import React, { createContext, useContext, useState } from 'react';

const userContext = createContext()

export default function AuthContextProvider({ children }) {
    const [user, setUser] = useState(true)

    return (
        <userContext.Provider value={{ user, setUser }}>
            {children}
        </userContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(userContext);
};

