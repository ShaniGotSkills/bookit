import Heading from "@/components/Heading"
import getMyBookings from "../actions/getMyBookings"
import BookedRoomCard from "@/components/BookedRoomCard";

export default async function BookingsPage() {
  const bookings = await getMyBookings();

  return (
    <div>
      <Heading title='My Bookings' />
      {bookings.length === 0 ? (
        <p className="text-gray-600 mt-4">You have no bookings</p>
      ) : (
        bookings.map((booking) => <BookedRoomCard booking={booking} key={booking.$id} />)
        
      )}
    </div>
  )
}
