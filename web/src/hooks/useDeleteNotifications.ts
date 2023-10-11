const useDeleteNotification = () => {
  const deleteNotification = async (receiver: string, sender: string) => {
    try {
      const response = await fetch(
        `http://localhost:1337/notifications?sender=${sender}&receiver=${receiver}`,
        { method: 'DELETE' },
      );

      if (!response.ok) throw new Error('failed fetching notifications.');

      const result = await response.json();
      return result.deleteNotify;
    } catch (error) {
      return false;
    }
  };

  return deleteNotification;
};

export default useDeleteNotification;
