import Heading from "@/components/Heading"
import getMyRooms from "@/app/actions/getMyRooms"
import MyRoomCard from "@/components/MyRoomCard";

export default async function MyRooms() {
    const rooms = await getMyRooms();


  return (
    <div>
        <Heading title='My Rooms' />
        {rooms.length > 0 ? (
           rooms.map((room) => <MyRoomCard room={room} key={room.$id} />)
        ) : (
            <p>You have no room listings</p>
        ) }
    </div>
  )
}
