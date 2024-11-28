'use server'

import { createSessionClient } from '@/config/appwrite.js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Query } from 'node-appwrite';
import { DateTime } from 'luxon';
import checkAuth from './checkAuth';

// convert a date string to a luxon datetime object in UTC
function toUTCDateTime(dateString) {
    return DateTime.fromISO(dateString, { zone: 'utc' }).toUTC();
}

// check for overlapping date ranges (overlap: if new booking (a) starts before end of existing booking b, if new booking (a) doesnt end before the start of existing booking (b))
function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
    return checkInA < checkOutB && checkOutA > checkInB;
}

// overlap example for bookings a -> new booking, b -> existing/current booked time (current booking)
// a - 1:00
// a - 3:00

// b - 2:00
// b - 5:00
 
// here checkoutA > checkinB which means new booking (b) starts before the existing booking is ongoing (a not ended/checkout yet) 

async function checkRoomAvailability(roomId, checkIn, checkOut) {
    const sessionCookie = cookies().get('appwrite-session');

    if(!sessionCookie) {
        redirect('/login');
    }

    try {
        const { databases } = await createSessionClient(sessionCookie.value);

        const checkInDateTime = toUTCDateTime(checkIn);
        const checkOutDateTime = toUTCDateTime(checkOut);

        // fetch all bookings for a given room
        const { documents:bookings } = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
            process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
            [Query.equal('room_id', roomId)]
        )

        // loop over bookings and check for overlaps
        for (const booking of bookings) {
            const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
            const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);

            if(dateRangesOverlap(checkInDateTime, checkOutDateTime, bookingCheckInDateTime, bookingCheckOutDateTime)) {
                return false;       // overlap found, do not book
            }
        }

        // no overlap found, continue to book
        return true;
    } catch (error) {
        console.log('failed to check room availability', error);
        return {
            error: 'Failed to check room availability'
        }
    }
}



export default checkRoomAvailability;

