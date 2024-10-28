import { Button, Col, FloatButton, Modal, Row } from "antd";
import buttonChatBot from "./assets/icons/buttonChatbot.svg";
import "./App.scss";
import ReactDOM from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatContent from "./components/ChatContent";
import ChatFooter from "./components/ChatFooter";
import { onCreateConversationsBot, onGetInfoBot } from "./apis/chatbot";
import { convertStringFunc } from "./utility/convertString";

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
  const [payload, setPayload] = useState<Payload>({
    model: infoData?.defaultModel,
    content: "",
    type: "text",
  });
  const botId = process.env.REACT_APP_BOTID;

  const handleOpenChatBot = async () => {
    if (!open) {
      const fetchInfo = await onGetInfoBot(botId);
      const resConversations = await onCreateConversationsBot(botId);
      setConversationsBot(resConversations);
      setInfoData(fetchInfo);

      setStreamData((prevResponses) => [
        ...prevResponses,
        {
          text: convertStringFunc(fetchInfo?.openMessage),
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

  const handleReset = () => {
    setIsOpenModal(true);
  };

  const onResetQuestion = () => {
    setQuestion("");
    setStreamData([]);
  };

  const onSendConversationsBot = async (
    botId: any,
    conversationId: string,
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

      let accumulatedText = "";
      let accumulatedTextReplace = "";
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
                accumulatedTextReplace = convertStringFunc(accumulatedText);
              }
              if (messageData?.type === "suggest") {
                suggestTextArray = messageData?.content;
              }

              // eslint-disable-next-line no-loop-func
              setStreamData((prevData) => [
                ...prevData.slice(0, -1), // Loại bỏ item "Đang trả lời ..."
                {
                  text: accumulatedTextReplace,
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
    }
  };

  const handleSend = () => {
    // setStreamData((prevData) => [
    //   ...prevData,
    //   {
    //     text: question,
    //     isUser: true,
    //     time: time,
    //   },
    //   {
    //     text: "Đang trả lời ...",
    //     isUser: false,
    //     time: time,
    //     loading: true,
    //   },
    // ]);
    setPayload((prevPayload: Payload) => ({
      ...prevPayload,
      model: infoData?.defaultModel,
      content: question,
    }));
    setIsReload(true);
  };

  const handleClickSuggest = (text: string) => {
    setQuestion(text);
    setPayload((prevPayload: Payload) => ({
      ...prevPayload,
      model: infoData?.defaultModel,
      content: text,
    }));
    setIsReload(true);
    console.log("handleClickSuggest", text);
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
        },
        {
          text: "Đang trả lời ...",
          isUser: false,
          time: time,
          loading: true,
        },
      ]);
      onSendConversationsBot(botId, conversationsBot?.conversationId, payload); // Gửi cau hỏi
      setQuestion("");
      setIsReload(false);
    }
  }, [isReload]);

  return (
    <div className="App">
      <div className="chatbot-ai">
        <FloatButton.Group
          open={open}
          trigger="click"
          onClick={handleOpenChatBot}
          type="primary"
          icon={<img src={buttonChatBot} alt="VARs Connect Chatbot" />}
          tooltip={"Chúng tôi luôn sẵn sàng hỗ trợ"}
        >
          <div className="chat-box">
            <ChatHeader title={infoData?.name} onReset={handleReset} />
            <div className="chat-box-content">
              <Row gutter={[0, 16]}>
                <ChatContent
                  title={infoData?.name}
                  streamData={streamData}
                  handleClickSuggest={handleClickSuggest}
                />
              </Row>
            </div>

            <ChatFooter
              question={question}
              setQuestion={setQuestion}
              handleSend={handleSend}
            />
          </div>
        </FloatButton.Group>
      </div>
      {isOpenModal && (
        <Modal
          className="modal-chatbot"
          open={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          onOk={() => setIsOpenModal(false)}
          centered
          title="Làm mới"
          width={350}
          footer={
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
                  onClick={() => {
                    onResetQuestion();
                    setIsOpenModal(false);
                    setOpen(false);
                  }}
                >
                  Xác nhận
                </Button>
              </Col>
            </Row>
          }
        >
          <p>
            Làm mới khung chat bạn sẽ không tìm lại được những thông tin đã hỏi.
            Bạn có chắc chắn không?
          </p>
        </Modal>
      )}
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
