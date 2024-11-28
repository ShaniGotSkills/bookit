'use server'

import { cookies } from "next/headers";
import { createSessionClient } from "@/config/appwrite";

async function destroySession() {
   

    // retrieve the session cookie
    const sessionCookie = cookies().get('appwrite-session');
    
    if(!sessionCookie) {
        return {
            error: 'no session cookie found'
        }
    }

    try {
        const {account} = await createSessionClient(sessionCookie.value);
        // delete session
        await account.deleteSession('current');

        // clear session cookie
        cookies().delete('appwrite-session');

        return {
            success: true
        }

    } catch (error) {
       
        return {
            error: 'error deleting session'
        }
    }
  
}

export default destroySession;
