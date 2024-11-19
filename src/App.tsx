import { Button, Col, FloatButton, Row } from "antd";
import buttonChatBot from "./assets/icons/avataChatbot.svg";
import "./App.scss";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatFooter from "./components/ChatFooter";
import {
  onCreateConversationsBot,
  onDeleteMessageBot,
  onGetInfoBot,
  onStopMessageBot,
} from "./apis/chatbot";
import { marked } from "marked";

interface Payload {
  model: string;
  content: string;
  type: string;
}

const AppChatBot = () => {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [infoData, setInfoData] = useState<any>(null);
  const [question, setQuestion] = useState<string>("");
  const [conversationsBot, setConversationsBot] = useState<any>(null);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [searchParam, setSearchParam] = useState<Payload>({
    model: infoData?.defaultModel,
    content: "",
    type: "text",
  });
  const [messageId, setMessageId] = useState<any>(null);
  const botId = process.env.REACT_APP_BOTID;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionEdit, setQuestionEdit] = useState<string>("");
  const [isToast, setIsToast] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [isFirstMessageSent, setIsFirstMessageSent] = useState<boolean>(false);

  function removeFromMessage(messages: any[], idToDelete: string) {
    // Tìm chỉ số của câu hỏi có nội dung `textToDelete`
    const indexToDelete = messages?.findIndex(
      (message) => message?.isUser && message?.preMessageId === idToDelete
    );

    // Nếu tìm thấy, cắt mảng từ vị trí của câu hỏi đến cuối mảng
    if (indexToDelete !== -1) {
      messages?.splice(indexToDelete);
    }
    return messages;
  }

  const onFirstChatBotMessage = async () => {
    const fetchInfo = await onGetInfoBot(botId);
    const resConversations = await onCreateConversationsBot(botId);
    setConversationsBot(resConversations);
    setInfoData(fetchInfo);

    const htmlContent = marked(fetchInfo?.openMessage);
    setStreamData((prevResponses) => [
      ...prevResponses,
      {
        text: htmlContent,
        isUser: false,
        time: time,
        suggestive: [],
        questions: fetchInfo?.openQuestions,
        loading: false,
        isQuestions: true,
      },
    ]);
  };

  const handleOpenChatBot = async () => {
    if (!isFirstMessageSent) {
      await onFirstChatBotMessage();
      setIsFirstMessageSent(true); // Đánh dấu là đã gọi API khởi tạo
    }
    setOpen(!open);
    setShowTooltip(!showTooltip);
  };

  const onResetQuestion = () => {
    setQuestion("");
    setStreamData([]);
  };

  const sendConversationMessage = async (
    botId: any,
    conversationId: string,
    payload: any,
    messageId?: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const reqParams = {
        model: payload.model,
        message: {
          type: payload.type,
          content: payload.content,
        },
      };

      // Chọn URL dựa trên sự hiện diện của messageId
      const urlSuffix = messageId
        ? `/regen-messages/${messageId}`
        : "/messages";

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/${botId}/conversations/${conversationId}${urlSuffix}`,
        {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqParams),
        }
      );

      if (!res.ok) {
        if (res?.status === 429) {
          const errorResponse = await res.json();
          setStreamData((prevData) =>
            prevData.filter((msg) => !(msg.isUser === false && msg.loading))
          );
          setStreamData((prevData) => [
            ...prevData,
            {
              text: errorResponse.message || "Too Many Requests",
              isUser: false,
              time: time,
              questions: [],
              isQuestions: false,
              suggestive: [],
              isCopy: false,
              loading: false,
            },
          ]);
          return;
        }
        throw new Error(`Network response was not ok: ${res?.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) {
        throw new Error("Response body is null or streaming is not supported.");
      }

      let accumulatedText = "";
      let suggestTextArray: string[] = [];
      let preMessageId;
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
            const messageData = JSON.parse(apiResponse.message);
            // Kiểm tra nếu có content
            if (messageData && messageData.content) {
              if (messageData?.type === "text") {
                accumulatedText += messageData.content;
                preMessageId = messageData?.preMessageId;
                setMessageId(preMessageId);
              }
              if (messageData?.type === "suggest") {
                suggestTextArray = messageData?.content;
              }

              // Chuyển đổi nội dung Markdown sang HTML bằng marked
              const htmlContent = marked(accumulatedText);

              // eslint-disable-next-line no-loop-func
              setStreamData((prevData) => [
                ...prevData.slice(0, -1), // Loại bỏ item "Đang trả lời ..."
                {
                  text: htmlContent,
                  isUser: false,
                  time: time,
                  questions: [],
                  isQuestions: false,
                  suggestive: suggestTextArray,
                  isCopy: true,
                },
              ]);
            } else {
              console.warn("No content found in the message data.");
            }
          } catch (error) {
            console.error("Failed to parse JSON string:", error);
          }
        }
      }
      return preMessageId;
    } catch (err) {
      console.error("Error in onSendConversationsBot:", err);
    } finally {
      setIsLoading(false); // Đặt lại isLoading thành false khi API hoàn thành
    }
  };

  const handleSend = async () => {
    if (isEditing) {
      setStreamData((prevData) => {
        const questionIndex = prevData?.findIndex(
          (message) => message?.preMessageId === questionEdit
        );
        const newData =
          questionIndex !== -1 ? prevData.slice(0, questionIndex) : prevData;
        newData.push(
          {
            text: question,
            isUser: true,
            time: time,
          },
          {
            isUser: false,
            time: time,
            loading: true,
          }
        );
        return newData;
      });
      setIsEditing(false);
      setQuestion("");
      const reqParams = {
        model: infoData?.defaultModel,
        type: "text",
        content: question,
      };
      await sendConversationMessage(
        botId,
        conversationsBot?.conversationId,
        reqParams,
        messageId
      );
    } else {
      setSearchParam((prevPayload: Payload) => ({
        ...prevPayload,
        model: infoData?.defaultModel,
        content: question,
      }));
      setIsReload(true);
    }
    setIsEditing(false);
  };

  const handleClickSuggest = (text: string) => {
    setQuestion(text);
    setSearchParam((prevPayload: Payload) => ({
      ...prevPayload,
      model: infoData?.defaultModel,
      content: text,
    }));
    setIsReload(true);
  };

  const handleDeleteMessage = async (item: any) => {
    const res = await onDeleteMessageBot(
      botId,
      conversationsBot?.conversationId,
      messageId
    );
    if (res?.code === 200) {
      removeFromMessage(streamData, item?.preMessageId);
      setStreamData([...streamData]);
    }
  };

  const handleStopSend = async () => {
    await onStopMessageBot(botId, conversationsBot?.conversationId);
    setStreamData((prevData) =>
      prevData?.map((message) => {
        if (message?.isUser === false) {
          return {
            ...message,
            loading: false,
          };
        }
        return message;
      })
    );
  };

  const handleResetHeader = () => {
    setIsOpenModal(true);
  };

  const handleSubmitReset = async () => {
    await onStopMessageBot(botId, conversationsBot?.conversationId);
    onResetQuestion();
    setIsOpenModal(false);
    await onFirstChatBotMessage();
    setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 0);
  };

  useEffect(() => {
    if (isReload) {
      if (!question.trim()) return;
      setStreamData((prevData) => [
        ...prevData,
        {
          text: question,
          isUser: true,
          time: time,
          preMessageId: messageId,
        },
        {
          isUser: false,
          time: time,
          loading: true,
        },
      ]);
      const sendMessage = async () => {
        const userMessageId = await sendConversationMessage(
          botId,
          conversationsBot?.conversationId,
          searchParam
        );
        setStreamData((prevData) => {
          const lastUserMessageIndex = prevData.findIndex(
            (msg) => msg.text === question && msg.isUser
          );

          if (lastUserMessageIndex !== -1) {
            // Tạo một bản sao của dữ liệu hiện có
            const updatedData = [...prevData];
            updatedData[lastUserMessageIndex] = {
              ...updatedData[lastUserMessageIndex],
              preMessageId: userMessageId, // Cập nhật preMessageId
            };
            return updatedData;
          }
          return prevData;
        });
      };
      sendMessage();
      setQuestion("");
      setIsReload(false);
    }
  }, [isReload]);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [streamData]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsToast(false);
    }, 3000);
    return () => {
      clearTimeout(timeOut);
    };
  }, [isToast]);

  return (
    <div className="App">
      <div className={`chatbot-ai`}>
        <FloatButton.Group
          open={open}
          trigger="click"
          onClick={handleOpenChatBot}
          type="default"
          icon={<img src={buttonChatBot} alt="VARs Connect Chatbot" />}
          tooltip={false}
          className={!open ? "phone-ring" : ""}
        >
          <div className={`chat-box ${isOpenModal ? "chat-box-bg" : ""}`}>
            <ChatHeader title={infoData?.name} onReset={handleResetHeader} />
            <div className="chat-box-content" ref={headerRef}>
              <ChatContent
                title={infoData?.name}
                streamData={streamData}
                handleClickSuggest={handleClickSuggest}
                setQuestion={setQuestion}
                handleDeleteMessage={handleDeleteMessage}
                setIsEditing={setIsEditing}
                setQuestionEdit={setQuestionEdit}
                isLoading={isLoading}
                setIsToast={setIsToast}
              />
              <div ref={messageRef}></div>
            </div>
            <ChatFooter
              question={question}
              setQuestion={setQuestion}
              handleSend={handleSend}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              isLoading={isLoading}
              handleStopSend={handleStopSend}
            />

            {isOpenModal && (
              <div className="chat-box-modal">
                <div className="title">
                  <h3>Làm mới</h3>
                  <Button
                    className="btn-close"
                    type="text"
                    onClick={() => setIsOpenModal(false)}
                  >
                    <svg
                      fill-rule="evenodd"
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="close"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path>
                    </svg>
                  </Button>
                </div>
                <div className="content">
                  <p>
                    Làm mới khung trò chuyện bạn sẽ không xem lại được các nội
                    dung đã trao đổi. Bạn có chắc chắn muốn thực hiện?
                  </p>
                </div>
                <div className="footer">
                  <Row gutter={[8, 0]}>
                    <Col xs={12}>
                      <Button
                        type="default"
                        className="btn btn-close"
                        onClick={() => setIsOpenModal(false)}
                      >
                        Đóng
                      </Button>
                    </Col>
                    <Col xs={12}>
                      <Button
                        type="primary"
                        className="btn btn-confirm"
                        onClick={handleSubmitReset}
                      >
                        Xác nhận
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            )}
            {isToast && (
              <div className="chat-box-toast">
                <div className="toast">
                  <div className="info">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.8332 10.0001C18.8332 14.6025 15.1022 18.3334 10.4998 18.3334C5.89746 18.3334 2.1665 14.6025 2.1665 10.0001C2.1665 5.39771 5.89746 1.66675 10.4998 1.66675C15.1022 1.66675 18.8332 5.39771 18.8332 10.0001ZM9.90576 5.93508C9.90576 5.68008 9.99548 5.46286 10.1749 5.28341C10.3638 5.09453 10.5858 5.00008 10.8408 5.00008C11.0958 5.00008 11.313 5.09453 11.4924 5.28341C11.6813 5.46286 11.7758 5.68008 11.7758 5.93508C11.7758 6.19008 11.6813 6.41203 11.4924 6.60092C11.313 6.78036 11.0958 6.87008 10.8408 6.87008C10.5858 6.87008 10.3638 6.78036 10.1749 6.60092C9.99548 6.41203 9.90576 6.19008 9.90576 5.93508ZM13.2724 12.1709L11.5905 12.9895C11.4542 13.0619 11.3075 13.123 11.1624 13.1833C11.0857 13.2153 11.0094 13.247 10.9354 13.2801C10.7212 13.3759 10.5325 13.4004 10.369 13.3536C10.133 13.2859 10.004 13.136 9.98219 12.9037C9.96034 12.6715 10.0054 12.3602 10.1173 11.9698C10.2383 11.582 10.3782 11.1112 10.5369 10.5574C10.615 10.285 10.6976 10.014 10.7848 9.74422C10.8836 9.46799 10.9721 9.19369 11.0501 8.92133C11.1647 8.52186 11.2278 8.25013 11.2396 8.10614C11.2514 7.96215 11.2431 7.83696 11.2147 7.73055C11.1823 7.60339 11.1091 7.49889 10.995 7.41706C10.8836 7.32615 10.7597 7.26118 10.6235 7.22214C10.3603 7.14666 10.0801 7.1302 9.78294 7.17275C9.48582 7.2153 9.2768 7.27147 8.97314 7.37109C8.60314 7.51382 8.5041 7.57875 8.3059 7.7087C8.24904 7.74598 8.18402 7.78861 8.10211 7.83996L7.1665 8.46812L8.18453 8.07036C8.38178 7.99918 8.56928 7.94486 8.74705 7.9074C8.93649 7.86346 9.10384 7.86231 9.2491 7.90395C9.43976 7.9586 9.5402 8.07091 9.55043 8.24086C9.57234 8.40434 9.56701 8.56001 9.53445 8.70788L9.07768 10.3012C8.87989 10.9912 8.71528 11.5482 8.58388 11.9723C8.45508 12.3873 8.37501 12.7181 8.34365 12.9645C8.3123 13.211 8.33221 13.4329 8.40339 13.6301C8.46034 13.7742 8.55234 13.8988 8.67938 14.004C8.80382 14.1182 8.94775 14.1988 9.11117 14.2457C9.38353 14.3237 9.66763 14.3266 9.96348 14.2542C10.271 14.1753 10.5695 14.0595 10.8589 13.9067C11.0556 13.7976 11.2837 13.6365 11.4923 13.4893C11.5934 13.4178 11.6899 13.3497 11.776 13.2923L13.2724 12.1709Z"
                        fill="#FEFEFE"
                      />
                    </svg>
                    <span>Đã sao chép vào bộ nhớ tạm!</span>
                  </div>
                  <Button type="text" onClick={() => setIsToast(false)}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 5.00049L10 10.0005M10 10.0005L5 15.0005M10 10.0005L15 15.0005M10 10.0005L5 5.00049"
                        stroke="#FEFEFE"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </FloatButton.Group>
        <div className={`chat-box-tootip ${showTooltip ? "active" : ""}`}>
          <p>Hãy trò chuyện với tôi nhé</p>
        </div>
      </div>
    </div>
  );
};

// Tạo một phần tử root cho nút chat nếu chưa có
// const rootElementId = "chat-button-root";
// let rootElement = document.getElementById(rootElementId);

// if (!rootElement) {
//   rootElement = document.createElement("div");
//   rootElement.id = rootElementId;
//   document.body.appendChild(rootElement);
// }

// // Render component ChatButton vào trang
// const root = ReactDOM.createRoot(rootElement);
// root.render(<AppChatBot />);

export default AppChatBot;
