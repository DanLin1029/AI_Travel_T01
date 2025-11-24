import { GoogleGenAI } from "@google/genai";
import { Activity } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getTravelTip = async (activity: Activity): Promise<string> => {
  if (!ai) return "請設定 API Key 以獲取 AI 建議。";

  try {
    const prompt = `
      我正在日本福岡旅遊。
      我目前計劃去：${activity.title}，時間是：${activity.time}。
      類別是：${activity.category}。
      地點：${activity.location}。
      
      請給我一個關於這個地點或活動的「簡短、有趣且實用」的旅行建議（繁體中文）。
      請保持在 30 字以內。
      如果是食物，推薦必點菜色。
      如果是景點，推薦拍照角度。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "暫無建議。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "暫時無法獲取建議。";
  }
};

export const analyzeExpenses = async (totalJPY: number, activities: Activity[]): Promise<string> => {
    if (!ai) return "未設定 API Key。";
    
    try {
        const prompt = `
            我正在分析我的福岡旅遊支出。
            目前日幣總花費: ${totalJPY} JPY。
            以下是活動明細: ${JSON.stringify(activities.map(a => ({t: a.title, c: a.cost})))}。
            
            請用繁體中文給我一句幽默、諷刺但又有點建設性的評語，關於我的花錢習慣。一句話就好。
        `;
        
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "花費看起來還行。";
    } catch (e) {
        return "計算完成。";
    }
}