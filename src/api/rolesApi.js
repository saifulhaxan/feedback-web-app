import Fetcher from "../library/Fetcher";

export const getRoles = async (data) => {
  return Fetcher.get("user/auth/roles");
};

export default {
  getRoles,
};
