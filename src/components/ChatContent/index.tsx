import { Col, Row } from "antd";
import avatarChatBot from "../../assets/icons/avataChatbot.svg";
import ChatSuggestive from "../ChatSuggestive";

interface ChatContentProps {
  streamData: any[];
}

const ChatContent = ({ streamData }: ChatContentProps) => {
  return (
    <>
      {streamData?.map((item, index) =>
        !item?.isUser ? (
          <Col xs={24} key={index}>
            <div className="chat-box-reply">
              <Row gutter={[0, 8]}>
                <Col xs={24}>
                  <div className="chat-box-avatar">
                    <div className="img">
                      <img src={avatarChatBot} alt="VARs Connect Chatbot" />
                    </div>
                    <h4>VARs Connect - Trợ lý ảo</h4>
                  </div>
                </Col>
                <Col xs={24}>
                  <p>{item?.loading ? "Đang trả lời..." : item?.text}</p>
                </Col>
              </Row>
            </div>
            <ChatSuggestive suggestive={item.suggestive} />
          </Col>
        ) : (
          <>
            <Col xs={24} key={index}>
              <div className="chat-box-time">
                <span>{item?.time}</span>
              </div>
            </Col>
            <Col xs={24}>
              <div className="chat-box-question">
                <p>{item?.text}</p>
              </div>
            </Col>
          </>
        )
      )}
    </>
  );
};

export default ChatContent;
