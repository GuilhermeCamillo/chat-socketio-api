export function getChatRoomId(userId1: string, userId2: string): string {
    const sortedUserIds = [userId1, userId2].sort();
    const chatRoomId = `${sortedUserIds[0]}_${sortedUserIds[1]}`;
    return chatRoomId;
  }