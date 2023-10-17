import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "A famous sky scraper",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9882393,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Harry Potter: The Exhibition New York City",
    description: "Experience the wonder of Harry Potter.",
    imageUrl:
      "https://offloadmedia.feverup.com/secretnyc.co/wp-content/uploads/2022/02/23134545/immersive-harry-potter-experience-less-than-two-hours-nyc.png",
    address: "50 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7496281,
      lng: -73.9872714,
    },
    creator: "u2",
  },
];

function UserPlaces() {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
}

export default UserPlaces;
