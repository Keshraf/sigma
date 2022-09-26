import { useCallback } from "react";
import { useSelector } from "react-redux";

// Firebase
import { ref, get, child, update } from "firebase/database";
import { database } from "../firebaseConfig";

export default function useElementUpdate(data) {
  const selected = useSelector((state) => state.selectedElement); // Gets the selected Element
  const roomId = useSelector((state) => state.room.id); // gets the room id

  const elementUpdate = useCallback(
    (data) => {
      console.log("USE CALLBACK CALLED!");

      const dbRef = ref(database);
      get(child(dbRef, `elements/${roomId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          snapshot.forEach((childSnapshot) => {
            const childValue = childSnapshot.val();
            if (childValue.id === selected.id) {
              update(
                ref(database, `elements/${roomId}/${childSnapshot.key}`),
                data
              );
            }
          });
        } else {
          console.log("No data available");
        }
      });
    },
    [roomId, selected.id]
  );

  return elementUpdate;
}
