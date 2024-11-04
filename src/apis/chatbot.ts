export const onGetInfoBot = async (botId: any) => {
  try {
    const res = await fetch(process.env.REACT_APP_API_URL + `/bots/${botId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "vi",
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const onCreateConversationsBot = async (botId: any) => {
  try {
    const res = await fetch(
      process.env.REACT_APP_API_URL + `/${botId}/conversations`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "vi",
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onSendConversationsBot = async (
  botId: any,
  conversationId: any,
  payload: any
): Promise<void> => {
  try {
    const reqParams = {
      model: payload.model,
      message: {
        type: payload.type,
        content: payload.content,
      },
    };

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/${botId}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          // Accept: "text/event-stream",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqParams),
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
      throw new Error("Response body is null or streaming is not supported.");
    }

    // Đọc từng chunk của response
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const regex = /data:\s*(\{.*\})/;
      const match = chunk.match(regex);

      if (match && match[1]) {
        try {
          const apiResponse = JSON.parse(match[1]);
          console.log("Parsed API response:", apiResponse);
          return apiResponse;
        } catch (error) {
          console.error("Failed to parse JSON string:", error);
        }
      } else {
        console.log("No JSON found in chunk.");
      }
    }
  } catch (err) {
    console.error("Error in onSendConversationsBot:", err);
  }
};

export const onEditMessageBot = async (
  botId: any,
  conversationId: any,
  messageId: any,
  payload: any
) => {
  try {
    const reqParams = {
      model: payload.model,
      message: {
        type: payload.type,
        content: payload.content,
      },
    };
    const res = await fetch(
      process.env.REACT_APP_API_URL +
        `/${botId}/conversations/${conversationId}/regen-messages/${messageId}`,
      {
        method: "POST",
        headers: {
          Accept: "text/event-stream",
          "Content-Type": "application/json",
          "Accept-Language": "vi",
        },
        body: JSON.stringify(reqParams),
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onDeleteMessageBot = async (
  botId: any,
  conversationId: any,
  messageId: any
) => {
  try {
    const res = await fetch(
      process.env.REACT_APP_API_URL +
        `/${botId}/conversations/${conversationId}/messages/${messageId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "vi",
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const onStopMessageBot = async (botId: any, conversationId: any) => {
  try {
    const res = await fetch(
      process.env.REACT_APP_API_URL +
        `/${botId}/conversations/${conversationId}/stop-conversation`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Accept-Language": "vi",
        },
      }
    );
    const data = await res.json();
    return data?.data;
  } catch (err) {
    console.log(err);
  }
};
