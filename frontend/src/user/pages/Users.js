import UserList from "../components/UsersList";

function Users() {
  const USERS = [
    {
      id: "u1",
      name: "Papazuki",
      image:
        "https://qph.cf2.quoracdn.net/main-qimg-8e770f980f1b1f0a1a33fa01ec29ec56-lq",
      places: 1,
    },
    {
      id: "u2",
      name: "Wogard",
      image: "https://static.zerochan.net/Bogard.full.3906865.jpg",
      places: 1,
    },
  ];

  return <UserList items={USERS} />;
}

export default Users;
