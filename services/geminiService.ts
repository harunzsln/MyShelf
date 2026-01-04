
import { GoogleGenAI, Type } from "@google/genai";
import { UserBook, Recommendation } from '../types';

export const getRecommendations = async (userBooks: UserBook[], language: 'tr' | 'en' = 'tr'): Promise<Recommendation[]> => {
  // 1. Analysis: Split into liked (read + high rating) and intent (want to read)
  const likedBooks = userBooks.filter(b => b.status === 'read' && b.rating >= 4);
  const wantToReadBooks = userBooks.filter(b => b.status === 'want_to_read');
  
  // Translation for error message
  const errorMsg = language === 'tr' 
    ? "Daha iyi öneriler için lütfen birkaç kitabı kitaplığınıza ekleyin veya okuduklarınızı oylayın."
    : "For better recommendations, please add a few books to your library or rate the ones you've read.";

  if (likedBooks.length === 0 && wantToReadBooks.length === 0) {
    throw new Error(errorMsg);
  }

  // 2. Prepare the payload for Gemini
  const likedData = likedBooks.map(b => ({
    title: b.title,
    categories: b.categories,
    rating: b.rating
  }));

  const intentData = wantToReadBooks.map(b => ({
    title: b.title,
    categories: b.categories
  }));

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 3. System Instruction & Prompt based on Language
  let systemInstruction = "";
  let prompt = "";

  if (language === 'tr') {
    systemInstruction = `Sen elit bir edebiyat eleştirmeni ve kitap küratörüsün. 
Kullanıcının okuduğu ve sevdiği kitaplar ile okumak için sıraya aldığı (istek listesi) kitapları analiz edeceksin.
Bu verilere dayanarak, hem kullanıcının geçmiş zevkine hem de şu anki ilgi odağına (istek listesine) uygun 5 yeni kitap önerisi sunmalısın.

KURALLAR:
1. Yanıtları KESİNLİKLE saf JSON formatında vermeli, Markdown veya açıklama metni eklememelisin.
2. Her öneri için kitap adı (title), yazarı (author) ve neden bu kitabı önerdiğini açıklayan kişiselleştirilmiş bir gerekçe (reason) sunmalısın.
3. Gerekçe (reason), kullanıcının "Okudukları" ve "Okumak İstedikleri" arasındaki bağı kurmalıdır (Örn: "X kitabındaki üslubu sevdiğiniz ve Y kitabını merak ettiğiniz için bu eser tam size göre...").
4. Önerdiğin kitaplar kullanıcının halihazırda listelerinde olan kitaplar OLMAMALIDIR.
5. DİL KURALI: Kitap isimleri yabancı olsa dahi, 'reason' (gerekçe) alanı KESİNLİKLE TÜRKÇE yazılmalıdır.`;

    prompt = `
Kullanıcının Sevdiği Kitaplar: ${JSON.stringify(likedData)}
Kullanıcının Okumak İstediği Kitaplar: ${JSON.stringify(intentData)}

Lütfen bu veriler ışığında en iyi 5 kitap önerisini yap.`;

  } else {
    systemInstruction = `You are an elite literary critic and book curator.
You will analyze the books the user has read and liked, as well as the books they have queued to read (wishlist).
Based on this data, you must provide 5 new book recommendations that fit both the user's past tastes and their current focus (wishlist).

RULES:
1. You must provide the response STRICTLY in pure JSON format, without Markdown or explanatory text.
2. For each recommendation, provide the book title (title), author (author), and a personalized reason (reason) explaining why you are recommending this book.
3. The reason should establish a link between the user's "Read" and "Want to Read" lists (e.g., "Since you liked the style in book X and are curious about book Y, this work is perfect for you...").
4. The recommended books MUST NOT be books the user already has in their lists.
5. LANGUAGE RULE: Even if the user's book list contains titles in Turkish or other languages, the 'reason' field MUST BE WRITTEN STRICTLY IN ENGLISH.`;

    prompt = `
User's Liked Books: ${JSON.stringify(likedData)}
User's Want to Read Books: ${JSON.stringify(intentData)}

Please provide the best 5 book recommendations based on this data. Remember to write the reasons in English.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Book Title" },
              author: { type: Type.STRING, description: "Author Name" },
              reason: { type: Type.STRING, description: "Reason for recommendation" }
            },
            required: ["title", "author", "reason"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error(language === 'tr' ? "Gemini API boş bir yanıt döndürdü." : "Gemini API returned an empty response.");
    }
    
    const result = JSON.parse(jsonStr);
    return result as Recommendation[];
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    throw error;
  }
};
