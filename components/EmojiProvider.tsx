'use client';

import { EmojiProvider as ReactAppleEmojiProvider } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';

export default function EmojiProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReactAppleEmojiProvider data={emojiData}>
            {children}
        </ReactAppleEmojiProvider>
    );
}
