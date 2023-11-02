import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/FormHook";

import "./PlaceForm.css";

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

function UpdatePlace() {
  const placeId = useParams().placeId;
  const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: identifiedPlace.title,
        isValid: true,
      },
      description: {
        value: identifiedPlace.description,
        isValid: true,
      },
      address: {
        value: identifiedPlace.address,
        isValid: true,
      },
    },
    true
  );

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateHandler}>
      <Input
        id="title"
        type="text"
        label="Title"
        element="input"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        value={formState.inputs.title.value}
        valid={true}
      />
      <Input
        id="description"
        label="Description"
        element="textarea"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        value={formState.inputs.description.value}
        valid={true}
      />
      <Input
        id="address"
        label="Address"
        element="input"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
        value={formState.inputs.address.value}
        valid={true}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );

  function placeUpdateHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
  }
}

export default UpdatePlace;
