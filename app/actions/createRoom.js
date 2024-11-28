'use server'
import { createAdminClient } from "@/config/appwrite"
import checkAuth from "./checkAuth"
import { ID } from "node-appwrite"


export default async function createRoom(previousState, formData) {
    // get database instances
    const {databases, storage } = await createAdminClient();

    try {
        const { user } = await checkAuth();
        if(!user) {
            return {
                error: 'you must be logged in to create a room'
            }
        } 


        // uploading image
        let imageID;
        const image = formData.get('image');

        if(image && image.size > 0 && image.name !== 'undefined') {
            try {
                // upload
                const response = await storage.createFile('rooms', ID.unique(), image);
                imageID = response.$id;

            } catch (error) {
                console.log('error uploading image', error);
                return { 
                    error: 'error uploading image'
                }
            }
        } else {
            console.log('no image file provided or file is invalid!');
        }


        // create new room
        const newRoom = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
            ID.unique(),
            {
                user_id: user.id,
                name: formData.get('name'),
                description: formData.get('description'),
                sqft: formData.get('sqft'),
                capacity: formData.get('capacity'),
                location: formData.get('location'),
                address: formData.get('address'),
                availability: formData.get('availability'),
                price_per_hour: formData.get('price_per_hour'),
                amenities: formData.get('amenities'),
                image: imageID
            }
        )

        return {
            success: true
        }
        
    } catch (error) {
        console.log(error);
        const errorMessage = error.response.message || 'An unexpected error has occured'
    }

    return {
        error: errorMessage
    }


}


