'use client'
import { toast } from "react-toastify"
import cancelBooking from "@/app/actions/cancelBooking"

export default function CancelBookingButton({bookingId}) {
    const handleCancelClick = async () => {
        if(!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const result = await cancelBooking(bookingId);
            if(result.success) {
                toast.success('Booking cancelled successfully');
            }
            
        } catch (error) {   
            console.log('failed to cancel booking', error);
            return {
                error: 'failed to cancel booking'
            }
        }
    }


  return (
    <div>
        <button onClick={handleCancelClick} className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700">
            Cancel Booking
        </button>
    </div>
  )
}
