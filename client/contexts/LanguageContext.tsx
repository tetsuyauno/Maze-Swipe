import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'menu.title': 'Choose Maze Size',
    'ride.title': 'Pick Your Ride',
    'ride.next': 'Next',
    'world.title': 'Choose World',
    'game.moves': 'Moves',
    'game.replay': 'Replay',
    'game.back': 'Back',
    'game.complete': 'Complete!',
    'game.amazing': 'Amazing!',
    'game.playAgain': 'Play Again',
    'game.menu': 'Menu',
    'game.tryAnother': 'Try Another Size',
    'game.movesIn': 'in',
    'game.movesUnit': 'moves',
    'ride.submarine': 'Submarine',
    'ride.gorilla': 'Gorilla',
    'ride.police': 'Police',
    'ride.helicopter': 'Helicopter',
    'ride.ambulance': 'Ambulance',
    'ride.fire_engine': 'Fire Engine',
    'world.classic': 'Classic',
    'world.candy': 'Candy',
    'world.ocean': 'Ocean',
    'world.jungle': 'Jungle',
    'world.space': 'Space',
  },
  ja: {
    'menu.title': '迷路のサイズを選ぼう',
    'ride.title': '乗り物を選ぼう',
    'ride.next': '次へ',
    'world.title': 'ワールドを選ぼう',
    'game.moves': '移動',
    'game.replay': 'もう一度',
    'game.back': '戻る',
    'game.complete': 'クリア！',
    'game.amazing': 'すごい！',
    'game.playAgain': 'もう一度遊ぶ',
    'game.menu': 'メニュー',
    'game.tryAnother': '他のサイズで遊ぶ',
    'game.movesIn': '',
    'game.movesUnit': '手',
    'ride.submarine': 'せんすいかん',
    'ride.gorilla': 'ゴリラ',
    'ride.police': 'パトカー',
    'ride.helicopter': 'ヘリコプター',
    'ride.ambulance': 'きゅうきゅうしゃ',
    'ride.fire_engine': 'しょうぼうしゃ',
    'world.classic': 'クラシック',
    'world.candy': 'キャンディ',
    'world.ocean': 'オーシャン',
    'world.jungle': 'ジャングル',
    'world.space': 'スペース',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
