export const getAiFeedbackPrompt = (
  language,
  sourceCode,
  input,
  output,
  isError
) => {
  let prompt = `I am coding on ${language} programming language. This is my source code: 
        """
          ${sourceCode}
        """
        -------------------------------
        `;

  if (isError) {
    prompt += `After running the code this error is being displayed:
        """
          ${output}
        """
        -------------------------------
        `;
  }

  if (!isError && output) {
    prompt += `After running the code i am getting this output:
        """
          ${output}
        """
        -------------------------------
        `;
  }

  prompt += `Give me feedback on my code and if there are any improvements that i can make then mention the improvements. and if you suggest any improvement then try to mention the complexity of my code and also mention the improved time and space complexity and don't put comma after writing the complexity 
        -------------------------------
        Not that the user is not directly writing this prompt. I am a programmer who is writing this in general prompt for my software. so write the response accordingly.
        `;

  return prompt;
};

export const getChatbotPrompt = (userPrompt, conversation) => {
  let prompt = "";

  if (conversation.length === 2) {
    const userMessage =
      conversation.find((msg) => msg.from !== "bot")?.message || "";
    const botMessage =
      conversation.find((msg) => msg.from === "bot")?.message || "";

    prompt = `user asked: ${userMessage}\nyou replied: ${botMessage}\n`;
    prompt += "-------------------------------\n";
    prompt += "now answer me this question:\n";
  }

  prompt += userPrompt;

  return prompt;
};
