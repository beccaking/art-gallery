export default async function handler(req,res) {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const prompt = `I am going to give you a set of data about a work of art. I want you to summarize the information in a paragraph. Do not add any introductory text, commentary, or markup. The result should be just plain text. Here is the information: ${JSON.stringify(req.body)}`
    const response = await model.generateContent(prompt)
    res.status(200).json({ data: response })
}

