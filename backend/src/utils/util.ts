
export function formatContentToString(data: any): string {

    try {
      let formatted = `📌 今日のK-pop日本語学習\n\n`;
      formatted += `**🎵 曲名:** ${data.title} 🌸\n\n`;
      formatted += `## **📍 韓国語の歌詞 & 解釈**\n\n`;
      
      data.content.forEach((item: any, index: number) => {
        formatted += `### ${index + 1}. "${item.lyrics}"\n`;
        formatted += `- **日本語訳:** 「${item.japaneseTranslation}」\n`;
        formatted += `- **発音 (カタカナ):** **${item.pronunciation}**\n\n`;
        
        formatted += `📌 **単語まとめ:**\n`;
        item.vocabulary.forEach((vocab: any) => {
          formatted += `- **${vocab.word} (${vocab.pronunciation})** – ${vocab.meaning}\n`;
        });
        formatted += `\n`;
        
        formatted += `✅ **文法説明:**\n`;
        item.grammar.forEach((gram: any) => {
          formatted += `**"${gram.expression}" → 「${gram.explanation.split('👉')[0]}」**\n`;
          if (gram.explanation.includes('👉')) {
            formatted += `👉 ${gram.explanation.split('👉')[1]}\n\n`;
          }
        });
        
        formatted += `---\n\n`;
      });
      
      formatted += `📌 **🎧 [${data.title}](${data.youtubeLink})**`;
      return formatted;

    } catch (error) {
      console.error("포맷팅 오류:", error);
      return JSON.stringify(data); // 오류 시 원본 JSON 반환
    }
  }