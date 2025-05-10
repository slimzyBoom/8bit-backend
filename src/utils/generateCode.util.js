import { v4 as uuidv4 } from "uuid";

const generate_room_code = () => {
  const room_code = uuidv4().slice(0, 6).toUpperCase();
  return room_code;
};

const generate_session_id = () => {
  const session_id = uuidv4();
  return session_id;
};

export { generate_room_code, generate_session_id };
