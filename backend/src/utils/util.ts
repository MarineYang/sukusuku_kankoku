
export function formatContentToString(data: any): string {

    try {
      let formatted = `📌 오늘의 K-pop 한국어 학습\n\n`;
      formatted += `**🎵 곡명:** ${data.title} 🌸\n\n`;
    formatted += `## **📍 한국어 가사 & 해석**\n\n`;
    
    data.content.forEach((item: any, index: number) => {
      formatted += `### ${index + 1}. "${item.lyrics}"\n`;
      formatted += `- **일본어 번역:** 「${item.japaneseTranslation}」\n`;
      formatted += `- **발음 (カタカナ):** **${item.pronunciation}**\n\n`;
      
      formatted += `📌 **단어 정리:**\n`;
      item.vocabulary.forEach((vocab: any) => {
        formatted += `- **${vocab.word} (${vocab.pronunciation})** – ${vocab.meaning}\n`;
      });
      formatted += `\n`;
      
      formatted += `✅ **문법 설명:**\n`;
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