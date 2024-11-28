'use server'

import { createSessionClient } from '@/config/appwrite.js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ID } from 'node-appwrite';
import checkAuth from './checkAuth';
import checkRoomAvailability from './checkRoomAvailability';

async function bookRoom(previousState, formData) {
    const sessionCookie = cookies().get('appwrite-session');

    if(!sessionCookie) {
        redirect('/login');
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);

        // get users id
        const {user} = await checkAuth();
        console.log("Authenticated User:", user);
        if (!user || !user.id) {
            return {
                error: 'You must be logged in to book a room'
            };
        }


        // extract date and time from formData
        const checkInDate = formData.get('check_in_date');
        const checkInTime = formData.get('check_in_time');
        const checkOutDate = formData.get('check_out_date');
        const checkOutTime = formData.get('check_out_time');    
        const roomID = formData.get('room_id');

        // combine date and time to ISO 8601 format
        const checkInDateTime = `${checkInDate}T${checkInTime}`;
        const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

        // check if room is available
        const isAvailable = await checkRoomAvailability(roomID, checkInDateTime, checkOutDateTime);

        if(!isAvailable) {
            return {
                error: 'This room is already booked for the selected time'
            }
        }

        const bookingData = {
            check_in: checkInDateTime,
            check_out: checkOutDateTime,
            user_id: user.id,
            room_id: roomID
        }

        // create booking
        const newBooking = await databases.createDocument(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            ID.unique(),
            bookingData
        )

        return {
            success: true
        }

    } catch (error) {
        console.log('failed to book room', error);
        return {
            error: 'Something went wrong while booking the room'
        }
    }
}



export default bookRoom;






