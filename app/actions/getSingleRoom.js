'use server'

import { createAdminClient } from '@/config/appwrite.js';
import { redirect } from 'next/navigation';

async function getSingleRoom(id) {
    try {
        const { databases } = await createAdminClient();

        // fetch room
        const room = await databases.getDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            id
        )
        
        return room;
    } catch (error) {
        console.log('failed to get room', error);
        redirect('/error');
    }
}



export default getSingleRoom;