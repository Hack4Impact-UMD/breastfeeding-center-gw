import { axiosClient } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export function useUploadJaneData() {
  return useMutation({
    mutationFn: async ({
      apptFile,
      clientFile,
    }: {
      apptFile: File | null;
      clientFile: File | null;
    }) => {
      const formData = new FormData();
      if (apptFile) {
        formData.append("appointments", apptFile);
      }
      if (clientFile) {
        formData.append("clients", clientFile);
      }

      const axiosInstance = await axiosClient();
      const response = await axiosInstance.post("/jane/upload", formData);

      return response.data;
    },
  });
}
