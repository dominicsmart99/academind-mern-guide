import Input from "../../shared/components/FormElements/Input";

import "./NewPlace.css";

function NewPlace() {
  return (
    <form className="place-form">
      <Input type="text" label="Place Name" element="input" />
    </form>
  );
}

export default NewPlace;
