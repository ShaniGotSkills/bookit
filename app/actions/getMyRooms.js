'use server'

import { createSessionClient } from '@/config/appwrite.js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';

async function getMyRooms() {
    const sessionCookie = cookies().get('appwrite-session');

    if(!sessionCookie) {
        redirect('/login');
    }

    try {
        const { account, databases } = await createSessionClient(sessionCookie.value);

        // get users id
        const user = await account.get();
        const userId = user.$id;

        // fetch rooms
        const {documents:rooms} = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            [Query.equal('user_id', userId)]
        )


        return rooms;
    } catch (error) {
        console.log('failed to get user rooms', error);
        redirect('/error');
    }
}



export default getMyRooms;






