import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chat.service';

export const useMessages = (conversationId: string) =>
  useQuery({ queryKey: ['chat', conversationId], queryFn: () => chatService.getMessages(conversationId) });

export const useSendMessage = (conversationId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      await chatService.send(conversationId, text);
      await qc.invalidateQueries({ queryKey: ['chat', conversationId] });
      // Mock : l'autre personne répond automatiquement
      void chatService
        .waitForReply(conversationId)
        .then(() => qc.invalidateQueries({ queryKey: ['chat', conversationId] }));
    },
  });
};
