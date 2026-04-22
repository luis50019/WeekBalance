import { apiClient } from "./client";

export interface UpdateProfileRequest {
  userId: string;
  fullName: string;
}

export interface UpdateProfileResponse {
  message: string;
  data: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    created_at: string;
  };
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  const response = await apiClient.patch<UpdateProfileResponse>(
    `/auth/profile/${data.userId}`,
    {
      full_name: data.fullName,
    }
  );
  return response.data;
};
