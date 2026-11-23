import { delay } from '@/services/mocks/delay';
import { AUTO_REPLIES, MOCK_MESSAGES } from '@/services/mocks/misc';
import type { ChatMessage } from '@/types';

/** Une conversation par identifiant (course ou trajet). */
const conversations = new Map<string, ChatMessage[]>();

const get = (id: string) => {
  if (!conversations.has(id)) conversations.set(id, [...MOCK_MESSAGES]);
  return conversations.get(id)!;
};

export const chatService = {
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await delay(300);
    return [...get(conversationId)];
  },

  async send(conversationId: string, text: string): Promise<ChatMessage> {
    await delay(150);
    const message: ChatMessage = { id: `m_${Date.now()}`, from: 'me', text, createdAt: new Date().toISOString() };
    conversations.set(conversationId, [...get(conversationId), message]);
    return message;
  },

  /** Mock : réponse automatique de l'autre personne. */
  async waitForReply(conversationId: string): Promise<ChatMessage> {
    await delay(1500);
    const text = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    const message: ChatMessage = { id: `m_${Date.now()}`, from: 'them', text, createdAt: new Date().toISOString() };
    conversations.set(conversationId, [...get(conversationId), message]);
    return message;
  },
};
