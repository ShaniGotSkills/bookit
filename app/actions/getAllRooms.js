'use server'

import { createAdminClient } from '@/config/appwrite.js';
import { redirect } from 'next/navigation';

async function getAllRooms() {
    try {
        const { databases } = await createAdminClient();

        // fetch rooms
        const { documents:rooms } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS
        )
        
        // // revalidate the cache for this path
        // await revalidateRoomsPath();

        return rooms;
    } catch (error) {
        console.log('failed to get rooms', error);
        redirect('/error');
    }
}


// export async function revalidateRoomsPath() {
//     try {
//         // Revalidate the cache for the specified path
//         revalidatePath('/');
//     } catch (error) {
//         console.error('Failed to revalidate path', error);
//     }
// }


export default getAllRooms;