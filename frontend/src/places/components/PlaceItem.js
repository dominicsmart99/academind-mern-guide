import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import "./PlaceItem.css";
import { Fragment } from "react";

function PlaceItem(props) {
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const showDeleteWarningHeader = () => setShowDeleteConfirm(true);
  const cancelDeleteHandler = () => setShowDeleteConfirm(false);
  const confirmDeleteHandler = () => {
    console.log("DELETING....");
    setShowDeleteConfirm(false);
  };
  return (
    <Fragment>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showDeleteConfirm}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </Fragment>
        }
      >
        <p>
          Are you sure you want to delete this place? This cannot be undone.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && (
              <Button to={`/${props.creatorId}/places/${props.id}`}>
                EDIT
              </Button>
            )}
            {auth.isLoggedIn && (
              <Button onClick={showDeleteWarningHeader}>DELETE</Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
}

export default PlaceItem;
