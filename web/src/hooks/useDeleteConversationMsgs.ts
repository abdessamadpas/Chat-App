import { useEffect, useState } from "react";

const useDeleteConversationMsgs = () => {
  const [errors, setErros] = useState<unknown>(null);

  const deleteConversationMsgs = async (id: string, chatId:string) => {
    try {
      const response = await fetch(`http://localhost:8080/messages/${id}?chatId=${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("failed get messages");

      const result = await response.json();

      return result.deleted;
    } catch (error) {
      console.log(error);
      setErros(error);
      return false;
    }
  };

  return { deleteConversationMsgs, errors };
};

export default useDeleteConversationMsgs;
