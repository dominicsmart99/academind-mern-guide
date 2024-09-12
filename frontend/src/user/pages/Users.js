import "../components/UsersList";
import UserList from "../components/UsersList";

const Users = () => {
  const USERS = [{ id: "u1", name: "Loro", image: "", places: 3 }];

  return <UserList items={USERS} />;
};

export default Users;
