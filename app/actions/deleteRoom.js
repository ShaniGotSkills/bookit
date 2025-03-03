'use server'

import { createSessionClient } from '@/config/appwrite.js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';
import { revalidatePath } from 'next/cache';

async function deleteRoom(roomId) {
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

        // find room to delete
        const roomToDelete = rooms.find((room) => room.$id === roomId);

        // delete the room
        if(roomToDelete) {
            await databases.deleteDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
                process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
                roomToDelete.$id
            );

            revalidatePath('/rooms/my', 'layout');
            revalidatePath('/', 'layout');

            return {
                success: true
            }
        }  else {
            return {
                error: 'Room not found'
            }
        }
 
    } catch (error) {
        console.log('failed to delete room', error);
        return {
            error: 'Failed to delete room'
        }
    }
}



export default deleteRoom;






