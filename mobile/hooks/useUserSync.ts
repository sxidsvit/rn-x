import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "../utils/api";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();


  const syncUserMutation = useMutation({
    mutationFn: () => {
      console.log("Calling syncUser with URL:", api.defaults.baseURL + "/users/sync");
      return userApi.syncUser(api);
    },
    onSuccess: (response: any) => console.log("User synced successfully (MongoDB id):", response.data.user._id),
    onError: (error) => console.error("User sync failed:", error),
  });

 
  useEffect(() => {
    if (isSignedIn && !syncUserMutation.data) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn]); // Removed trailing comma

  return null;
};