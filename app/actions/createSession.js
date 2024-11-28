'use server'

import { cookies } from "next/headers";
import { createAdminClient } from "@/config/appwrite";

async function createSession(previousState, formData) {
    const email =  formData.get('email');
    const password = formData.get('password');

    if(!email || !password) {
        return {
            error: 'Please fill out all fields'
        }
    }

    // get account instance
    const { account } = await createAdminClient();

    try {
        // generate session
        const session = await account.createEmailPasswordSession(email, password);

        // create cookie
        cookies().set('appwrite-session', session.secret, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(session.expire),
            path: '/'
        });

        return {
            success: true
        }    

    } catch (error) {
        console.log('auth error', error);
        return {
            error: 'invalid credentials'
        }
    }
  
}

export default createSession;