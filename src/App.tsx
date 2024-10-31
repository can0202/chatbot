import { Button, Col, FloatButton, Modal, Row } from "antd";
import buttonChatBot from "./assets/icons/avataChatbot.svg";
import "./App.scss";
import ReactDOM from "react-dom/client";
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
import { convertStringFunc } from "./utility/convertString";
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
  const messageRef = useRef<HTMLDivElement>(null);

  const [modalData, setModalData] = useState<{
    title?: any;
    description?: any;
    submitText?: any;
    handleSubmit: () => void;
    closeText?: any;
    handleClose?: () => void;
    width?: number;
  }>({
    title: "",
    description: "",
    submitText: "",
    handleSubmit: () => {},
    closeText: "",
    handleClose: () => {},
    width: 480,
  });

  const uniqueId = () => Date.now() + Math.random().toString(36).substr(2, 9);

  function removeFromMessage(messages: any[], textToDelete: string) {
    // Tìm chỉ số của câu hỏi có nội dung `textToDelete`
    const indexToDelete = messages?.findIndex(
      (message) => message?.isUser && message?.text === textToDelete
    );

    // Nếu tìm thấy, cắt mảng từ vị trí của câu hỏi đến cuối mảng
    if (indexToDelete !== -1) {
      messages?.splice(indexToDelete);
    }
    return messages;
  }

  const handleOpenChatBot = async () => {
    if (!open) {
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
    } else {
      setStreamData([]);
    }
    setOpen(!open);
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
        throw new Error("Network response was not ok");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) {
        throw new Error("Response body is null or streaming is not supported.");
      }

      let accumulatedText = "";
      let suggestTextArray: string[] = [];
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
                const messageId = messageData?.preMessageId;
                setMessageId(messageId);
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
    } catch (err) {
      console.error("Error in onSendConversationsBot:", err);
    } finally {
      setIsLoading(false); // Đặt lại isLoading thành false khi API hoàn thành
    }
  };

  const handleSend = async () => {
    if (isEditing) {
      setStreamData((prevData) => {
        const questionIndex = prevData.findIndex(
          (message) => message.text === questionEdit
        );
        if (questionIndex !== -1) {
          // return prevData.filter(
          //   (_, index) => index !== questionIndex && index !== questionIndex + 1
          // );
          const newData = prevData.filter(
            (_, index) => index !== questionIndex && index !== questionIndex + 1
          );
          // Thêm câu hỏi mới của user và trạng thái "Đang trả lời ..."
          newData.push(
            {
              id: uniqueId(),
              text: question,
              isUser: true,
              time: time,
            },
            {
              id: uniqueId(),
              text: "Đang trả lời ...",
              isUser: false,
              time: time,
              loading: true,
            }
          );
          return newData;
        }
        return prevData;
      });

      const reqParams = {
        model: infoData?.defaultModel,
        type: "text",
        content: question,
      };
      sendConversationMessage(
        botId,
        conversationsBot?.conversationId,
        reqParams,
        messageId
      );

      setQuestion("");
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
      removeFromMessage(streamData, item?.text);
      setStreamData([...streamData]);
    }
  };

  const handleStopSend = async () => {
    await onStopMessageBot(botId, conversationsBot?.conversationId);
  };

  const handleResetHeader = () => {
    setIsOpenModal(true);
  };

  const handleSubmitReset = async () => {
    await onStopMessageBot(botId, conversationsBot?.conversationId);
    onResetQuestion();
    setIsOpenModal(false);
    setOpen(false);
  };

  useEffect(() => {
    if (isReload) {
      if (!question.trim()) return;
      setStreamData((prevData) => [
        ...prevData,
        {
          id: uniqueId(),
          text: question,
          isUser: true,
          time: time,
        },
        {
          id: uniqueId(),
          text: "Đang trả lời ...",
          isUser: false,
          time: time,
          loading: true,
        },
      ]);
      sendConversationMessage(
        botId,
        conversationsBot?.conversationId,
        searchParam
      );
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

  return (
    <div className="App">
      <div className="chatbot-ai">
        <FloatButton.Group
          open={open}
          trigger="click"
          onClick={handleOpenChatBot}
          type="default"
          icon={<img src={buttonChatBot} alt="VARs Connect Chatbot" />}
          tooltip={"Hãy trò chuyên với tôi nhé"}
        >
          <div className={`chat-box ${isOpenModal ? "chat-box-bg" : ""}`}>
            <ChatHeader title={infoData?.name} onReset={handleResetHeader} />
            <div className="chat-box-content">
              <ChatContent
                title={infoData?.name}
                streamData={streamData}
                handleClickSuggest={handleClickSuggest}
                setQuestion={setQuestion}
                setModalData={setModalData}
                setIsOpenModal={setIsOpenModal}
                handleDeleteMessage={handleDeleteMessage}
                setIsEditing={setIsEditing}
                setQuestionEdit={setQuestionEdit}
                isLoading={isLoading}
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
          </div>
        </FloatButton.Group>
      </div>
    </div>
  );
};

// Tạo một phần tử root cho nút chat nếu chưa có
const rootElementId = "chat-button-root";
let rootElement = document.getElementById(rootElementId);

if (!rootElement) {
  rootElement = document.createElement("div");
  rootElement.id = rootElementId;
  document.body.appendChild(rootElement);
}

// Render component ChatButton vào trang
const root = ReactDOM.createRoot(rootElement);
root.render(<AppChatBot />);

export default AppChatBot;
