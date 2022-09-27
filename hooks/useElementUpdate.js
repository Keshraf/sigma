// React & Redux
import { useCallback } from "react";
import { useSelector } from "react-redux";

// Firebase
import { ref, get, child, update } from "firebase/database";
import { database } from "../firebaseConfig";

export default function useElementUpdate() {
  const selected = useSelector((state) => state.selectedElement); // Gets the selected Element
  const roomId = useSelector((state) => state.room.id); // gets the room id

  const elementUpdate = useCallback(
    (data) => {
      const dbRef = ref(database);
      // Gets the list of all the elements in the database for that room
      get(child(dbRef, `elements/${roomId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          // Loops over each element of that room
          snapshot.forEach((childSnapshot) => {
            const childValue = childSnapshot.val();
            // Updates the selected element with the passed data
            if (childValue.id === selected.id) {
              update(
                ref(database, `elements/${roomId}/${childSnapshot.key}`),
                data
              );
            }
          });
        } else {
          // Prints this if there are no elements
          console.log("No data available");
        }
      });
    },
    [roomId, selected.id]
  );

  return elementUpdate;
}
